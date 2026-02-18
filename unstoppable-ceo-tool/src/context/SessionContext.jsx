import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { FRAMEWORK_CATEGORIES } from '../utils/constants';
import { createSession, completeSession } from '../lib/supabase';
import { sendWebhook, formatWebhookPayload } from '../lib/webhook';

const SessionContext = createContext(null);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  // Current stage: 'gate' | 'framework' | 'roi' | 'results'
  const [stage, setStage] = useState('gate');
  
  // Session ID from database
  const [sessionId, setSessionId] = useState(null);
  
  // User info
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  // Framework data - array of { categoryId, category, description, score }
  const [frameworkData, setFrameworkData] = useState(() =>
    FRAMEWORK_CATEGORIES.map(cat => ({
      categoryId: cat.id,
      category: cat.name,
      description: '',
      score: 0
    }))
  );
  
  // ROI inputs
  const [roiInputs, setRoiInputs] = useState({
    offerPrice: '',
    clientsPerMonth: '',
    closeRate: '',
    revenueGoal: '',
    monthsToGoal: '',
    programInvestment: ''
  });
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate total score
  const totalScore = useMemo(() => {
    return frameworkData.reduce((sum, item) => sum + (item.score || 0), 0);
  }, [frameworkData]);
  
  // Check if all framework items are scored
  const allFrameworkScored = useMemo(() => {
    return frameworkData.every(item => item.score > 0);
  }, [frameworkData]);
  
  // Calculate ROI outputs
  const roiOutputs = useMemo(() => {
    const offerPrice = parseFloat(roiInputs.offerPrice) || 0;
    const clientsPerMonth = parseFloat(roiInputs.clientsPerMonth) || 0;
    const revenueGoal = parseFloat(roiInputs.revenueGoal) || 0;
    const programInvestment = parseFloat(roiInputs.programInvestment) || 0;
    
    // Business metrics
    const monthlyRevenue = offerPrice * clientsPerMonth;
    const annualRevenue = monthlyRevenue * 12;
    const projectedRevenue = revenueGoal;
    const revenueGap = revenueGoal - annualRevenue;
    
    // Program ROI (from client's formula)
    // Total Investment Gain = Revenue Goal - Program Investment
    const totalInvestmentGain = revenueGoal - programInvestment;
    // ROI Percentage = (Total Investment Gain / Program Investment) × 100
    const roiPercentage = programInvestment > 0 ? (totalInvestmentGain / programInvestment) * 100 : 0;
    // ROI Multiple for backward compatibility
    const roiMultiple = programInvestment > 0 ? revenueGoal / programInvestment : 0;
    
    return {
      monthlyRevenue,
      annualRevenue,
      projectedRevenue,
      revenueGap,
      totalInvestmentGain,
      roiPercentage,
      roiMultiple
    };
  }, [roiInputs]);
  
  // Start session (Access Gate submit)
  const startSession = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      setUser(userData);
      const { data, error } = await createSession(userData);
      
      if (error) {
        console.error('Failed to create session:', error);
        // Continue anyway in demo mode
      }
      
      if (data?.id) {
        setSessionId(data.id);
      }
      
      setStage('framework');
    } catch (err) {
      console.error('Session start error:', err);
      // Still proceed to framework stage
      setStage('framework');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update framework item
  const updateFrameworkItem = useCallback((categoryId, updates) => {
    setFrameworkData(prev => 
      prev.map(item => 
        item.categoryId === categoryId 
          ? { ...item, ...updates }
          : item
      )
    );
  }, []);
  
  // Update ROI input
  const updateROIInput = useCallback((field, value) => {
    setRoiInputs(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);
  
  // Submit final results
  const submitResults = useCallback(async () => {
    setIsLoading(true);
    try {
      const allData = {
        frameworkData,
        totalScore,
        roiInputs: {
          offerPrice: parseFloat(roiInputs.offerPrice) || 0,
          clientsPerMonth: parseFloat(roiInputs.clientsPerMonth) || 0,
          closeRate: parseFloat(roiInputs.closeRate) || 0,
          revenueGoal: parseFloat(roiInputs.revenueGoal) || 0,
          monthsToGoal: parseFloat(roiInputs.monthsToGoal) || 0,
          programInvestment: parseFloat(roiInputs.programInvestment) || 0
        },
        roiOutputs
      };
      
      // Save to database
      if (sessionId) {
        await completeSession(sessionId, allData);
      }
      
      // Send webhook
      const webhookPayload = formatWebhookPayload({
        user,
        frameworkData,
        totalScore,
        roiInputs: allData.roiInputs,
        roiOutputs
      });
      await sendWebhook(webhookPayload);
      
      setStage('results');
    } catch (err) {
      console.error('Submit error:', err);
      // Still show results
      setStage('results');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, user, frameworkData, totalScore, roiInputs, roiOutputs]);
  
  // Go to ROI stage
  const goToROI = useCallback(() => {
    setStage('roi');
  }, []);
  
  const value = {
    stage,
    setStage,
    sessionId,
    user,
    frameworkData,
    totalScore,
    allFrameworkScored,
    roiInputs,
    roiOutputs,
    isLoading,
    startSession,
    updateFrameworkItem,
    updateROIInput,
    submitResults,
    goToROI
  };
  
  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};
