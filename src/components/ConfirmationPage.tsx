import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormData } from "../types/transformer";
import { exportToJson, exportToExcel } from "../utils/export-utils";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, Database, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveFormData } from "@/lib/supabase";

interface ConfirmationPageProps {
  formData: FormData;
  onBack: () => void;
  onReset: () => void;
}

const ConfirmationPage: React.FC<ConfirmationPageProps> = ({
  formData,
  onBack,
  onReset,
}) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleExportJson = () => {
    exportToJson(formData);
    toast({
      title: "JSON Export Successful",
      description: "The data has been exported as JSON file.",
    });
  };

  const handleExportExcel = () => {
    exportToExcel(formData);
    toast({
      title: "Excel Export Successful",
      description: "The data has been exported as Excel file.",
    });
  };

  const handleSaveToSupabase = async () => {
    setIsSaving(true);
    try {
      const result = await saveFormData(formData);
      if (result.success) {
        toast({
          title: "Data Saved Successfully",
          description: "Your transformer data has been saved to the database.",
          variant: "default",
        });
      } else {
        toast({
          title: "Error Saving Data",
          description: "There was an error saving your data. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving to Supabase:", error);
      toast({
        title: "Error Saving Data",
        description: "There was an error saving your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-center mb-8">
        <CheckCircle className="h-12 w-12 text-green-500 mr-3" />
        <h2 className="text-2xl font-bold">Data Entry Complete</h2>
      </div>
      
      <Card className="mb-6 shadow-lg">
        <CardHeader className="bg-brand-500 text-white">
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Client Name</p>
              <p className="font-medium">{formData.clientInfo.clientName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">TR Number</p>
              <p className="font-medium">{formData.clientInfo.trNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Client Address</p>
              <p className="font-medium">{formData.clientInfo.clientAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pincode</p>
              <p className="font-medium">{formData.clientInfo.pincode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Test</p>
              <p className="font-medium">
                {formData.clientInfo.dateOfTest instanceof Date
                  ? format(formData.clientInfo.dateOfTest, "PPP")
                  : format(new Date(formData.clientInfo.dateOfTest), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Transformers</p>
              <p className="font-medium">{formData.clientInfo.noOfTransformers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Transformer Summary</h3>
        <Accordion type="single" collapsible className="space-y-4">
          {formData.transformers.map((transformer, index) => (
            <AccordionItem
              key={index}
              value={`transformer-summary-${index}`}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100">
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium">
                    {transformer.transformerId} - {transformer.transformerMake} ({transformer.capacity} kVA)
                  </span>
                  {transformer.hasOLTC && (
                    <span className="bg-brand-100 text-brand-600 text-xs font-semibold px-2 py-1 rounded">
                      With OLTC
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 py-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Serial Number</p>
                    <p className="font-medium">{transformer.serialNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Year of Manufacture</p>
                    <p className="font-medium">{transformer.yearOfManufacture}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Voltage HV/LV</p>
                    <p className="font-medium">{transformer.voltageHV} V / {transformer.voltageLV} V</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Impedance Voltage</p>
                    <p className="font-medium">{transformer.impedanceVoltage}%</p>
                  </div>
                </div>
                
                {transformer.hasOLTC && transformer.oltcInfo && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold mb-2">OLTC Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">OLTC Make</p>
                        <p className="font-medium">{transformer.oltcInfo.oltcMake}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">OLTC Type</p>
                        <p className="font-medium">{transformer.oltcInfo.oltcType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">OLTC Serial Number</p>
                        <p className="font-medium">{transformer.oltcInfo.oltcSerialNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Year of Manufacture</p>
                        <p className="font-medium">{transformer.oltcInfo.oltcYearOfManufacture}</p>
                      </div>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Export & Save Options</h3>
        <div className="flex flex-col md:flex-row gap-4">
          <Button 
            onClick={handleExportJson}
            className="flex-1 bg-brand-500 hover:bg-brand-600"
          >
            Download as JSON
          </Button>
          <Button 
            onClick={handleExportExcel}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Download as Excel
          </Button>
          <Button 
            onClick={handleSaveToSupabase}
            disabled={isSaving}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Database className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save to Database"}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
        >
          Back to Edit
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
        >
          Start New Form
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
