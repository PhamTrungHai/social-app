import { useState } from 'react';
import MainPage from './pages/MainPage';
import LogInPage from './pages/LoginPage';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="App">
        <Routes>
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LogInPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
