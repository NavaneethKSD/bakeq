import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { OutletProvider } from './context/OutletContext';
import { CartProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OutletProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </OutletProvider>
  </StrictMode>
);
