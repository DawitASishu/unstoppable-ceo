import { memo } from 'react';
import { motion } from 'framer-motion';

const ScoreCard = memo(({ 
  category, 
  description, 
  score, 
  onDescriptionChange, 
  onScoreChange,
  index = 0
}) => {
  const getBackgroundColor = () => {
    if (!score || score === 0) return 'bg-white border-cream-300';
    if (score >= 1 && score <= 3) return 'bg-red-50 border-red-300';
    if (score >= 4 && score <= 7) return 'bg-amber-50 border-amber-300';
    if (score >= 8 && score <= 10) return 'bg-green-50 border-green-300';
    return 'bg-white border-cream-300';
  };
  
  const getScoreButtonStyle = (num) => {
    const isActive = score === num;
    let baseStyle = 'border transition-all duration-150 ';
    
    if (num >= 1 && num <= 3) {
      baseStyle += isActive 
        ? 'bg-red-500 text-white border-red-500' 
        : 'border-red-200 text-red-500 hover:bg-red-50';
    } else if (num >= 4 && num <= 7) {
      baseStyle += isActive 
        ? 'bg-amber-500 text-white border-amber-500' 
        : 'border-amber-200 text-amber-600 hover:bg-amber-50';
    } else {
      baseStyle += isActive 
        ? 'bg-green-500 text-white border-green-500' 
        : 'border-green-200 text-green-600 hover:bg-green-50';
    }
    
    return baseStyle;
  };
  
  return (
    <motion.div 
      className={`rounded-lg border-2 p-2.5 transition-all duration-300 ${getBackgroundColor()}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <h3 className="text-xs font-bold text-navy uppercase tracking-wide">
          {category.name}
        </h3>
        {score > 0 && (
          <motion.div 
            className={`w-6 h-6 rounded flex items-center justify-center font-bold text-white text-[10px] ${
              score <= 3 ? 'bg-red-500' : score <= 7 ? 'bg-amber-500' : 'bg-green-500'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            {score}
          </motion.div>
        )}
      </div>
      
      {/* Description Input */}
      <input
        type="text"
        className="w-full px-2.5 py-1.5 mb-1.5 bg-white/70 border border-cream-300 rounded text-navy text-xs placeholder:text-cream-500 focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy/10 transition-all"
        placeholder={`Describe your ${category.name.toLowerCase()}...`}
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
      />
      
      {/* Score Selector - Always show all 10 */}
      <div className="flex items-center gap-0.5">
        <div className="flex gap-0.5 flex-1 justify-between">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <motion.button
              key={num}
              type="button"
              className={`flex-1 min-w-0 h-6 rounded font-semibold text-[9px] ${getScoreButtonStyle(num)}`}
              onClick={() => onScoreChange(score === num ? 0 : num)}
              whileTap={{ scale: 0.9 }}
            >
              {num}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

ScoreCard.displayName = 'ScoreCard';

export default ScoreCard;
