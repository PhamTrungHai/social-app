import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';
import ProtectedRoute from './auth/ProtectedRoute';

function App() {
  const MainPage = lazy(() => import('./pages/MainPage'));
  const LogInPage = lazy(() => import('./pages/LoginPage'));
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
                <Suspense fallback={<div>Loading...</div>}>
                  <MainPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LogInPage />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
