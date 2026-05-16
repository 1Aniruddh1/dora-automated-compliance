

import { useState, useEffect, useRef } from "react";

const JSON_URL = "/dora_compliance_data.json";

// ─── Dropdown ────────────────────────────────────────────────────────────────
function Dropdown({ label, icon, value, onChange, options, disabled }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
        textTransform: "uppercase", color: "#8A9BAE",
        marginBottom: 5, display: "flex", alignItems: "center", gap: 5,
      }}>
        <span style={{ fontSize: 13 }}>{icon}</span>{label}
      </div>

      <button
        onClick={() => !disabled && setOpen((o) => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "10px 13px",
          background: disabled ? "#F5F7FA" : "#fff",
          border: `1.5px solid ${open ? "#2E86DE" : "#DDE3EC"}`,
          borderRadius: 10, cursor: disabled ? "not-allowed" : "pointer",
          fontSize: 12.5,
          color: disabled ? "#B0BCC8" : selected ? "#1A2B3C" : "#8A9BAE",
          fontFamily: "inherit", transition: "border-color 0.2s", outline: "none",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "85%" }}>
          {selected ? selected.label : `Select ${label}`}
        </span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
          stroke="#8A9BAE" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 5px)", left: 0, right: 0,
          background: "#fff", border: "1.5px solid #DDE3EC", borderRadius: 10,
          boxShadow: "0 8px 28px rgba(0,0,0,0.10)", zIndex: 100,
          maxHeight: 260, overflowY: "auto",
        }}>
          {options.map((o) => (
            <div key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              style={{
                padding: "9px 13px", fontSize: 12.5, cursor: "pointer",
                color: o.value === value ? "#1E3C5A" : "#3A4E63",
                background: o.value === value ? "#EEF4FB" : "transparent",
                fontWeight: o.value === value ? 600 : 400,
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = o.value === value ? "#EEF4FB" : "#F5F8FC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = o.value === value ? "#EEF4FB" : "transparent")}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Animated card ───────────────────────────────────────────────────────────
function Card({ icon, label, tag, tagBg, tagColor, children, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{
      background: "#fff", borderRadius: 16, border: "1.5px solid #E5EAF2",
      overflow: "hidden", opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(14px)",
      transition: "opacity 0.38s ease, transform 0.38s ease",
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 9,
        padding: "13px 18px", borderBottom: "1.5px solid #F0F4FA",
        background: "#FAFBFD",
      }}>
        <span style={{ fontSize: 17 }}>{icon}</span>
        <span style={{ fontWeight: 600, fontSize: 13, color: "#1A2B3C" }}>{label}</span>
        {tag && (
          <span style={{
            marginLeft: "auto", fontSize: 11, fontWeight: 600,
            padding: "3px 9px", borderRadius: 20,
            background: tagBg, color: tagColor,
          }}>{tag}</span>
        )}
      </div>
      <div style={{ padding: "15px 18px" }}>{children}</div>
    </div>
  );
}

// ─── Flow list ───────────────────────────────────────────────────────────────
function FlowList({ items, dotColor }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {items.map((item, i) => (
        <div key={i} style={{
          display: "flex", gap: 11, alignItems: "flex-start", padding: "9px 0",
          borderBottom: i < items.length - 1 ? "1px solid #F4F6FA" : "none",
        }}>
          <div style={{ paddingTop: 5, flexShrink: 0 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor }} />
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: "#2E3F52", margin: 0 }}>{item}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton loader ─────────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          background: "#fff", borderRadius: 16,
          border: "1.5px solid #E5EAF2", overflow: "hidden",
        }}>
          <div style={{ padding: "13px 18px", borderBottom: "1.5px solid #F0F4FA", background: "#FAFBFD" }}>
            <div style={{ height: 13, width: 140, background: "#EEF2F8", borderRadius: 5, animation: "pulse 1.3s ease-in-out infinite" }} />
          </div>
          <div style={{ padding: "15px 18px", display: "flex", flexDirection: "column", gap: 9 }}>
            {[90, 72, 82].map((w, j) => (
              <div key={j} style={{
                height: 11, width: `${w}%`, background: "#F0F4FA", borderRadius: 5,
                animation: "pulse 1.3s ease-in-out infinite",
                animationDelay: `${j * 0.12}s`,
              }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Lead-gen form ───────────────────────────────────────────────────────────
function DemoForm() {
  const [form, setForm] = useState({ name: "", email: "", org: "", role: "" });
  const [submitted, setSubmitted] = useState(false);
  const fields = [
    ["name", "Full name",     "text"],
    ["email", "Work email",   "email"],
    ["org",  "Organisation",  "text"],
    ["role", "Your role",     "text"],
  ];

  return (
    <div style={{
      marginTop: 28,
      background: "linear-gradient(135deg, #0A1929 0%, #1A3350 100%)",
      borderRadius: 20, padding: "28px 24px",
    }}>
      <div style={{
        display: "inline-block", fontSize: 10, fontWeight: 700,
        letterSpacing: "0.1em", textTransform: "uppercase", color: "#7BB8F4",
        background: "rgba(123,184,244,0.12)", padding: "4px 10px",
        borderRadius: 6, marginBottom: 10,
      }}>
        Get Expert Guidance
      </div>
      <h3 style={{
        fontSize: 19, fontWeight: 700, color: "#fff",
        margin: "0 0 6px", fontFamily: "'Playfair Display', serif",
      }}>
        Ready for full DORA compliance?
      </h3>
      <p style={{ fontSize: 12.5, color: "#5B92C0", margin: "0 0 18px", lineHeight: 1.6 }}>
        Book a personalised demo with our regulatory specialists.
      </p>

      {submitted ? (
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "14px 18px",
          background: "rgba(43,165,94,0.15)", borderRadius: 10,
          border: "1px solid rgba(43,165,94,0.3)",
        }}>
          <span style={{ fontSize: 18 }}>✅</span>
          <div>
            <p style={{ color: "#6EDBA0", fontWeight: 600, fontSize: 13, margin: 0 }}>Request received!</p>
            <p style={{ color: "#4DC485", fontSize: 11.5, margin: "2px 0 0" }}>
              We'll be in touch within one business day.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 11 }}>
            {fields.map(([key, placeholder, type]) => (
              <input key={key} type={type} placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                style={{
                  padding: "9px 13px", background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(255,255,255,0.12)", borderRadius: 9,
                  color: "#fff", fontSize: 12.5, fontFamily: "inherit", outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(123,184,244,0.5)")}
                onBlur={(e)  => (e.target.style.borderColor = "rgba(255,255,255,0.12)")}
              />
            ))}
          </div>
          <button
            onClick={() => { if (form.name && form.email) setSubmitted(true); }}
            style={{
              width: "100%", padding: "11px", background: "#2E86DE",
              color: "#fff", border: "none", borderRadius: 9,
              fontSize: 13.5, fontWeight: 600, fontFamily: "inherit",
              cursor: "pointer", transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#185FA5")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#2E86DE")}
          >
            Book a Demo →
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function DORAComplianceTool() {
  // JSON data state
  const [articles, setArticles]       = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError]     = useState("");

  // Selections
  const [region,     setRegion]     = useState("");
  const [regulation, setRegulation] = useState("");
  const [ruleId,     setRuleId]     = useState("");

  // Analysis
  const [analyzing, setAnalyzing] = useState(false);
  const [result,    setResult]    = useState(null); // { risks[], controls[] }

  // ── Fetch JSON on mount ────────────────────────────────────────────────────
  useEffect(() => {
    fetch(JSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // data.articles is the array from dora_compliance_data.json
        setArticles(data.articles);
        setDataLoading(false);
      })
      .catch(() => {
        setDataError(
          `Could not load ${JSON_URL}. Make sure dora_compliance_data.json is in /public.`
        );
        setDataLoading(false);
      });
  }, []);

  // Derived values
  const article    = articles.find((a) => a.id === ruleId) ?? null;
  const canAnalyze = !!(region && regulation && ruleId && !dataLoading);

  const regionOptions     = [{ value: "eu",   label: "🇪🇺 European Union" }];
  const regulationOptions = [{ value: "dora", label: "DORA — Digital Operational Resilience Act" }];
  const ruleOptions       = articles.map((a) => ({ value: a.id, label: `${a.label} — ${a.title}` }));

  const steps = [
    { n: 1, label: "Region",     done: !!region },
    { n: 2, label: "Regulation", done: !!regulation },
    { n: 3, label: "Rule ID",    done: !!ruleId },
  ];

  // ── AI call ────────────────────────────────────────────────────────────────
  async function analyze() {
    if (!canAnalyze || !article) return;
    setAnalyzing(true);
    setResult(null);

    const prompt = `You are a DORA compliance expert. For ${article.label} – ${article.title}, return ONLY a JSON object (no markdown, no backticks):
{"risks":["risk1","risk2","risk3","risk4","risk5"],"controls":["control1","control2","control3","control4","control5"]}
Article text: "${article.text}"
Keep each item under 20 words. Risks = compliance/operational failures. Controls = concrete governance actions.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw  = data.content.map((c) => c.text || "").join("").replace(/```json|```/g, "").trim();
      setResult(JSON.parse(raw));
    } catch {
      // Fallback: serve risks & controls straight from the JSON file
      setResult({ risks: article.risks, controls: article.controls });
    } finally {
      setAnalyzing(false);
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif", background: "#F2F5FA", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(255,255,255,0.35) !important; }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0A1929 0%, #1A3A5C 65%, #0D2B47 100%)",
        padding: "32px 24px 26px", position: "relative", overflow: "hidden",
      }}>
        {[140, 240, 330].map((s, i) => (
          <div key={i} style={{
            position: "absolute", top: -s / 2.5, right: -s / 3.5,
            width: s, height: s, borderRadius: "50%",
            border: `1px solid rgba(46,134,222,${0.09 - i * 0.025})`,
            pointerEvents: "none",
          }} />
        ))}
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7, marginBottom: 12,
            background: "rgba(46,134,222,0.14)",
            border: "1px solid rgba(46,134,222,0.25)",
            padding: "5px 11px", borderRadius: 8,
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#2E86DE" }} />
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", color: "#7BB8F4", textTransform: "uppercase" }}>
              comply2reg · EU Regulatory Suite
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif", fontSize: 27,
            fontWeight: 700, color: "#fff", lineHeight: 1.28, margin: "0 0 8px",
          }}>
            DORA Automated Compliance<br />
            <span style={{ color: "#7BB8F4" }}>Risk & Controls Generator</span>
          </h1>
          <p style={{ fontSize: 13, color: "#5B92C0", lineHeight: 1.65, margin: 0, maxWidth: 500 }}>
            Select a DORA article to instantly generate AI-powered compliance risks and governance controls.{" "}
            {!dataLoading && articles.length > 0 && (
              <span style={{ color: "#4DC485", fontWeight: 500 }}>
                ✓ {articles.length} articles loaded from JSON
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "22px 18px 40px" }}>

        {/* Error banner */}
        {dataError && (
          <div style={{
            background: "#FFF1EE", border: "1.5px solid #FFCDC3",
            borderRadius: 10, padding: "12px 16px", marginBottom: 16,
            fontSize: 13, color: "#993C1D",
          }}>
            ⚠️ {dataError}
          </div>
        )}

        {/* Step indicators */}
        <div style={{ display: "flex", gap: 7, marginBottom: 20 }}>
          {steps.map((s, i) => (
            <div key={s.n} style={{ flex: 1, display: "flex", alignItems: "center" }}>
              <div style={{
                flex: 1, display: "flex", alignItems: "center", gap: 7,
                padding: "9px 12px", background: "#fff", borderRadius: 10,
                border: `1.5px solid ${s.done ? "#2E86DE" : "#E5EAF2"}`,
                transition: "border-color 0.3s",
              }}>
                <div style={{
                  width: 21, height: 21, borderRadius: "50%",
                  background: s.done ? "#2E86DE" : "#EEF2F8",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "background 0.3s",
                }}>
                  {s.done
                    ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                    : <span style={{ fontSize: 10.5, fontWeight: 600, color: "#8A9BAE" }}>{s.n}</span>
                  }
                </div>
                <span style={{ fontSize: 11.5, fontWeight: s.done ? 600 : 400, color: s.done ? "#1E3C5A" : "#8A9BAE" }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div style={{ width: 12, height: 1.5, background: "#DDE3EC", flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        {/* Selector panel */}
        <div style={{
          background: "#fff", borderRadius: 16, border: "1.5px solid #E5EAF2",
          padding: "18px 18px 14px", marginBottom: 14,
        }}>
          {dataLoading ? (
            <div style={{ textAlign: "center", padding: "16px 0", color: "#8A9BAE", fontSize: 13 }}>
              <div style={{
                width: 20, height: 20, border: "2px solid #DDE3EC",
                borderTopColor: "#2E86DE", borderRadius: "50%",
                animation: "spin 0.75s linear infinite",
                margin: "0 auto 8px",
              }} />
              Loading JSON data…
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              <Dropdown
                label="Region" icon="🌍"
                value={region}
                onChange={(v) => { setRegion(v); setRegulation(""); setRuleId(""); setResult(null); }}
                options={regionOptions}
                disabled={false}
              />
              <Dropdown
                label="Regulation" icon="📋"
                value={regulation}
                onChange={(v) => { setRegulation(v); setRuleId(""); setResult(null); }}
                options={regulationOptions}
                disabled={!region}
              />
              <Dropdown
                label="Rule ID" icon="📌"
                value={ruleId}
                onChange={(v) => { setRuleId(v); setResult(null); }}
                options={ruleOptions}
                disabled={!regulation}
              />
            </div>
          )}
        </div>

        {/* Analyse button */}
        <button
          onClick={analyze}
          disabled={!canAnalyze || analyzing}
          style={{
            width: "100%", padding: "13px", marginBottom: 22,
            background: canAnalyze && !analyzing
              ? "linear-gradient(135deg, #1E3C5A 0%, #2E86DE 100%)"
              : "#EEF2F8",
            color: canAnalyze && !analyzing ? "#fff" : "#B0BCC8",
            border: "none", borderRadius: 11, fontSize: 14, fontWeight: 600,
            fontFamily: "inherit",
            cursor: canAnalyze && !analyzing ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 9, transition: "all 0.3s",
          }}
        >
          {analyzing ? (
            <>
              <div style={{
                width: 16, height: 16,
                border: "2px solid rgba(255,255,255,0.3)",
                borderTopColor: "#fff", borderRadius: "50%",
                animation: "spin 0.75s linear infinite",
              }} />
              <span>Generating analysis…</span>
            </>
          ) : (
            <><span>🛡️</span><span>Generate Compliance Analysis</span></>
          )}
        </button>

        {/* Article strip */}
        {article && !analyzing && (
          <div style={{
            display: "flex", gap: 8, alignItems: "center", marginBottom: 14,
            padding: "9px 13px", background: "#EEF4FB",
            borderRadius: 9, border: "1px solid #C3D9F5",
          }}>
            <span style={{
              fontSize: 11.5, fontWeight: 700, color: "#2E86DE",
              background: "#D6EAFE", padding: "3px 9px",
              borderRadius: 6, whiteSpace: "nowrap",
            }}>
              {article.label}
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: "#1E3C5A" }}>{article.title}</span>
            <span style={{ fontSize: 11.5, color: "#5B92C0", marginLeft: "auto", whiteSpace: "nowrap" }}>
              EU 2022/2554 · DORA
            </span>
          </div>
        )}

        {/* Skeleton */}
        {analyzing && <Skeleton />}

        {/* Results */}
        {result && !analyzing && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Card icon="📄" label="Rule Text"
              tag="Legal Text" tagBg="#EEF4FB" tagColor="#185FA5" delay={0}>
              <p style={{ fontSize: 13, lineHeight: 1.75, color: "#3A4E63", margin: 0 }}>
                {article?.text}
              </p>
            </Card>

            <Card icon="⚠️" label="Generated Risks"
              tag={`${result.risks.length} identified`}
              tagBg="#FFF1EE" tagColor="#C0442A" delay={110}>
              <FlowList items={result.risks} dotColor="#E05A3A" />
            </Card>

            <Card icon="✅" label="Generated Controls"
              tag={`${result.controls.length} actions`}
              tagBg="#EDFAF3" tagColor="#1D7A4A" delay={220}>
              <FlowList items={result.controls} dotColor="#2BA55E" />
            </Card>
          </div>
        )}

        {/* Empty state */}
        {!result && !analyzing && (
          <div style={{
            textAlign: "center", padding: "44px 20px",
            background: "#fff", borderRadius: 16,
            border: "1.5px dashed #DDE3EC",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <h3 style={{ fontSize: 15.5, fontWeight: 600, color: "#1A2B3C", margin: "0 0 7px" }}>
              Select an article to begin
            </h3>
            <p style={{ fontSize: 12.5, color: "#8A9BAE", lineHeight: 1.65, margin: 0 }}>
              Choose a region, regulation and Rule ID above,<br />
              then click "Generate Compliance Analysis."
            </p>
          </div>
        )}

        <DemoForm />

        <p style={{ textAlign: "center", fontSize: 11, color: "#A0AABB", marginTop: 10 }}>
          comply2reg · Automated Regulatory Intelligence · EU DORA Compliance Suite
        </p>
      </div>
    </div>
  );
}