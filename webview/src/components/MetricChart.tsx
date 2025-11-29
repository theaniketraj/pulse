import * as React from 'react';
import * as Plot from '@observablehq/plot';

// Component to render metric charts
interface MetricChartProps {
  metrics: any;
  loading?: boolean;
  error?: string | null;
}

const MetricChart: React.FC<MetricChartProps> = ({ metrics, loading, error }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (loading || error || !metrics?.data?.result) {
      if (ref.current) ref.current.innerHTML = ''; // Clear chart
      return;
    }

    let plot: HTMLElement | SVGSVGElement | null = null;
    if (ref.current && metrics?.data?.result) {
      const data = metrics.data.result.flatMap((r: any) =>
        r.values ? r.values.map((v: any) => ({
          time: new Date(v[0] * 1000),
          value: parseFloat(v[1]),
          metric: r.metric
        })) : [{
          time: new Date(r.value[0] * 1000),
          value: parseFloat(r.value[1]),
          metric: r.metric
        }]
      );

      // Clear previous chart
      ref.current.innerHTML = '';

      plot = Plot.plot({
        marks: [
          Plot.line(data, { x: 'time', y: 'value', stroke: 'steelblue' }),
          Plot.dot(data, { x: 'time', y: 'value', fill: 'steelblue', tip: true })
        ],
        x: { label: 'Time' },
        y: { label: 'Value', grid: true },
        width: 600,
        height: 400,
        style: {
          background: 'transparent',
          color: 'var(--vscode-editor-foreground)',
        }
      });

      ref.current.appendChild(plot);
    }
    return () => {
      if (plot && ref.current && ref.current.contains(plot)) {
        ref.current.removeChild(plot);
      }
    };
  }, [metrics, loading, error]);

  if (loading) return <div className="metric-chart">Loading metrics...</div>;
  if (error) return <div className="metric-chart error">Error: {error}</div>;
  if (!metrics) return <div className="metric-chart">No data available</div>;

  return <div ref={ref} className="metric-chart" />;
};

export default MetricChart;