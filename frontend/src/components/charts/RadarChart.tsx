type RadarAxis = {
  label: string;
  firstValue: number;
  secondValue: number;
};

type RadarChartProps = {
  axes: RadarAxis[];
  firstName: string;
  secondName: string;
  caption: string;
};

const CENTER_X = 210;
const CENTER_Y = 218;
const RADIUS = 110;
const LABEL_RADIUS = 148;
const RINGS = [25, 50, 75, 100];

function point(index: number, radius: number, count: number) {
  const angle = -Math.PI / 2 + (index * Math.PI * 2) / count;
  return {
    x: CENTER_X + Math.cos(angle) * radius,
    y: CENTER_Y + Math.sin(angle) * radius,
  };
}

function polygonPoints(values: number[], count: number) {
  return values.map((value, index) => {
    const { x, y } = point(index, RADIUS * Math.max(0, Math.min(value, 100)) / 100, count);
    return `${x},${y}`;
  }).join(' ');
}

function labelLines(label: string) {
  const split: Record<string, string[]> = {
    'Technical Breadth': ['Technical', 'Breadth'],
    'Project Quality': ['Project', 'Quality'],
    'Open Source': ['Open', 'Source'],
    'Portfolio Readiness': ['Portfolio', 'Readiness'],
    'Community Signal': ['Community', 'Signal'],
  };
  return split[label] || [label];
}

export default function RadarChart({ axes, firstName, secondName, caption }: RadarChartProps) {
  const firstValues = axes.map((axis) => axis.firstValue);
  const secondValues = axes.map((axis) => axis.secondValue);
  const description = `${firstName} and ${secondName} profile shape comparison. ${axes.map((axis) => `${axis.label}: ${firstName} ${axis.firstValue}, ${secondName} ${axis.secondValue}`).join('; ')}.`;

  return (
    <div className="radar-wrap">
      <div className="radar-legend" aria-label="Chart legend">
        <span className="radar-legend-item"><i className="radar-swatch radar-swatch-first" aria-hidden="true" />@{firstName}</span>
        <span className="radar-legend-item"><i className="radar-swatch radar-swatch-second" aria-hidden="true" />@{secondName}</span>
      </div>
      <svg className="radar-chart" viewBox="0 0 420 436" role="img" aria-label={description}>
        <title>{description}</title>
        {RINGS.map((ring) => {
          const points = axes.map((_, index) => {
            const position = point(index, RADIUS * ring / 100, axes.length);
            return `${position.x},${position.y}`;
          }).join(' ');
          return <polygon className="radar-grid" key={ring} points={points} />;
        })}
        {axes.map((axis, index) => {
          const end = point(index, RADIUS, axes.length);
          const labelPosition = point(index, LABEL_RADIUS, axes.length);
          const lines = labelLines(axis.label);
          const textAnchor = labelPosition.x < CENTER_X - 10 ? 'end' : labelPosition.x > CENTER_X + 10 ? 'start' : 'middle';
          return (
            <g key={axis.label}>
              <line className="radar-spoke" x1={CENTER_X} y1={CENTER_Y} x2={end.x} y2={end.y} />
              <text className="radar-axis-label" x={labelPosition.x} y={labelPosition.y - ((lines.length - 1) * 7)} textAnchor={textAnchor}>
                {lines.map((line, lineIndex) => <tspan key={line} x={labelPosition.x} dy={lineIndex === 0 ? 0 : 14}>{line}</tspan>)}
              </text>
            </g>
          );
        })}
        <polygon className="radar-series radar-series-first" points={polygonPoints(firstValues, axes.length)} />
        <polygon className="radar-series radar-series-second" points={polygonPoints(secondValues, axes.length)} />
        {axes.map((axis, index) => {
          const first = point(index, RADIUS * Math.max(0, Math.min(axis.firstValue, 100)) / 100, axes.length);
          const second = point(index, RADIUS * Math.max(0, Math.min(axis.secondValue, 100)) / 100, axes.length);
          return (
            <g key={axis.label}>
              <circle className="radar-marker-first" cx={first.x} cy={first.y} r="4" tabIndex={0} aria-label={`${firstName}, ${axis.label}: ${axis.firstValue}`}>
                <title>{`${firstName}, ${axis.label}: ${axis.firstValue}`}</title>
              </circle>
              <rect className="radar-marker-second" x={second.x - 4} y={second.y - 4} width="8" height="8" tabIndex={0} aria-label={`${secondName}, ${axis.label}: ${axis.secondValue}`}>
                <title>{`${secondName}, ${axis.label}: ${axis.secondValue}`}</title>
              </rect>
            </g>
          );
        })}
      </svg>
      <p className="radar-caption">{caption}</p>
      <dl className="sr-only" aria-label="Scores by profile and category">
        {axes.map((axis) => <div key={axis.label}><dt>{axis.label}</dt><dd>@{firstName}: {axis.firstValue}; @{secondName}: {axis.secondValue}</dd></div>)}
      </dl>
    </div>
  );
}
