// src/components/FilterCard.jsx
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Card from "./Card";
import Select from "./Select";
import { SlidersHorizontal } from "lucide-react";

/**
 * FilterCard component – allows selecting a column and a specific value to filter the dataset.
 *
 * Props:
 * - filterField (string): currently selected column to filter by
 * - setFilterField (func): setter for filterField
 * - filterValue (string): currently selected value for filtering
 * - setFilterValue (func): setter for filterValue
 * - columns (array of strings): available columns in the dataset
 * - data (array of objects): dataset to extract filter values from
 */
export default function FilterCard({
  filterField,
  setFilterField,
  filterValue,
  setFilterValue,
  columns,
  data,
}) {
  // Memoize available filter values for the selected field
  const values = useMemo(() => {
    if (!filterField || !data?.length) return [];
    const set = new Set();
    data.forEach((row) => {
      const val = row[filterField];
      if (val !== undefined && val !== null && String(val).trim() !== "") {
        set.add(String(val));
      }
    });
    return Array.from(set).sort();
  }, [filterField, data]);

  return (
    <Card title="Filters" icon={SlidersHorizontal}>
      <div className="space-y-3">
        {/* Field selector */}
        <Select
          label="Field"
          value={filterField}
          onChange={setFilterField}
          options={columns}
          placeholder="Select column"
        />

        {/* Value selector */}
        <Select
          label="Value"
          value={filterValue}
          onChange={setFilterValue}
          options={values}
          placeholder="Select value"
        />

        {/* Helper text */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Leave empty to disable filter.
        </div>
      </div>
    </Card>
  );
}

// ---------------------------
// PropTypes validation
// ---------------------------
FilterCard.propTypes = {
  filterField: PropTypes.string,           // Optional: selected column
  setFilterField: PropTypes.func.isRequired, // Required setter
  filterValue: PropTypes.string,           // Optional: selected value
  setFilterValue: PropTypes.func.isRequired, // Required setter
  columns: PropTypes.arrayOf(PropTypes.string).isRequired, // Available columns
  data: PropTypes.arrayOf(PropTypes.object), // Dataset
};

// ---------------------------
// Default props
// ---------------------------
FilterCard.defaultProps = {
  filterField: "",
  filterValue: "",
  data: [],
};
