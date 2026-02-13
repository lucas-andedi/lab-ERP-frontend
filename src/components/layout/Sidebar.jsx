import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  Truck,
  Wallet,
  UserCog,
  ChevronLeft,
  ChevronRight,
  Activity,
  X,
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', path: '/', icon: LayoutDashboard },
  { name: 'Gestion de Stocks', path: '/stocks', icon: Package },
  { name: 'Gestion Clients', path: '/clients', icon: Users },
  { name: 'Gestion Fournisseurs', path: '/fournisseurs', icon: Truck },
  { name: 'Trésorerie', path: '/tresorerie', icon: Wallet },
  { name: 'Personnel', path: '/personnel', icon: UserCog },
];

export default function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }) {
  const location = useLocation();

  const sidebarContent = (isOverlay) => (
    <>
      <div className={`flex items-center h-16 px-4 border-b border-slate-700/50 ${collapsed && !isOverlay ? 'justify-center' : 'gap-3'}`}>
        <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
          <Activity className="w-5 h-5 text-white" />
        </div>
        {(!collapsed || isOverlay) && (
          <div className="overflow-hidden flex-1">
            <h1 className="text-lg font-bold tracking-tight text-white">Lab-ERP</h1>
            <p className="text-[10px] text-slate-400 -mt-0.5 tracking-widest uppercase">Enterprise Suite</p>
          </div>
        )}
        {isOverlay && (
          <button onClick={onMobileClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {(!collapsed || isOverlay) && (
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-3">
            Navigation
          </p>
        )}
        {navigation.map((item) => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={isOverlay ? onMobileClose : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-600/20 text-primary-300'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              } ${collapsed && !isOverlay ? 'justify-center' : ''}`}
              title={collapsed && !isOverlay ? item.name : undefined}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-primary-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              {(!collapsed || isOverlay) && <span>{item.name}</span>}
              {isActive && (!collapsed || isOverlay) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {!isOverlay && (
        <div className="p-3 border-t border-slate-700/50">
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Réduire</span>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-900 text-white z-30 transition-all duration-300 flex-col hidden lg:flex ${
          collapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {sidebarContent(false)}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onMobileClose} />
          <aside className="relative w-[280px] h-full bg-slate-900 text-white flex flex-col shadow-2xl">
            {sidebarContent(true)}
          </aside>
        </div>
      )}
    </>
  );
}
