import { PageLayout } from '../shared/PageLayout';
import { OptionCard } from '../shared/OptionCard';

const OPTIONS = {
  budget: [
    { value: 'budget', label: 'Budget', desc: '$800 – $1,200' },
    { value: 'mid_range', label: 'Mid-range', desc: '$1,200 – $2,000' },
    { value: 'high_end', label: 'High-end', desc: '$2,000 – $3,500' },
    { value: 'enthusiast', label: 'Enthusiast', desc: '$3,500+' }
  ],
  usage: [
    { value: 'office', label: 'Office', desc: 'Documents, browsing, light multitasking' },
    { value: 'gaming', label: 'Gaming', desc: 'Resolution and frame-rate come next' },
    { value: 'programming', label: 'Programming', desc: 'Compile times and extra RAM' },
    { value: 'content_creation', label: 'Content creation', desc: 'Video, 3D, and export work' }
  ],
  gaming: [
    { value: '1080p', label: '1080p', desc: '1080p, 60–144 FPS' },
    { value: '1440p', label: '1440p', desc: '1440p, 60–120 FPS' },
    { value: '4k', label: '4K', desc: '2160p, 60 FPS and up' }
  ],
  cpu: [
    { value: 'intel', label: 'Intel', desc: 'LGA1700 parts preferred' },
    { value: 'amd', label: 'AMD', desc: 'AM4 / AM5 parts preferred' },
    { value: 'none', label: 'No preference', desc: 'Highest score in budget wins' }
  ],
  rgb: [
    { value: 'very_important', label: 'Required', desc: 'Prefer lit RAM and cases' },
    { value: 'nice_to_have', label: 'Nice to have', desc: 'A small scoring bonus' },
    { value: 'dont_care', label: 'Ignore', desc: 'Lighting is not scored' }
  ],
  cooling: [
    { value: 'aio', label: 'AIO liquid', desc: 'Case must take a radiator' },
    { value: 'air', label: 'Air', desc: 'Simpler, no radiator needed' },
    { value: 'either', label: 'Either', desc: 'No cooling constraint' }
  ]
};

const TITLES = {
  budget: 'Budget',
  usage: 'Primary use',
  gaming: 'Gaming resolution',
  cpu: 'CPU brand',
  rgb: 'RGB lighting',
  cooling: 'Cooling'
};

export const QuestionsPage = ({ step, inputs, expertMessage, onNext, loading }) => {
  const currentOptions = OPTIONS[step] || [];
  const fieldName =
    step === 'gaming' ? 'gamingLevel' :
    step === 'cpu' ? 'cpuPreference' :
    step === 'rgb' ? 'rgbImportance' :
    step === 'cooling' ? 'coolingPreference' : step;

  const steps = ['budget', 'usage', ...(inputs.usage === 'gaming' ? ['gaming'] : []), 'cpu', 'rgb', 'cooling'];
  const currentIndex = steps.indexOf(step);
  const total = steps.length;

  return (
    <PageLayout brandRight={`${currentIndex + 1} / ${total} · ${TITLES[step] || ''}`}>
      <section className="question">
        <p className="kicker">{TITLES[step]}</p>
        <h1>{expertMessage}</h1>
        <p className="question-copy">Choose one. The engine uses this as a fact, then infers the rest.</p>

        <div className={`options cols-${Math.min(currentOptions.length, 4)}`}>
          {currentOptions.map((option) => (
            <OptionCard
              key={option.value}
              option={option}
              onClick={() => !loading && onNext(fieldName, option.value)}
            />
          ))}
        </div>

        <div className="progress" aria-hidden="true">
          {steps.map((s) => (
            <i key={s} className={steps.indexOf(s) <= currentIndex ? 'on' : ''} />
          ))}
        </div>
      </section>
    </PageLayout>
  );
};
