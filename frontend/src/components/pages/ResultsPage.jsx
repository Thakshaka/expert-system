import React, { useState } from 'react';
import { X } from 'lucide-react';
import { PageLayout } from '../shared/PageLayout';
import { ComponentCard } from '../shared/ComponentCard';

const API_URL = 'http://localhost:8080/api';

const PARTS = [
  { key: 'cpu', label: 'Processor' },
  { key: 'motherboard', label: 'Motherboard' },
  { key: 'ram', label: 'Memory' },
  { key: 'gpu', label: 'Graphics' },
  { key: 'storage', label: 'Storage' },
  { key: 'psu', label: 'Power supply' },
  { key: 'case', label: 'Case' }
];

const matchLabel = (conf) => {
  if (conf >= 0.9) return 'strong match';
  if (conf >= 0.8) return 'good match';
  if (conf >= 0.7) return 'acceptable';
  return 'compromise';
};

export const ResultsPage = ({
  build,
  originalBuild,
  trace,
  onStartOver,
  chosenAlternatives,
  setChosenAlternatives,
  setBuild
}) => {
  const [showTrace, setShowTrace] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [alternatives, setAlternatives] = useState(null);
  const [showAlternatives, setShowAlternatives] = useState(false);

  const formatExplanation = (text) => {
    if (!text || typeof text !== 'string') return { humanText: '', confidence: null };

    const confMatch = text.match(/Confidence:\s*([0-9]*\.?[0-9]+)/i);
    const confidence = confMatch ? parseFloat(confMatch[1]) : null;
    const rationaleMatch = text.match(/Selection Rationale:\s*([\s\S]*?)(?:\n|$|\u2713\sConfidence|\bConfidence:)/i);
    const rationale = rationaleMatch ? rationaleMatch[1].trim() : null;

    let humanText = text.split('\n')[0] || '';
    if (rationale) {
      humanText += `\n\n${rationale}`;
    } else {
      const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
      const filtered = lines.filter((l) => !/\bconfidence\b/i.test(l));
      if (filtered.length > 1) {
        humanText += `\n\n${filtered.slice(1, 4).join('\n')}`;
      }
    }
    return { humanText, confidence };
  };

  const explainComponent = async (component) => {
    try {
      const response = await fetch(`${API_URL}/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ component, type: 'why' })
      });
      const data = await response.json();
      if (!response.ok) return;
      const parsed = formatExplanation(data.explanation);
      setExplanation({
        component,
        raw: data.explanation,
        humanText: parsed.humanText,
        confidence: parsed.confidence
      });
      setSelectedComponent(component);
    } catch (error) {
      console.error('Explain error:', error);
    }
  };

  const fetchAlternatives = async (component) => {
    try {
      setAlternatives({ component, items: null, loading: true });
      setShowAlternatives(true);
      const url = `${API_URL}/alternatives?component=${encodeURIComponent(component)}`;
      const response = await fetch(url, { method: 'GET' });
      const data = await response.json();
      if (!response.ok) {
        setAlternatives({ component, items: [], error: data || { error: 'Unknown error' } });
        return;
      }
      const items = Array.isArray(data.alternatives) ? data.alternatives.map((a) => ({ ...a })) : [];
      setAlternatives({ component, items });
    } catch (err) {
      setAlternatives({ component, items: [], error: String(err) });
    }
  };

  const applyChosenAlternatives = (baseBuild, chosenMap) => {
    if (!baseBuild) return null;
    const comps = ['cpu', 'motherboard', 'ram', 'gpu', 'storage', 'psu', 'case'];
    const newBuild = JSON.parse(JSON.stringify(baseBuild));

    comps.forEach((c) => {
      const alt = chosenMap[c];
      if (alt) {
        if (!newBuild[c]) newBuild[c] = {};
        Object.keys(alt).forEach((k) => {
          if (k === 'price') {
            newBuild[c].price = Number(alt.price);
            return;
          }
          if (k === 'confidence') {
            if (alt.confidence != null) newBuild[c].confidence = Number(alt.confidence);
            return;
          }
          if (alt[k] != null) newBuild[c][k] = alt[k];
        });
      }
    });

    const prices = comps.map((c) => (newBuild[c] && Number(newBuild[c].price)) || 0);
    const totalCost = prices.reduce((a, b) => a + b, 0);
    const confidences = comps.map((c) => (newBuild[c] && newBuild[c].confidence != null) ? Number(newBuild[c].confidence) : null);
    const present = confidences.filter((c) => c != null);
    const overallConfidence = present.length ? (present.reduce((a, b) => a + b, 0) / present.length) : 0;

    newBuild.totalCost = totalCost;
    newBuild.overallConfidence = overallConfidence;
    return newBuild;
  };

  const useAlternative = (alt) => {
    const newChosen = { ...(chosenAlternatives || {}) };
    const fallbackConf = (originalBuild && originalBuild[alternatives.component] && originalBuild[alternatives.component].confidence) || 0;
    newChosen[alternatives.component] = {
      ...alt,
      price: Number(alt.price),
      confidence: alt.confidence != null ? Number(alt.confidence) : fallbackConf
    };
    setChosenAlternatives(newChosen);
    if (originalBuild) {
      setBuild(applyChosenAlternatives(originalBuild, newChosen));
    }
    setShowAlternatives(false);
    setAlternatives(null);
  };

  return (
    <PageLayout brandRight="recommended build">
      <div className="results-head">
        <div>
          <p className="kicker">Result</p>
          <h1>Recommended parts</h1>
          <p className="lede" style={{ marginTop: '0.55rem' }}>
            Socket, RAM type, and PSU wattage were checked before scoring.
          </p>
        </div>
        <div className="totals">
          <div className="price">${Number(build.totalCost).toLocaleString()}</div>
          <div className="score">
            {Math.round(build.overallConfidence * 100)}% · {matchLabel(build.overallConfidence)}
          </div>
        </div>
      </div>

      <div className="toolbar">
        <button type="button" className="btn btn-ghost" onClick={() => setShowTrace(!showTrace)}>
          {showTrace ? 'Hide' : 'Show'} reasoning ({trace.length} steps)
        </button>
        <button type="button" className="btn btn-ghost" onClick={onStartOver}>
          Start over
        </button>
      </div>

      {showTrace && (
        <div className="trace">
          {trace.map((t, i) => (
            <p key={i}>
              <em>[{t.type}] {t.subject}</em> — {t.message}
            </p>
          ))}
        </div>
      )}

      <div className="parts">
        {PARTS.filter((c) => build[c.key]).map((c) => (
          <ComponentCard
            key={c.key}
            componentKey={c.key}
            label={c.label}
            data={build[c.key]}
            isSelected={selectedComponent === c.key}
            onExplain={explainComponent}
            onFetchAlternatives={fetchAlternatives}
            chosenAlternative={chosenAlternatives && chosenAlternatives[c.key]}
            onRevertAlternative={(key) => {
              const next = { ...(chosenAlternatives || {}) };
              delete next[key];
              setChosenAlternatives(next);
              if (originalBuild) {
                setBuild(applyChosenAlternatives(originalBuild, next));
              }
            }}
          />
        ))}
      </div>

      {explanation && (
        <div className="modal-bg" onClick={() => setExplanation(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <p className="kicker">{explanation.component}</p>
                <h2>Why this part</h2>
              </div>
              <button type="button" className="icon-btn" onClick={() => setExplanation(null)} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="why">{explanation.humanText || explanation.raw}</div>
            {explanation.confidence != null && (
              <p className="score" style={{ marginTop: '1rem' }}>
                {Math.round(explanation.confidence * 100)}% match
              </p>
            )}
          </div>
        </div>
      )}

      {showAlternatives && alternatives && (
        <div
          className="modal-bg"
          onClick={() => { setShowAlternatives(false); setAlternatives(null); }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <div>
                <p className="kicker">{alternatives.component}</p>
                <h2>Other candidates</h2>
              </div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => { setShowAlternatives(false); setAlternatives(null); }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {alternatives.loading && <p className="lede">Loading…</p>}
            {alternatives.error && <p className="lede">{String(alternatives.error?.error || alternatives.error)}</p>}
            {Array.isArray(alternatives.items) && alternatives.items.length === 0 && !alternatives.loading && (
              <p className="lede">No other parts in this slot.</p>
            )}

            {Array.isArray(alternatives.items) && alternatives.items.length > 0 && alternatives.items.map((alt, i) => (
              <div key={i} className="alt-row">
                <div>
                  <div className="part-name">
                    {alt.name}
                    {alt.selected && <span className="tag">picked</span>}
                  </div>
                  {alt.details && <div className="option-desc">{alt.details}</div>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className="part-price">${alt.price}</span>
                  <button type="button" className="btn" onClick={() => useAlternative(alt)}>Use</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  );
};
