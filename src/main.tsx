import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { sound } from './audio/soundSystem';

if (typeof window !== 'undefined') {
  (window as any).__soundSystem = sound;
}

createRoot(document.getElementById('root')!).render(<App />);

