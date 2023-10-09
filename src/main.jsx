import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import * as serviceWorkerRegistration from '../serviceWorkerRegistration.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

serviceWorkerRegistration.register();
