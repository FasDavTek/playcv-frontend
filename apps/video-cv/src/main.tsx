// import { StrictMode } from 'react';
// import * as ReactDOM from 'react-dom/client';
// import { useNavigate } from 'react-router-dom'

// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { QueryClient, QueryClientProvider } from 'react-query';

// import Routes from './routes';
// import CartProvider from './context/CartProvider';
// import AuthProvider from './context/AuthProvider';
// import './styles.scss'
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const queryClient = new QueryClient();

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <>
//     {/* <StrictMode> */}
//     <AuthProvider>
//       <QueryClientProvider client={queryClient}>
//         <LocalizationProvider dateAdapter={AdapterDayjs}>
//           <ToastContainer autoClose={9000} />
//             <CartProvider>
//               <Routes />
//             </CartProvider>
//         </LocalizationProvider>
//       </QueryClientProvider>
//     </AuthProvider>
//     {/* </StrictMode> */}
//   </>
// );










import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { useNavigate } from 'react-router-dom'

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { QueryClient, QueryClientProvider } from 'react-query';

import Routes from './routes';
import CartProvider from './context/CartProvider';
import AuthProvider from './context/AuthProvider';
import './styles.scss'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ToastContainer autoClose={9000} />
          <AuthProvider>
            <CartProvider>
              <Routes />
            </CartProvider>
          </AuthProvider>
        </LocalizationProvider>
      </QueryClientProvider>
    </StrictMode>
  </>
);