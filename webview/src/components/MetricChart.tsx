import * as React from 'react';
import * as Plot from '@observablehq/plot';

// Component to render metric charts
interface MetricChartProps {
  metrics: any;
}

const MetricChart: React.FC<MetricChartProps> = ({ metrics }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let plot: HTMLElement | SVGSVGElement | null = null;
    if (ref.current && metrics?.data?.result) {
      const data = metrics.data.result.map((r: any) => ({
        time: new Date(r.value[0] * 1000),
        value: parseFloat(r.value[1])
      }));

      plot = Plot.plot({
        marks: [Plot.line(data, { x: 'time', y: 'value' })],
        width: 600,
        height: 400
      });

      ref.current.appendChild(plot);
    }
    return () => {
      if (plot && ref.current && ref.current.contains(plot)) {
        ref.current.removeChild(plot);
      }
    };
  }, [metrics]);

  return <div ref={ref} className="metric-chart" />;
};

export default MetricChart;