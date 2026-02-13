import { useState, useRef } from 'react';
import { Package, Plus, Search, Filter, ArrowDownUp, AlertTriangle, TrendingUp, TrendingDown, FileText, Edit, Trash2, Eye, ArrowUpCircle, ArrowDownCircle, Printer } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Modal from '../components/shared/Modal';
import StatCard from '../components/shared/StatCard';
import { produits as initialProduits, mouvementsStock, categories, stockParCategorie } from '../data/mockData';

const formatMontant = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(v);
const COLORS = ['#026bc7', '#0e88e9', '#38a3f8', '#7dc2fc', '#baddfd'];

export default function Stocks() {
  const [produits, setProduits] = useState(initialProduits);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [tab, setTab] = useState('produits');
  const [modal, setModal] = useState({ open: false, type: '', data: null });
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef();

  const filtered = produits.filter(p => {
    const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase()) || p.reference.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || p.categorie === filterCat;
    return matchSearch && matchCat;
  });

  const alertes = produits.filter(p => p.quantite <= p.seuil_alerte);
  const valeurTotale = produits.reduce((s, p) => s + (p.prix_achat * p.quantite), 0);

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProduits(produits.filter(p => p.id !== id));
    }
  };

  const handleSave = (formData) => {
    if (modal.data) {
      setProduits(produits.map(p => p.id === modal.data.id ? { ...p, ...formData } : p));
    } else {
      setProduits([...produits, { ...formData, id: produits.length + 1, date_ajout: new Date().toLocaleDateString('fr-FR') }]);
    }
    setModal({ open: false, type: '', data: null });
  };

  const printReport = () => {
    const content = reportRef.current;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Rapport Stock - Lab-ERP</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1e293b}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #e2e8f0;font-size:13px}th{background:#f8fafc;font-weight:600;color:#475569;text-transform:uppercase;font-size:11px}h1{font-size:20px;margin-bottom:4px}h2{font-size:16px;margin:24px 0 8px;color:#026bc7}.header{border-bottom:2px solid #026bc7;padding-bottom:12px;margin-bottom:24px}.badge{padding:2px 8px;border-radius:10px;font-size:11px;font-weight:500}.danger{background:#fef2f2;color:#b91c1c}.success{background:#f0fdf5;color:#15803d}.stat{display:inline-block;margin-right:32px;margin-bottom:12px}.stat-val{font-size:22px;font-weight:700}.stat-label{font-size:12px;color:#64748b}@media print{body{padding:20px}}</style></head><body>`);
    win.document.write(content.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestion de Stocks</h1>
          <p className="page-subtitle">Gérez vos produits, mouvements et inventaire</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowReport(true)} className="btn-secondary btn-sm">
            <FileText className="w-4 h-4" /> Rapport
          </button>
          <button onClick={() => setModal({ open: true, type: 'produit', data: null })} className="btn-primary">
            <Plus className="w-4 h-4" /> Nouveau produit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Package} label="Total produits" value={produits.length} subtitle={`${produits.reduce((s, p) => s + p.quantite, 0).toLocaleString('fr-FR')} unités`} color="primary" />
        <StatCard icon={TrendingUp} label="Valeur du stock" value={formatMontant(valeurTotale)} color="success" />
        <StatCard icon={AlertTriangle} label="Alertes stock" value={alertes.length} subtitle="sous le seuil" color="danger" />
        <StatCard icon={ArrowDownUp} label="Mouvements" value={mouvementsStock.length} subtitle="ce mois" color="accent" />
      </div>

      <div className="flex gap-1 mb-4 bg-slate-100 rounded-lg p-1 w-fit">
        {['produits', 'mouvements', 'alertes'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'produits' ? 'Produits' : t === 'mouvements' ? 'Mouvements' : 'Alertes'}
          </button>
        ))}
      </div>

      {tab === 'produits' && (
        <div className="card">
          <div className="card-header flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Rechercher par nom ou référence..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
            </div>
            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="select w-auto min-w-[180px]">
              <option value="">Toutes catégories</option>
              {categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
            </select>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Produit</th>
                  <th>Catégorie</th>
                  <th>Quantité</th>
                  <th>Prix achat</th>
                  <th>Prix vente</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs font-semibold text-primary-700">{p.reference}</td>
                    <td>
                      <div>
                        <p className="font-medium text-slate-800">{p.nom}</p>
                        <p className="text-xs text-slate-400">{p.emplacement}</p>
                      </div>
                    </td>
                    <td><span className="badge-slate">{p.categorie}</span></td>
                    <td>
                      <span className="font-semibold">{p.quantite.toLocaleString('fr-FR')}</span>
                      <span className="text-slate-400 ml-1 text-xs">{p.unite}</span>
                    </td>
                    <td>{formatMontant(p.prix_achat)}</td>
                    <td>{p.prix_vente > 0 ? formatMontant(p.prix_vente) : <span className="text-slate-300">—</span>}</td>
                    <td>
                      {p.quantite <= p.seuil_alerte ? (
                        <span className="badge-danger">Critique</span>
                      ) : p.quantite <= p.seuil_alerte * 2 ? (
                        <span className="badge-warning">Bas</span>
                      ) : (
                        <span className="badge-success">Normal</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setModal({ open: true, type: 'view', data: p })} className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => setModal({ open: true, type: 'produit', data: p })} className="p-1.5 rounded-md text-slate-400 hover:text-accent-600 hover:bg-accent-50 transition-colors cursor-pointer"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-md text-slate-400 hover:text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 text-sm text-slate-500">
            {filtered.length} produit{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
          </div>
        </div>
      )}

      {tab === 'mouvements' && (
        <div className="card">
          <div className="card-header">
            <h3 className="font-semibold text-slate-800">Historique des mouvements</h3>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Produit</th>
                  <th>Type</th>
                  <th>Quantité</th>
                  <th>Motif</th>
                  <th>Responsable</th>
                </tr>
              </thead>
              <tbody>
                {mouvementsStock.map(m => (
                  <tr key={m.id}>
                    <td className="text-sm">{m.date}</td>
                    <td className="font-medium">{m.produit}</td>
                    <td>
                      {m.type === 'entree' ? (
                        <span className="inline-flex items-center gap-1 badge-success"><ArrowUpCircle className="w-3 h-3" /> Entrée</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 badge-danger"><ArrowDownCircle className="w-3 h-3" /> Sortie</span>
                      )}
                    </td>
                    <td className="font-semibold">{m.quantite}</td>
                    <td className="text-sm text-slate-500">{m.motif}</td>
                    <td className="text-sm">{m.responsable}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'alertes' && (
        <div className="space-y-4">
          {alertes.length === 0 ? (
            <div className="card card-body text-center py-12">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Aucune alerte de stock en cours</p>
            </div>
          ) : (
            alertes.map(p => (
              <div key={p.id} className="card p-4 flex items-center gap-4 border-l-4 border-l-danger-500">
                <div className="w-10 h-10 rounded-lg bg-danger-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-danger-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">{p.nom}</p>
                  <p className="text-sm text-slate-500">{p.reference} • {p.emplacement}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-danger-600">{p.quantite} <span className="text-sm font-normal text-slate-400">{p.unite}</span></p>
                  <p className="text-xs text-slate-500">Seuil : {p.seuil_alerte} {p.unite}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Product Form Modal */}
      <Modal isOpen={modal.open && modal.type === 'produit'} onClose={() => setModal({ open: false, type: '', data: null })} title={modal.data ? 'Modifier le produit' : 'Nouveau produit'} size="lg">
        <ProductForm data={modal.data} onSave={handleSave} onCancel={() => setModal({ open: false, type: '', data: null })} />
      </Modal>

      {/* View Modal */}
      <Modal isOpen={modal.open && modal.type === 'view'} onClose={() => setModal({ open: false, type: '', data: null })} title="Détails du produit" size="lg">
        {modal.data && <ProductDetail data={modal.data} />}
      </Modal>

      {/* Report Modal */}
      <Modal isOpen={showReport} onClose={() => setShowReport(false)} title="Rapport de Stock" size="xl">
        <div className="mb-4 flex justify-end">
          <button onClick={printReport} className="btn-primary btn-sm"><Printer className="w-4 h-4" /> Imprimer</button>
        </div>
        <div ref={reportRef}>
          <div className="header">
            <h1>Lab-ERP — Rapport de Stock</h1>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <div className="stat"><div className="stat-label">Total produits</div><div className="stat-val">{produits.length}</div></div>
            <div className="stat"><div className="stat-label">Valeur totale</div><div className="stat-val">{formatMontant(valeurTotale)}</div></div>
            <div className="stat"><div className="stat-label">Alertes</div><div className="stat-val" style={{ color: '#dc2626' }}>{alertes.length}</div></div>
          </div>
          <h2>Stock par catégorie</h2>
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stockParCategorie}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="categorie" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k$`} />
                <Tooltip formatter={(v) => formatMontant(v)} />
                <Bar dataKey="valeur" fill="#026bc7" radius={[4, 4, 0, 0]} name="Valeur" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <h2>Inventaire détaillé</h2>
          <table>
            <thead><tr><th>Réf.</th><th>Produit</th><th>Catégorie</th><th>Qté</th><th>P.U. Achat</th><th>Valeur</th><th>Statut</th></tr></thead>
            <tbody>
              {produits.map(p => (
                <tr key={p.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{p.reference}</td>
                  <td>{p.nom}</td>
                  <td>{p.categorie}</td>
                  <td>{p.quantite} {p.unite}</td>
                  <td>{formatMontant(p.prix_achat)}</td>
                  <td style={{ fontWeight: 600 }}>{formatMontant(p.prix_achat * p.quantite)}</td>
                  <td><span className={p.quantite <= p.seuil_alerte ? 'badge danger' : 'badge success'}>{p.quantite <= p.seuil_alerte ? 'Critique' : 'OK'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {alertes.length > 0 && (
            <>
              <h2>Produits en alerte</h2>
              <table>
                <thead><tr><th>Produit</th><th>Stock actuel</th><th>Seuil d'alerte</th><th>Déficit</th></tr></thead>
                <tbody>
                  {alertes.map(p => (
                    <tr key={p.id}>
                      <td>{p.nom}</td>
                      <td style={{ color: '#dc2626', fontWeight: 600 }}>{p.quantite} {p.unite}</td>
                      <td>{p.seuil_alerte} {p.unite}</td>
                      <td style={{ color: '#dc2626' }}>{p.seuil_alerte - p.quantite} {p.unite}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}

function ProductForm({ data, onSave, onCancel }) {
  const [form, setForm] = useState(data || {
    reference: '', nom: '', categorie: '', prix_achat: '', prix_vente: '', quantite: '', unite: 'pcs', seuil_alerte: '', emplacement: '', fournisseur: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, prix_achat: parseFloat(form.prix_achat), prix_vente: parseFloat(form.prix_vente) || 0, quantite: parseInt(form.quantite), seuil_alerte: parseInt(form.seuil_alerte) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="label">Référence</label><input className="input" value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} required /></div>
        <div><label className="label">Nom du produit</label><input className="input" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required /></div>
        <div><label className="label">Catégorie</label>
          <select className="select" value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })} required>
            <option value="">Sélectionner</option>
            {categories.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
          </select>
        </div>
        <div><label className="label">Fournisseur</label><input className="input" value={form.fournisseur} onChange={e => setForm({ ...form, fournisseur: e.target.value })} /></div>
        <div><label className="label">Prix d'achat ($)</label><input type="number" step="0.01" className="input" value={form.prix_achat} onChange={e => setForm({ ...form, prix_achat: e.target.value })} required /></div>
        <div><label className="label">Prix de vente ($)</label><input type="number" step="0.01" className="input" value={form.prix_vente} onChange={e => setForm({ ...form, prix_vente: e.target.value })} /></div>
        <div><label className="label">Quantité</label><input type="number" className="input" value={form.quantite} onChange={e => setForm({ ...form, quantite: e.target.value })} required /></div>
        <div><label className="label">Unité</label>
          <select className="select" value={form.unite} onChange={e => setForm({ ...form, unite: e.target.value })}>
            <option value="pcs">Pièces</option><option value="kg">Kilogrammes</option><option value="m">Mètres</option><option value="L">Litres</option><option value="ramettes">Ramettes</option>
          </select>
        </div>
        <div><label className="label">Seuil d'alerte</label><input type="number" className="input" value={form.seuil_alerte} onChange={e => setForm({ ...form, seuil_alerte: e.target.value })} required /></div>
        <div><label className="label">Emplacement</label><input className="input" value={form.emplacement} onChange={e => setForm({ ...form, emplacement: e.target.value })} /></div>
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="btn-secondary">Annuler</button>
        <button type="submit" className="btn-primary">Enregistrer</button>
      </div>
    </form>
  );
}

function ProductDetail({ data }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          ['Référence', data.reference],
          ['Nom', data.nom],
          ['Catégorie', data.categorie],
          ['Fournisseur', data.fournisseur],
          ['Prix achat', formatMontant(data.prix_achat)],
          ['Prix vente', data.prix_vente > 0 ? formatMontant(data.prix_vente) : '—'],
          ['Quantité', `${data.quantite} ${data.unite}`],
          ['Seuil alerte', `${data.seuil_alerte} ${data.unite}`],
          ['Emplacement', data.emplacement],
          ['Date ajout', data.date_ajout],
        ].map(([label, value]) => (
          <div key={label}>
            <p className="text-xs text-slate-500 mb-0.5">{label}</p>
            <p className="text-sm font-medium text-slate-800">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
