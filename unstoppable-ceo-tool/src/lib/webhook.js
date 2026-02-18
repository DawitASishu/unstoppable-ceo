const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

// Send data to webhook (Ontraport/Zapier)
export const sendWebhook = async (data) => {
  if (!webhookUrl) {
    console.warn('Webhook URL not configured - skipping webhook');
    console.log('Webhook payload would be:', data);
    return { success: true, message: 'Webhook not configured' };
  }

  try {
    // Fire and forget - non-blocking
    fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      mode: 'no-cors' // Allow cross-origin requests to webhooks
    }).catch(err => {
      console.warn('Webhook request failed (non-blocking):', err);
    });

    return { success: true, message: 'Webhook sent' };
  } catch (error) {
    console.error('Error sending webhook:', error);
    return { success: false, message: error.message };
  }
};

// Format data for webhook payload
export const formatWebhookPayload = (sessionData) => {
  const {
    user,
    frameworkData,
    totalScore,
    roiInputs,
    roiOutputs
  } = sessionData;

  return {
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    framework_scores: frameworkData.map(item => item.score),
    framework_descriptions: frameworkData.map(item => ({
      category: item.category,
      description: item.description,
      score: item.score
    })),
    total_score: totalScore,
    roi_inputs: {
      offer_price: roiInputs.offerPrice,
      clients_per_month: roiInputs.clientsPerMonth,
      close_rate: roiInputs.closeRate,
      revenue_goal: roiInputs.revenueGoal,
      months_to_goal: roiInputs.monthsToGoal,
      program_investment: roiInputs.programInvestment
    },
    roi_outputs: {
      monthly_revenue: roiOutputs.monthlyRevenue,
      annual_revenue: roiOutputs.annualRevenue,
      projected_revenue: roiOutputs.projectedRevenue,
      revenue_gap: roiOutputs.revenueGap,
      total_investment_gain: roiOutputs.totalInvestmentGain,
      roi_percentage: roiOutputs.roiPercentage,
      roi_multiple: roiOutputs.roiMultiple
    },
    timestamp: new Date().toISOString()
  };
};
