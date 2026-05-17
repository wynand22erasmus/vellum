import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { DevLoginPage } from './pages/DevLoginPage.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { VerifyPage } from './pages/VerifyPage.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/verify/:token" element={<VerifyPage />} />
        <Route path="/login" element={<DevLoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
