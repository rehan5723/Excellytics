// src/components/Chart3D.jsx
import React from "react";
import ReactECharts from "echarts-for-react";

/**
 * Chart3D component – renders a 3D bar chart using ECharts.
 * 
 * Props:
 * - data (array): Array of objects containing chart data.
 * - xKey (string): Key for X-axis category in data objects.
 * - yKey (string): Key for Y-axis category in data objects.
 * - zKey (string): Key for Z-axis value in data objects.
 * - type (string): Type of 3D chart (default is 'bar'). Currently only 'bar3D' is implemented.
 */
export default function Chart3D({ data = [], xKey, yKey, zKey, type = "bar" }) {
  // If no data, show placeholder message
  if (!data.length) {
    return (
      <div className="h-64 grid place-items-center text-gray-400 italic">
        No data available
      </div>
    );
  }

  // Extract unique labels for X and Y axes
  const xLabels = [...new Set(data.map(d => d[xKey]))];
  const yLabels = [...new Set(data.map(d => d[yKey]))];

  // Format data for 3D: [[xIndex, yIndex, value], ...]
  const seriesData = data.map(d => [
    xLabels.indexOf(d[xKey]), 
    yLabels.indexOf(d[yKey]), 
    d[zKey]
  ]);

  // ECharts option configuration
  const option = {
    tooltip: {}, // Enable default tooltip
    xAxis3D: { type: 'category', data: xLabels },
    yAxis3D: { type: 'category', data: yLabels },
    zAxis3D: { type: 'value' },
    grid3D: {
      boxWidth: 100,
      boxDepth: 80,
      viewControl: { projection: 'perspective' } // Perspective 3D view
    },
    series: [
      {
        type: 'bar3D',         // 3D bar chart
        data: seriesData,      // Data formatted as [[xIndex, yIndex, value], ...]
        shading: 'lambert',    // Smooth shading
        label: { show: false },// Disable labels on bars
        itemStyle: { color: '#7C3AED' }, // Bar color (purple theme)
      }
    ]
  };

  // Render the chart with fixed height and full width
  return <ReactECharts option={option} style={{ height: 420, width: '100%' }} />;
}
