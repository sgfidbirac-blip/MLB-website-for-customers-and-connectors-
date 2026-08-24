import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const loc = useLocation();
  const nav = useNavigate();
  const connector = JSON.parse(localStorage.getItem('mlb_connector') || 'null');
  const adminToken = localStorage.getItem('mlb_admin_token');

  const isActive = (p) => loc.pathname === p;

  const handleLogoutConnector = () => {
    localStorage.removeItem('mlb_connector');
    nav('/');
  };
  const handleLogoutAdmin = () => {
    localStorage.removeItem('mlb_admin_token');
    nav('/admin-bazaar');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0A2647] shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#CCA43B] to-[#A67C00] shadow-md group-hover:shadow-lg transition">
              <span className="font-black text-[15px] tracking-[-0.02em] text-[#0A2647]">MLB</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-[800] tracking-[-0.02em] text-white text-[16px]">My Loan Bazaar</span>
              <span className="text-[10px] tracking-[0.18em] uppercase text-[#E2C275] font-semibold mt-[2px]">Single Office DSA</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/" className={`px-4 py-2 rounded-full text-sm font-medium transition ${isActive('/') ? 'bg-white text-[#0A2647]' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>Home</Link>
            
            {connector ? (
              <>
                <Link to="/connector-dashboard" className={`px-4 py-2 rounded-full text-sm font-medium transition ${isActive('/connector-dashboard') ? 'bg-white text-[#0A2647]' : 'text-white/80 hover:text-white hover:bg-white/10'}`}>Connector Dashboard</Link>
                <div className="ml-2 flex items-center gap-3 pl-3 border-l border-white/20">
                  <div className="text-right hidden lg:block">
                    <div className="text-[11px] text-[#E2C275] font-bold tracking-widest uppercase">{connector.agentCode}</div>
                    <div className="text-xs text-white font-medium">{connector.name}</div>
                  </div>
                  <button onClick={handleLogoutConnector} className="px-3 py-1.5 rounded-full bg-white/10 text-white text-xs hover:bg-white/20">Logout</button>
                </div>
              </>
            ) : (
              <Link to="/connector-login" className={`px-4 py-2 rounded-full text-sm font-medium border transition ${isActive('/connector-login') ? 'bg-[#CCA43B] text-[#0A2647] border-[#CCA43B]' : 'border-white/20 text-white hover:bg-white hover:text-[#0A2647]'}`}>Connector Login</Link>
            )}

            {adminToken ? (
              <>
                <Link to="/admin-dashboard" className={`px-4 py-2 rounded-full text-sm font-medium transition ${loc.pathname.includes('admin') ? 'bg-[#CCA43B] text-[#0A2647]' : 'text-white/80 hover:text-white'}`}>Admin</Link>
                <button onClick={handleLogoutAdmin} className="text-xs text-white/60 hover:text-white ml-1">Exit</button>
              </>
            ) : (
              <Link to="/admin-bazaar" className={`ml-2 w-8 h-8 rounded-full flex items-center justify-center border text-[10px] ${loc.pathname.includes('admin') ? 'bg-white text-[#0A2647] border-white' : 'border-white/20 text-white/40 hover:text-white/80'}`}>AD</Link>
            )}
          </nav>

          {/* Mobile menu simplified */}
          <div className="flex md:hidden items-center gap-2">
            {!connector && !adminToken && (
              <Link to="/connector-login" className="px-3 py-1.5 rounded-full bg-white text-[#0A2647] text-xs font-bold">Login</Link>
            )}
            {connector && (
              <Link to="/connector-dashboard" className="px-3 py-1.5 rounded-full bg-[#CCA43B] text-[#0A2647] text-xs font-bold">{connector.agentCode}</Link>
            )}
            {adminToken && (
              <Link to="/admin-dashboard" className="px-3 py-1.5 rounded-full bg-white text-[#0A2647] text-xs font-bold">Admin</Link>
            )}
          </div>
        </div>
      </div>

      {/* mobile bottom nav */}
      <div className="md:hidden border-t border-white/10 bg-[#061a32] px-2 py-2 flex justify-around">
        <Link to="/" className={`flex-1 text-center py-2 text-xs font-medium rounded-lg ${isActive('/') ? 'bg-white text-[#0A2647]' : 'text-white/70'}`}>Home</Link>
        <Link to="/connector-login" className={`flex-1 text-center py-2 text-xs font-medium rounded-lg ml-2 ${isActive('/connector-login') || isActive('/connector-dashboard') ? 'bg-[#CCA43B] text-[#0A2647]' : 'text-white/70'}`}>{connector ? 'Dashboard' : 'Connector'}</Link>
        <Link to="/admin-bazaar" className={`flex-1 text-center py-2 text-xs font-medium rounded-lg ml-2 ${loc.pathname.includes('admin') ? 'bg-white text-[#0A2647]' : 'text-white/50'}`}>Admin</Link>
      </div>
    </header>
  );
}
