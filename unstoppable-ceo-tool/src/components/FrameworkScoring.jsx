import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { FRAMEWORK_CATEGORIES } from '../utils/constants';
import ScoreCard from './ScoreCard';
import FrameworkDiagram from './FrameworkDiagram';
import Button from './ui/Button';

const FrameworkScoring = () => {
  const { 
    frameworkData, 
    totalScore, 
    allFrameworkScored,
    updateFrameworkItem,
    goToROI
  } = useSession();
  
  const handleDescriptionChange = useCallback((categoryId, description) => {
    updateFrameworkItem(categoryId, { description });
  }, [updateFrameworkItem]);
  
  const handleScoreChange = useCallback((categoryId, score) => {
    updateFrameworkItem(categoryId, { score });
  }, [updateFrameworkItem]);
  
  const scoredCount = frameworkData.filter(d => d.score > 0).length;
  
  return (
    <motion.div 
      className="min-h-screen pt-24 pb-12 px-4 md:px-6"
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
        <div className="inline-block px-4 py-2 bg-navy/5 border border-navy/20 rounded-full mb-4 mt-6">
          <span className="text-xs font-bold tracking-[0.15em] text-navy uppercase">
            Step 2 of 4
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-navy mb-2">
          The Unstoppable CEO Framework
        </h2>
        <p className="text-navy/60 text-sm sm:text-base max-w-xl mx-auto">
          Rate each area of your business from 1-10. Be honest — this diagnostic reveals your true growth opportunities.
        </p>
      </motion.div>
      
      {/* Main Content */}
      <div className="max-w-[1100px] mx-auto">
        <div className="grid lg:grid-cols-[380px_1fr] xl:grid-cols-[400px_1fr] gap-4 items-start">
          {/* Score Cards - Single column, scrollable on mobile */}
          <div className="space-y-2 order-2 lg:order-1 max-h-[calc(100vh-200px)] lg:max-h-none overflow-y-auto lg:overflow-visible pr-1 lg:pr-0">
            {FRAMEWORK_CATEGORIES.map((category, index) => {
              const data = frameworkData.find(d => d.categoryId === category.id);
              return (
                <ScoreCard
                  key={category.id}
                  category={category}
                  description={data?.description || ''}
                  score={data?.score || 0}
                  onDescriptionChange={(desc) => handleDescriptionChange(category.id, desc)}
                  onScoreChange={(score) => handleScoreChange(category.id, score)}
                  index={index}
                />
              );
            })}
            
            {/* Continue Button - Mobile */}
            <div className="lg:hidden pt-4 pb-2">
              <Button
                variant="primary"
                size="large"
                onClick={goToROI}
                disabled={!allFrameworkScored}
                className="w-full"
              >
                {allFrameworkScored 
                  ? 'Continue to ROI Calculator →' 
                  : `Score All 9 Areas (${scoredCount}/9)`
                }
              </Button>
            </div>
          </div>
          
          {/* Diagram - Sticky on desktop */}
          <div className="lg:sticky lg:top-20 order-1 lg:order-2">
            <motion.div 
              className="bg-white rounded-2xl border border-cream-300 shadow-md p-2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <FrameworkDiagram 
                frameworkData={frameworkData}
                totalScore={totalScore}
                size="large"
              />
              
              {/* Continue Button - Desktop */}
              <div className="hidden lg:block mt-2 pt-2 border-t border-cream-200">
                <Button
                  variant="primary"
                  size="large"
                  onClick={goToROI}
                  disabled={!allFrameworkScored}
                  className="w-full"
                >
                  {allFrameworkScored 
                    ? 'Continue to ROI Calculator →' 
                    : `Score All 9 Areas (${scoredCount}/9)`
                  }
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FrameworkScoring;
