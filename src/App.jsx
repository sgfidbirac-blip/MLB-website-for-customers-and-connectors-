import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ConnectorLogin from './pages/ConnectorLogin';
import ConnectorDashboard from './pages/ConnectorDashboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function Layout({ children }) {
  const loc = useLocation();
  const hideNav = loc.pathname.startsWith('/admin-bazaar') || loc.pathname.includes('/connector-login');
  // But we still want navbar for connector dashboard? Show navbar always except login pages for cleaner design, but spec says top navbar must be present. We'll show navbar except admin login and connector login which have own headers
  const noNav = loc.pathname === '/admin-bazaar' || loc.pathname === '/connector-login';
  return (
    <>
      {!noNav && <Navbar />}
      {children}
    </>
  );
}

function ProtectedConnector({ children }) {
  const stored = localStorage.getItem('mlb_connector');
  if (!stored) return <Navigate to="/connector-login" replace />;
  return children;
}
function ProtectedAdmin({ children }) {
  const token = localStorage.getItem('mlb_admin_token');
  if (!token) return <Navigate to="/admin-bazaar" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/connector-login" element={<ConnectorLogin />} />
          <Route path="/connector-dashboard" element={<ProtectedConnector><ConnectorDashboard /></ProtectedConnector>} />
          <Route path="/admin-bazaar" element={<AdminLogin />} />
          <Route path="/admin-dashboard" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
