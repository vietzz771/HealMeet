import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContextProvider } from './context/authContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="762447627886-smn1dg0ge8877pp6smlu95kovqs8amlr.apps.googleusercontent.com">
      <BrowserRouter>
        <AuthContextProvider>
          <ToastContainer
            theme="light"
            position="top-right"
            autoClose={3000}
            pauseOnHover={false}
          />
          <App />
        </AuthContextProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
