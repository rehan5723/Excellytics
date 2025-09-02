// src/components/ChartCard.jsx
import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import Select from "./Select";
import MultiCheckbox from "./MultiCheckbox";
import { BarChart3, LineChart, PieChart, ScatterChart, AreaChart, Box } from "lucide-react";

/**
 * ChartCard component – provides a UI to build charts by selecting chart type, X axis, and Y series.
 * 
 * Props:
 * - chartType (string): Current chart type selected.
 * - setChartType (func): Setter function to update chart type.
 * - xField (string): Current X-axis field.
 * - setXField (func): Setter function to update X-axis field.
 * - yFields (array of strings): Currently selected Y-axis series.
 * - setYFields (func): Setter function to update Y-axis series.
 * - columns (array): All available column options for X-axis.
 * - numericColumns (array): All available numeric columns for Y-axis.
 */
export default function ChartCard({
  chartType,
  setChartType,
  xField,
  setXField,
  yFields,
  setYFields,
  columns,
  numericColumns,
}) {
  // Memoize chart type options to avoid unnecessary re-renders
  const chartOptions = useMemo(
    () => [
      { label: "Line", value: "line", icon: LineChart },
      { label: "Area", value: "area", icon: AreaChart },
      { label: "Bar", value: "bar", icon: BarChart3 },
      { label: "Scatter", value: "scatter", icon: ScatterChart },
      { label: "Pie", value: "pie", icon: PieChart },
      { label: "Bar 3D", value: "bar3D", icon: BarChart3 },
      { label: "Scatter 3D", value: "scatter3D", icon: Box },
    ],
    []
  );

  // Handle Y-axis selection (limit max 3 series)
  const handleYFieldChange = useCallback(
    (vals) => {
      if (vals.length <= 3) {
        setYFields(vals);
      } else {
        setYFields(vals.slice(0, 3)); // Slice to first 3 if more selected
      }
    },
    [setYFields]
  );

  return (
    <Card title="Chart Builder" icon={BarChart3}>
      <div className="space-y-6">
        {/* Chart Type Selection */}
        <section aria-labelledby="chart-type-label">
          <div
            id="chart-type-label"
            className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2"
          >
            Chart Type
          </div>
          <div className="flex gap-2 flex-wrap">
            {chartOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={chartType === opt.value} // Accessibility for selected state
                  onClick={() => setChartType(opt.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition
                    ${
                      chartType === opt.value
                        ? "bg-indigo-500 text-white border-indigo-600 shadow-md"
                        : "bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* X Axis Selection */}
        <Select
          label="X Axis"
          value={xField}
          onChange={setXField}
          options={columns}
        />

        {/* Y Axis Selection */}
        <section aria-labelledby="y-axis-label">
          <div
            id="y-axis-label"
            className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
          >
            Y Series
          </div>
          <MultiCheckbox
            values={yFields}
            onChange={handleYFieldChange}
            options={numericColumns}
          />
          <div className="text-xs text-gray-500 mt-1 italic">
            You can select up to 3 series.
          </div>
        </section>
      </div>
    </Card>
  );
}

/* ✅ PropTypes ensure proper usage of props */
ChartCard.propTypes = {
  chartType: PropTypes.string.isRequired,
  setChartType: PropTypes.func.isRequired,
  xField: PropTypes.string,
  setXField: PropTypes.func.isRequired,
  yFields: PropTypes.arrayOf(PropTypes.string).isRequired,
  setYFields: PropTypes.func.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
  numericColumns: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    })
  ).isRequired,
};

/* ✅ Default props for optional fields */
ChartCard.defaultProps = {
  xField: "",
};
