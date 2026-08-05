import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/shared/ErrorBoundary';
import './index.css';

window.addEventListener('error', (e) => {
  console.error('Global Error caught:', e.error || e.message);
});

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <ThemeProvider>
            <AuthProvider>
              <App />
              <Toaster position="top-right" />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
} else {
  console.error('Root element not found!');
}
