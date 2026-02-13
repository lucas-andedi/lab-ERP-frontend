import { useState, useRef } from 'react';
import { Users, Plus, Search, Eye, Edit, Trash2, FileText, Printer, ShoppingCart, CreditCard, MapPin, Mail, Phone } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Modal from '../components/shared/Modal';
import StatCard from '../components/shared/StatCard';
import { clients as initialClients, commandes, repartitionCA } from '../data/mockData';

const formatMontant = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(v);

export default function Clients() {
  const [clientsList, setClients] = useState(initialClients);
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [tab, setTab] = useState('clients');
  const [modal, setModal] = useState({ open: false, type: '', data: null });
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef();

  const filtered = clientsList.filter(c => {
    const matchSearch = c.nom.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchStatut = !filterStatut || c.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const totalCA = clientsList.reduce((s, c) => s + c.ca_total, 0);
  const totalSolde = clientsList.reduce((s, c) => s + c.solde, 0);
  const clientsActifs = clientsList.filter(c => c.statut === 'Actif').length;

  const handleDelete = (id) => {
    if (confirm('Supprimer ce client ?')) {
      setClients(clientsList.filter(c => c.id !== id));
    }
  };

  const handleSave = (formData) => {
    if (modal.data) {
      setClients(clientsList.map(c => c.id === modal.data.id ? { ...c, ...formData } : c));
    } else {
      setClients([...clientsList, { ...formData, id: clientsList.length + 1, ca_total: 0, solde: 0, date_creation: new Date().toLocaleDateString('fr-FR') }]);
    }
    setModal({ open: false, type: '', data: null });
  };

  const caParVille = clientsList.reduce((acc, c) => {
    const existing = acc.find(x => x.ville === c.ville);
    if (existing) existing.ca += c.ca_total;
    else acc.push({ ville: c.ville, ca: c.ca_total });
    return acc;
  }, []).sort((a, b) => b.ca - a.ca);

  const printReport = () => {
    const content = reportRef.current;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Rapport Clients - Lab-ERP</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1e293b}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #e2e8f0;font-size:13px}th{background:#f8fafc;font-weight:600;color:#475569;text-transform:uppercase;font-size:11px}h1{font-size:20px;margin-bottom:4px}h2{font-size:16px;margin:24px 0 8px;color:#026bc7}.header{border-bottom:2px solid #026bc7;padding-bottom:12px;margin-bottom:24px}.stat{display:inline-block;margin-right:32px;margin-bottom:12px}.stat-val{font-size:22px;font-weight:700}.stat-label{font-size:12px;color:#64748b}.badge{padding:2px 8px;border-radius:10px;font-size:11px;font-weight:500}.success{background:#f0fdf5;color:#15803d}.inactive{background:#f1f5f9;color:#475569}@media print{body{padding:20px}}</style></head><body>`);
    win.document.write(content.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestion Clients</h1>
          <p className="page-subtitle">Gérez votre portefeuille clients et commandes</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowReport(true)} className="btn-secondary btn-sm"><FileText className="w-4 h-4" /> Rapport</button>
          <button onClick={() => setModal({ open: true, type: 'client', data: null })} className="btn-primary"><Plus className="w-4 h-4" /> Nouveau client</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total clients" value={clientsList.length} subtitle={`${clientsActifs} actifs`} color="primary" />
        <StatCard icon={CreditCard} label="Chiffre d'affaires" value={formatMontant(totalCA)} color="success" trend={12.5} />
        <StatCard icon={ShoppingCart} label="Commandes" value={commandes.length} subtitle="ce mois" color="accent" />
        <StatCard icon={CreditCard} label="Solde clients" value={formatMontant(totalSolde)} subtitle="créances en cours" color="warning" />
      </div>

      <div className="flex gap-1 mb-4 bg-slate-100 rounded-lg p-1 w-fit">
        {['clients', 'commandes'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'clients' ? 'Clients' : 'Commandes'}
          </button>
        ))}
      </div>

      {tab === 'clients' && (
        <div className="card">
          <div className="card-header flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Rechercher par nom ou code..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
            </div>
            <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} className="select w-auto min-w-[160px]">
              <option value="">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Client</th>
                  <th>Contact</th>
                  <th>Ville</th>
                  <th>CA Total</th>
                  <th>Solde</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td className="font-mono text-xs font-semibold text-primary-700">{c.code}</td>
                    <td>
                      <p className="font-medium text-slate-800">{c.nom}</p>
                      <p className="text-xs text-slate-400">{c.email}</p>
                    </td>
                    <td className="text-sm">{c.contact}</td>
                    <td className="text-sm">{c.ville}</td>
                    <td className="font-semibold">{formatMontant(c.ca_total)}</td>
                    <td className={c.solde > 0 ? 'font-semibold text-accent-600' : 'text-slate-400'}>{c.solde > 0 ? formatMontant(c.solde) : '—'}</td>
                    <td><span className={c.statut === 'Actif' ? 'badge-success' : 'badge-slate'}>{c.statut}</span></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setModal({ open: true, type: 'view', data: c })} className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => setModal({ open: true, type: 'client', data: c })} className="p-1.5 rounded-md text-slate-400 hover:text-accent-600 hover:bg-accent-50 transition-colors cursor-pointer"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-md text-slate-400 hover:text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 text-sm text-slate-500">{filtered.length} client{filtered.length > 1 ? 's' : ''}</div>
        </div>
      )}

      {tab === 'commandes' && (
        <div className="card">
          <div className="card-header"><h3 className="font-semibold text-slate-800">Commandes clients</h3></div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>N° Commande</th><th>Client</th><th>Date</th><th>Montant</th><th>Statut</th><th>Paiement</th></tr>
              </thead>
              <tbody>
                {commandes.map(cmd => (
                  <tr key={cmd.id}>
                    <td className="font-mono text-xs font-semibold">{cmd.numero}</td>
                    <td className="font-medium">{cmd.client}</td>
                    <td className="text-sm">{cmd.date}</td>
                    <td className="font-semibold">{formatMontant(cmd.montant)}</td>
                    <td>
                      <span className={`badge ${cmd.statut === 'Livrée' ? 'badge-success' : cmd.statut === 'En cours' ? 'badge-primary' : cmd.statut === 'En préparation' ? 'badge-warning' : 'badge-slate'}`}>{cmd.statut}</span>
                    </td>
                    <td>
                      <span className={`badge ${cmd.paiement === 'Payée' ? 'badge-success' : cmd.paiement === 'Partielle' ? 'badge-warning' : 'badge-slate'}`}>{cmd.paiement}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Client Form Modal */}
      <Modal isOpen={modal.open && modal.type === 'client'} onClose={() => setModal({ open: false, type: '', data: null })} title={modal.data ? 'Modifier le client' : 'Nouveau client'} size="lg">
        <ClientForm data={modal.data} onSave={handleSave} onCancel={() => setModal({ open: false, type: '', data: null })} />
      </Modal>

      {/* View Modal */}
      <Modal isOpen={modal.open && modal.type === 'view'} onClose={() => setModal({ open: false, type: '', data: null })} title="Fiche client" size="lg">
        {modal.data && <ClientDetail data={modal.data} />}
      </Modal>

      {/* Report Modal */}
      <Modal isOpen={showReport} onClose={() => setShowReport(false)} title="Rapport Clients" size="xl">
        <div className="mb-4 flex justify-end">
          <button onClick={printReport} className="btn-primary btn-sm"><Printer className="w-4 h-4" /> Imprimer</button>
        </div>
        <div ref={reportRef}>
          <div className="header">
            <h1>Lab-ERP — Rapport Clients</h1>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <div className="stat"><div className="stat-label">Total clients</div><div className="stat-val">{clientsList.length}</div></div>
            <div className="stat"><div className="stat-label">CA Total</div><div className="stat-val">{formatMontant(totalCA)}</div></div>
            <div className="stat"><div className="stat-label">Créances</div><div className="stat-val" style={{ color: '#d97706' }}>{formatMontant(totalSolde)}</div></div>
          </div>
          <h2>CA par ville</h2>
          <div className="mb-6">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={caParVille} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}k$`} />
                <YAxis type="category" dataKey="ville" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
                <Tooltip formatter={(v) => formatMontant(v)} />
                <Bar dataKey="ca" fill="#026bc7" radius={[0, 4, 4, 0]} name="CA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <h2>Liste des clients</h2>
          <table>
            <thead><tr><th>Code</th><th>Client</th><th>Contact</th><th>Ville</th><th>CA</th><th>Solde</th><th>Statut</th></tr></thead>
            <tbody>
              {clientsList.map(c => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{c.code}</td>
                  <td>{c.nom}</td>
                  <td>{c.contact}</td>
                  <td>{c.ville}</td>
                  <td style={{ fontWeight: 600 }}>{formatMontant(c.ca_total)}</td>
                  <td style={{ color: c.solde > 0 ? '#d97706' : '#94a3b8' }}>{c.solde > 0 ? formatMontant(c.solde) : '—'}</td>
                  <td><span className={`badge ${c.statut === 'Actif' ? 'success' : 'inactive'}`}>{c.statut}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Commandes récentes</h2>
          <table>
            <thead><tr><th>N°</th><th>Client</th><th>Date</th><th>Montant</th><th>Statut</th><th>Paiement</th></tr></thead>
            <tbody>
              {commandes.map(cmd => (
                <tr key={cmd.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{cmd.numero}</td>
                  <td>{cmd.client}</td>
                  <td>{cmd.date}</td>
                  <td style={{ fontWeight: 600 }}>{formatMontant(cmd.montant)}</td>
                  <td>{cmd.statut}</td>
                  <td>{cmd.paiement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

function ClientForm({ data, onSave, onCancel }) {
  const [form, setForm] = useState(data || { code: '', nom: '', contact: '', email: '', telephone: '', adresse: '', ville: '', type: 'Entreprise', statut: 'Actif' });
  const handleSubmit = (e) => { e.preventDefault(); onSave(form); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="label">Code client</label><input className="input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required /></div>
        <div><label className="label">Raison sociale</label><input className="input" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required /></div>
        <div><label className="label">Personne de contact</label><input className="input" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} required /></div>
        <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
        <div><label className="label">Téléphone</label><input className="input" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} /></div>
        <div><label className="label">Ville</label><input className="input" value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} /></div>
        <div className="sm:col-span-2"><label className="label">Adresse</label><input className="input" value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} /></div>
        <div><label className="label">Type</label>
          <select className="select" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value="Entreprise">Entreprise</option><option value="Particulier">Particulier</option>
          </select>
        </div>
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

function ClientDetail({ data }) {
  const clientCommandes = commandes.filter(c => c.client_id === data.id);
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center shrink-0">
          <Users className="w-7 h-7 text-primary-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{data.nom}</h3>
          <p className="text-sm text-slate-500">{data.code} • {data.type}</p>
          <span className={`mt-1 inline-block ${data.statut === 'Actif' ? 'badge-success' : 'badge-slate'}`}>{data.statut}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-slate-400" /><span>{data.email}</span></div>
        <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-slate-400" /><span>{data.telephone}</span></div>
        <div className="flex items-center gap-2 text-sm sm:col-span-2"><MapPin className="w-4 h-4 text-slate-400" /><span>{data.adresse}</span></div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500">CA Total</p>
          <p className="text-lg font-bold text-slate-900">{formatMontant(data.ca_total)}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500">Solde</p>
          <p className={`text-lg font-bold ${data.solde > 0 ? 'text-accent-600' : 'text-slate-400'}`}>{data.solde > 0 ? formatMontant(data.solde) : '—'}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500">Commandes</p>
          <p className="text-lg font-bold text-slate-900">{clientCommandes.length}</p>
        </div>
      </div>
      {clientCommandes.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Commandes récentes</h4>
          <div className="space-y-2">
            {clientCommandes.map(cmd => (
              <div key={cmd.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{cmd.numero}</p>
                  <p className="text-xs text-slate-500">{cmd.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatMontant(cmd.montant)}</p>
                  <span className={`badge ${cmd.statut === 'Livrée' ? 'badge-success' : 'badge-primary'}`}>{cmd.statut}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
