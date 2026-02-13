import { useState, useRef } from 'react';
import { Truck, Plus, Search, Eye, Edit, Trash2, FileText, Printer, Star, Mail, Phone, MapPin, ShoppingCart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Modal from '../components/shared/Modal';
import StatCard from '../components/shared/StatCard';
import { fournisseurs as initialFournisseurs, bonsCommande } from '../data/mockData';

const formatMontant = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(v);

export default function Fournisseurs() {
  const [fournisseursList, setFournisseurs] = useState(initialFournisseurs);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [tab, setTab] = useState('fournisseurs');
  const [modal, setModal] = useState({ open: false, type: '', data: null });
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef();

  const filtered = fournisseursList.filter(f => {
    const matchSearch = f.nom.toLowerCase().includes(search.toLowerCase()) || f.code.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || f.categorie === filterCat;
    return matchSearch && matchCat;
  });

  const totalAchats = fournisseursList.reduce((s, f) => s + f.total_achats, 0);
  const totalDu = fournisseursList.reduce((s, f) => s + f.solde_du, 0);
  const fournisseursActifs = fournisseursList.filter(f => f.statut === 'Actif').length;
  const categoriesList = [...new Set(fournisseursList.map(f => f.categorie))];

  const achatsParFournisseur = fournisseursList
    .filter(f => f.statut === 'Actif')
    .map(f => ({ nom: f.nom.length > 15 ? f.nom.substring(0, 15) + '...' : f.nom, achats: f.total_achats }))
    .sort((a, b) => b.achats - a.achats);

  const handleDelete = (id) => {
    if (confirm('Supprimer ce fournisseur ?')) {
      setFournisseurs(fournisseursList.filter(f => f.id !== id));
    }
  };

  const handleSave = (formData) => {
    if (modal.data) {
      setFournisseurs(fournisseursList.map(f => f.id === modal.data.id ? { ...f, ...formData } : f));
    } else {
      setFournisseurs([...fournisseursList, { ...formData, id: fournisseursList.length + 1, total_achats: 0, solde_du: 0, note: 0, date_creation: new Date().toLocaleDateString('fr-FR') }]);
    }
    setModal({ open: false, type: '', data: null });
  };

  const renderStars = (note) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.floor(note) ? 'text-warning-500 fill-warning-500' : i - 0.5 <= note ? 'text-warning-500 fill-warning-500/50' : 'text-slate-300'}`} />
        ))}
        <span className="ml-1 text-xs text-slate-500">{note}</span>
      </div>
    );
  };

  const printReport = () => {
    const content = reportRef.current;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Rapport Fournisseurs - Lab-ERP</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1e293b}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #e2e8f0;font-size:13px}th{background:#f8fafc;font-weight:600;color:#475569;text-transform:uppercase;font-size:11px}h1{font-size:20px;margin-bottom:4px}h2{font-size:16px;margin:24px 0 8px;color:#026bc7}.header{border-bottom:2px solid #026bc7;padding-bottom:12px;margin-bottom:24px}.stat{display:inline-block;margin-right:32px;margin-bottom:12px}.stat-val{font-size:22px;font-weight:700}.stat-label{font-size:12px;color:#64748b}.badge{padding:2px 8px;border-radius:10px;font-size:11px;font-weight:500}.success{background:#f0fdf5;color:#15803d}.inactive{background:#f1f5f9;color:#475569}@media print{body{padding:20px}}</style></head><body>`);
    win.document.write(content.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestion Fournisseurs</h1>
          <p className="page-subtitle">Gérez vos fournisseurs et bons de commande</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowReport(true)} className="btn-secondary btn-sm"><FileText className="w-4 h-4" /> Rapport</button>
          <button onClick={() => setModal({ open: true, type: 'fournisseur', data: null })} className="btn-primary"><Plus className="w-4 h-4" /> Nouveau fournisseur</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Truck} label="Fournisseurs" value={fournisseursList.length} subtitle={`${fournisseursActifs} actifs`} color="primary" />
        <StatCard icon={ShoppingCart} label="Total achats" value={formatMontant(totalAchats)} color="accent" />
        <StatCard icon={Truck} label="Dettes fournisseurs" value={formatMontant(totalDu)} subtitle="à régler" color="danger" />
        <StatCard icon={FileText} label="Bons de commande" value={bonsCommande.length} subtitle="ce mois" color="success" />
      </div>

      <div className="flex gap-1 mb-4 bg-slate-100 rounded-lg p-1 w-fit">
        {['fournisseurs', 'bons'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'fournisseurs' ? 'Fournisseurs' : 'Bons de commande'}
          </button>
        ))}
      </div>

      {tab === 'fournisseurs' && (
        <div className="card">
          <div className="card-header flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Rechercher par nom ou code..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
            </div>
            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="select w-auto min-w-[180px]">
              <option value="">Toutes catégories</option>
              {categoriesList.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Code</th><th>Fournisseur</th><th>Catégorie</th><th>Note</th><th>Total achats</th><th>Solde dû</th><th>Délai</th><th>Statut</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr key={f.id}>
                    <td className="font-mono text-xs font-semibold text-primary-700">{f.code}</td>
                    <td>
                      <p className="font-medium text-slate-800">{f.nom}</p>
                      <p className="text-xs text-slate-400">{f.contact}</p>
                    </td>
                    <td><span className="badge-slate">{f.categorie}</span></td>
                    <td>{renderStars(f.note)}</td>
                    <td className="font-semibold">{formatMontant(f.total_achats)}</td>
                    <td className={f.solde_du > 0 ? 'font-semibold text-danger-600' : 'text-slate-400'}>{f.solde_du > 0 ? formatMontant(f.solde_du) : '—'}</td>
                    <td className="text-sm">{f.delai_moyen}</td>
                    <td><span className={f.statut === 'Actif' ? 'badge-success' : 'badge-slate'}>{f.statut}</span></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setModal({ open: true, type: 'view', data: f })} className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => setModal({ open: true, type: 'fournisseur', data: f })} className="p-1.5 rounded-md text-slate-400 hover:text-accent-600 hover:bg-accent-50 transition-colors cursor-pointer"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(f.id)} className="p-1.5 rounded-md text-slate-400 hover:text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 text-sm text-slate-500">{filtered.length} fournisseur{filtered.length > 1 ? 's' : ''}</div>
        </div>
      )}

      {tab === 'bons' && (
        <div className="card">
          <div className="card-header"><h3 className="font-semibold text-slate-800">Bons de commande fournisseurs</h3></div>
          <div className="table-container">
            <table className="table">
              <thead><tr><th>N° BC</th><th>Fournisseur</th><th>Date</th><th>Montant</th><th>Statut</th><th>Paiement</th></tr></thead>
              <tbody>
                {bonsCommande.map(bc => (
                  <tr key={bc.id}>
                    <td className="font-mono text-xs font-semibold">{bc.numero}</td>
                    <td className="font-medium">{bc.fournisseur}</td>
                    <td className="text-sm">{bc.date}</td>
                    <td className="font-semibold">{formatMontant(bc.montant)}</td>
                    <td>
                      <span className={`badge ${bc.statut === 'Reçue' ? 'badge-success' : bc.statut === 'En transit' ? 'badge-primary' : bc.statut === 'Envoyée' ? 'badge-warning' : 'badge-slate'}`}>{bc.statut}</span>
                    </td>
                    <td><span className={`badge ${bc.paiement === 'Payé' ? 'badge-success' : 'badge-slate'}`}>{bc.paiement}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modal.open && modal.type === 'fournisseur'} onClose={() => setModal({ open: false, type: '', data: null })} title={modal.data ? 'Modifier le fournisseur' : 'Nouveau fournisseur'} size="lg">
        <FournisseurForm data={modal.data} onSave={handleSave} onCancel={() => setModal({ open: false, type: '', data: null })} />
      </Modal>

      <Modal isOpen={modal.open && modal.type === 'view'} onClose={() => setModal({ open: false, type: '', data: null })} title="Fiche fournisseur" size="lg">
        {modal.data && <FournisseurDetail data={modal.data} renderStars={renderStars} />}
      </Modal>

      <Modal isOpen={showReport} onClose={() => setShowReport(false)} title="Rapport Fournisseurs" size="xl">
        <div className="mb-4 flex justify-end">
          <button onClick={printReport} className="btn-primary btn-sm"><Printer className="w-4 h-4" /> Imprimer</button>
        </div>
        <div ref={reportRef}>
          <div className="header">
            <h1>Lab-ERP — Rapport Fournisseurs</h1>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <div className="stat"><div className="stat-label">Fournisseurs</div><div className="stat-val">{fournisseursList.length}</div></div>
            <div className="stat"><div className="stat-label">Total achats</div><div className="stat-val">{formatMontant(totalAchats)}</div></div>
            <div className="stat"><div className="stat-label">Dettes</div><div className="stat-val" style={{ color: '#dc2626' }}>{formatMontant(totalDu)}</div></div>
          </div>
          <h2>Achats par fournisseur</h2>
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={achatsParFournisseur} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k$`} />
                <YAxis type="category" dataKey="nom" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
                <Tooltip formatter={(v) => formatMontant(v)} />
                <Bar dataKey="achats" fill="#e38e55" radius={[0, 4, 4, 0]} name="Achats" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <h2>Liste des fournisseurs</h2>
          <table>
            <thead><tr><th>Code</th><th>Fournisseur</th><th>Catégorie</th><th>Note</th><th>Total achats</th><th>Solde dû</th><th>Statut</th></tr></thead>
            <tbody>
              {fournisseursList.map(f => (
                <tr key={f.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{f.code}</td>
                  <td>{f.nom}</td>
                  <td>{f.categorie}</td>
                  <td>{f.note}/5</td>
                  <td style={{ fontWeight: 600 }}>{formatMontant(f.total_achats)}</td>
                  <td style={{ color: f.solde_du > 0 ? '#dc2626' : '#94a3b8' }}>{f.solde_du > 0 ? formatMontant(f.solde_du) : '—'}</td>
                  <td><span className={`badge ${f.statut === 'Actif' ? 'success' : 'inactive'}`}>{f.statut}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Bons de commande</h2>
          <table>
            <thead><tr><th>N°</th><th>Fournisseur</th><th>Date</th><th>Montant</th><th>Statut</th><th>Paiement</th></tr></thead>
            <tbody>
              {bonsCommande.map(bc => (
                <tr key={bc.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{bc.numero}</td>
                  <td>{bc.fournisseur}</td>
                  <td>{bc.date}</td>
                  <td style={{ fontWeight: 600 }}>{formatMontant(bc.montant)}</td>
                  <td>{bc.statut}</td>
                  <td>{bc.paiement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

function FournisseurForm({ data, onSave, onCancel }) {
  const [form, setForm] = useState(data || { code: '', nom: '', contact: '', email: '', telephone: '', adresse: '', ville: '', categorie: '', statut: 'Actif', delai_moyen: '' });
  const handleSubmit = (e) => { e.preventDefault(); onSave(form); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="label">Code</label><input className="input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required /></div>
        <div><label className="label">Raison sociale</label><input className="input" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required /></div>
        <div><label className="label">Contact</label><input className="input" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} required /></div>
        <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
        <div><label className="label">Téléphone</label><input className="input" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} /></div>
        <div><label className="label">Ville</label><input className="input" value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className="label">Adresse</label><input className="input" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} /></div>
        <div><label className="label">Catégorie</label><input className="input" value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })} required /></div>
        <div><label className="label">Délai moyen livraison</label><input className="input" value={form.delai_moyen} onChange={e => setForm({ ...form, delai_moyen: e.target.value })} placeholder="ex: 5 jours" /></div>
        <div><label className="label">Statut</label>
          <select className="select" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
            <option value="Actif">Actif</option><option value="Inactif">Inactif</option>
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

function FournisseurDetail({ data, renderStars }) {
  const fournisseurBons = bonsCommande.filter(b => b.fournisseur_id === data.id);
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-accent-50 flex items-center justify-center shrink-0">
          <Truck className="w-7 h-7 text-accent-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{data.nom}</h3>
          <p className="text-sm text-slate-500">{data.code} • {data.categorie}</p>
          <div className="mt-1">{renderStars(data.note)}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-slate-400" /><span>{data.email}</span></div>
        <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-slate-400" /><span>{data.telephone}</span></div>
        <div className="flex items-center gap-2 text-sm sm:col-span-2"><MapPin className="w-4 h-4 text-slate-400" /><span>{data.adresse}</span></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500">Total achats</p>
          <p className="text-lg font-bold text-slate-900">{formatMontant(data.total_achats)}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500">Solde dû</p>
          <p className={`text-lg font-bold ${data.solde_du > 0 ? 'text-danger-600' : 'text-slate-400'}`}>{data.solde_du > 0 ? formatMontant(data.solde_du) : '—'}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500">Délai moyen</p>
          <p className="text-lg font-bold text-slate-900">{data.delai_moyen}</p>
        </div>
      </div>
      {fournisseurBons.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Bons de commande</h4>
          <div className="space-y-2">
            {fournisseurBons.map(bc => (
              <div key={bc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{bc.numero}</p>
                  <p className="text-xs text-slate-500">{bc.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatMontant(bc.montant)}</p>
                  <span className={`badge ${bc.statut === 'Reçue' ? 'badge-success' : 'badge-primary'}`}>{bc.statut}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
