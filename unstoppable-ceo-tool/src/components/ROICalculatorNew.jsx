import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { formatCurrency } from '../utils/constants';
import Button from './ui/Button';

// Step indicator component
const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          i + 1 === currentStep
            ? 'w-8 bg-navy'
            : i + 1 < currentStep
            ? 'bg-green-500'
            : 'bg-cream-300'
        }`}
      />
    ))}
  </div>
);

// Animated number display
const AnimatedNumber = ({ value, prefix = '$', className = '' }) => (
  <motion.span
    key={value}
    initial={{ scale: 1.2, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className={className}
  >
    {prefix === '$' ? formatCurrency(value) : `${value}${prefix}`}
  </motion.span>
);

// Currency input component
const CurrencyInput = ({ value, onChange, placeholder, label }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-semibold text-navy/70">{label}</label>
    )}
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 font-semibold">$</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-4 bg-white border-2 border-cream-300 rounded-xl text-navy text-xl font-bold placeholder:text-cream-400 focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy/10 transition-all"
      />
    </div>
  </div>
);


// Number input component
const NumberInput = ({ value, onChange, placeholder, label }) => (
  <div className="space-y-2">
    {label && (
      <label className="block text-sm font-semibold text-navy/70">{label}</label>
    )}
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-4 bg-white border-2 border-cream-300 rounded-xl text-navy text-xl font-bold placeholder:text-cream-400 focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy/10 transition-all"
    />
  </div>
);

// Result display card
const ResultCard = ({ label, value, highlight = false, positive = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-4 rounded-xl text-center ${
      highlight
        ? 'bg-navy text-white'
        : positive
        ? 'bg-green-50 border-2 border-green-200'
        : 'bg-red-50 border-2 border-red-200'
    }`}
  >
    <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
      highlight ? 'text-white/60' : 'text-navy/50'
    }`}>
      {label}
    </p>
    <p className={`text-2xl font-display font-bold ${
      highlight ? 'text-[#c8ff00]' : positive ? 'text-green-600' : 'text-red-600'
    }`}>
      {typeof value === 'number' ? formatCurrency(value) : value}
    </p>
  </motion.div>
);

// Monthly comparison row
const MonthRow = ({ month, valueA, valueB }) => {
  const isAHigher = valueA > valueB;
  return (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-cream-200">
      <span className="text-navy/70 font-medium">{month}</span>
      <span className={`text-right font-bold ${isAHigher ? 'text-green-600' : 'text-red-500'}`}>
        {formatCurrency(valueA)}
      </span>
      <span className={`text-right font-bold ${!isAHigher ? 'text-green-600' : 'text-red-500'}`}>
        {formatCurrency(valueB)}
      </span>
    </div>
  );
};


const ROICalculatorNew = () => {
  const { user, totalScore, submitResults, isLoading } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Step 1: Revenue Vision
  const [revenueGoal2026, setRevenueGoal2026] = useState('');

  // Step 2: Offer Trifecta
  const [founderClients, setFounderClients] = useState('');
  const [founderPrice, setFounderPrice] = useState('500');
  const [unstoppableClients, setUnstoppableClients] = useState('');
  const [unstoppablePrice, setUnstoppablePrice] = useState('');

  // Step 3: Launches
  const [numLaunches, setNumLaunches] = useState('3');

  // Investment constants
  const TOTAL_INVESTMENT = 35000;
  const MONTHLY_PAYMENT = 3000;
  const INITIAL_PAYMENT = 5000;

  // Calculations
  const calculations = useMemo(() => {
    const founderRevenue = (parseFloat(founderClients) || 0) * (parseFloat(founderPrice) || 0);
    const unstoppableRevenue = (parseFloat(unstoppableClients) || 0) * (parseFloat(unstoppablePrice) || 0);
    const revenuePerLaunch = founderRevenue + unstoppableRevenue;
    const launches = parseFloat(numLaunches) || 0;
    const projected2026Revenue = revenuePerLaunch * launches;

    // Execution capacity based on framework score (score out of 90, convert to percentage)
    // Score 90 = 100% capacity, Score 45 = 50% capacity, etc.
    const executionCapacity = Math.min(100, Math.round((totalScore / 90) * 100));
    const revenueOnOwn = Math.round(projected2026Revenue * (executionCapacity / 100));
    const revenueGapAlone = projected2026Revenue - revenueOnOwn;

    // With The Unstoppable (full projected revenue)
    const revenueWithSupport = projected2026Revenue;

    // ROI calculations
    const roiPercentage = TOTAL_INVESTMENT > 0 
      ? Math.round(((projected2026Revenue - TOTAL_INVESTMENT) / TOTAL_INVESTMENT) * 100) 
      : 0;

    // Safety layers
    const revenue75 = Math.round(projected2026Revenue * 0.75);
    const roi75 = TOTAL_INVESTMENT > 0 
      ? Math.round(((revenue75 - TOTAL_INVESTMENT) / TOTAL_INVESTMENT) * 100) 
      : 0;

    const revenue50 = Math.round(projected2026Revenue * 0.50);
    const roi50 = TOTAL_INVESTMENT > 0 
      ? Math.round(((revenue50 - TOTAL_INVESTMENT) / TOTAL_INVESTMENT) * 100) 
      : 0;

    // Monthly cash flow (March 2026 - February 2027)
    const months = ['March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February'];
    
    // On your own: distribute revenue evenly across launch months (assuming 3 launches)
    const monthlyRevenueAlone = revenueOnOwn / 12;
    
    // With Unstoppable: full revenue minus investment payments
    const monthlyRevenueWithSupport = projected2026Revenue / 12;
    
    const cashFlowAlone = months.map((month, i) => ({
      month,
      value: Math.round(monthlyRevenueAlone)
    }));

    const cashFlowWithSupport = months.map((month, i) => {
      let payment = 0;
      if (i === 0) payment = INITIAL_PAYMENT; // March: $5000 initial
      else if (i < 11) payment = MONTHLY_PAYMENT; // April-January: $3000/month (10 payments)
      return {
        month,
        value: Math.round(monthlyRevenueWithSupport - payment),
        payment
      };
    });

    const totalAlone = cashFlowAlone.reduce((sum, m) => sum + m.value, 0);
    const totalWithSupport = cashFlowWithSupport.reduce((sum, m) => sum + m.value, 0);
    const netCashPosition = totalWithSupport;
    const unrealizedRevenue = projected2026Revenue - revenueOnOwn;

    return {
      founderRevenue,
      unstoppableRevenue,
      revenuePerLaunch,
      projected2026Revenue,
      executionCapacity,
      revenueOnOwn,
      revenueGapAlone,
      revenueWithSupport,
      roiPercentage,
      revenue75,
      roi75,
      revenue50,
      roi50,
      cashFlowAlone,
      cashFlowWithSupport,
      totalAlone,
      totalWithSupport,
      netCashPosition,
      unrealizedRevenue
    };
  }, [founderClients, founderPrice, unstoppableClients, unstoppablePrice, numLaunches, totalScore]);


  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const canProceed = () => {
    switch (currentStep) {
      case 1: return revenueGoal2026 !== '';
      case 2: return founderClients !== '' && founderPrice !== '' && unstoppableClients !== '' && unstoppablePrice !== '';
      case 3: return numLaunches !== '';
      default: return true;
    }
  };

  const handleFinalSubmit = async () => {
    await submitResults();
  };

  const slideVariants = {
    enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 })
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-navy mb-2">
                Your Unstoppable Score Is Clear.
              </h2>
              <p className="text-xl text-navy/70">Now Let's Look at the Money.</p>
              <p className="text-navy/50 mt-2">Numbers do not lie. You're about to see what 2026 actually looks like.</p>
            </div>

            <div className="bg-white rounded-2xl border border-cream-300 p-6">
              <h3 className="text-lg font-bold text-navy mb-4">
                STEP 1: 2026 REVENUE VISION
              </h3>
              <CurrencyInput
                value={revenueGoal2026}
                onChange={setRevenueGoal2026}
                placeholder="500,000"
                label="What is your total revenue goal for 2026?"
              />
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-navy mb-2">
                Let's Build One Launch.
              </h2>
              <p className="text-navy/60">You don't need 27 offers. You need one strategic ecosystem.</p>
            </div>

            <div className="bg-white rounded-2xl border border-cream-300 p-6 space-y-6">
              <h3 className="text-lg font-bold text-navy">
                STEP 2: BUILD YOUR UNSTOPPABLE OFFER TRIFECTA
              </h3>

              {/* Part A - 5K Founder Offer */}
              <div className="bg-cream-50 rounded-xl p-4 space-y-4">
                <h4 className="font-bold text-navy">Part A — 5K Founder Offer</h4>
                <NumberInput
                  value={founderClients}
                  onChange={setFounderClients}
                  placeholder="10"
                  label="How many clients will you enroll in your 5K Founder offer in ONE launch?"
                />
                <CurrencyInput
                  value={founderPrice}
                  onChange={setFounderPrice}
                  placeholder="500"
                  label="What is the cost of your 5K Founder offer?"
                />
                {founderClients && founderPrice && (
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-navy/60">Revenue from One 5K Founder Launch:</p>
                    <AnimatedNumber value={calculations.founderRevenue} className="text-2xl font-bold text-green-600" />
                  </div>
                )}
              </div>

              {/* Part B - Unstoppable Offer */}
              <div className="bg-cream-50 rounded-xl p-4 space-y-4">
                <h4 className="font-bold text-navy">Part B — Your Unstoppable Offer</h4>
                <NumberInput
                  value={unstoppableClients}
                  onChange={setUnstoppableClients}
                  placeholder="5"
                  label="How many clients will you upsell from your 5K Founder Launch in your Unstoppable Offer in ONE launch?"
                />
                <CurrencyInput
                  value={unstoppablePrice}
                  onChange={setUnstoppablePrice}
                  placeholder="5,000"
                  label="What is the cost of your Unstoppable Offer?"
                />
                {unstoppableClients && unstoppablePrice && (
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-sm text-navy/60">Revenue from Your Unstoppable Offer:</p>
                    <AnimatedNumber value={calculations.unstoppableRevenue} className="text-2xl font-bold text-green-600" />
                  </div>
                )}
              </div>

              {/* Total Per Launch */}
              {calculations.revenuePerLaunch > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-navy rounded-xl p-4 text-center"
                >
                  <p className="text-white/60 text-sm mb-1">Your Total Revenue From ONE Beyoncé Offer Trifecta Launch:</p>
                  <motion.p
                    key={calculations.revenuePerLaunch}
                    initial={{ y: 10 }}
                    animate={{ y: 0 }}
                    className="text-3xl font-display font-bold text-[#c8ff00]"
                  >
                    {formatCurrency(calculations.revenuePerLaunch)}
                  </motion.p>
                </motion.div>
              )}
            </div>
          </motion.div>
        );


      case 3:
        return (
          <motion.div
            key="step3"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-cream-300 p-6 space-y-6">
              <h3 className="text-lg font-bold text-navy">
                STEP 3: MULTIPLY THE YEAR
              </h3>

              <NumberInput
                value={numLaunches}
                onChange={setNumLaunches}
                placeholder="3"
                label="How many launches will you do in 2026?"
              />
              <p className="text-sm text-navy/50 italic">
                We suggest 3 strategic launches inside The Unstoppable.
              </p>

              {calculations.projected2026Revenue > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-br from-navy to-navy-light rounded-xl p-6 text-center"
                >
                  <p className="text-white/60 text-sm mb-2">Your 2026 Beyoncé Trifecta Revenue:</p>
                  <motion.p
                    key={calculations.projected2026Revenue}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-display font-bold text-[#c8ff00]"
                  >
                    {formatCurrency(calculations.projected2026Revenue)}
                  </motion.p>
                </motion.div>
              )}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-cream-300 p-6 space-y-6">
              <h3 className="text-lg font-bold text-navy">
                STEP 4: THE CEO SCORE REALITY CHECK
              </h3>

              <div className="bg-cream-50 rounded-xl p-4 text-center">
                <p className="text-sm text-navy/60 mb-2">Your Unstoppable CEO Score</p>
                <p className="text-4xl font-display font-bold text-navy">{totalScore}<span className="text-lg text-navy/40">/90</span></p>
              </div>

              <div className="space-y-4">
                <p className="text-navy/70">
                  Based on your current Unstoppable CEO Score, your independent execution capacity is approximately:
                </p>
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 text-center">
                  <p className="text-4xl font-display font-bold text-amber-600">{calculations.executionCapacity}%</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ResultCard
                    label="Projected Revenue On Your Own"
                    value={calculations.revenueOnOwn}
                    positive={false}
                  />
                  <ResultCard
                    label="Revenue Gap From Doing This Alone"
                    value={calculations.revenueGapAlone}
                    positive={false}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-cream-300 p-6 space-y-6">
              <h3 className="text-lg font-bold text-navy">
                STEP 5: WITH THE UNSTOPPABLE
              </h3>

              <div className="text-center">
                <p className="text-navy/70 mb-4">
                  Now Let's Look At The Supported Scenario with us.
                </p>
                <p className="text-navy/60 mb-6">
                  If you dedicate just <span className="font-bold text-navy">3 hours per week</span> inside The Unstoppable, your projected revenue becomes:
                </p>

                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8"
                >
                  <p className="text-white/80 text-sm mb-2">Full Projected Launch Revenue</p>
                  <motion.p
                    key={calculations.revenueWithSupport}
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="text-5xl font-display font-bold text-white"
                  >
                    {formatCurrency(calculations.revenueWithSupport)}
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        );


      case 6:
        return (
          <motion.div
            key="step6"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-cream-300 p-6 space-y-6">
              <h3 className="text-lg font-bold text-navy">
                STEP 6: INVESTMENT CALCULATION
              </h3>

              <div className="bg-cream-50 rounded-xl p-4">
                <h4 className="font-bold text-navy mb-3">Investment Plan:</h4>
                <div className="space-y-2 text-navy/70">
                  <p>• $5,000 today</p>
                  <p>• 10 monthly payments of $3,000</p>
                  <p className="font-bold text-navy pt-2 border-t border-cream-300">Total Investment: {formatCurrency(TOTAL_INVESTMENT)}</p>
                </div>
              </div>

              <div className="bg-navy rounded-xl p-6 text-center">
                <p className="text-white/60 text-sm mb-2">When you achieve your projected {formatCurrency(calculations.projected2026Revenue)}:</p>
                <p className="text-white/80 mb-1">Your Return On Investment =</p>
                <motion.p
                  key={calculations.roiPercentage}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="text-5xl font-display font-bold text-[#c8ff00]"
                >
                  {calculations.roiPercentage}%
                </motion.p>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-navy">Now let's look at safety layers:</h4>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-sm text-navy/60 mb-2">If you only achieve 75% of your projection:</p>
                  <div className="flex justify-between items-center">
                    <span className="text-navy/70">75% Revenue = {formatCurrency(calculations.revenue75)}</span>
                    <span className="text-xl font-bold text-amber-600">ROI = {calculations.roi75}%</span>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <p className="text-sm text-navy/60 mb-2">If you only achieve 50% of your projection:</p>
                  <div className="flex justify-between items-center">
                    <span className="text-navy/70">50% Revenue = {formatCurrency(calculations.revenue50)}</span>
                    <span className="text-xl font-bold text-orange-600">ROI = {calculations.roi50}%</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div
            key="step7"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={1}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-cream-300 p-6 space-y-6">
              <h3 className="text-lg font-bold text-navy">
                STEP 7: CASH FLOW COMPARISON
              </h3>
              <p className="text-navy/60">Let's Compare 12 Months.</p>

              {/* Side by side comparison */}
              <div className="overflow-x-auto">
                <div className="min-w-[500px]">
                  <div className="grid grid-cols-3 gap-4 py-3 border-b-2 border-navy font-bold text-navy">
                    <span>Month</span>
                    <span className="text-right text-green-600">With Unstoppable</span>
                    <span className="text-right text-red-500">On Your Own</span>
                  </div>
                  {calculations.cashFlowAlone.map((month, i) => (
                    <MonthRow
                      key={month.month}
                      month={month.month}
                      valueA={calculations.cashFlowWithSupport[i].value}
                      valueB={month.value}
                    />
                  ))}
                  <div className="grid grid-cols-3 gap-4 py-3 border-t-2 border-navy font-bold">
                    <span className="text-navy">TOTAL</span>
                    <span className="text-right text-green-600">{formatCurrency(calculations.totalWithSupport)}</span>
                    <span className="text-right text-red-500">{formatCurrency(calculations.totalAlone)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-cream-50 rounded-xl p-4 text-center">
                <p className="text-sm text-navy/60 mb-1">Net Cash Position After Investment:</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(calculations.netCashPosition)}</p>
              </div>
            </div>

            {/* Final Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-navy to-navy-light rounded-2xl p-6 text-white"
            >
              <h3 className="text-2xl font-display font-bold mb-4 text-center">
                The Numbers Are Clear, {user.firstName}.
              </h3>

              <div className="space-y-4">
                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/70 text-sm">Doing this alone costs you:</p>
                  <p className="text-2xl font-bold text-red-400">{formatCurrency(calculations.unrealizedRevenue)} in unrealized revenue</p>
                </div>

                <div className="bg-white/10 rounded-xl p-4">
                  <p className="text-white/70 text-sm">Working with us:</p>
                  <p className="text-lg">Generates <span className="font-bold text-[#c8ff00]">{formatCurrency(calculations.projected2026Revenue)}</span></p>
                  <p className="text-lg">Creates a <span className="font-bold text-[#c8ff00]">{calculations.roiPercentage}%</span> return</p>
                  <p className="text-lg">Leaves you cash positive by <span className="font-bold text-[#c8ff00]">{formatCurrency(calculations.netCashPosition)}</span></p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xl font-bold mb-4">Is this a good investment, {user.firstName}?</p>
                <Button
                  variant="accent"
                  size="large"
                  onClick={handleFinalSubmit}
                  loading={isLoading}
                  className="bg-[#c8ff00] text-navy hover:bg-[#d4ff33] min-w-[200px]"
                >
                  Yes
                </Button>
              </div>

              <p className="text-center text-white/60 text-sm mt-6 italic">
                You do not lose when you build with our infrastructure and support.<br />
                You lose when you attempt scale without it.
              </p>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };


  return (
    <motion.div
      className="min-h-screen pt-24 pb-12 px-4 md:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-block px-4 py-2 bg-navy/5 border border-navy/20 rounded-full mb-4">
          <span className="text-xs font-bold tracking-[0.15em] text-navy uppercase">
            Step 3 of 4
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-navy mb-2">
          ROI Calculator
        </h2>
      </motion.div>

      <div className="max-w-2xl mx-auto">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="secondary"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'opacity-0 pointer-events-none' : ''}
          >
            ← Back
          </Button>

          {currentStep < totalSteps ? (
            <Button
              variant="primary"
              onClick={nextStep}
              disabled={!canProceed()}
            >
              Continue →
            </Button>
          ) : (
            <div /> // Placeholder for layout
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ROICalculatorNew;
