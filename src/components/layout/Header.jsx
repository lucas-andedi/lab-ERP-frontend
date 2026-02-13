import { Bell, Search, User, Settings, Menu } from 'lucide-react';

export default function Header({ onMenuToggle }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button onClick={onMenuToggle} className="lg:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>
        <button className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer hidden sm:flex">
          <Settings className="w-5 h-5" />
        </button>
        <div className="w-px h-8 bg-slate-200 mx-1 hidden sm:block" />
        <div className="flex items-center gap-3 pl-1 sm:pl-2">
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold text-slate-800">Patrick Kabongo</p>
            <p className="text-xs text-slate-500">Directeur Général</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
}
