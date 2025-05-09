
import React, { useState } from "react";
import { TransformerData, OLTCInfo } from "../types/transformer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TRANSFORMER_MAKES, TRANSFORMER_CAPACITIES, OLTC_MAKES } from "../constants/transformer-constants";

interface TransformerFormProps {
  transformerData: TransformerData[];
  setTransformerData: React.Dispatch<React.SetStateAction<TransformerData[]>>;
  numTransformers: number;
  numTransformersWithOLTC: number;
  onBack: () => void;
  onNext: () => void;
}

const defaultOLTCInfo: OLTCInfo = {
  oltcMake: "OLG",
  oltcType: "",
  oltcSerialNumber: "",
  oltcYearOfManufacture: new Date().getFullYear().toString(),
  oltcVoltageHV: "11000",
  oltcRatedCurrent: "",
  oltcOilTemperature: "32",
  oltcElectrodeGap: "2.5",
};

const TransformerForm: React.FC<TransformerFormProps> = ({
  transformerData,
  setTransformerData,
  numTransformers,
  numTransformersWithOLTC,
  onBack,
  onNext,
}) => {
  const [expandedAccordion, setExpandedAccordion] = useState<string>("transformer-0");

  const handleTransformerChange = (index: number, field: keyof TransformerData | string, value: string | boolean) => {
    const updatedTransformers = [...transformerData];
    
    if (field === "hasOLTC") {
      updatedTransformers[index] = {
        ...updatedTransformers[index],
        [field]: value as boolean,
        oltcInfo: value ? (updatedTransformers[index].oltcInfo || { ...defaultOLTCInfo }) : undefined
      };
    } else {
      updatedTransformers[index] = {
        ...updatedTransformers[index],
        [field]: value
      };
    }
    
    setTransformerData(updatedTransformers);
  };

  const handleOLTCChange = (transformerIndex: number, field: keyof OLTCInfo, value: string) => {
    const updatedTransformers = [...transformerData];
    
    if (updatedTransformers[transformerIndex].oltcInfo) {
      updatedTransformers[transformerIndex] = {
        ...updatedTransformers[transformerIndex],
        oltcInfo: {
          ...updatedTransformers[transformerIndex].oltcInfo!,
          [field]: value
        }
      };
      
      setTransformerData(updatedTransformers);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="container mx-auto py-8">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-brand-500 mb-2">Transformer Data Entry</h2>
          <p className="text-gray-600">Enter details for each transformer</p>
        </div>
        
        <Accordion
          type="single"
          collapsible
          value={expandedAccordion}
          onValueChange={setExpandedAccordion}
          className="space-y-4"
        >
          {transformerData.map((transformer, index) => (
            <AccordionItem
              key={index}
              value={`transformer-${index}`}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-lg">
                    {transformer.transformerId} {transformer.transformerMake ? `- ${transformer.transformerMake}` : ''}
                  </span>
                  <div className="flex items-center">
                    {transformer.hasOLTC && (
                      <span className="bg-brand-100 text-brand-600 text-xs font-semibold px-2 py-1 rounded mr-2">
                        With OLTC
                      </span>
                    )}
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent>
                <Card className="border-0 shadow-none">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {/* Basic Transformer Information */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`hasOLTC-${index}`}
                            checked={transformer.hasOLTC}
                            onCheckedChange={(checked) => handleTransformerChange(index, "hasOLTC", checked)}
                            disabled={index < numTransformersWithOLTC}
                          />
                          <Label htmlFor={`hasOLTC-${index}`}>With OLTC</Label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`transformerMake-${index}`}>Transformer Make</Label>
                            <Select
                              value={transformer.transformerMake}
                              onValueChange={(value) => handleTransformerChange(index, "transformerMake", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Make" />
                              </SelectTrigger>
                              <SelectContent>
                                {TRANSFORMER_MAKES.map((make) => (
                                  <SelectItem key={make} value={make}>
                                    {make}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`capacity-${index}`}>Capacity</Label>
                            <Select
                              value={transformer.capacity}
                              onValueChange={(value) => handleTransformerChange(index, "capacity", value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Capacity" />
                              </SelectTrigger>
                              <SelectContent>
                                {TRANSFORMER_CAPACITIES.map((capacity) => (
                                  <SelectItem key={capacity} value={capacity}>
                                    {capacity}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`serialNumber-${index}`}>Serial Number</Label>
                            <Input
                              id={`serialNumber-${index}`}
                              value={transformer.serialNumber}
                              onChange={(e) => handleTransformerChange(index, "serialNumber", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`yearOfManufacture-${index}`}>Year of Manufacture</Label>
                            <Input
                              id={`yearOfManufacture-${index}`}
                              type="number"
                              min="1900"
                              max={new Date().getFullYear()}
                              value={transformer.yearOfManufacture}
                              onChange={(e) => handleTransformerChange(index, "yearOfManufacture", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`voltageHV-${index}`}>Voltage HV (V)</Label>
                            <Input
                              id={`voltageHV-${index}`}
                              value={transformer.voltageHV}
                              onChange={(e) => handleTransformerChange(index, "voltageHV", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`voltageLV-${index}`}>Voltage LV (V)</Label>
                            <Input
                              id={`voltageLV-${index}`}
                              value={transformer.voltageLV}
                              onChange={(e) => handleTransformerChange(index, "voltageLV", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`currentHV-${index}`}>Current HV (A)</Label>
                            <Input
                              id={`currentHV-${index}`}
                              value={transformer.currentHV}
                              onChange={(e) => handleTransformerChange(index, "currentHV", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`currentLV-${index}`}>Current LV (A)</Label>
                            <Input
                              id={`currentLV-${index}`}
                              value={transformer.currentLV}
                              onChange={(e) => handleTransformerChange(index, "currentLV", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`impedanceVoltage-${index}`}>Impedance Voltage (%)</Label>
                            <Input
                              id={`impedanceVoltage-${index}`}
                              value={transformer.impedanceVoltage}
                              onChange={(e) => handleTransformerChange(index, "impedanceVoltage", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`oilTemperature-${index}`}>Oil Temperature (°C)</Label>
                            <Input
                              id={`oilTemperature-${index}`}
                              value={transformer.oilTemperature}
                              onChange={(e) => handleTransformerChange(index, "oilTemperature", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`electrodeGap-${index}`}>Electrode Gap (mm)</Label>
                            <Input
                              id={`electrodeGap-${index}`}
                              value={transformer.electrodeGap}
                              onChange={(e) => handleTransformerChange(index, "electrodeGap", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`bdvSampleNo1-${index}`}>BDV Sample No 1</Label>
                            <Input
                              id={`bdvSampleNo1-${index}`}
                              value={transformer.bdvSampleNo1}
                              onChange={(e) => handleTransformerChange(index, "bdvSampleNo1", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`bdvSampleNo2-${index}`}>BDV Sample No 2</Label>
                            <Input
                              id={`bdvSampleNo2-${index}`}
                              value={transformer.bdvSampleNo2}
                              onChange={(e) => handleTransformerChange(index, "bdvSampleNo2", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`breakdownVoltage-${index}`}>Breakdown Voltage</Label>
                            <Input
                              id={`breakdownVoltage-${index}`}
                              value={transformer.breakdownVoltage}
                              onChange={(e) => handleTransformerChange(index, "breakdownVoltage", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`acidityValue-${index}`}>Acidity Value (mg of KOH/g)</Label>
                            <Input
                              id={`acidityValue-${index}`}
                              value={transformer.acidityValue}
                              onChange={(e) => handleTransformerChange(index, "acidityValue", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`permissibleLimit-${index}`}>Permissible Limit (mg of KOH/g)</Label>
                            <Input
                              id={`permissibleLimit-${index}`}
                              value={transformer.permissibleLimit}
                              onChange={(e) => handleTransformerChange(index, "permissibleLimit", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* OLTC Section - Only show if transformer has OLTC */}
                      {transformer.hasOLTC && transformer.oltcInfo && (
                        <div className="border-t border-gray-200 pt-4 mt-4">
                          <h3 className="text-lg font-semibold mb-4">OLTC Information</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor={`oltcMake-${index}`}>OLTC Make</Label>
                              <Select
                                value={transformer.oltcInfo.oltcMake}
                                onValueChange={(value) => handleOLTCChange(index, "oltcMake", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select OLTC Make" />
                                </SelectTrigger>
                                <SelectContent>
                                  {OLTC_MAKES.map((make) => (
                                    <SelectItem key={make} value={make}>
                                      {make}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`oltcType-${index}`}>OLTC Type</Label>
                              <Input
                                id={`oltcType-${index}`}
                                value={transformer.oltcInfo.oltcType}
                                onChange={(e) => handleOLTCChange(index, "oltcType", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`oltcSerialNumber-${index}`}>OLTC Serial Number</Label>
                              <Input
                                id={`oltcSerialNumber-${index}`}
                                value={transformer.oltcInfo.oltcSerialNumber}
                                onChange={(e) => handleOLTCChange(index, "oltcSerialNumber", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`oltcYearOfManufacture-${index}`}>OLTC Year of Manufacture</Label>
                              <Input
                                id={`oltcYearOfManufacture-${index}`}
                                type="number"
                                min="1900"
                                max={new Date().getFullYear()}
                                value={transformer.oltcInfo.oltcYearOfManufacture}
                                onChange={(e) => handleOLTCChange(index, "oltcYearOfManufacture", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`oltcVoltageHV-${index}`}>OLTC Voltage HV (V)</Label>
                              <Input
                                id={`oltcVoltageHV-${index}`}
                                value={transformer.oltcInfo.oltcVoltageHV}
                                onChange={(e) => handleOLTCChange(index, "oltcVoltageHV", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`oltcRatedCurrent-${index}`}>OLTC Rated Current (A)</Label>
                              <Input
                                id={`oltcRatedCurrent-${index}`}
                                value={transformer.oltcInfo.oltcRatedCurrent}
                                onChange={(e) => handleOLTCChange(index, "oltcRatedCurrent", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`oltcOilTemperature-${index}`}>OLTC Oil Temperature (°C)</Label>
                              <Input
                                id={`oltcOilTemperature-${index}`}
                                value={transformer.oltcInfo.oltcOilTemperature}
                                onChange={(e) => handleOLTCChange(index, "oltcOilTemperature", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor={`oltcElectrodeGap-${index}`}>OLTC Electrode Gap (mm)</Label>
                              <Input
                                id={`oltcElectrodeGap-${index}`}
                                value={transformer.oltcInfo.oltcElectrodeGap}
                                onChange={(e) => handleOLTCChange(index, "oltcElectrodeGap", e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            Back
          </Button>
          <Button type="submit" className="bg-brand-500 hover:bg-brand-600">
            Next
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TransformerForm;
