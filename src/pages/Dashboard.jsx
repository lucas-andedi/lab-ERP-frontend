import { Package, Users, Truck, Wallet, UserCog, TrendingUp, AlertTriangle, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import StatCard from '../components/shared/StatCard';
import { produits, clients, fournisseurs, employes, commandes, ventesParMois, repartitionCA, tresorerieEvolution } from '../data/mockData';

const formatMontant = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(v);

const alertesStock = produits.filter(p => p.quantite <= p.seuil_alerte);
const commandesEnCours = commandes.filter(c => c.statut !== 'Livrée');
const totalCA = clients.reduce((sum, c) => sum + c.ca_total, 0);

const tooltipStyle = {
  contentStyle: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
  labelStyle: { color: '#334155', fontWeight: 600 },
};

export default function Dashboard() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Tableau de bord</h1>
          <p className="page-subtitle">Vue d'ensemble de votre activité</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
          Données en temps réel
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Wallet} label="Chiffre d'affaires" value={formatMontant(totalCA)} color="primary" trend={12.5} />
        <StatCard icon={ShoppingCart} label="Commandes en cours" value={commandesEnCours.length} subtitle={`sur ${commandes.length} commandes`} color="accent" />
        <StatCard icon={AlertTriangle} label="Alertes stock" value={alertesStock.length} subtitle="produits sous le seuil" color="danger" />
        <StatCard icon={UserCog} label="Effectif total" value={employes.filter(e => e.statut === 'Actif').length} subtitle={`${employes.length} employés inscrits`} color="success" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Package} label="Produits en stock" value={produits.length} subtitle={`${produits.reduce((s, p) => s + p.quantite, 0).toLocaleString('fr-FR')} unités`} color="slate" />
        <StatCard icon={Users} label="Clients actifs" value={clients.filter(c => c.statut === 'Actif').length} subtitle={`sur ${clients.length} clients`} color="primary" />
        <StatCard icon={Truck} label="Fournisseurs actifs" value={fournisseurs.filter(f => f.statut === 'Actif').length} subtitle={`sur ${fournisseurs.length} fournisseurs`} color="accent" />
        <StatCard icon={TrendingUp} label="Trésorerie totale" value={formatMontant(478200)} color="success" trend={7.8} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 card">
          <div className="card-header">
            <h3 className="font-semibold text-slate-800">Ventes vs Achats</h3>
            <p className="text-xs text-slate-500 mt-0.5">Évolution sur les 6 derniers mois</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ventesParMois} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mois" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip {...tooltipStyle} formatter={(v) => formatMontant(v)} />
                <Bar dataKey="ventes" fill="#026bc7" radius={[4, 4, 0, 0]} name="Ventes" />
                <Bar dataKey="achats" fill="#e38e55" radius={[4, 4, 0, 0]} name="Achats" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-slate-800">Répartition CA</h3>
            <p className="text-xs text-slate-500 mt-0.5">Par client principal</p>
          </div>
          <div className="card-body flex flex-col items-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={repartitionCA} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" paddingAngle={3}>
                  {repartitionCA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={(v) => formatMontant(v)} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-1.5 mt-2">
              {repartitionCA.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                  <span className="text-slate-600 truncate flex-1">{item.name}</span>
                  <span className="font-medium text-slate-800">{formatMontant(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-slate-800">Évolution Trésorerie</h3>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={tresorerieEvolution}>
                <defs>
                  <linearGradient id="tresGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#026bc7" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#026bc7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mois" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                <Tooltip {...tooltipStyle} formatter={(v) => formatMontant(v)} />
                <Area type="monotone" dataKey="solde" stroke="#026bc7" strokeWidth={2} fill="url(#tresGrad)" name="Solde" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-semibold text-slate-800">Dernières commandes</h3>
            <a href="/clients" className="text-xs text-primary-600 hover:text-primary-700 font-medium">Voir tout →</a>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>N° Commande</th>
                  <th>Client</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {commandes.slice(0, 6).map((cmd) => (
                  <tr key={cmd.id}>
                    <td className="font-mono text-xs font-medium">{cmd.numero}</td>
                    <td className="text-sm">{cmd.client}</td>
                    <td className="font-medium">{formatMontant(cmd.montant)}</td>
                    <td>
                      <span className={`badge ${
                        cmd.statut === 'Livrée' ? 'badge-success' :
                        cmd.statut === 'En cours' ? 'badge-primary' :
                        cmd.statut === 'En préparation' ? 'badge-warning' :
                        'badge-slate'
                      }`}>
                        {cmd.statut}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
