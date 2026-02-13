export default function StatCard({ icon: Icon, label, value, subtitle, color = 'primary', trend }) {
  const colors = {
    primary: { bg: 'bg-primary-50', icon: 'text-primary-600' },
    accent: { bg: 'bg-accent-50', icon: 'text-accent-600' },
    success: { bg: 'bg-success-50', icon: 'text-success-600' },
    danger: { bg: 'bg-danger-50', icon: 'text-danger-600' },
    warning: { bg: 'bg-warning-50', icon: 'text-warning-600' },
    slate: { bg: 'bg-slate-100', icon: 'text-slate-600' },
  };

  const c = colors[color] || colors.primary;

  return (
    <div className="stat-card">
      <div className={`stat-icon ${c.bg}`}>
        <Icon className={`w-6 h-6 ${c.icon}`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm text-slate-500 truncate">{label}</p>
        <p className="text-2xl font-bold text-slate-900 mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        {trend && (
          <p className={`text-xs font-medium mt-1 ${trend > 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs mois dernier
          </p>
        )}
      </div>
    </div>
  );
}
