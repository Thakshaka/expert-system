export const OptionCard = ({ option, onClick }) => (
  <button type="button" className="option" onClick={onClick}>
    <div className="option-label">{option.label}</div>
    <div className="option-desc">{option.desc}</div>
  </button>
);
