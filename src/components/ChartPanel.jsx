// src/components/ChartPanel.jsx
import React from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  ScatterChart, Scatter, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import ReactECharts from "echarts-for-react"; // For 3D charts
import "echarts-gl"; // Enable 3D charts support

// ---------------------------
// Central color palette
// ---------------------------
const DEFAULT_PALETTE = ["#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE"];

/**
 * Helper to generate a monochromatic palette from a base hex color
 */
const generatePalette = (baseHex, count = 5) => {
  if (!baseHex) return DEFAULT_PALETTE;
  const palette = [baseHex];
  
  // Very simplistic: just add transparency for shades if count > 1
  // For better results, one could use a color library, but here we just use fixed opacity steps
  return [
    baseHex,
    `${baseHex}cc`, // 80%
    `${baseHex}99`, // 60%
    `${baseHex}66`, // 40%
    `${baseHex}33`, // 20%
  ];
};

// ---------------------------
// Shared tooltip component
// Supports dark & light theme
// ---------------------------
const CustomTooltip = ({ active, payload, label, theme }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
          border: `1px solid ${theme === "dark" ? "#374151" : "#e5e7eb"}`,
          color: theme === "dark" ? "#f9fafb" : "#111827",
          padding: "10px 12px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          minWidth: 120,
        }}
      >
        <p className="font-semibold text-sm mb-1">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-xs">
            <span className="font-medium">{p.name}:</span> {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ---------------------------
// Gradient definitions for 2D charts
// ---------------------------
const GradientDefs = ({ palette }) => (
  <defs>
    {palette.map((color, i) => (
      <linearGradient key={`linear-${i}`} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color.length > 7 ? color.substring(0, 7) : color} stopOpacity={0.9} />
        <stop offset="100%" stopColor={color.length > 7 ? color.substring(0, 7) : color} stopOpacity={0.2} />
      </linearGradient>
    ))}
    {palette.map((color, i) => (
      <radialGradient key={`radial-${i}`} id={`pie-gradient-${i}`} cx="50%" cy="50%" r="65%">
        <stop offset="0%" stopColor={color.length > 7 ? color.substring(0, 7) : color} stopOpacity={0.9} />
        <stop offset="100%" stopColor={color.length > 7 ? color.substring(0, 7) : color} stopOpacity={0.5} />
      </radialGradient>
    ))}
    <filter id="pie-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor={palette[0]} floodOpacity="0.35" />
    </filter>
  </defs>
);

/**
 * ChartPanel component – dynamically renders charts based on type, data, and selected fields.
 * Uses React.memo to prevent unnecessary re-renders from parent updates.
 * 
 * Props:
 * - type (string): Chart type (line, area, bar, scatter, pie, bar3D, scatter3D)
 * - data (array): Array of data objects
 * - xKey (string): Key for X-axis
 * - yKeys (array): Keys for Y-axis series
 * - theme (string): "light" or "dark" theme
 */
 function ChartPanelContent({ type, data = [], xKey, yKeys = [], theme = "light", baseColor = "#6366f1" }) {
  const palette = generatePalette(baseColor);
  // Early returns for empty data or missing fields
  if (!data?.length)
    return (
      <div className="h-80 grid place-items-center rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 transition-all">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No data available</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Upload an Excel file to see charts</p>
        </div>
      </div>
    );
  if (!xKey || !yKeys?.length)
    return (
      <div className="h-80 grid place-items-center rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/60 transition-all">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">Configure your chart</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Select X axis and at least one Y series</p>
        </div>
      </div>
    );

  const margins = { left: 12, right: 12, top: 16, bottom: 12 };

  // Wrapper for consistent chart container styling
  const ChartWrapper = ({ children }) => (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/60 p-4 lg:p-5 shadow-lg transition-all">
      <header className="mb-3">
        <h3 className="text-base lg:text-lg font-semibold text-gray-800 dark:text-gray-100">
          {type.charAt(0).toUpperCase() + type.slice(1)} Chart
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          {xKey} vs {yKeys.join(", ")}
        </p>
      </header>
      {children}
    </div>
  );

  // ---------------------------
  // 3D Charts using ECharts
  // ---------------------------
  if (type === "bar3D" || type === "scatter3D") {
    const xLabels = [...new Set(data.map(d => String(d[xKey])))];
    const yLabel = yKeys[0];
    const zLabel = yKeys[1] || yKeys[0];

    let seriesData;
    if (yKeys.length >= 2) {
      const yLabels = [...new Set(data.map(d => String(d[yKeys[0]])))];
      seriesData = data.map(d => [
        xLabels.indexOf(String(d[xKey])),
        yLabels.indexOf(String(d[yKeys[0]])),
        Number(d[yKeys[1]]) || 0
      ]);
    } else {
      // Single Y key: use index as Y axis
      seriesData = data.map((d) => [
        xLabels.indexOf(String(d[xKey])),
        0,
        Number(d[yKeys[0]]) || 0
      ]);
    }

    const option = {
      tooltip: {},
      xAxis3D: { type: 'category', data: xLabels, name: xKey },
      yAxis3D: { type: yKeys.length >= 2 ? 'category' : 'value', data: yKeys.length >= 2 ? [...new Set(data.map(d => String(d[yKeys[0]])))] : undefined, name: yLabel },
      zAxis3D: { type: 'value', name: zLabel },
      grid3D: { boxWidth: 100, boxDepth: 80, viewControl: { projection: 'perspective' } },
      series: [
        {
          type: type === "bar3D" ? "bar3D" : "scatter3D",
          data: seriesData,
          shading: type === "bar3D" ? "lambert" : undefined,
          symbolSize: type === "scatter3D" ? 10 : undefined,
          itemStyle: { color: palette[0] },
        }
      ]
    };

    return (
      <ChartWrapper>
        <ReactECharts option={option} style={{ height: 420, width: '100%' }} />
      </ChartWrapper>
    );
  }

  // ---------------------------
  // Pie Chart
  // ---------------------------
  if (type === "pie") {
    // Aggregate values by xKey for pie chart
    const aggregated = {};
    data.forEach((row) => {
      const key = String(row[xKey]);
      const val = Number(row[yKeys[0]]) || 0;
      aggregated[key] = (aggregated[key] || 0) + val;
    });
    const grouped = Object.entries(aggregated).map(([name, value]) => ({ name, value }));

    return (
      <ChartWrapper>
        <ResponsiveContainer width="100%" height={420}>
          <PieChart>
            <GradientDefs palette={palette} />
            <Tooltip content={<CustomTooltip theme={theme} />} />
            <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: "12px" }} />
            <Pie
              data={grouped}
              dataKey="value"
              nameKey="name"
              outerRadius={140}
              filter="url(#pie-shadow)"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {grouped.map((_, idx) => (
                <Cell key={idx} fill={`url(#pie-gradient-${idx % palette.length})`} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  // ---------------------------
  // Line Chart
  // ---------------------------
  if (type === "line") {
    return (
      <ChartWrapper>
        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={data} margin={margins}>
            <GradientDefs palette={palette} />
            <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.4} />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip theme={theme} />} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            {yKeys.map((k, i) => (
              <Line
                key={k}
                type="monotone"
                dataKey={k}
                stroke={palette[i % palette.length]}
                dot={{ r: 2 }}
                strokeWidth={2}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  // ---------------------------
  // Area Chart
  // ---------------------------
  if (type === "area") {
    return (
      <ChartWrapper>
        <ResponsiveContainer width="100%" height={420}>
          <AreaChart data={data} margin={margins}>
            <GradientDefs palette={palette} />
            <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.4} />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip theme={theme} />} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            {yKeys.map((k, i) => (
              <Area
                key={k}
                type="monotone"
                dataKey={k}
                stroke={palette[i % palette.length]}
                fill={`url(#gradient-${i % palette.length})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  // ---------------------------
  // Bar Chart
  // ---------------------------
  if (type === "bar") {
    return (
      <ChartWrapper>
        <ResponsiveContainer width="100%" height={420}>
          <BarChart data={data} margin={margins}>
            <GradientDefs palette={palette} />
            <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.4} />
            <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip theme={theme} />} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            {yKeys.map((k, i) => (
              <Bar
                key={k}
                dataKey={k}
                fill={`url(#gradient-${i % palette.length})`}
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  // ---------------------------
  // Scatter Chart
  // ---------------------------
  if (type === "scatter") {
    const y = yKeys[0];
    return (
      <ChartWrapper>
        <ResponsiveContainer width="100%" height={420}>
          <ScatterChart margin={margins}>
            <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.4} />
            <XAxis dataKey={xKey} name={xKey} tick={{ fontSize: 12 }} />
            <YAxis dataKey={y} name={y} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip theme={theme} />} cursor={{ strokeDasharray: "3 3" }} />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Scatter
              name={`${y} vs ${xKey}`}
              data={data}
              fill={palette[2]}
              shape="circle"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartWrapper>
    );
  }

  // Default fallback
  return (
    <div className="h-80 grid place-items-center rounded-xl border border-gray-800 bg-gray-900/60">
      <p className="text-gray-400">Unsupported chart type: {type}</p>
    </div>
  );
}

// Memoized export to prevent unnecessary re-renders from parent component updates
// Only re-renders when type, data, xKey, yKeys, or theme actually change
const ChartPanel = React.memo(ChartPanelContent, (prevProps, nextProps) => {
  return (
    prevProps.type === nextProps.type &&
    prevProps.xKey === nextProps.xKey &&
    prevProps.theme === nextProps.theme &&
    prevProps.baseColor === nextProps.baseColor &&
    prevProps.data === nextProps.data && // Reference comparison - works for useMemo'd arrays
    JSON.stringify(prevProps.yKeys) === JSON.stringify(nextProps.yKeys) // Deep compare for array
  );
});

export default ChartPanel;
