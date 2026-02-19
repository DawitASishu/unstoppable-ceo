import { AnimatePresence } from 'framer-motion';
import { SessionProvider, useSession } from './context/SessionContext';
import ProgressIndicator from './components/ProgressIndicator';
import AccessGate from './components/AccessGate';
import FrameworkScoring from './components/FrameworkScoring';
import ROICalculatorNew from './components/ROICalculatorNew';
import FinalResultsNew from './components/FinalResultsNew';

const StageRenderer = () => {
  const { stage } = useSession();
  
  return (
    <AnimatePresence mode="wait">
      {stage === 'gate' && <AccessGate key="gate" />}
      {stage === 'framework' && <FrameworkScoring key="framework" />}
      {stage === 'roi' && <ROICalculatorNew key="roi" />}
      {stage === 'results' && <FinalResultsNew key="results" />}
    </AnimatePresence>
  );
};

const AppContent = () => {
  const { stage } = useSession();
  
  return (
    <div className="min-h-screen">
      {stage !== 'gate' && (
        <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 bg-gradient-to-b from-cream-50 to-transparent">
          <ProgressIndicator />
        </header>
      )}
      <main>
        <StageRenderer />
      </main>
    </div>
  );
};

const App = () => {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
};

export default App;
