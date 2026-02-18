import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { formatCurrency, getScoreInterpretation } from '../utils/constants';
import FrameworkDiagram from './FrameworkDiagram';

const FinalResults = () => {
  const { 
    user,
    frameworkData,
    totalScore, 
    roiOutputs 
  } = useSession();
  
  const interpretation = getScoreInterpretation(totalScore);
  const revenueGapIsPositive = roiOutputs.revenueGap <= 0;
  
  const getInterpretationColor = () => {
    if (interpretation.level === 'needs-work') return 'text-red-500';
    if (interpretation.level === 'moderate') return 'text-amber-500';
    return 'text-green-500';
  };
  
  return (
    <motion.div 
      className="min-h-screen pt-24 pb-12 px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-block px-4 py-2 bg-green-100 border border-green-300 rounded-full mb-4">
            <span className="text-xs font-bold tracking-[0.15em] text-green-600 uppercase">
              ✓ Diagnostic Complete
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-navy mb-3">
            Your Unstoppable CEO Results
          </h1>
          <p className="text-navy/60 text-lg">
            Results for {user.firstName} {user.lastName}
          </p>
        </motion.div>
        
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Diagram */}
          <motion.div 
            className="bg-white rounded-3xl border border-cream-300 shadow-medium p-6 lg:p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FrameworkDiagram 
              frameworkData={frameworkData}
              totalScore={totalScore}
              size="large"
            />
          </motion.div>
          
          {/* Results Summary */}
          <div className="space-y-4">
            {/* Interpretation Card */}
            <motion.div 
              className="bg-white rounded-2xl border border-cream-300 shadow-soft p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className={`text-xl font-bold mb-2 ${getInterpretationColor()}`}>
                {interpretation.title}
              </h3>
              <p className="text-navy/70 leading-relaxed">
                {interpretation.message}
              </p>
            </motion.div>
            
            {/* ROI Results */}
            <div className="grid grid-cols-2 gap-4">
              <motion.div 
                className="bg-white rounded-2xl border border-cream-300 shadow-soft p-5 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide mb-1">
                  Annual Revenue
                </p>
                <p className="text-xl font-display font-bold text-navy">
                  {formatCurrency(roiOutputs.annualRevenue)}
                </p>
              </motion.div>
              
              <motion.div 
                className="bg-white rounded-2xl border border-cream-300 shadow-soft p-5 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide mb-1">
                  Revenue Goal
                </p>
                <p className="text-xl font-display font-bold text-navy">
                  {formatCurrency(roiOutputs.projectedRevenue)}
                </p>
              </motion.div>
              
              <motion.div 
                className={`rounded-2xl border-2 shadow-soft p-5 text-center ${
                  revenueGapIsPositive 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-red-50 border-red-300'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide mb-1">
                  Revenue Gap
                </p>
                <p className={`text-xl font-display font-bold ${
                  revenueGapIsPositive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {revenueGapIsPositive ? '+' : ''}{formatCurrency(Math.abs(roiOutputs.revenueGap))}
                </p>
              </motion.div>
              
              <motion.div 
                className={`rounded-2xl border-2 shadow-soft p-5 text-center ${
                  roiOutputs.totalInvestmentGain > 0 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-red-50 border-red-300'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
              >
                <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide mb-1">
                  Total Investment Gain
                </p>
                <p className={`text-xl font-display font-bold ${
                  roiOutputs.totalInvestmentGain > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(roiOutputs.totalInvestmentGain)}
                </p>
              </motion.div>
            </div>
            
            {/* ROI Percentage - Featured */}
            <motion.div 
              className="bg-navy rounded-2xl shadow-lg p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-2">
                Return on Investment
              </p>
              <p className="text-4xl font-display font-bold text-[#c8ff00]">
                {roiOutputs.roiPercentage.toFixed(0)}%
              </p>
            </motion.div>
            
            {/* Monthly Revenue */}
            <motion.div 
              className="bg-cream-100 rounded-2xl p-5 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <p className="text-xs font-semibold text-navy/50 uppercase tracking-wide mb-1">
                Monthly Revenue
              </p>
              <p className="text-2xl font-display font-bold text-navy">
                {formatCurrency(roiOutputs.monthlyRevenue)}
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* CTA Section */}
        <motion.div 
          className="bg-gradient-to-br from-[#1a2744] to-[#2a3a5c] rounded-3xl shadow-lg p-8 md:p-12 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Ready to Close the Gap?
          </h3>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Your diagnostic reveals exactly where to focus. 
            Let's build your roadmap to becoming an Unstoppable CEO.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-[#c8ff00] text-[#1a2744] font-bold rounded-xl">
            <span>Your results have been saved</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FinalResults;
