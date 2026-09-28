export const PageLayout = ({ children, brandRight }) => (
  <div className="page">
    <div className="shell">
      <header className="topbar">
        <div className="brand"><strong>PC Builder</strong></div>
        {brandRight ? <div className="step-meta">{brandRight}</div> : null}
      </header>
      {children}
    </div>
  </div>
);
