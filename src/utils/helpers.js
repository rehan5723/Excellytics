export function classNames(...s) {
  return s.filter(Boolean).join(" ");
}

export function isNumericColumn(data, key) {
  return data.some((row) => typeof row[key] === "number");
}

export function unique(arr) {
  return Array.from(new Set(arr));
}

function toFiniteNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function areClose(a, b, tolerance = 0.01) {
  return Math.abs(a - b) <= tolerance;
}

export function validateDatasetInsights({
  data,
  columns,
  basicInsights,
  columnInsights,
}) {
  const errors = [];
  const warnings = [];
  let totalChecks = 0;
  let passedChecks = 0;

  const pass = () => {
    totalChecks += 1;
    passedChecks += 1;
  };

  const fail = (message) => {
    totalChecks += 1;
    errors.push(message);
  };

  const warn = (message) => {
    warnings.push(message);
  };

  if (!Array.isArray(data) || !Array.isArray(columns)) {
    return {
      isValid: false,
      score: 0,
      totalChecks: 1,
      passedChecks: 0,
      errors: ["Validation input is invalid."],
      warnings: [],
    };
  }

  if (basicInsights?.rowCount === data.length) {
    pass();
  } else {
    fail("Row count in insights does not match dataset row count.");
  }

  if (basicInsights?.columnCount === columns.length) {
    pass();
  } else {
    fail("Column count in insights does not match detected columns.");
  }

  const insightColumns = Array.isArray(columnInsights)
    ? columnInsights.map((ci) => ci.column)
    : [];
  const missingColumns = columns.filter((c) => !insightColumns.includes(c));
  if (missingColumns.length === 0) {
    pass();
  } else {
    fail(`Missing column insights for: ${missingColumns.join(", ")}`);
  }

  (columnInsights || []).forEach((ci) => {
    const columnName = ci.column;
    if (!columns.includes(columnName)) {
      fail(`Column insight includes unknown column: ${columnName}`);
      return;
    }

    const rawValues = data
      .map((row) => row[columnName])
      .filter((v) => v !== null && v !== undefined);

    const uniqueCount = new Set(rawValues).size;
    if (ci.uniqueCount === uniqueCount) {
      pass();
    } else {
      fail(`Unique count mismatch for column ${columnName}.`);
    }

    if ((ci.sampleValues || []).every((sv) => rawValues.includes(sv))) {
      pass();
    } else {
      fail(`Sample values contain out-of-dataset values for ${columnName}.`);
    }

    if (ci.type === "numeric") {
      const nums = rawValues.map(toFiniteNumber).filter((v) => v !== null);
      if (!nums.length) {
        fail(`Numeric insight for ${columnName} has no valid numeric values.`);
        return;
      }

      if (nums.length !== rawValues.length) {
        warn(`Column ${columnName} marked numeric but has non-numeric values.`);
      }

      const min = Math.min(...nums);
      const max = Math.max(...nums);
      const mean = nums.reduce((a, b) => a + b, 0) / nums.length;

      const sorted = [...nums].sort((a, b) => a - b);
      const median =
        sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];

      const variance =
        nums.reduce((acc, val) => acc + (val - mean) ** 2, 0) / nums.length;
      const stdDev = Math.sqrt(variance);

      const reportedMean = toFiniteNumber(ci.mean);
      const reportedMedian = toFiniteNumber(ci.median);
      const reportedStdDev = toFiniteNumber(ci.stdDev);

      if (ci.min === min && ci.max === max) {
        pass();
      } else {
        fail(`Min/Max mismatch for column ${columnName}.`);
      }

      if (reportedMean !== null && areClose(reportedMean, mean)) {
        pass();
      } else {
        fail(`Mean mismatch for column ${columnName}.`);
      }

      if (reportedMedian !== null && areClose(reportedMedian, median)) {
        pass();
      } else {
        fail(`Median mismatch for column ${columnName}.`);
      }

      if (reportedStdDev !== null && areClose(reportedStdDev, stdDev)) {
        pass();
      } else {
        fail(`StdDev mismatch for column ${columnName}.`);
      }
    } else {
      const freq = {};
      rawValues.forEach((v) => {
        freq[v] = (freq[v] || 0) + 1;
      });
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
      const expectedTopValue = sorted[0] ? sorted[0][0] : null;

      if ((ci.topValue || null) === expectedTopValue) {
        pass();
      } else {
        fail(`Top value mismatch for column ${columnName}.`);
      }
    }
  });

  const score = totalChecks
    ? Math.round((passedChecks / totalChecks) * 100)
    : 0;

  return {
    isValid: errors.length === 0,
    score,
    totalChecks,
    passedChecks,
    errors,
    warnings,
  };
}
