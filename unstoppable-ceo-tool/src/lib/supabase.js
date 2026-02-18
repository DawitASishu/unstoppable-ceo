import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create Supabase client (will be null if env vars not set)
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Create a new session (called on Access Gate submit)
export const createSession = async (userData) => {
  if (!supabase) {
    console.warn('Supabase not configured - running in demo mode');
    return { data: { id: 'demo-' + Date.now() }, error: null };
  }

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      framework_data: [],
      total_score: 0,
      roi_inputs: {},
      roi_outputs: {}
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating session:', error);
  }

  return { data, error };
};

// Update session with framework data
export const updateFrameworkData = async (sessionId, frameworkData, totalScore) => {
  if (!supabase || sessionId.startsWith('demo-')) {
    console.log('Demo mode - framework data:', { frameworkData, totalScore });
    return { error: null };
  }

  const { error } = await supabase
    .from('sessions')
    .update({
      framework_data: frameworkData,
      total_score: totalScore
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error updating framework data:', error);
  }

  return { error };
};

// Update session with ROI data and mark as complete
export const updateROIData = async (sessionId, roiInputs, roiOutputs) => {
  if (!supabase || sessionId.startsWith('demo-')) {
    console.log('Demo mode - ROI data:', { roiInputs, roiOutputs });
    return { error: null };
  }

  const { error } = await supabase
    .from('sessions')
    .update({
      roi_inputs: roiInputs,
      roi_outputs: roiOutputs,
      completed_at: new Date().toISOString()
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error updating ROI data:', error);
  }

  return { error };
};

// Complete session with all data
export const completeSession = async (sessionId, allData) => {
  if (!supabase || sessionId.startsWith('demo-')) {
    console.log('Demo mode - complete session:', allData);
    return { error: null };
  }

  const { error } = await supabase
    .from('sessions')
    .update({
      framework_data: allData.frameworkData,
      total_score: allData.totalScore,
      roi_inputs: allData.roiInputs,
      roi_outputs: allData.roiOutputs,
      completed_at: new Date().toISOString()
    })
    .eq('id', sessionId);

  if (error) {
    console.error('Error completing session:', error);
  }

  return { error };
};
