import { PageLayout } from '../shared/PageLayout';

export const HomePage = ({ onStart }) => (
  <PageLayout>
    <section className="hero">
      <div>
        <p className="kicker">Compatibility first</p>
        <h1>Pick a budget and a job.<br />Get a matched parts list.</h1>
        <p className="lede">
          A Prolog expert system scores CPUs, boards, RAM, GPUs, storage, PSUs, and cases
          so the sockets, memory type, and wattage actually fit together.
        </p>
        <ul className="facts">
          <li>Seven parts, chosen in dependency order</li>
          <li>Forward-chaining rules from your answers</li>
          <li>A reason for every recommendation</li>
        </ul>
        <div style={{ marginTop: '2rem' }}>
          <button type="button" className="btn" onClick={onStart}>
            Start the questionnaire
          </button>
        </div>
      </div>
      <aside className="hero-aside">
        <h2>You will be asked</h2>
        <div className="aside-row"><span>Budget</span><b>4 tiers</b></div>
        <div className="aside-row"><span>Use</span><b>office / play / work</b></div>
        <div className="aside-row"><span>CPU brand</span><b>optional</b></div>
        <div className="aside-row"><span>RGB &amp; cooling</span><b>optional</b></div>
      </aside>
    </section>
  </PageLayout>
);
