import { useState, useEffect, useRef } from "react";
import "./App.css";

// reactmd icons
import {
  MdShield,
  MdPublic,
  MdDescription,
  MdBookmark,
  MdAutoAwesome,
  MdWarning,
  MdCheckCircle,
  MdArticle,
  MdSearch,
  MdCheck,
  MdKeyboardArrowDown,
  MdSend,
  MdErrorOutline,
} from "react-icons/md";

const JSON_URL = "/dora_compliance_data.json";


function Dropdown({ label, icon: Icon, value, onChange, options, disabled }) {
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
    <div className="field">
      <label className="field-label">
        {Icon && <Icon size={12} />}
        {label}
      </label>
      <div className="dropdown-wrapper" ref={ref}>
        <button
          className={`dropdown-btn${open ? " open" : ""}`}
          onClick={() => !disabled && setOpen((o) => !o)}
          disabled={disabled}
          type="button"
        >
          <span className={`dropdown-btn-text${!selected ? " dropdown-btn-placeholder" : ""}`}>
            {selected ? selected.label : `Select ${label}`}
          </span>
          <MdKeyboardArrowDown
            size={18}
            className={`dropdown-chevron${open ? " rotated" : ""}`}
          />
        </button>

        {open && (
          <div className="dropdown-menu">
            {options.map((o) => (
              <div
                key={o.value}
                className={`dropdown-item${o.value === value ? " active" : ""}`}
                onClick={() => { onChange(o.value); setOpen(false); }}
              >
                {o.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


function ResultCard({ iconClass, Icon, title, badge, badgeClass, children, style }) {
  return (
    <div className="card result-card" style={style}>
      <div className="card-header">
        <div className={`card-icon ${iconClass}`}>
          <Icon size={15} />
        </div>
        <span className="card-title">{title}</span>
        {badge && (
          <span className={`card-badge ${badgeClass}`}>{badge}</span>
        )}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}


function FlowList({ items, dotClass }) {
  return (
    <div className="flow-list">
      {items.map((item, i) => (
        <div key={i} className="flow-item">
          <div className={`flow-dot ${dotClass}`} />
          <p className="flow-text">{item}</p>
        </div>
      ))}
    </div>
  );
}


function Skeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {[80, 60, 75].map((w, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton-header">
            <div className="skeleton-bar" style={{ width: 140 }} />
          </div>
          <div className="skeleton-body">
            {[w, w - 12, w - 5].map((pw, j) => (
              <div key={j} className="skeleton-bar" style={{ width: `${pw}%`, animationDelay: `${j * 0.1}s` }} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


// sheetsdb api
const SHEETSDB_URL = "https://sheetdb.io/api/v1/v3npu5mie2tu6";

function DemoForm() {
  const [form, setForm] = useState({ name: "", email: "", org: "", role: "" });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const fields = [
    { key: "name", placeholder: "Full name", type: "text" },
    { key: "email", placeholder: "Work email", type: "email" },
    { key: "org", placeholder: "Organisation", type: "text" },
    { key: "role", placeholder: "Your role", type: "text" },
  ];

  async function handleSubmit() {
    if (!form.name || !form.email) return;
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(SHEETSDB_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          data: [{
            Name: form.name,
            Email: form.email,
            Organisation: form.org,
            Role: form.role,
            Timestamp: new Date().toISOString(),
          }],
        }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      setStatus("success");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="demo-form">
      <div className="demo-form-eyebrow">Get Expert Guidance</div>
      <h3>Ready for full DORA compliance?</h3>
      <p>Book a personalised demo with our regulatory specialists.</p>

      {status === "success" ? (
        <div className="demo-success">
          <MdCheckCircle className="demo-success-icon" size={22} />
          <div>
            <h4>Request received!</h4>
            <p>We'll be in touch within one business day.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="demo-form-grid">
            {fields.map(({ key, placeholder, type }) => (
              <input
                key={key}
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                className="demo-input"
                disabled={status === "submitting"}
              />
            ))}
          </div>

          {status === "error" && (
            <div className="demo-error">
              <MdErrorOutline size={15} style={{ flexShrink: 0 }} />
              {errorMsg}
            </div>
          )}

          <button
            className="demo-submit"
            onClick={handleSubmit}
            disabled={status === "submitting" || !form.name || !form.email}
            type="button"
          >
            {status === "submitting" ? (
              <>
                <div className="spinner" style={{ width: 14, height: 14 }} />
                Sending…
              </>
            ) : (
              <>
                <MdSend size={15} />
                Book a Demo
              </>
            )}
          </button>
        </>
      )}
    </div>
  );
}


export default function DORAComplianceTool() {
  const [articles, setArticles] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  const [region, setRegion] = useState("");
  const [regulation, setRegulation] = useState("");
  const [ruleId, setRuleId] = useState("");

  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  /* load json*/
  useEffect(() => {
    fetch(JSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => { setArticles(data.articles); setDataLoading(false); })
      .catch(() => {
        setDataError(`Could not load ${JSON_URL}. Make sure dora_compliance_data.json is in /public.`);
        setDataLoading(false);
      });
  }, []);


  const article = articles.find((a) => a.id === ruleId) ?? null;
  const canAnalyze = !!(region && regulation && ruleId && !dataLoading);

  const regionOptions = [{ value: "eu", label: "🇪🇺  European Union" }];
  const regulationOptions = [{ value: "dora", label: "DORA — Digital Operational Resilience Act" }];
  const ruleOptions = articles.map((a) => ({ value: a.id, label: `${a.label} — ${a.title}` }));

  const steps = [
    { n: 1, label: "Region", done: !!region },
    { n: 2, label: "Regulation", done: !!regulation },
    { n: 3, label: "Article", done: !!ruleId },
  ];

  /* optional npl integration */
  async function analyze() {
    if (!canAnalyze || !article) return;
    setAnalyzing(true);
    setResult(null);

    const prompt = `You are a dora compliance expert. For ${article.label} – ${article.title}, return ONLY a JSON object (no markdown, no backticks):
{"risks":["risk1","risk2","risk3","risk4","risk5"],"controls":["control1","control2","control3","control4","control5"]}
Article text: "${article.text}"
Keep each item under 20 words. Risks = compliance/operational failures. Controls = concrete governance actions.`;

    try {
      const res = await fetch("XXXXXXXXXXX", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "XXXXXXXXXX",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const raw = data.content.map((c) => c.text || "").join("").replace(/```json|```/g, "").trim();
      setResult(JSON.parse(raw));
    } catch {
      setResult({ risks: article.risks, controls: article.controls });
    } finally {
      setAnalyzing(false);
    }
  }

  /* rendering */
  return (
    <div className="app">
      {/*  header  */}
      <header className="header">
        <div className="header-inner">
          <img
            src="/image.png"
            alt="Comply2Reg"
            className="header-logo-img"
          />
          <span className="header-tag">EU · DORA</span>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        <div className="main-inner">

          {/* Error */}
          {dataError && (
            <div className="error-banner">
              <MdErrorOutline size={18} style={{ flexShrink: 0 }} />
              {dataError}
            </div>
          )}

          {/* Step progress */}
          <div className="steps">
            {steps.map((s, i) => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div className={`step${s.done ? " done" : ""}`}>
                  <div className="step-circle">
                    {s.done ? <MdCheck size={11} /> : s.n}
                  </div>
                  <span className="step-label">{s.label}</span>
                </div>
                {i < 2 && <div className="step-connector" />}
              </div>
            ))}
          </div>

          {/* Selector panel */}
          <div className="card">
            <div className="card-header">
              <div className="card-icon blue">
                <MdDescription size={15} />
              </div>
              <span className="card-title">Select Rule</span>
              {!dataLoading && articles.length > 0 && (
                <span className="card-badge blue">{articles.length} articles</span>
              )}
            </div>
            <div className="card-body">
              {dataLoading ? (
                <div className="loading-row">
                  <div className="spinner dark" />
                  Loading articles…
                </div>
              ) : (
                <div className="fields-grid">
                  <Dropdown
                    label="Region"
                    icon={MdPublic}
                    value={region}
                    onChange={(v) => { setRegion(v); setRegulation(""); setRuleId(""); setResult(null); }}
                    options={regionOptions}
                    disabled={false}
                  />
                  <Dropdown
                    label="Regulation"
                    icon={MdBookmark}
                    value={regulation}
                    onChange={(v) => { setRegulation(v); setRuleId(""); setResult(null); }}
                    options={regulationOptions}
                    disabled={!region}
                  />
                  <Dropdown
                    label="Article"
                    icon={MdArticle}
                    value={ruleId}
                    onChange={(v) => { setRuleId(v); setResult(null); }}
                    options={ruleOptions}
                    disabled={!regulation}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Analyze button */}
          <button
            className="analyze-btn"
            onClick={analyze}
            disabled={!canAnalyze || analyzing}
            type="button"
          >
            {analyzing ? (
              <>
                <div className="spinner" />
                Generating analysis…
              </>
            ) : (
              <>
                <MdAutoAwesome size={17} />
                Generate Compliance Analysis
              </>
            )}
          </button>

          {/* Article strip */}
          {article && !analyzing && (
            <div className="article-strip">
              <span className="article-label-tag">{article.label}</span>
              <span className="article-title">{article.title}</span>
              <span className="article-ref">EU 2022/2554</span>
            </div>
          )}

          {/* Skeleton */}
          {analyzing && <Skeleton />}

          {/* Results */}
          {result && !analyzing && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <ResultCard
                iconClass="blue"
                Icon={MdArticle}
                title="Rule Text"
                badge="Legal Text"
                badgeClass="blue"
                style={{ animationDelay: "0ms" }}
              >
                <p style={{ fontSize: 13, lineHeight: 1.75, color: "#334155", margin: 0 }}>
                  {article?.text}
                </p>
              </ResultCard>

              <ResultCard
                iconClass="red"
                Icon={MdWarning}
                title="Identified Risks"
                badge={`${result.risks.length} risks`}
                badgeClass="red"
                style={{ animationDelay: "80ms" }}
              >
                <FlowList items={result.risks} dotClass="red" />
              </ResultCard>

              <ResultCard
                iconClass="green"
                Icon={MdCheckCircle}
                title="Governance Controls"
                badge={`${result.controls.length} actions`}
                badgeClass="green"
                style={{ animationDelay: "160ms" }}
              >
                <FlowList items={result.controls} dotClass="green" />
              </ResultCard>
            </div>
          )}

          {/* empty state */}
          {!result && !analyzing && (
            <div className="empty-state">
              <div className="empty-icon">
                <MdSearch size={24} />
              </div>
              <h3>Select an article to begin</h3>
              <p>
                Choose a region, regulation, and article above,<br />
                then click "Generate Compliance Analysis."
              </p>
            </div>
          )}

          {/* contact demo form */}
          <DemoForm />

          <p className="footer">
            comply2reg · Automated Regulatory Intelligence · EU DORA Compliance Suite
          </p>
        </div>
      </main>
    </div>
  );
}