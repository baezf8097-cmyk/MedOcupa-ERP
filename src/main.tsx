import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { setupApiInterceptor } from './services/apiInterceptor';

// Initialize embedded API engine & fetch interceptor for standalone desktop (Tauri) and web modes
setupApiInterceptor();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
