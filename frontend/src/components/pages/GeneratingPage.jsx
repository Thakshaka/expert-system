import { PageLayout } from '../shared/PageLayout';

export const GeneratingPage = () => (
  <PageLayout brandRight="working">
    <section className="working">
      <p className="kicker">Inference</p>
      <h1>Matching parts against the knowledge base.</h1>
      <p className="lede">Same order the engine uses. Later parts depend on earlier ones.</p>
      <ol className="work-list">
        <li><span>Infer budget, use, and preference facts</span><b>01</b></li>
        <li><span>CPU, then a board on the same socket</span><b>02</b></li>
        <li><span>RAM type from the board, GPU from the workload</span><b>03</b></li>
        <li><span>Storage, then a PSU with enough wattage</span><b>04</b></li>
        <li><span>Case last — RGB and cooler support</span><b>05</b></li>
      </ol>
    </section>
  </PageLayout>
);
