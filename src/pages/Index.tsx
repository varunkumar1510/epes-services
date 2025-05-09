
  import React, { useState, useEffect, useRef } from "react";
  import { Link } from "react-router-dom";
  import ClientInfoForm from "../components/ClientInfoForm";
  import TransformerForm from "../components/TransformerForm";
  import ConfirmationPage from "../components/ConfirmationPage";
  import { ClientInfo, TransformerData, FormData } from "../types/transformer";
  import { Progress } from "@/components/ui/progress";
  import { Database, ArrowRight } from "lucide-react";
  import { Button } from "@/components/ui/button";

  // Default client information
  const defaultClientInfo: ClientInfo = {
    clientName: "",
    clientAddress: "",
    pincode: "",
    trNumber: "",
    dateOfTest: new Date(),
    noOfTransformers: 1,
    noOfTransformersWithOLTC: 0,
    noOfTransformersWithoutOLTC: 1,
  };

  // Default transformer data
  const createDefaultTransformer = (id: number, hasOLTC: boolean = false): TransformerData => ({
    transformerId: `Transformer ${id}`,
    hasOLTC,
    transformerMake: "",
    capacity: "",
    serialNumber: "",
    yearOfManufacture: new Date().getFullYear().toString(),
    voltageHV: "11000",
    voltageLV: "433",
    currentHV: "",
    currentLV: "",
    impedanceVoltage: "",
    oilTemperature: "32",
    electrodeGap: "2.5",
    bdvSampleNo1: "STOOD 40 kV PER MINUTE",
    bdvSampleNo2: "STOOD 40 kV PER MINUTE",
    breakdownVoltage: "BROKE AT 60 kV",
    acidityValue: "",
    permissibleLimit: "0.30",
    oltcInfo: hasOLTC ? {
      oltcMake: "OLG",
      oltcType: "",
      oltcSerialNumber: "",
      oltcYearOfManufacture: new Date().getFullYear().toString(),
      oltcVoltageHV: "11000",
      oltcRatedCurrent: "",
      oltcOilTemperature: "32",
      oltcElectrodeGap: "2.5",
    } : undefined,
  });

  enum FormStep {
    CLIENT_INFO = 0,
    TRANSFORMER_DATA = 1,
    CONFIRMATION = 2,
  }

  const TransformerServicingApp = () => {
    const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.CLIENT_INFO);
    const [clientInfo, setClientInfo] = useState<ClientInfo>(defaultClientInfo);
    const [transformerData, setTransformerData] = useState<TransformerData[]>([]);
    const [progress, setProgress] = useState<number>(0);
    const [showForm, setShowForm] = useState<boolean>(false);
    const parallaxRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);

    // Update transformers when client info changes
    useEffect(() => {
      if (clientInfo.noOfTransformers > 0) {
        const transformers: TransformerData[] = [];
        
        for (let i = 0; i < clientInfo.noOfTransformers; i++) {
          // For first N transformers where N is noOfTransformersWithOLTC, set hasOLTC to true
          const hasOLTC = i < clientInfo.noOfTransformersWithOLTC;
          transformers.push(createDefaultTransformer(i + 1, hasOLTC));
        }
        
        setTransformerData(transformers);
      }
    }, [clientInfo.noOfTransformers, clientInfo.noOfTransformersWithOLTC]);

    // Update progress based on current step
    useEffect(() => {
      const progressValues = [33, 66, 100];
      setProgress(progressValues[currentStep]);
    }, [currentStep]);

    const handleNext = () => {
      setCurrentStep((prev) => (prev < FormStep.CONFIRMATION ? prev + 1 : prev));
    };

    const handleBack = () => {
      setCurrentStep((prev) => (prev > FormStep.CLIENT_INFO ? prev - 1 : prev));
    };

    const handleReset = () => {
      setClientInfo(defaultClientInfo);
      setTransformerData([createDefaultTransformer(1)]);
      setCurrentStep(FormStep.CLIENT_INFO);
    };

    const formData: FormData = {
      clientInfo,
      transformers: transformerData,
    };

    const handleHomeClick = () => {
      window.location.href = "https://epes-web.web.app/";
    };

    const startApplication = () => {
      setShowForm(true);
    };

    if (!showForm) {
    return (
      <div className="min-h-screen flex flex-col">

        {/* Hero Section */}
        <section id="home" ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Parallax Background */}
          <div ref={parallaxRef} className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/50 to-black/60">
            <div className="absolute inset-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1603736128636-1abafb08d099?q=80&w=2070')] bg-center bg-cover opacity-70 mix-blend-overlay" />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center container-section">
            <div className="animate-fade-in">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium mb-6">
                Govt. Authorized Electrical Contractor — EA No. 3071
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6l font-serif font-bold text-white mb-6 drop-shadow-sm leading-relaxed">
                WELCOME TO<br />
                <span className="uppercase">
                  <span className="text-orange-500">E</span>XCELLENT{" "}
                  <span className="text-orange-500">P</span>OWER{" "}
                  <span className="text-orange-500">E</span>NGINEERING{" "}
                  <span className="text-orange-500">S</span>ERVICES
                </span>
              </h1>

              <p className="text-white/100 font-serif mb-8 max-w-2xl mx-auto">
                Delivering reliable and innovative power solutions with a commitment to excellence and safety since 2015.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={startApplication} className="px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all">
                  Start Testing
                </Button>
                <Button onClick={handleHomeClick} variant="outline" className="px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all">
                  Visit Website
                </Button>
              </div>
            </div>
          </div>
          </section>
          
          <div className="py-16 bg-white">
            <div className="container">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="card bg-white p-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                  <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-4 mx-auto">
                    <span className="text-3xl text-orange-500">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3">Enter Client Information</h3>
                  <p className="text-gray-600 text-center">Provide client details and transformer specifications to get started.</p>
                </div>
                
                <div className="card bg-white p-6 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                  <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-4 mx-auto">
                    <span className="text-3xl text-orange-500">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3">Add Transformer Data</h3>
                  <p className="text-gray-600 text-center">Input detailed specifications for each transformer included in the test.</p>
                </div>
                
                <div className="card bg-white p-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
                  <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center mb-4 mx-auto">
                    <span className="text-3xl text-orange-500">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3">Submit & Record</h3>
                  <p className="text-gray-600 text-center">Review details, confirm and save your transformer testing records.</p>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <Button 
                  onClick={startApplication} 
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover-scale animate-pulse-glow"
                >
                  Start Transformer Testing <ArrowRight className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-100 py-16">
            <div className="container">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2 animate-fade-in">
                  <img 
                    src="/favicon.ico" 
                    alt="EPES Logo" 
                    className="w-48 mx-auto md:mx-0 mb-6"
                  />
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose EPES?</h2>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start">
                      <span className="mr-2 text-orange-500">✓</span>
                      <span>Govt. Authorized Electrical Contractor — EA No. 3071</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-orange-500">✓</span>
                      <span>Expert team with extensive industry experience</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-orange-500">✓</span>
                      <span>Modern equipment and testing procedures</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-orange-500">✓</span>
                      <span>Commitment to safety and reliability</span>
                    </li>
                  </ul>
                  
                  <Button 
                    onClick={handleHomeClick}
                    variant="outline" 
                    className="mt-6 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    Learn More About Us
                  </Button>
                </div>
                
                <div className="md:w-1/2 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4">View Your Records</h3>
                    <p className="text-gray-600 mb-4">
                      Access and manage all your previous transformer testing records with our easy-to-use system.
                    </p>
                    <Link to="/records">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        <Database className="mr-2 h-4 w-4" /> View All Records
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-brand-500 text-white py-4 shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Excellent Power Engineering Services</h1>
                <p className="text-brand-100">Transformer Servicing Data Collection</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleHomeClick}
                  className="bg-white text-brand-500 px-4 py-2 rounded hover:bg-orange-50 transition-all"
                >
                  Visit Website
                </button>
                <Link to="/records">
                  <Button variant="outline" className="bg-white text-brand-500 hover:bg-brand-50 border-white">
                    <Database className="mr-2 h-4 w-4" /> View Records
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-4">
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Step {currentStep + 1} of 3</span>
              <span className="text-sm font-medium">{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="flex justify-between mt-2">
              <div className={`text-sm ${currentStep >= FormStep.CLIENT_INFO ? "text-brand-500 font-medium" : "text-gray-400"}`}>
                Client Details
              </div>
              <div className={`text-sm ${currentStep >= FormStep.TRANSFORMER_DATA ? "text-brand-500 font-medium" : "text-gray-400"}`}>
                Transformer Data
              </div>
              <div className={`text-sm ${currentStep >= FormStep.CONFIRMATION ? "text-brand-500 font-medium" : "text-gray-400"}`}>
                Confirmation
              </div>
            </div>
          </div>

          {currentStep === FormStep.CLIENT_INFO && (
            <ClientInfoForm
              clientInfo={clientInfo}
              setClientInfo={setClientInfo}
              onNext={handleNext}
            />
          )}

          {currentStep === FormStep.TRANSFORMER_DATA && (
            <TransformerForm
              transformerData={transformerData}
              setTransformerData={setTransformerData}
              numTransformers={clientInfo.noOfTransformers}
              numTransformersWithOLTC={clientInfo.noOfTransformersWithOLTC}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}

          {currentStep === FormStep.CONFIRMATION && (
            <ConfirmationPage
              formData={formData}
              onBack={handleBack}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    );
  };

  export default TransformerServicingApp;
