import * as XLSX from "xlsx";

export default function useExcelParser() {
  const parse = async (file) => {
    // Support both .xls and .xlsx
    const data = await file.arrayBuffer();
    const wb = XLSX.read(data);
    const sheetName = wb.SheetNames[0];
    const ws = wb.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(ws, { defval: null });
    return json;
  };
  return { parse };
}
