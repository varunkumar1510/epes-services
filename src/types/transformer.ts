
export interface ClientInfo {
  clientName: string;
  clientAddress: string;
  pincode: string;
  trNumber: string;
  dateOfTest: Date | string;
  noOfTransformers: number;
  noOfTransformersWithOLTC: number;
  noOfTransformersWithoutOLTC: number;
}

export interface OLTCInfo {
  oltcMake: string;
  oltcType: string;
  oltcSerialNumber: string;
  oltcYearOfManufacture: string;
  oltcVoltageHV: string;
  oltcRatedCurrent: string;
  oltcOilTemperature: string;
  oltcElectrodeGap: string;
}

export interface TransformerData {
  transformerId: string;
  hasOLTC: boolean;
  transformerMake: string;
  capacity: string;
  serialNumber: string;
  yearOfManufacture: string;
  voltageHV: string;
  voltageLV: string;
  currentHV: string;
  currentLV: string;
  impedanceVoltage: string;
  oilTemperature: string;
  electrodeGap: string;
  bdvSampleNo1: string;
  bdvSampleNo2: string;
  breakdownVoltage: string;
  acidityValue: string;
  permissibleLimit: string;
  oltcInfo?: OLTCInfo;
}

export interface FormData {
  clientInfo: ClientInfo;
  transformers: TransformerData[];
}
