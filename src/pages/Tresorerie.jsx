import { useState, useRef } from 'react';
import { Wallet, Plus, Search, TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, FileText, Printer, Landmark, CreditCard, PiggyBank } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Modal from '../components/shared/Modal';
import StatCard from '../components/shared/StatCard';
import { transactions as initialTransactions, comptesBancaires, tresorerieEvolution } from '../data/mockData';

const formatMontant = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(v);

export default function Tresorerie() {
  const [transactionsList, setTransactions] = useState(initialTransactions);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [tab, setTab] = useState('transactions');
  const [modal, setModal] = useState({ open: false, type: '', data: null });
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef();

  const filtered = transactionsList.filter(t => {
    const matchSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.reference.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || t.type === filterType;
    const matchCat = !filterCat || t.categorie === filterCat;
    return matchSearch && matchType && matchCat;
  });

  const totalEntrees = transactionsList.filter(t => t.type === 'entree').reduce((s, t) => s + t.montant, 0);
  const totalSorties = transactionsList.filter(t => t.type === 'sortie').reduce((s, t) => s + t.montant, 0);
  const soldeTotal = comptesBancaires.reduce((s, c) => s + c.solde, 0);
  const categoriesList = [...new Set(transactionsList.map(t => t.categorie))];

  const depensesParCategorie = transactionsList
    .filter(t => t.type === 'sortie')
    .reduce((acc, t) => {
      const existing = acc.find(x => x.name === t.categorie);
      if (existing) existing.value += t.montant;
      else acc.push({ name: t.categorie, value: t.montant });
      return acc;
    }, []).sort((a, b) => b.value - a.value);

  const PIE_COLORS = ['#026bc7', '#0e88e9', '#38a3f8', '#7dc2fc', '#baddfd'];

  const handleSave = (formData) => {
    const newTransaction = {
      ...formData,
      id: transactionsList.length + 1,
      montant: parseFloat(formData.montant),
    };
    setTransactions([newTransaction, ...transactionsList]);
    setModal({ open: false, type: '', data: null });
  };

  const printReport = () => {
    const content = reportRef.current;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Rapport Trésorerie - Lab-ERP</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1e293b}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #e2e8f0;font-size:13px}th{background:#f8fafc;font-weight:600;color:#475569;text-transform:uppercase;font-size:11px}h1{font-size:20px;margin-bottom:4px}h2{font-size:16px;margin:24px 0 8px;color:#026bc7}.header{border-bottom:2px solid #026bc7;padding-bottom:12px;margin-bottom:24px}.stat{display:inline-block;margin-right:32px;margin-bottom:12px}.stat-val{font-size:22px;font-weight:700}.stat-label{font-size:12px;color:#64748b}.green{color:#15803d}.red{color:#b91c1c}@media print{body{padding:20px}}</style></head><body>`);
    win.document.write(content.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestion Trésorerie</h1>
          <p className="page-subtitle">Suivi des flux financiers et comptes bancaires</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowReport(true)} className="btn-secondary btn-sm"><FileText className="w-4 h-4" /> Rapport</button>
          <button onClick={() => setModal({ open: true, type: 'transaction', data: null })} className="btn-primary"><Plus className="w-4 h-4" /> Nouvelle transaction</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Wallet} label="Solde total" value={formatMontant(soldeTotal)} color="primary" trend={7.8} />
        <StatCard icon={TrendingUp} label="Entrées" value={formatMontant(totalEntrees)} subtitle="ce mois" color="success" />
        <StatCard icon={TrendingDown} label="Sorties" value={formatMontant(totalSorties)} subtitle="ce mois" color="danger" />
        <StatCard icon={PiggyBank} label="Résultat net" value={formatMontant(totalEntrees - totalSorties)} subtitle={totalEntrees - totalSorties > 0 ? 'excédentaire' : 'déficitaire'} color={totalEntrees - totalSorties > 0 ? 'success' : 'danger'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {comptesBancaires.map(compte => (
          <div key={compte.id} className="card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{compte.nom}</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{formatMontant(compte.solde)}</p>
                <p className="text-xs text-slate-400 mt-1">{compte.banque} • {compte.type}</p>
              </div>
              <div className={`stat-icon ${compte.type === 'Épargne' ? 'bg-success-50' : 'bg-primary-50'}`}>
                <Landmark className={`w-6 h-6 ${compte.type === 'Épargne' ? 'text-success-600' : 'text-primary-600'}`} />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-3 font-mono">{compte.numero}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1 mb-4 bg-slate-100 rounded-lg p-1 w-fit">
        {['transactions', 'analyse'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'transactions' ? 'Transactions' : 'Analyse'}
          </button>
        ))}
      </div>

      {tab === 'transactions' && (
        <div className="card">
          <div className="card-header flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Rechercher une transaction..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
            </div>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="select w-auto min-w-[140px]">
              <option value="">Tous types</option>
              <option value="entree">Entrées</option>
              <option value="sortie">Sorties</option>
            </select>
            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="select w-auto min-w-[160px]">
              <option value="">Toutes catégories</option>
              {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Date</th><th>Description</th><th>Catégorie</th><th>Compte</th><th>Référence</th><th>Montant</th></tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id}>
                    <td className="text-sm whitespace-nowrap">{t.date}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        {t.type === 'entree' ? (
                          <ArrowUpCircle className="w-4 h-4 text-success-500 shrink-0" />
                        ) : (
                          <ArrowDownCircle className="w-4 h-4 text-danger-500 shrink-0" />
                        )}
                        <span className="font-medium text-slate-800">{t.description}</span>
                      </div>
                    </td>
                    <td><span className="badge-slate">{t.categorie}</span></td>
                    <td className="text-sm text-slate-500">{t.compte}</td>
                    <td className="font-mono text-xs text-slate-500">{t.reference}</td>
                    <td className={`font-semibold whitespace-nowrap ${t.type === 'entree' ? 'text-success-600' : 'text-danger-600'}`}>
                      {t.type === 'entree' ? '+' : '-'}{formatMontant(t.montant)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 text-sm text-slate-500">{filtered.length} transaction{filtered.length > 1 ? 's' : ''}</div>
        </div>
      )}

      {tab === 'analyse' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header"><h3 className="font-semibold text-slate-800">Évolution de la trésorerie</h3></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={tresorerieEvolution}>
                  <defs>
                    <linearGradient id="tresGradAnalyse" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#026bc7" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#026bc7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="mois" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k`} />
                  <Tooltip formatter={(v) => formatMontant(v)} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="solde" stroke="#026bc7" strokeWidth={2} fill="url(#tresGradAnalyse)" name="Solde" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card">
            <div className="card-header"><h3 className="font-semibold text-slate-800">Répartition des dépenses</h3></div>
            <div className="card-body flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={depensesParCategorie} cx="50%" cy="50%" outerRadius={80} innerRadius={45} dataKey="value" paddingAngle={3}>
                    {depensesParCategorie.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatMontant(v)} contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-full space-y-2 mt-3">
                {depensesParCategorie.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-sm text-slate-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{formatMontant(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Modal isOpen={modal.open && modal.type === 'transaction'} onClose={() => setModal({ open: false, type: '', data: null })} title="Nouvelle transaction" size="lg">
        <TransactionForm onSave={handleSave} onCancel={() => setModal({ open: false, type: '', data: null })} comptes={comptesBancaires} categories={categoriesList} />
      </Modal>

      <Modal isOpen={showReport} onClose={() => setShowReport(false)} title="Rapport Trésorerie" size="xl">
        <div className="mb-4 flex justify-end">
          <button onClick={printReport} className="btn-primary btn-sm"><Printer className="w-4 h-4" /> Imprimer</button>
        </div>
        <div ref={reportRef}>
          <div className="header">
            <h1>Lab-ERP — Rapport Trésorerie</h1>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <div className="stat"><div className="stat-label">Solde total</div><div className="stat-val">{formatMontant(soldeTotal)}</div></div>
            <div className="stat"><div className="stat-label">Entrées</div><div className="stat-val green">{formatMontant(totalEntrees)}</div></div>
            <div className="stat"><div className="stat-label">Sorties</div><div className="stat-val red">{formatMontant(totalSorties)}</div></div>
            <div className="stat"><div className="stat-label">Résultat net</div><div className="stat-val" style={{ color: totalEntrees - totalSorties > 0 ? '#15803d' : '#b91c1c' }}>{formatMontant(totalEntrees - totalSorties)}</div></div>
          </div>
          <h2>Comptes bancaires</h2>
          <table>
            <thead><tr><th>Compte</th><th>Banque</th><th>Type</th><th>N° IBAN</th><th>Solde</th></tr></thead>
            <tbody>
              {comptesBancaires.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 600 }}>{c.nom}</td>
                  <td>{c.banque}</td>
                  <td>{c.type}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{c.numero}</td>
                  <td style={{ fontWeight: 700 }}>{formatMontant(c.solde)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: 700, borderTop: '2px solid #1e293b' }}>
                <td colSpan={4}>TOTAL</td>
                <td>{formatMontant(soldeTotal)}</td>
              </tr>
            </tbody>
          </table>
          <h2>Dépenses par catégorie</h2>
          <table>
            <thead><tr><th>Catégorie</th><th>Montant</th><th>% du total</th></tr></thead>
            <tbody>
              {depensesParCategorie.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td style={{ fontWeight: 600 }}>{formatMontant(item.value)}</td>
                  <td>{((item.value / totalSorties) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Détail des transactions</h2>
          <table>
            <thead><tr><th>Date</th><th>Description</th><th>Catégorie</th><th>Type</th><th>Montant</th></tr></thead>
            <tbody>
              {transactionsList.map(t => (
                <tr key={t.id}>
                  <td>{t.date}</td>
                  <td>{t.description}</td>
                  <td>{t.categorie}</td>
                  <td>{t.type === 'entree' ? 'Entrée' : 'Sortie'}</td>
                  <td style={{ fontWeight: 600, color: t.type === 'entree' ? '#15803d' : '#b91c1c' }}>{t.type === 'entree' ? '+' : '-'}{formatMontant(t.montant)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

function TransactionForm({ onSave, onCancel, comptes, categories }) {
  const [form, setForm] = useState({ date: new Date().toLocaleDateString('fr-FR'), description: '', type: 'entree', categorie: '', montant: '', compte_id: 1, compte: comptes[0]?.nom || '', reference: '' });
  const handleSubmit = (e) => { e.preventDefault(); onSave(form); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="label">Date</label><input className="input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required /></div>
        <div><label className="label">Référence</label><input className="input" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} placeholder="ex: PAY-CLI-001" /></div>
        <div className="sm:col-span-2"><label className="label">Description</label><input className="input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /></div>
        <div><label className="label">Type</label>
          <select className="select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="entree">Entrée</option><option value="sortie">Sortie</option>
          </select>
        </div>
        <div><label className="label">Catégorie</label>
          <select className="select" value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })} required>
            <option value="">Sélectionner</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="Autre">Autre</option>
          </select>
        </div>
        <div><label className="label">Montant ($)</label><input type="number" step="0.01" className="input" value={form.montant} onChange={e => setForm({ ...form, montant: e.target.value })} required /></div>
        <div><label className="label">Compte</label>
          <select className="select" value={form.compte_id} onChange={e => { const c = comptes.find(x => x.id === parseInt(e.target.value)); setForm({ ...form, compte_id: parseInt(e.target.value), compte: c?.nom || '' }); }}>
            {comptes.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
        <button type="submit" className="btn-primary">Enregistrer</button>
      </div>
    </form>
  );
}
