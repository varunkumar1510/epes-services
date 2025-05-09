
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClients } from "@/lib/supabase";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ArrowLeft, Plus, Database, Eye } from "lucide-react";

interface ClientRecord {
  id: string;
  client_name: string;
  tr_number: string;
  date_of_test: string;
  no_of_transformers: number;
  created_at: string;
}

const RecordsPage = () => {
  const [records, setRecords] = useState<ClientRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clients = await getClients();
        setRecords(clients);
      } catch (err) {
        console.error("Failed to fetch client records:", err);
        setError("Failed to load records. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);
  
  const handleHomeClick = () => {
    window.location.href = "https://epes-web.web.app/";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-orange-500 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/lovable-uploads/bb2911f1-2bd3-486e-891c-bdca499884cc.png" 
                alt="EPES Logo" 
                className="w-12 h-12 animate-scale-in"
              />
              <div>
                <h1 className="text-2xl font-bold">Excellent Power Engineering Services</h1>
                <p className="text-orange-100">Transformer Servicing Records</p>
              </div>
            </div>
            <button 
              onClick={handleHomeClick}
              className="bg-white text-orange-500 px-4 py-2 rounded hover:bg-orange-50 transition-all"
            >
              Visit Website
            </button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6 animate-fade-in">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Form
            </Button>
          </Link>
          <Link to="/">
            <Button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 animated-btn">
              <Plus className="h-4 w-4" /> New Record
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 animate-scale-in">
          <h2 className="text-2xl font-bold mb-4 text-orange-600 border-b border-orange-200 pb-2">Transformer Testing Records</h2>
          
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-gray-500">Loading records...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
              <Button 
                variant="outline" 
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-8">
              <Database className="mx-auto h-12 w-12 text-orange-300 mb-3" />
              <p className="text-gray-500">No records found. Start by creating a new record.</p>
              <Link to="/" className="mt-2 inline-block">
                <Button className="bg-orange-500 hover:bg-orange-600 mt-2">
                  Create New Record
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto animate-fade-in">
              <Table>
                <TableCaption>A list of all transformer servicing records.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-orange-50">Client Name</TableHead>
                    <TableHead className="bg-orange-50">TR Number</TableHead>
                    <TableHead className="bg-orange-50">Date of Test</TableHead>
                    <TableHead className="bg-orange-50">Transformers</TableHead>
                    <TableHead className="bg-orange-50">Date Added</TableHead>
                    <TableHead className="text-right bg-orange-50">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id} className="hover:bg-orange-50 transition-all">
                      <TableCell className="font-medium">{record.client_name}</TableCell>
                      <TableCell>{record.tr_number}</TableCell>
                      <TableCell>
                        {format(new Date(record.date_of_test), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell>{record.no_of_transformers}</TableCell>
                      <TableCell>
                        {format(new Date(record.created_at), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="hover:bg-orange-100 hover:text-orange-500">
                          <Eye className="h-4 w-4 mr-1" /> View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecordsPage;
