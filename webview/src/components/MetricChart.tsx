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
  const containerRef = React.useRef<HTMLDivElement>(null);

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

      // Get container width for responsiveness
      const width = containerRef.current?.clientWidth || 600;

      plot = Plot.plot({
        marks: [
          Plot.areaY(data, {
            x: 'time',
            y: 'value',
            fill: 'url(#gradient)',
            fillOpacity: 0.3
          }),
          Plot.line(data, {
            x: 'time',
            y: 'value',
            stroke: 'var(--pulse-primary)',
            strokeWidth: 2
          }),
          Plot.dot(data, {
            x: 'time',
            y: 'value',
            fill: 'var(--pulse-primary)',
            r: 3,
            tip: true,
            title: (d: any) => `${d.time.toLocaleTimeString()}\nValue: ${d.value}`
          })
        ],
        x: {
          label: null,
          tickFormat: '%H:%M:%S',
          grid: false
        },
        y: {
          label: null,
          grid: true
        },
        width: width,
        height: 350,
        marginTop: 20,
        marginBottom: 30,
        marginLeft: 40,
        marginRight: 20,
        style: {
          background: 'transparent',
          color: 'var(--vscode-editor-foreground)',
          fontSize: '11px',
          fontFamily: 'var(--vscode-font-family)',
          overflow: 'visible'
        }
      });

      // Add gradient definition
      const svg = plot as SVGSVGElement;
      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      const linearGradient = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      linearGradient.setAttribute("id", "gradient");
      linearGradient.setAttribute("x1", "0%");
      linearGradient.setAttribute("y1", "0%");
      linearGradient.setAttribute("x2", "0%");
      linearGradient.setAttribute("y2", "100%");

      const stop1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop1.setAttribute("offset", "0%");
      stop1.setAttribute("stop-color", "var(--pulse-primary)");
      stop1.setAttribute("stop-opacity", "0.5");

      const stop2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      stop2.setAttribute("offset", "100%");
      stop2.setAttribute("stop-color", "var(--pulse-primary)");
      stop2.setAttribute("stop-opacity", "0.0");

      linearGradient.appendChild(stop1);
      linearGradient.appendChild(stop2);
      defs.appendChild(linearGradient);
      svg.prepend(defs);

      ref.current.appendChild(plot);
    }
    return () => {
      if (plot && ref.current && ref.current.contains(plot)) {
        ref.current.removeChild(plot);
      }
    };
  }, [metrics, loading, error]);

  return (
    <div ref={containerRef} className="metric-chart-container" style={{ width: '100%', height: '100%' }}>
      {loading && <div className="chart-status">Loading metrics...</div>}
      {error && <div className="chart-status error">Error: {error}</div>}
      {!loading && !error && !metrics && <div className="chart-status">No data available</div>}
      <div ref={ref} className="metric-chart" />
    </div>
  );
};

export default MetricChart;