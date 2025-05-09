
import React from "react";
import { ClientInfo } from "../types/transformer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ClientInfoFormProps {
  clientInfo: ClientInfo;
  setClientInfo: React.Dispatch<React.SetStateAction<ClientInfo>>;
  onNext: () => void;
}

const ClientInfoForm: React.FC<ClientInfoFormProps> = ({
  clientInfo,
  setClientInfo,
  onNext,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === "noOfTransformers" || name === "noOfTransformersWithOLTC") {
      const numValue = parseInt(value) || 0;
      let noOfTransformers = name === "noOfTransformers" ? numValue : clientInfo.noOfTransformers;
      let noOfTransformersWithOLTC = name === "noOfTransformersWithOLTC" ? numValue : clientInfo.noOfTransformersWithOLTC;
      
      // Ensure noOfTransformersWithOLTC doesn't exceed noOfTransformers
      if (noOfTransformersWithOLTC > noOfTransformers) {
        noOfTransformersWithOLTC = noOfTransformers;
      }
      
      const noOfTransformersWithoutOLTC = noOfTransformers - noOfTransformersWithOLTC;
      
      setClientInfo({
        ...clientInfo,
        [name]: numValue,
        noOfTransformersWithOLTC,
        noOfTransformersWithoutOLTC,
      });
    } else {
      setClientInfo({
        ...clientInfo,
        [name]: value,
      });
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setClientInfo({
        ...clientInfo,
        dateOfTest: date,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="container max-w-3xl mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader className="bg-brand-500 text-white">
          <CardTitle className="text-xl font-bold">Client Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={clientInfo.clientName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trNumber">TR Number</Label>
                <Input
                  id="trNumber"
                  name="trNumber"
                  value={clientInfo.trNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAddress">Client Address</Label>
                <Input
                  id="clientAddress"
                  name="clientAddress"
                  value={clientInfo.clientAddress}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  type="number"
                  value={clientInfo.pincode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Date of Test</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {clientInfo.dateOfTest ? (
                        format(
                          new Date(clientInfo.dateOfTest),
                          "PPP"
                        )
                      ) : (
                        <span>Select a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        clientInfo.dateOfTest
                          ? new Date(clientInfo.dateOfTest)
                          : undefined
                      }
                      onSelect={handleDateSelect}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">Transformer Count</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="noOfTransformers">No. of Transformers</Label>
                  <Input
                    id="noOfTransformers"
                    name="noOfTransformers"
                    type="number"
                    min="1"
                    value={clientInfo.noOfTransformers}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noOfTransformersWithOLTC">
                    No. of Transformers with OLTC
                  </Label>
                  <Input
                    id="noOfTransformersWithOLTC"
                    name="noOfTransformersWithOLTC"
                    type="number"
                    min="0"
                    max={clientInfo.noOfTransformers}
                    value={clientInfo.noOfTransformersWithOLTC}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noOfTransformersWithoutOLTC">
                    No. of Transformers without OLTC
                  </Label>
                  <Input
                    id="noOfTransformersWithoutOLTC"
                    name="noOfTransformersWithoutOLTC"
                    value={clientInfo.noOfTransformersWithoutOLTC}
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-brand-500 hover:bg-brand-600">
                Next
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientInfoForm;
