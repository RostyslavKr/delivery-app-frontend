import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './components/App';
// dIfpQU87tgK6BSlC
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename="delivery-app-frontend-beryl">
    <App />
  </BrowserRouter>
);
