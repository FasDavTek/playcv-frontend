import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import Routes from './routes';
import CartProvider from './context/CartProvider';
import AuthProvider from './context/AuthProvider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
    {/* <StrictMode> */}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <CartProvider>
          <Routes />
        </CartProvider>
      </AuthProvider>
    </LocalizationProvider>
    {/* </StrictMode> */}
  </>
);
