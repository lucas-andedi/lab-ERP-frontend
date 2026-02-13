import { useState, useRef } from 'react';
import { UserCog, Plus, Search, Eye, Edit, Trash2, FileText, Printer, Users, Calendar, Briefcase, Mail, Phone, Building2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Modal from '../components/shared/Modal';
import StatCard from '../components/shared/StatCard';
import { employes as initialEmployes, departements, conges, effectifParDepartement } from '../data/mockData';

const formatMontant = (v) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD' }).format(v);
const COLORS = ['#026bc7', '#0e88e9', '#38a3f8', '#e38e55', '#22c55e', '#f59e0b', '#7dc2fc'];

export default function Personnel() {
  const [employesList, setEmployes] = useState(initialEmployes);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterContrat, setFilterContrat] = useState('');
  const [tab, setTab] = useState('employes');
  const [modal, setModal] = useState({ open: false, type: '', data: null });
  const [showReport, setShowReport] = useState(false);
  const reportRef = useRef();

  const filtered = employesList.filter(e => {
    const matchSearch = `${e.nom} ${e.prenom}`.toLowerCase().includes(search.toLowerCase()) || e.matricule.toLowerCase().includes(search.toLowerCase());
    const matchDept = !filterDept || e.departement === filterDept;
    const matchContrat = !filterContrat || e.type_contrat === filterContrat;
    return matchSearch && matchDept && matchContrat;
  });

  const actifs = employesList.filter(e => e.statut === 'Actif').length;
  const masseSalariale = employesList.reduce((s, e) => s + e.salaire, 0);
  const congesEnAttente = conges.filter(c => c.statut === 'En attente').length;
  const typeContrats = [...new Set(employesList.map(e => e.type_contrat))];

  const repartitionContrats = employesList.reduce((acc, e) => {
    const existing = acc.find(x => x.name === e.type_contrat);
    if (existing) existing.value++;
    else acc.push({ name: e.type_contrat, value: 1 });
    return acc;
  }, []);

  const handleDelete = (id) => {
    if (confirm('Supprimer cet employé ?')) {
      setEmployes(employesList.filter(e => e.id !== id));
    }
  };

  const handleSave = (formData) => {
    if (modal.data) {
      setEmployes(employesList.map(e => e.id === modal.data.id ? { ...e, ...formData } : e));
    } else {
      setEmployes([...employesList, { ...formData, id: employesList.length + 1, salaire: parseFloat(formData.salaire) }]);
    }
    setModal({ open: false, type: '', data: null });
  };

  const printReport = () => {
    const content = reportRef.current;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Rapport Personnel - Lab-ERP</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#1e293b}table{width:100%;border-collapse:collapse;margin:16px 0}th,td{padding:8px 12px;text-align:left;border-bottom:1px solid #e2e8f0;font-size:13px}th{background:#f8fafc;font-weight:600;color:#475569;text-transform:uppercase;font-size:11px}h1{font-size:20px;margin-bottom:4px}h2{font-size:16px;margin:24px 0 8px;color:#026bc7}.header{border-bottom:2px solid #026bc7;padding-bottom:12px;margin-bottom:24px}.stat{display:inline-block;margin-right:32px;margin-bottom:12px}.stat-val{font-size:22px;font-weight:700}.stat-label{font-size:12px;color:#64748b}.badge{padding:2px 8px;border-radius:10px;font-size:11px;font-weight:500}.success{background:#f0fdf5;color:#15803d}.warning{background:#fffbeb;color:#d97706}@media print{body{padding:20px}}</style></head><body>`);
    win.document.write(content.innerHTML);
    win.document.write('</body></html>');
    win.document.close();
    win.print();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Gestion du Personnel</h1>
          <p className="page-subtitle">Gérez les employés, départements et congés</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowReport(true)} className="btn-secondary btn-sm"><FileText className="w-4 h-4" /> Rapport</button>
          <button onClick={() => setModal({ open: true, type: 'employe', data: null })} className="btn-primary"><Plus className="w-4 h-4" /> Nouvel employé</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Effectif total" value={employesList.length} subtitle={`${actifs} actifs`} color="primary" />
        <StatCard icon={Briefcase} label="Masse salariale" value={formatMontant(masseSalariale)} subtitle="mensuelle" color="accent" />
        <StatCard icon={Building2} label="Départements" value={departements.length} color="success" />
        <StatCard icon={Calendar} label="Congés en attente" value={congesEnAttente} subtitle="à valider" color="warning" />
      </div>

      <div className="flex gap-1 mb-4 bg-slate-100 rounded-lg p-1 w-fit">
        {['employes', 'departements', 'conges'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t === 'employes' ? 'Employés' : t === 'departements' ? 'Départements' : 'Congés'}
          </button>
        ))}
      </div>

      {tab === 'employes' && (
        <div className="card">
          <div className="card-header flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Rechercher par nom ou matricule..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-10" />
            </div>
            <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="select w-auto min-w-[180px]">
              <option value="">Tous départements</option>
              {departements.map(d => <option key={d.id} value={d.nom}>{d.nom}</option>)}
            </select>
            <select value={filterContrat} onChange={(e) => setFilterContrat(e.target.value)} className="select w-auto min-w-[120px]">
              <option value="">Tous contrats</option>
              {typeContrats.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Matricule</th><th>Employé</th><th>Poste</th><th>Département</th><th>Contrat</th><th>Salaire</th><th>Statut</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td className="font-mono text-xs font-semibold text-primary-700">{e.matricule}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold shrink-0">
                          {e.prenom[0]}{e.nom[0]}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{e.prenom} {e.nom}</p>
                          <p className="text-xs text-slate-400">{e.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-sm">{e.poste}</td>
                    <td><span className="badge-slate">{e.departement}</span></td>
                    <td>
                      <span className={`badge ${e.type_contrat === 'CDI' ? 'badge-success' : e.type_contrat === 'CDD' ? 'badge-warning' : 'badge-primary'}`}>{e.type_contrat}</span>
                    </td>
                    <td className="font-semibold">{formatMontant(e.salaire)}</td>
                    <td>
                      <span className={`badge ${e.statut === 'Actif' ? 'badge-success' : 'badge-warning'}`}>{e.statut}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button onClick={() => setModal({ open: true, type: 'view', data: e })} className="p-1.5 rounded-md text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors cursor-pointer"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => setModal({ open: true, type: 'employe', data: e })} className="p-1.5 rounded-md text-slate-400 hover:text-accent-600 hover:bg-accent-50 transition-colors cursor-pointer"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(e.id)} className="p-1.5 rounded-md text-slate-400 hover:text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 border-t border-slate-100 text-sm text-slate-500">{filtered.length} employé{filtered.length > 1 ? 's' : ''}</div>
        </div>
      )}

      {tab === 'departements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header"><h3 className="font-semibold text-slate-800">Effectif par département</h3></div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={effectifParDepartement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="departement" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  <Bar dataKey="effectif" fill="#026bc7" radius={[4, 4, 0, 0]} name="Effectif" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-3">
            {departements.map(d => (
              <div key={d.id} className="card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800">{d.nom}</p>
                  <p className="text-sm text-slate-500">Responsable : {d.responsable}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900">{d.effectif}</p>
                  <p className="text-xs text-slate-400">personnes</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'conges' && (
        <div className="card">
          <div className="card-header"><h3 className="font-semibold text-slate-800">Demandes de congés</h3></div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr><th>Employé</th><th>Type</th><th>Du</th><th>Au</th><th>Jours</th><th>Statut</th></tr>
              </thead>
              <tbody>
                {conges.map(c => (
                  <tr key={c.id}>
                    <td className="font-medium">{c.employe}</td>
                    <td><span className="badge-slate">{c.type}</span></td>
                    <td className="text-sm">{c.date_debut}</td>
                    <td className="text-sm">{c.date_fin}</td>
                    <td className="font-semibold">{c.jours} j</td>
                    <td>
                      <span className={`badge ${c.statut === 'Approuvé' ? 'badge-success' : 'badge-warning'}`}>{c.statut}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modal.open && modal.type === 'employe'} onClose={() => setModal({ open: false, type: '', data: null })} title={modal.data ? 'Modifier l\'employé' : 'Nouvel employé'} size="lg">
        <EmployeForm data={modal.data} onSave={handleSave} onCancel={() => setModal({ open: false, type: '', data: null })} departements={departements} />
      </Modal>

      <Modal isOpen={modal.open && modal.type === 'view'} onClose={() => setModal({ open: false, type: '', data: null })} title="Fiche employé" size="lg">
        {modal.data && <EmployeDetail data={modal.data} />}
      </Modal>

      <Modal isOpen={showReport} onClose={() => setShowReport(false)} title="Rapport du Personnel" size="xl">
        <div className="mb-4 flex justify-end">
          <button onClick={printReport} className="btn-primary btn-sm"><Printer className="w-4 h-4" /> Imprimer</button>
        </div>
        <div ref={reportRef}>
          <div className="header">
            <h1>Lab-ERP — Rapport du Personnel</h1>
            <p style={{ color: '#64748b', fontSize: '13px' }}>Généré le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}</p>
          </div>
          <div style={{ marginBottom: '20px' }}>
            <div className="stat"><div className="stat-label">Effectif total</div><div className="stat-val">{employesList.length}</div></div>
            <div className="stat"><div className="stat-label">Actifs</div><div className="stat-val" style={{ color: '#15803d' }}>{actifs}</div></div>
            <div className="stat"><div className="stat-label">Masse salariale</div><div className="stat-val">{formatMontant(masseSalariale)}</div></div>
            <div className="stat"><div className="stat-label">Départements</div><div className="stat-val">{departements.length}</div></div>
          </div>
          <h2>Répartition par département</h2>
          <table>
            <thead><tr><th>Département</th><th>Responsable</th><th>Effectif</th><th>Masse salariale</th></tr></thead>
            <tbody>
              {departements.map(d => {
                const deptEmployes = employesList.filter(e => e.departement === d.nom);
                const deptSalaire = deptEmployes.reduce((s, e) => s + e.salaire, 0);
                return (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.nom}</td>
                    <td>{d.responsable}</td>
                    <td>{deptEmployes.length}</td>
                    <td style={{ fontWeight: 600 }}>{formatMontant(deptSalaire)}</td>
                  </tr>
                );
              })}
              <tr style={{ fontWeight: 700, borderTop: '2px solid #1e293b' }}>
                <td colSpan={2}>TOTAL</td>
                <td>{employesList.length}</td>
                <td>{formatMontant(masseSalariale)}</td>
              </tr>
            </tbody>
          </table>
          <h2>Répartition par type de contrat</h2>
          <table>
            <thead><tr><th>Type</th><th>Nombre</th><th>% de l'effectif</th></tr></thead>
            <tbody>
              {repartitionContrats.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td style={{ fontWeight: 600 }}>{r.value}</td>
                  <td>{((r.value / employesList.length) * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Liste complète des employés</h2>
          <table>
            <thead><tr><th>Matricule</th><th>Nom</th><th>Poste</th><th>Département</th><th>Contrat</th><th>Embauche</th><th>Salaire</th></tr></thead>
            <tbody>
              {employesList.map(e => (
                <tr key={e.id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{e.matricule}</td>
                  <td>{e.prenom} {e.nom}</td>
                  <td>{e.poste}</td>
                  <td>{e.departement}</td>
                  <td><span className={`badge ${e.type_contrat === 'CDI' ? 'success' : 'warning'}`}>{e.type_contrat}</span></td>
                  <td>{e.date_embauche}</td>
                  <td style={{ fontWeight: 600 }}>{formatMontant(e.salaire)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2>Congés en cours</h2>
          <table>
            <thead><tr><th>Employé</th><th>Type</th><th>Du</th><th>Au</th><th>Jours</th><th>Statut</th></tr></thead>
            <tbody>
              {conges.map(c => (
                <tr key={c.id}>
                  <td>{c.employe}</td>
                  <td>{c.type}</td>
                  <td>{c.date_debut}</td>
                  <td>{c.date_fin}</td>
                  <td>{c.jours}</td>
                  <td><span className={`badge ${c.statut === 'Approuvé' ? 'success' : 'warning'}`}>{c.statut}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}

function EmployeForm({ data, onSave, onCancel, departements }) {
  const [form, setForm] = useState(data || { matricule: '', nom: '', prenom: '', email: '', telephone: '', poste: '', departement: '', type_contrat: 'CDI', salaire: '', statut: 'Actif', date_embauche: new Date().toLocaleDateString('fr-FR') });
  const handleSubmit = (e) => { e.preventDefault(); onSave({ ...form, departement_id: departements.find(d => d.nom === form.departement)?.id || 0 }); };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div><label className="label">Matricule</label><input className="input" value={form.matricule} onChange={e => setForm({ ...form, matricule: e.target.value })} required /></div>
        <div><label className="label">Nom</label><input className="input" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} required /></div>
        <div><label className="label">Prénom</label><input className="input" value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} required /></div>
        <div><label className="label">Email</label><input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div>
        <div><label className="label">Téléphone</label><input className="input" value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} /></div>
        <div><label className="label">Poste</label><input className="input" value={form.poste} onChange={e => setForm({ ...form, poste: e.target.value })} required /></div>
        <div><label className="label">Département</label>
          <select className="select" value={form.departement} onChange={e => setForm({ ...form, departement: e.target.value })} required>
            <option value="">Sélectionner</option>
            {departements.map(d => <option key={d.id} value={d.nom}>{d.nom}</option>)}
          </select>
        </div>
        <div><label className="label">Type de contrat</label>
          <select className="select" value={form.type_contrat} onChange={e => setForm({ ...form, type_contrat: e.target.value })}>
            <option value="CDI">CDI</option><option value="CDD">CDD</option><option value="Stage">Stage</option><option value="Intérim">Intérim</option>
          </select>
        </div>
        <div><label className="label">Salaire brut ($)</label><input type="number" step="0.01" className="input" value={form.salaire} onChange={e => setForm({ ...form, salaire: e.target.value })} required /></div>
        <div><label className="label">Date d'embauche</label><input className="input" value={form.date_embauche} onChange={e => setForm({ ...form, date_embauche: e.target.value })} /></div>
        <div><label className="label">Statut</label>
          <select className="select" value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}>
            <option value="Actif">Actif</option><option value="Congé maternité">Congé maternité</option><option value="Congé maladie">Congé maladie</option><option value="Suspendu">Suspendu</option>
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

function EmployeDetail({ data }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-primary-700">{data.prenom[0]}{data.nom[0]}</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">{data.prenom} {data.nom}</h3>
          <p className="text-sm text-slate-500">{data.poste}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`badge ${data.statut === 'Actif' ? 'badge-success' : 'badge-warning'}`}>{data.statut}</span>
            <span className={`badge ${data.type_contrat === 'CDI' ? 'badge-success' : data.type_contrat === 'CDD' ? 'badge-warning' : 'badge-primary'}`}>{data.type_contrat}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4 text-slate-400" /><span>{data.email}</span></div>
        <div className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4 text-slate-400" /><span>{data.telephone}</span></div>
        <div className="flex items-center gap-2 text-sm"><Building2 className="w-4 h-4 text-slate-400" /><span>{data.departement}</span></div>
        <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-slate-400" /><span>Depuis le {data.date_embauche}</span></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500">Matricule</p>
          <p className="text-sm font-bold text-slate-900 font-mono">{data.matricule}</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-3 text-center">
          <p className="text-xs text-slate-500">Salaire brut</p>
          <p className="text-lg font-bold text-slate-900">{formatMontant(data.salaire)}</p>
        </div>
      </div>
    </div>
  );
}
