import { useMemo } from 'react';

export const useROICalculations = (inputs) => {
  return useMemo(() => {
    const offerPrice = parseFloat(inputs.offerPrice) || 0;
    const clientsPerMonth = parseFloat(inputs.clientsPerMonth) || 0;
    const closeRate = parseFloat(inputs.closeRate) || 0;
    const revenueGoal = parseFloat(inputs.revenueGoal) || 0;
    const monthsToGoal = parseFloat(inputs.monthsToGoal) || 0;
    
    // Core calculations
    const monthlyRevenue = offerPrice * clientsPerMonth;
    const annualRevenue = monthlyRevenue * 12;
    const projectedRevenue = revenueGoal;
    const revenueGap = revenueGoal - annualRevenue;
    const roiMultiple = annualRevenue > 0 ? revenueGoal / annualRevenue : 0;
    
    // Additional insights
    const monthlyGap = revenueGap / 12;
    const additionalClientsNeeded = offerPrice > 0 
      ? Math.ceil(revenueGap / (offerPrice * 12))
      : 0;
    
    // Close rate adjusted projections
    const effectiveCloseRate = closeRate / 100;
    const leadsNeededPerMonth = effectiveCloseRate > 0 
      ? Math.ceil(clientsPerMonth / effectiveCloseRate)
      : 0;
    
    return {
      monthlyRevenue,
      annualRevenue,
      projectedRevenue,
      revenueGap,
      roiMultiple,
      monthlyGap,
      additionalClientsNeeded,
      leadsNeededPerMonth,
      isCalculated: offerPrice > 0 && clientsPerMonth > 0 && revenueGoal > 0
    };
  }, [inputs]);
};
