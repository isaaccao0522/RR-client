import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider} from 'react-helmet-async';
import { StoreProvider} from './Store.js'
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';



const root = ReactDOM.createRoot ( document.querySelector ('#root'));


root.render (
  <React.StrictMode>
    <StoreProvider>
      <HelmetProvider>
        <PayPalScriptProvider deferLoading={ true}>
          <App />
        </PayPalScriptProvider>
      </HelmetProvider>
    </StoreProvider>
  </React.StrictMode>
);
