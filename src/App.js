import { useState, useEffect, useRef, useCallback } from "react";
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

const JSON_URL = process.env.PUBLIC_URL + "/dora_compliance_data.json";


function PolygonBackground() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const init = useCallback((canvas) => {
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const NODE_COUNT = Math.floor((W * H) / 22000);
    const MAX_DIST = 180;

    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2 + 1.5,
    }));

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Draw connecting lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.18;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(37, 99, 235, 0.25)";
        ctx.fill();
      }

      // Update positions
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > W) node.vx *= -1;
        if (node.y < 0 || node.y > H) node.vy *= -1;
      }

      animRef.current = requestAnimationFrame(draw);
    }

    draw();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      init(canvas);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [init]);

  return <canvas ref={canvasRef} className="polygon-bg" />;
}


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

function DemoFormModal({ isOpen, onClose }) {
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

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        <div className="demo-form">
          <span className="demo-form-eyebrow">DEMO REQUEST</span>
          <h3>Book a Demo</h3>
          <p>Book a personalised demo with our compliance technology.</p>

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
                    Submit Request
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const getFirstSentence = (text) => {
  if (!text) return "";
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0] : text;
};

export default function DORAComplianceTool() {
  const [articles, setArticles] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState("");

  const [region, setRegion] = useState("");
  const [regulation, setRegulation] = useState("");
  const [ruleId, setRuleId] = useState("");

  const [displayedArticle, setDisplayedArticle] = useState(null);
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  /* load json*/
  useEffect(() => {
    fetch(JSON_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setArticles(data.articles);
        setDataLoading(false);
      })
      .catch(() => {
        setDataError(`Could not load ${JSON_URL}. Make sure dora_compliance_data.json is in /public.`);
        setDataLoading(false);
      });
  }, []);

  const article = articles.find((a) => a.id === ruleId) ?? null;
  const canGenerate = !!(region && regulation && ruleId && !dataLoading);

  function handleGenerate() {
    if (!canGenerate || !article) return;
    setGenerating(true);
    setResult(null);
    setDisplayedArticle(null);

    setTimeout(() => {
      setDisplayedArticle(article);
      setResult({ risks: article.risks, controls: article.controls });
      setGenerating(false);
    }, 1000);
  }

  const regionOptions = [{ value: "eu", label: "EU European Union" }];
  const regulationOptions = [{ value: "dora", label: "DORA — Digital Operational Resilience Act" }];
  const ruleOptions = articles.map((a) => ({ value: a.id, label: `${a.label} — ${a.title}` }));

  /* rendering */
  return (
    <div className="app">
      <PolygonBackground />
      
      {/* Main Clean Header */}
      <header className="header-clean">
        <h1 className="logo-text">DORA <span className="logo-subtext">Explore</span></h1>
        <p className="header-subtitle-text">
          Select a regulatory article to instantly view the rule text, the risks it generates, and the governance controls required to meet it.
        </p>
      </header>

      {/* Main Content Area */}
      <main className="main">
        <div className="main-inner-widescreen">

          {/* Error Banner */}
          {dataError && (
            <div className="error-banner">
              <MdErrorOutline size={18} style={{ flexShrink: 0 }} />
              {dataError}
            </div>
          )}

          {/* Selector panel */}
          <div className="selector-panel card">
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
                    onChange={(v) => {
                      setRegion(v);
                      setRegulation("");
                      setRuleId("");
                    }}
                    options={regionOptions}
                    disabled={false}
                  />
                  <Dropdown
                    label="Regulation"
                    icon={MdBookmark}
                    value={regulation}
                    onChange={(v) => {
                      setRegulation(v);
                      setRuleId("");
                    }}
                    options={regulationOptions}
                    disabled={!region}
                  />
                  <Dropdown
                    label="Article"
                    icon={MdArticle}
                    value={ruleId}
                    onChange={(v) => {
                      setRuleId(v);
                    }}
                    options={ruleOptions}
                    disabled={!regulation}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Generate Button */}
          {!dataLoading && (
            <div className="generate-btn-container">
              <button
                className="generate-dashboard-btn"
                onClick={handleGenerate}
                disabled={!canGenerate || generating}
                type="button"
              >
                {generating ? (
                  <>
                    <div className="spinner" style={{ marginRight: 8 }} />
                    Generating Risks and Controls…
                  </>
                ) : (
                  <>
                    <MdAutoAwesome size={16} style={{ marginRight: 6 }} />
                    Generate Risks and Controls
                  </>
                )}
              </button>
            </div>
          )}

          {/* Skeleton Loader during generation */}
          {generating && <Skeleton />}

          {/* Three-Column Horizontal Dashboard Layout */}
          {displayedArticle && result && !generating && (
            <div className="dashboard-grid">
              
              {/* Column 1: Article info, lead paragraph, rule text, CTAs */}
              <div className="dashboard-col col-left">
                <div className="article-intro-header">
                  <span className="badge-article-label">{displayedArticle.label}</span>
                  <h2 className="article-title-text">{displayedArticle.title}</h2>
                </div>
                <p className="article-lead-text">{getFirstSentence(displayedArticle.text)}</p>
                
                <ResultCard
                  iconClass="blue"
                  Icon={MdArticle}
                  title="Rule Text"
                  badge="Legal Text"
                  badgeClass="blue"
                  style={{ animationDelay: "0ms" }}
                >
                  <p className="rule-text-content">
                    {displayedArticle.text}
                  </p>
                </ResultCard>
                
                {/* CTA Action Buttons */}
                <div className="cta-container">
                  <button className="btn-cta-blue" onClick={() => setIsDemoModalOpen(true)}>
                    BOOK A DEMO →
                  </button>
                  <a href="mailto:talk2us@comply2reg.com" className="btn-cta-black">
                    TALK2US@COMPLY2REG.COM
                  </a>
                </div>
              </div>

              {/* Column 2: Identified Risks */}
              <div className="dashboard-col col-risks">
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
              </div>

              {/* Column 3: Governance Controls */}
              <div className="dashboard-col col-controls">
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

            </div>
          )}

          {/* Empty state / placeholder prompt when no generation has occurred */}
          {!displayedArticle && !generating && !dataLoading && (
            <div className="empty-state">
              <div className="empty-icon">
                <MdSearch size={24} />
              </div>
              <h3>Select Options to Begin</h3>
              <p>
                Choose a region, regulation, and article above,<br />
                then click "Generate Risks and Controls" to load the analysis.
              </p>
            </div>
          )}

          {/* Footer branding */}
          <p className="footer">
            comply2reg · EU DORA Compliance
          </p>
        </div>
      </main>

      {/* Booking Form Modal Overlay */}
      <DemoFormModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} />
    </div>
  );
}