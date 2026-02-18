import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { formatCurrency } from '../utils/constants';
import Button from './ui/Button';

const ROICalculator = () => {
  const { 
    totalScore,
    roiInputs, 
    roiOutputs, 
    updateROIInput,
    submitResults,
    isLoading
  } = useSession();
  
  const handleInputChange = (field) => (e) => {
    const value = e.target.value;
    if (value === '' || !isNaN(value)) {
      updateROIInput(field, value);
    }
  };

  const handleInvestmentSelect = (amount) => {
    updateROIInput('programInvestment', amount);
  };
  
  const isComplete = 
    roiInputs.offerPrice !== '' && 
    roiInputs.clientsPerMonth !== '' && 
    roiInputs.revenueGoal !== '' && 
    roiInputs.programInvestment !== '';
  
  const revenueGapIsPositive = roiOutputs.revenueGap <= 0;
  const investmentGainIsPositive = roiOutputs.totalInvestmentGain > 0;
  
  return (
    <motion.div 
      className="min-h-screen pt-24 pb-12 px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="inline-block px-4 py-2 bg-navy/5 border border-navy/20 rounded-full mb-4">
          <span className="text-xs font-bold tracking-[0.15em] text-navy uppercase">
            Step 2 of 2
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-navy mb-3">
          ROI Calculator
        </h2>
        <p className="text-navy/60 max-w-xl mx-auto">
          Enter your numbers to calculate your return on investment.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Inputs Card */}
          <motion.div 
            className="bg-white rounded-3xl border border-cream-300 shadow-medium p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-lg font-bold text-navy mb-5">Your Current Numbers</h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wide">
                  Current Offer Price
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40 font-semibold text-sm">$</span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-4 py-3 bg-white border-2 border-cream-300 rounded-xl text-navy font-semibold placeholder:text-cream-500 focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy/10 transition-all"
                    placeholder="5,000"
                    value={roiInputs.offerPrice}
                    onChange={handleInputChange('offerPrice')}
                    min="0"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wide">
                  Clients Per Month
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 bg-white border-2 border-cream-300 rounded-xl text-navy font-semibold placeholder:text-cream-500 focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy/10 transition-all"
                  placeholder="4"
                  value={roiInputs.clientsPerMonth}
                  onChange={handleInputChange('clientsPerMonth')}
                  min="0"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wide">
                  Close Rate
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full px-4 pr-10 py-3 bg-white border-2 border-cream-300 rounded-xl text-navy font-semibold placeholder:text-cream-500 focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy/10 transition-all"
                    placeholder="25"
                    value={roiInputs.closeRate}
                    onChange={handleInputChange('closeRate')}
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 font-semibold text-sm">%</span>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wide">
                  Revenue Goal
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/40 font-semibold text-sm">$</span>
                  <input
                    type="number"
                    className="w-full pl-8 pr-4 py-3 bg-white border-2 border-cream-300 rounded-xl text-navy font-semibold placeholder:text-cream-500 focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy/10 transition-all"
                    placeholder="500,000"
                    value={roiInputs.revenueGoal}
                    onChange={handleInputChange('revenueGoal')}
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wide">
                  Months to Goal
                </label>
                <div className="flex gap-2">
                  {[6, 12].map(months => (
                    <button
                      key={months}
                      type="button"
                      onClick={() => updateROIInput('monthsToGoal', months)}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                        roiInputs.monthsToGoal === months || roiInputs.monthsToGoal === String(months)
                          ? 'bg-navy text-white'
                          : 'bg-cream-100 text-navy hover:bg-cream-200'
                      }`}
                    >
                      {months} Months
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-navy/70 uppercase tracking-wide">
                  Program Investment
                </label>
                <div className="flex gap-2">
                  {[30000, 35000].map(amount => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleInvestmentSelect(amount)}
                      className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                        roiInputs.programInvestment === amount || roiInputs.programInvestment === String(amount)
                          ? 'bg-navy text-white'
                          : 'bg-cream-100 text-navy hover:bg-cream-200'
                      }`}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Card */}
          <motion.div 
            className="bg-gradient-to-br from-navy to-navy-light rounded-3xl shadow-navy p-6 text-white"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Framework Score Badge */}
            <div className="flex items-center justify-between bg-white/10 rounded-xl p-3 mb-5">
              <span className="text-white/70 font-medium text-sm">Your Framework Score</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-display font-bold text-accent-lime">{totalScore}</span>
                <span className="text-white/50 text-sm">/ 90</span>
              </div>
            </div>
            
            <h3 className="text-lg font-bold mb-4">Live Calculations</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70 text-sm">Monthly Revenue</span>
                <motion.span 
                  className="text-lg font-bold"
                  key={roiOutputs.monthlyRevenue}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  {formatCurrency(roiOutputs.monthlyRevenue)}
                </motion.span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70 text-sm">Annual Revenue</span>
                <motion.span 
                  className="text-lg font-bold"
                  key={roiOutputs.annualRevenue}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  {formatCurrency(roiOutputs.annualRevenue)}
                </motion.span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70 text-sm">Revenue Goal</span>
                <motion.span 
                  className="text-lg font-bold"
                  key={roiOutputs.projectedRevenue}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  {formatCurrency(roiOutputs.projectedRevenue)}
                </motion.span>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70 text-sm">Revenue Gap</span>
                <motion.span 
                  className={`text-lg font-bold ${revenueGapIsPositive ? 'text-green-400' : 'text-red-400'}`}
                  key={roiOutputs.revenueGap}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  {formatCurrency(roiOutputs.revenueGap)}
                </motion.span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70 text-sm">Total Investment Gain</span>
                <motion.span 
                  className={`text-lg font-bold ${investmentGainIsPositive ? 'text-green-400' : 'text-red-400'}`}
                  key={roiOutputs.totalInvestmentGain}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                >
                  {formatCurrency(roiOutputs.totalInvestmentGain)}
                </motion.span>
              </div>
              
              <div className="bg-accent-lime/20 rounded-xl p-4 mt-3">
                <p className="text-white/70 text-xs mb-1 text-center">Return on Investment</p>
                <motion.p 
                  className="text-3xl font-display font-bold text-accent-lime text-center"
                  key={roiOutputs.roiPercentage}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                >
                  {roiOutputs.roiPercentage.toFixed(0)}%
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Generate Button */}
        <motion.div 
          className="flex justify-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="primary"
            size="large"
            onClick={submitResults}
            disabled={!isComplete}
            loading={isLoading}
            className="min-w-[300px]"
          >
            Generate My Results
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ROICalculator;
