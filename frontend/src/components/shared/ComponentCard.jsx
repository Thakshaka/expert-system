import { SpecBox } from './SpecBox';

export const ComponentCard = ({
  componentKey,
  label,
  data,
  isSelected,
  onExplain,
  onFetchAlternatives,
  chosenAlternative,
  onRevertAlternative
}) => {
  const pct = data.confidence != null ? `${Math.round(data.confidence * 100)}%` : '';

  const renderSpecs = () => {
    switch (componentKey) {
      case 'cpu':
        return (
          <>
            <SpecBox label="Cores" value={data.cores} />
            <SpecBox label="Threads" value={data.threads} />
            <SpecBox label="Socket" value={data.socket} />
            <SpecBox label="Brand" value={data.brand} />
          </>
        );
      case 'motherboard':
        return (
          <>
            <SpecBox label="Chipset" value={data.chipset} />
            <SpecBox label="Socket" value={data.socket} />
            <SpecBox label="RAM" value={data.ramType.toUpperCase()} />
          </>
        );
      case 'ram':
        return (
          <>
            <SpecBox label="Capacity" value={`${data.capacity}GB`} />
            <SpecBox label="Type" value={data.type.toUpperCase()} />
            <SpecBox label="Speed" value={`${data.speed} MT/s`} />
            {data.hasRGB && <SpecBox label="RGB" value={data.hasRGB === 'yes' ? 'Yes' : 'No'} />}
          </>
        );
      case 'gpu':
        return (
          <>
            <SpecBox label="Brand" value={data.brand} />
            <SpecBox label="TDP" value={`${data.tdp}W`} />
          </>
        );
      case 'storage':
        return (
          <>
            <SpecBox label="Type" value={data.type.toUpperCase()} />
            <SpecBox label="Capacity" value={`${data.capacity}GB`} />
          </>
        );
      case 'psu':
        return (
          <>
            <SpecBox label="Wattage" value={`${data.wattage}W`} />
            <SpecBox label="Efficiency" value={data.efficiency} />
          </>
        );
      case 'case':
        return (
          <>
            <SpecBox label="Form" value={data.formFactor.replace('_', ' ')} />
            {data.hasRGB && <SpecBox label="RGB" value={data.hasRGB === 'yes' ? 'Yes' : 'No'} />}
            {data.aioSupport && <SpecBox label="AIO" value={data.aioSupport === 'yes' ? 'Yes' : 'No'} />}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <article className={`part${isSelected ? ' selected' : ''}`}>
      <div className="part-top">
        <div>
          <div className="part-kind">{label}</div>
          <div className="part-name">{data.name}</div>
        </div>
        <div>
          <div className="part-price">${Number(data.price).toLocaleString()}</div>
          {pct && <span className="part-score">{pct} match</span>}
        </div>
      </div>

      <div className="specs">{renderSpecs()}</div>

      <div className="part-actions">
        {!chosenAlternative && (
          <button type="button" className="btn btn-ghost" onClick={() => onExplain(componentKey)}>
            Why this part
          </button>
        )}
        <button type="button" className="btn btn-ghost" onClick={() => onFetchAlternatives(componentKey)}>
          Alternatives
        </button>
      </div>

      {chosenAlternative && (
        <div className="alt-note">
          Using a substitute
          <button type="button" className="btn btn-ghost" onClick={() => onRevertAlternative(componentKey)}>
            Revert
          </button>
        </div>
      )}
    </article>
  );
};
