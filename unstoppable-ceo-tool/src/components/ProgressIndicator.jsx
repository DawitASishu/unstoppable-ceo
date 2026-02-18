import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';

const stages = [
  { id: 'gate', label: 'Start', icon: '1' },
  { id: 'framework', label: 'Framework', icon: '2' },
  { id: 'roi', label: 'ROI', icon: '3' },
  { id: 'results', label: 'Results', icon: '4' }
];

const ProgressIndicator = () => {
  const { stage } = useSession();
  const currentIndex = stages.findIndex(s => s.id === stage);
  
  return (
    <motion.div 
      className="flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-cream-200"
      initial={{ opacity: 0, y: -30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
    >
      {stages.map((s, index) => (
        <div key={s.id} className="flex items-center">
          <motion.div 
            className="flex items-center gap-2 sm:gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {/* Step circle */}
            <motion.div 
              className={`
                relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-sm sm:text-base
                transition-all duration-500
                ${index < currentIndex 
                  ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg shadow-green-500/30' 
                  : index === currentIndex 
                    ? 'bg-gradient-to-br from-navy to-navy-dark text-white shadow-xl shadow-navy/40' 
                    : 'bg-cream-100 text-cream-400 border-2 border-cream-300'
                }
              `}
              animate={index === currentIndex ? { 
                scale: [1, 1.08, 1],
              } : {}}
              transition={{ duration: 2, repeat: index === currentIndex ? Infinity : 0, repeatDelay: 0.5 }}
            >
              {/* Pulse ring for current step */}
              {index === currentIndex && (
                <motion.div 
                  className="absolute inset-0 rounded-full border-2 border-navy"
                  animate={{ 
                    scale: [1, 1.4, 1.4],
                    opacity: [0.6, 0, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              
              {index < currentIndex ? (
                <motion.svg 
                  className="w-5 h-5 sm:w-6 sm:h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </motion.svg>
              ) : (
                <span>{s.icon}</span>
              )}
            </motion.div>
            
            {/* Label */}
            <span className={`
              text-sm sm:text-base font-semibold hidden sm:block transition-colors duration-300
              ${index < currentIndex ? 'text-green-600' : index === currentIndex ? 'text-navy' : 'text-cream-400'}
            `}>
              {s.label}
            </span>
          </motion.div>
          
          {/* Connector line */}
          {index < stages.length - 1 && (
            <div className="relative w-6 sm:w-10 md:w-14 h-1 mx-2 sm:mx-3 rounded-full overflow-hidden bg-cream-200">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: index < currentIndex ? '100%' : '0%' }}
                transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              />
              {/* Animated shimmer effect for completed lines */}
              {index < currentIndex && (
                <motion.div 
                  className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{ x: [-32, 100] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default ProgressIndicator;
