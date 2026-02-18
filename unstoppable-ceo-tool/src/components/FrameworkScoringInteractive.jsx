import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { FRAMEWORK_CATEGORIES, getScoreColorClass } from '../utils/constants';
import InteractiveDiagram from './InteractiveDiagram';
import Button from './ui/Button';

// Score selection modal that appears after clicking a segment
const ScoreModal = ({ 
  isOpen, 
  category, 
  currentDescription, 
  currentScore,
  onSubmit, 
  onClose 
}) => {
  const [description, setDescription] = useState(currentDescription || '');
  const [score, setScore] = useState(currentScore || 0);
  const [step, setStep] = useState(currentDescription ? 2 : 1); // Step 1: type answer, Step 2: select score
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setDescription(currentDescription || '');
      setScore(currentScore || 0);
      setStep(currentDescription ? 2 : 1);
    }
  }, [isOpen, currentDescription, currentScore]);

  useEffect(() => {
    if (isOpen && step === 1 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, step]);

  const handleDescriptionSubmit = () => {
    if (description.trim()) {
      setStep(2);
    }
  };

  const handleScoreSelect = (selectedScore) => {
    // Toggle off if same score clicked
    const newScore = score === selectedScore ? 0 : selectedScore;
    setScore(newScore);
    if (newScore > 0) {
      // Auto-submit after selecting score
      setTimeout(() => {
        onSubmit(description, newScore);
      }, 200);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && step === 1) {
      handleDescriptionSubmit();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const getScoreButtonClass = (value) => {
    const isSelected = score === value;
    let colorClass = 'bg-cream-100 text-navy hover:bg-cream-200';
    
    if (isSelected) {
      if (value >= 1 && value <= 3) colorClass = 'bg-red-400 text-white';
      else if (value >= 4 && value <= 7) colorClass = 'bg-amber-400 text-white';
      else if (value >= 8 && value <= 10) colorClass = 'bg-green-500 text-white';
    }
    
    return colorClass;
  };

  if (!isOpen || !category) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div 
          className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
        
        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-navy px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-xs uppercase tracking-wider">
                  {step === 1 ? 'Step 1: Your Answer' : 'Step 2: Your Score'}
                </p>
                <h3 className="text-white font-bold text-xl">{category.name}</h3>
              </div>
              <button 
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <p className="text-navy/70 text-sm mb-4">
                    Type your word or answer for <span className="font-semibold text-navy">{category.name}</span>:
                  </p>
                  <input
                    ref={inputRef}
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={`Enter your ${category.name.toLowerCase()}...`}
                    className="w-full px-4 py-3 bg-cream-50 border-2 border-cream-300 rounded-xl text-navy font-medium placeholder:text-cream-500 focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy/10 transition-all text-lg"
                  />
                  <Button
                    variant="primary"
                    size="large"
                    onClick={handleDescriptionSubmit}
                    disabled={!description.trim()}
                    className="w-full mt-4"
                  >
                    Continue to Score →
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* Show the answer */}
                  <div className="bg-cream-50 rounded-xl p-3 mb-4">
                    <p className="text-xs text-navy/50 uppercase tracking-wide mb-1">Your Answer</p>
                    <p className="text-navy font-semibold">{description}</p>
                    <button 
                      onClick={() => setStep(1)}
                      className="text-xs text-blue-600 hover:underline mt-1"
                    >
                      Edit answer
                    </button>
                  </div>

                  <p className="text-navy/70 text-sm mb-4">
                    On a scale of 1–10, what is your score?
                  </p>
                  
                  {/* Score grid */}
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <motion.button
                        key={value}
                        onClick={() => handleScoreSelect(value)}
                        className={`py-3 rounded-xl font-bold text-lg transition-all ${getScoreButtonClass(value)}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {value}
                      </motion.button>
                    ))}
                  </div>

                  {/* Color legend */}
                  <div className="flex justify-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-red-400"></div>
                      <span className="text-navy/60">1-3 Needs Work</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-amber-400"></div>
                      <span className="text-navy/60">4-7 Moderate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded bg-green-500"></div>
                      <span className="text-navy/60">8-10 Strong</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Progress indicator showing which segments are completed
const ProgressBar = ({ frameworkData, categories }) => {
  const completed = frameworkData.filter(d => d.score > 0).length;
  const total = categories.length;
  
  return (
    <div className="bg-white rounded-xl border border-cream-300 p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-navy">Progress</span>
        <span className="text-sm text-navy/60">{completed} of {total} completed</span>
      </div>
      <div className="flex gap-1">
        {categories.map((cat, index) => {
          const data = frameworkData.find(d => d.categoryId === cat.id);
          const hasScore = data?.score > 0;
          let bgColor = 'bg-cream-200';
          if (hasScore) {
            const score = data.score;
            if (score >= 1 && score <= 3) bgColor = 'bg-red-400';
            else if (score >= 4 && score <= 7) bgColor = 'bg-amber-400';
            else if (score >= 8 && score <= 10) bgColor = 'bg-green-500';
          }
          return (
            <div 
              key={cat.id}
              className={`flex-1 h-2 rounded-full transition-colors ${bgColor}`}
              title={`${cat.name}: ${hasScore ? data.score : 'Not scored'}`}
            />
          );
        })}
      </div>
    </div>
  );
};

const FrameworkScoringInteractive = () => {
  const { 
    frameworkData, 
    totalScore, 
    allFrameworkScored,
    updateFrameworkItem,
    goToROI
  } = useSession();
  
  const [activeSegment, setActiveSegment] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSegmentClick = useCallback((categoryId) => {
    setActiveSegment(categoryId);
    setModalOpen(true);
  }, []);

  const handleModalSubmit = useCallback((description, score) => {
    if (activeSegment) {
      updateFrameworkItem(activeSegment, { description, score });
    }
    setModalOpen(false);
    setActiveSegment(null);
  }, [activeSegment, updateFrameworkItem]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setActiveSegment(null);
  }, []);

  const activeCategory = activeSegment 
    ? FRAMEWORK_CATEGORIES.find(c => c.id === activeSegment)
    : null;
  
  const activeData = activeSegment
    ? frameworkData.find(d => d.categoryId === activeSegment)
    : null;

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
        className="text-center mb-6"
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
          Click on each section of the diagram to enter your answer and score.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <ProgressBar frameworkData={frameworkData} categories={FRAMEWORK_CATEGORIES} />

        {/* Interactive Diagram */}
        <motion.div 
          className="bg-white rounded-2xl border border-cream-300 shadow-md p-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <InteractiveDiagram 
            frameworkData={frameworkData}
            totalScore={totalScore}
            onSegmentClick={handleSegmentClick}
            activeSegment={activeSegment}
            size="large"
          />
        </motion.div>

        {/* Instructions */}
        <motion.div 
          className="text-center mt-4 text-sm text-navy/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p>Click any section to add your answer and score</p>
        </motion.div>

        {/* Continue Button */}
        <motion.div 
          className="mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
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
        </motion.div>
      </div>

      {/* Score Modal */}
      <ScoreModal
        isOpen={modalOpen}
        category={activeCategory}
        currentDescription={activeData?.description || ''}
        currentScore={activeData?.score || 0}
        onSubmit={handleModalSubmit}
        onClose={handleModalClose}
      />
    </motion.div>
  );
};

export default FrameworkScoringInteractive;
