
import { FormData } from "../types/transformer";
import * as XLSX from "xlsx";

export const exportToJson = (data: FormData): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `transformer_data_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = (data: FormData): void => {
  // Create client info worksheet
  const clientInfoWS = XLSX.utils.json_to_sheet([data.clientInfo]);
  
  // Create transformer data worksheet
  const transformerData = data.transformers.map(transformer => {
    const baseData = { ...transformer };
    
    // If transformer has OLTC, flatten the OLTC data for Excel
    if (transformer.hasOLTC && transformer.oltcInfo) {
      Object.entries(transformer.oltcInfo).forEach(([key, value]) => {
        baseData[key] = value;
      });
    }
    
    return baseData;
  });
  
  const transformerWS = XLSX.utils.json_to_sheet(transformerData);
  
  // Create workbook with both sheets
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, clientInfoWS, "Client Info");
  XLSX.utils.book_append_sheet(wb, transformerWS, "Transformer Data");
  
  // Generate Excel file and trigger download
  XLSX.writeFile(wb, `transformer_data_${new Date().toISOString().slice(0, 10)}.xlsx`);
};
