import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LearningCoachCard } from './components/common/LearningCoachCard';
import './index.css';
import './styles/learning-upgrade.css';

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <div className="learning-coach-entry">
      <LearningCoachCard />
    </div>
  </>
);
