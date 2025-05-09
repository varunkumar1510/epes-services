
import { createClient } from '@supabase/supabase-js';
import { FormData } from '../types/transformer';

// Default to empty strings when env vars are not available, 
// but add console warnings to help with debugging
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if Supabase credentials are available
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials are missing. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.');
}

// Create Supabase client with fallback to prevent immediate errors
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Save form data to Supabase
export const saveFormData = async (formData: FormData) => {
  // If Supabase client isn't initialized, return error
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot save data.');
    return { success: false, error: 'Supabase client not initialized' };
  }

  try {
    // First, save client info and get the ID
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .insert({
        client_name: formData.clientInfo.clientName,
        client_address: formData.clientInfo.clientAddress,
        pincode: formData.clientInfo.pincode,
        tr_number: formData.clientInfo.trNumber,
        date_of_test: formData.clientInfo.dateOfTest,
        no_of_transformers: formData.clientInfo.noOfTransformers,
        no_of_transformers_with_oltc: formData.clientInfo.noOfTransformersWithOLTC,
        no_of_transformers_without_oltc: formData.clientInfo.noOfTransformersWithoutOLTC
      })
      .select();

    if (clientError) throw clientError;
    
    const clientId = clientData[0].id;
    
    // Then save each transformer with reference to client ID
    for (const transformer of formData.transformers) {
      // Save basic transformer data
      const { data: transformerData, error: transformerError } = await supabase
        .from('transformers')
        .insert({
          client_id: clientId,
          transformer_id: transformer.transformerId,
          has_oltc: transformer.hasOLTC,
          transformer_make: transformer.transformerMake,
          capacity: transformer.capacity,
          serial_number: transformer.serialNumber,
          year_of_manufacture: transformer.yearOfManufacture,
          voltage_hv: transformer.voltageHV,
          voltage_lv: transformer.voltageLV,
          current_hv: transformer.currentHV,
          current_lv: transformer.currentLV,
          impedance_voltage: transformer.impedanceVoltage,
          oil_temperature: transformer.oilTemperature,
          electrode_gap: transformer.electrodeGap,
          bdv_sample_no1: transformer.bdvSampleNo1,
          bdv_sample_no2: transformer.bdvSampleNo2,
          breakdown_voltage: transformer.breakdownVoltage,
          acidity_value: transformer.acidityValue,
          permissible_limit: transformer.permissibleLimit
        })
        .select();
        
      if (transformerError) throw transformerError;
      
      // If transformer has OLTC, save OLTC data
      if (transformer.hasOLTC && transformer.oltcInfo) {
        const { error: oltcError } = await supabase
          .from('oltc_info')
          .insert({
            transformer_id: transformerData[0].id,
            oltc_make: transformer.oltcInfo.oltcMake,
            oltc_type: transformer.oltcInfo.oltcType,
            oltc_serial_number: transformer.oltcInfo.oltcSerialNumber,
            oltc_year_of_manufacture: transformer.oltcInfo.oltcYearOfManufacture,
            oltc_voltage_hv: transformer.oltcInfo.oltcVoltageHV,
            oltc_rated_current: transformer.oltcInfo.oltcRatedCurrent,
            oltc_oil_temperature: transformer.oltcInfo.oltcOilTemperature,
            oltc_electrode_gap: transformer.oltcInfo.oltcElectrodeGap
          });
          
        if (oltcError) throw oltcError;
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving data to Supabase:', error);
    return { success: false, error };
  }
};

// Get all client records
export const getClients = async () => {
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot fetch data.');
    return [];
  }
  
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
};

// Get a specific form record with all related transformer data
export const getFormData = async (clientId: string): Promise<FormData | null> => {
  if (!supabase) {
    console.error('Supabase client not initialized. Cannot fetch data.');
    return null;
  }
  
  try {
    // Get client info
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();
      
    if (clientError) throw clientError;
    
    // Get transformer data for this client
    const { data: transformersData, error: transformersError } = await supabase
      .from('transformers')
      .select('*')
      .eq('client_id', clientId);
      
    if (transformersError) throw transformersError;
    
    // Get OLTC data for these transformers
    const transformers = await Promise.all(
      transformersData.map(async (transformer) => {
        let oltcInfo = undefined;
        
        if (transformer.has_oltc) {
          const { data: oltcData, error: oltcError } = await supabase
            .from('oltc_info')
            .select('*')
            .eq('transformer_id', transformer.id)
            .single();
            
          if (!oltcError && oltcData) {
            oltcInfo = {
              oltcMake: oltcData.oltc_make,
              oltcType: oltcData.oltc_type,
              oltcSerialNumber: oltcData.oltc_serial_number,
              oltcYearOfManufacture: oltcData.oltc_year_of_manufacture,
              oltcVoltageHV: oltcData.oltc_voltage_hv,
              oltcRatedCurrent: oltcData.oltc_rated_current,
              oltcOilTemperature: oltcData.oltc_oil_temperature,
              oltcElectrodeGap: oltcData.oltc_electrode_gap
            };
          }
        }
        
        return {
          transformerId: transformer.transformer_id,
          hasOLTC: transformer.has_oltc,
          transformerMake: transformer.transformer_make,
          capacity: transformer.capacity,
          serialNumber: transformer.serial_number,
          yearOfManufacture: transformer.year_of_manufacture,
          voltageHV: transformer.voltage_hv,
          voltageLV: transformer.voltage_lv,
          currentHV: transformer.current_hv,
          currentLV: transformer.current_lv,
          impedanceVoltage: transformer.impedance_voltage,
          oilTemperature: transformer.oil_temperature,
          electrodeGap: transformer.electrode_gap,
          bdvSampleNo1: transformer.bdv_sample_no1,
          bdvSampleNo2: transformer.bdv_sample_no2,
          breakdownVoltage: transformer.breakdown_voltage,
          acidityValue: transformer.acidity_value,
          permissibleLimit: transformer.permissible_limit,
          oltcInfo
        };
      })
    );
    
    // Format the data to match our FormData type
    const formData: FormData = {
      clientInfo: {
        clientName: clientData.client_name,
        clientAddress: clientData.client_address,
        pincode: clientData.pincode,
        trNumber: clientData.tr_number,
        dateOfTest: clientData.date_of_test,
        noOfTransformers: clientData.no_of_transformers,
        noOfTransformersWithOLTC: clientData.no_of_transformers_with_oltc,
        noOfTransformersWithoutOLTC: clientData.no_of_transformers_without_oltc
      },
      transformers
    };
    
    return formData;
  } catch (error) {
    console.error('Error fetching form data:', error);
    return null;
  }
};
