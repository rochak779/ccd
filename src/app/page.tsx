import {
  ArrowDown,
  Check,
  FileSpreadsheet,
  Mail,
  ShieldCheck,
} from "lucide-react";

const requestedItems = [
  { label: "Customer contracts", state: "Missing" },
  { label: "FY25 revenue", state: "Missing" },
  { label: "FY26 revenue", state: "Supported" },
  { label: "Expiry dates", state: "Missing" },
] as const;

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="brand-header">
        <div className="header-inner">
          <a className="wordmark" href="#main-content" aria-label="CC’d home">
            CC’d
          </a>
          <div className="session-state" aria-label="Build status">
            <span className="state-dot" aria-hidden="true" />
            Foundation assembled
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="context-band" aria-labelledby="page-title">
          <div className="context-copy">
            <h1 id="page-title">A clear frame around the evidence.</h1>
            <p>
              CC’d connects an ordinary diligence thread to the request tracker,
              checks what the evidence supports, and leaves the decision with you.
            </p>
          </div>

          <a className="down-link" href="#prepared-example">
            See the prepared example <ArrowDown aria-hidden="true" size={18} />
          </a>
        </section>

        <section
          className="work-frame"
          id="prepared-example"
          aria-labelledby="example-title"
        >
          <div className="request-pane">
            <div className="pane-heading">
              <span className="icon-box"><Mail aria-hidden="true" size={19} /></span>
              <div>
                <h2 id="example-title">Request C-14 · Prepared sample</h2>
              </div>
            </div>
            <p className="request-copy">
              Please provide the top-customer schedule, including contracts,
              FY25 and FY26 revenue, and expiry dates.
            </p>
            <span className="status-chip neutral">Response received</span>
          </div>

          <div className="coverage-pane">
            <div className="coverage-head">
              <h2>Evidence coverage: 1 of 4 supported</h2>
              <FileSpreadsheet aria-hidden="true" size={24} />
            </div>

            <ul className="coverage-list" aria-label="Requested evidence coverage">
              {requestedItems.map((item) => (
                <li key={item.label} className={item.state === "Supported" ? "supported" : "missing"}>
                  <span className="coverage-marker" aria-hidden="true">
                    {item.state === "Supported" ? <Check size={14} /> : "—"}
                  </span>
                  <span>{item.label}</span>
                  <strong>{item.state}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="decision-pane">
            <h2>Proposed: Partial — evidence missing</h2>
            <p>
              The reply includes FY26 revenue only. Three requested components
              remain open for review.
            </p>
            <div className="human-control">
              <ShieldCheck aria-hidden="true" size={20} />
              <div>
                <strong>Human approval required</strong>
                <span>No material tracker state changes automatically.</span>
              </div>
            </div>
            <span className="preview-label">Prepared preview · unavailable in S01</span>
            <button className="prepared-action" type="button" disabled>
              Approve as partial
            </button>
          </div>
        </section>

        <section className="delivery-strip" id="delivery" aria-labelledby="delivery-title">
          <div>
            <h2 id="delivery-title">Session 01 delivery foundation</h2>
          </div>
          <p>
            Development, linting, type checking, production builds and browser smoke
            testing are configured in scripts and the CI workflow.
          </p>
        </section>
      </main>

      <footer>
        <span>CC’d</span>
        <span>A response is an event. An answer is a verified state.</span>
      </footer>
    </>
  );
}
