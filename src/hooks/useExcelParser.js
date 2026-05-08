import * as XLSX from "xlsx";

/**
 * useExcelParser – parses Excel (.xls, .xlsx) and CSV files client-side.
 * Returns all sheet names and allows parsing specific sheets.
 */
export default function useExcelParser() {
  const parse = async (file, sheetIndex = 0) => {
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data, { type: "array" });
    
    const sheetNames = wb.SheetNames;
    const sheetName = sheetNames[sheetIndex] || sheetNames[0];
    const ws = wb.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(ws, { defval: null });
    
    return {
      data: json,
      sheetNames,
      activeSheet: sheetName,
      rowCount: json.length,
      columns: json.length > 0 ? Object.keys(json[0]) : [],
    };
  };

  const parseAllSheets = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const wb = XLSX.read(arrayBuffer, { type: "array" });

    const sheets = {};
    wb.SheetNames.forEach((name) => {
      const ws = wb.Sheets[name];
      sheets[name] = XLSX.utils.sheet_to_json(ws, { defval: null });
    });

    return {
      sheetNames: wb.SheetNames,
      sheets,
    };
  };

  return { parse, parseAllSheets };
}
