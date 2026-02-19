import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { getScoreInterpretation } from '../utils/constants';
import InteractiveDiagram from './InteractiveDiagram';
import Button from './ui/Button';

const FinalResultsNew = () => {
  const { 
    user,
    frameworkData,
    totalScore
  } = useSession();
  
  const interpretation = getScoreInterpretation(totalScore);
  
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="inline-block px-4 py-2 bg-navy/5 border border-navy/20 rounded-full mb-4">
            <span className="text-xs font-bold tracking-[0.15em] text-navy uppercase">
              Step 4 of 4
            </span>
          </div>
          <div className="inline-block px-4 py-2 bg-green-100 border border-green-300 rounded-full mb-4 ml-3">
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
            className="bg-white rounded-3xl border border-cream-300 shadow-medium p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <InteractiveDiagram 
              frameworkData={frameworkData}
              totalScore={totalScore}
              onSegmentClick={() => {}}
              activeSegment={null}
              size="large"
            />
          </motion.div>
          
          {/* Results Summary */}
          <div className="space-y-4">
            {/* Score Card */}
            <motion.div 
              className="bg-navy rounded-2xl p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-white/60 text-sm uppercase tracking-wide mb-2">Your Unstoppable CEO Score</p>
              <p className="text-5xl font-display font-bold text-[#c8ff00]">
                {totalScore}<span className="text-2xl text-white/40">/90</span>
              </p>
            </motion.div>

            {/* Interpretation Card */}
            <motion.div 
              className="bg-white rounded-2xl border border-cream-300 shadow-soft p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className={`text-xl font-bold mb-2 ${getInterpretationColor()}`}>
                {interpretation.title}
              </h3>
              <p className="text-navy/70 leading-relaxed">
                {interpretation.message}
              </p>
            </motion.div>

            {/* Saved confirmation */}
            <motion.div 
              className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-green-700">Your results have been saved</p>
                <p className="text-sm text-green-600">We'll be in touch soon!</p>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* CTA Section */}
        <motion.div 
          className="bg-gradient-to-br from-navy to-navy-light rounded-3xl shadow-lg p-8 md:p-12 text-center text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl md:text-3xl font-display font-bold mb-4">
            Make Your First Move.
          </h3>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            You do not lose when you build with our infrastructure and support.<br />
            You lose when you attempt scale without it.
          </p>
          <a 
            href="https://strengthonstages.com/unstoppable"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              variant="accent"
              size="large"
              className="bg-[#c8ff00] text-navy hover:bg-[#d4ff33] font-bold px-8"
            >
              Secure Your Spot In The Unstoppable Now →
            </Button>
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FinalResultsNew;
