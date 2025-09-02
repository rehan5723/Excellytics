// src/components/ChartPanel.jsx
import React from "react";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  ScatterChart, Scatter, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import ReactECharts from "echarts-for-react"; // For 3D charts
import * as echarts from "echarts/core";
import "echarts-gl"; // Enable 3D charts support

// ---------------------------
// Central color palette
// ---------------------------
const palette = ["#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE"];

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
const GradientDefs = () => (
  <defs>
    {palette.map((color, i) => (
      <linearGradient key={`linear-${i}`} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity={0.9} />
        <stop offset="100%" stopColor={color} stopOpacity={0.2} />
      </linearGradient>
    ))}
    {palette.map((color, i) => (
      <radialGradient key={`radial-${i}`} id={`pie-gradient-${i}`} cx="50%" cy="50%" r="65%">
        <stop offset="0%" stopColor={color} stopOpacity={0.9} />
        <stop offset="100%" stopColor={color} stopOpacity={0.5} />
      </radialGradient>
    ))}
    <filter id="pie-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#7C3AED" floodOpacity="0.35" />
    </filter>
  </defs>
);

/**
 * ChartPanel component – dynamically renders charts based on type, data, and selected fields.
 * 
 * Props:
 * - type (string): Chart type (line, area, bar, scatter, pie, bar3D, scatter3D)
 * - data (array): Array of data objects
 * - xKey (string): Key for X-axis
 * - yKeys (array): Keys for Y-axis series
 * - theme (string): "light" or "dark" theme
 */
export default function ChartPanel({ type, data = [], xKey, yKeys = [], theme = "light" }) {
  // Early returns for empty data or missing fields
  if (!data?.length)
    return <div className="h-64 grid place-items-center text-gray-400 italic">No data available</div>;
  if (!xKey || !yKeys?.length)
    return <div className="h-64 grid place-items-center text-gray-400 italic">Please select X and Y fields</div>;

  const margins = { left: 12, right: 12, top: 16, bottom: 12 };
  const isDark = theme === "dark";

  // ---------------------------
  // 3D Charts using ECharts
  // ---------------------------
  if (type === "bar3D" || type === "scatter3D") {
    const xLabels = [...new Set(data.map(d => d[xKey]))];
    const yLabels = [...new Set(data.map(d => d[yKeys[0]]))];
    const seriesData = data.map(d => [xLabels.indexOf(d[xKey]), yLabels.indexOf(d[yKeys[0]]), d[yKeys[1]] || 0]);

    const option = {
      tooltip: {},
      xAxis3D: { type: 'category', data: xLabels },
      yAxis3D: { type: 'category', data: yLabels },
      zAxis3D: { type: 'value' },
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

    return <ReactECharts option={option} style={{ height: 420, width: '100%' }} />;
  }

  // ---------------------------
  // Pie Chart
  // ---------------------------
  if (type === "pie") {
    const grouped = data.map((row) => ({
      name: String(row[xKey]),
      value: Number(row[yKeys[0]]) || 0,
    }));
    return (
      <ResponsiveContainer width="100%" height={420}>
        <PieChart>
          <GradientDefs />
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
    );
  }

  // ---------------------------
  // Line Chart
  // ---------------------------
  if (type === "line") {
    return (
      <ResponsiveContainer width="100%" height={420}>
        <LineChart data={data} margin={margins}>
          <GradientDefs />
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
    );
  }

  // ---------------------------
  // Area Chart
  // ---------------------------
  if (type === "area") {
    return (
      <ResponsiveContainer width="100%" height={420}>
        <AreaChart data={data} margin={margins}>
          <GradientDefs />
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
    );
  }

  // ---------------------------
  // Bar Chart
  // ---------------------------
  if (type === "bar") {
    return (
      <ResponsiveContainer width="100%" height={420}>
        <BarChart data={data} margin={margins}>
          <GradientDefs />
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
    );
  }

  // ---------------------------
  // Scatter Chart
  // ---------------------------
  if (type === "scatter") {
    const y = yKeys[0];
    return (
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
    );
  }

  // Default fallback
  return null;
}
