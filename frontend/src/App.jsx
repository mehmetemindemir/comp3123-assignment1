import {  Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EmployeesPage from './pages/Employees';
import { isAuthenticated } from './auth';
import './index.css';

function App() {
  const { pathname } = useLocation();
  const isAuthRoute = pathname === '/login' || pathname === '/signup';
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <main className={isAuthRoute ? 'flex w-full flex-1 items-center justify-center' : 'w-full flex-1'}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<AuthPage initialTab="login" />} />
            <Route path="/signup" element={<AuthPage initialTab="signup" />} />
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <EmployeesPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}



function ProtectedRoute({ children }) {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return children;
}

export default App;
