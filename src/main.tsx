import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles.css';

const ua = navigator.userAgent;
const isSafari = /safari/i.test(ua) && !/chrome|chromium|crios|edg/i.test(ua);
const isFirefox = /firefox/i.test(ua);
if (!isSafari && !isFirefox) {
  document.documentElement.classList.add('glass-refract');
}

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
