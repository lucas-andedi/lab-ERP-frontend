import { format, subDays } from 'date-fns';

const today = new Date();
const formatDate = (d) => format(d, 'dd/MM/yyyy');

// ==================== STOCKS ====================
export const categories = [
  { id: 1, nom: 'Matières premières', description: 'Matériaux bruts pour production' },
  { id: 2, nom: 'Produits finis', description: 'Produits prêts à la vente' },
  { id: 3, nom: 'Emballages', description: 'Matériaux d\'emballage' },
  { id: 4, nom: 'Pièces détachées', description: 'Pièces de rechange' },
  { id: 5, nom: 'Consommables', description: 'Fournitures de bureau et consommables' },
];

export const produits = [
  { id: 1, reference: 'MP-001', nom: 'Acier inoxydable 304', categorie_id: 1, categorie: 'Matières premières', prix_achat: 45.00, prix_vente: 0, quantite: 1250, unite: 'kg', seuil_alerte: 200, emplacement: 'Entrepôt A - Zone 1', fournisseur: 'CongoMetal SARL', date_ajout: formatDate(subDays(today, 120)) },
  { id: 2, reference: 'MP-002', nom: 'Aluminium 6061', categorie_id: 1, categorie: 'Matières premières', prix_achat: 38.50, prix_vente: 0, quantite: 80, unite: 'kg', seuil_alerte: 150, emplacement: 'Entrepôt A - Zone 2', fournisseur: 'CongoMetal SARL', date_ajout: formatDate(subDays(today, 95)) },
  { id: 3, reference: 'PF-001', nom: 'Module de contrôle X200', categorie_id: 2, categorie: 'Produits finis', prix_achat: 120.00, prix_vente: 285.00, quantite: 340, unite: 'pcs', seuil_alerte: 50, emplacement: 'Entrepôt B - Zone 1', fournisseur: '-', date_ajout: formatDate(subDays(today, 60)) },
  { id: 4, reference: 'PF-002', nom: 'Capteur thermique T500', categorie_id: 2, categorie: 'Produits finis', prix_achat: 85.00, prix_vente: 195.00, quantite: 520, unite: 'pcs', seuil_alerte: 100, emplacement: 'Entrepôt B - Zone 2', fournisseur: '-', date_ajout: formatDate(subDays(today, 45)) },
  { id: 5, reference: 'PF-003', nom: 'Valve hydraulique VH30', categorie_id: 2, categorie: 'Produits finis', prix_achat: 210.00, prix_vente: 450.00, quantite: 45, unite: 'pcs', seuil_alerte: 30, emplacement: 'Entrepôt B - Zone 3', fournisseur: '-', date_ajout: formatDate(subDays(today, 30)) },
  { id: 6, reference: 'EM-001', nom: 'Cartons 40x30x20', categorie_id: 3, categorie: 'Emballages', prix_achat: 2.50, prix_vente: 0, quantite: 3200, unite: 'pcs', seuil_alerte: 500, emplacement: 'Entrepôt C', fournisseur: 'EmbalCongo', date_ajout: formatDate(subDays(today, 90)) },
  { id: 7, reference: 'PD-001', nom: 'Roulement à billes 6205', categorie_id: 4, categorie: 'Pièces détachées', prix_achat: 12.00, prix_vente: 28.00, quantite: 180, unite: 'pcs', seuil_alerte: 50, emplacement: 'Entrepôt D', fournisseur: 'TechPieces Kin', date_ajout: formatDate(subDays(today, 75)) },
  { id: 8, reference: 'PD-002', nom: 'Joint torique NBR 50mm', categorie_id: 4, categorie: 'Pièces détachées', prix_achat: 3.20, prix_vente: 8.50, quantite: 15, unite: 'pcs', seuil_alerte: 100, emplacement: 'Entrepôt D', fournisseur: 'TechPieces Kin', date_ajout: formatDate(subDays(today, 40)) },
  { id: 9, reference: 'CO-001', nom: 'Papier A4 80g', categorie_id: 5, categorie: 'Consommables', prix_achat: 4.50, prix_vente: 0, quantite: 450, unite: 'ramettes', seuil_alerte: 100, emplacement: 'Bureau - Stock', fournisseur: 'BuroCongo', date_ajout: formatDate(subDays(today, 20)) },
  { id: 10, reference: 'CO-002', nom: 'Encre imprimante HP', categorie_id: 5, categorie: 'Consommables', prix_achat: 32.00, prix_vente: 0, quantite: 25, unite: 'pcs', seuil_alerte: 10, emplacement: 'Bureau - Stock', fournisseur: 'BuroCongo', date_ajout: formatDate(subDays(today, 15)) },
];

export const mouvementsStock = [
  { id: 1, produit_id: 1, produit: 'Acier inoxydable 304', type: 'entree', quantite: 500, date: formatDate(subDays(today, 5)), motif: 'Réception commande F-2024-042', responsable: 'Patrick Kabongo' },
  { id: 2, produit_id: 3, produit: 'Module de contrôle X200', type: 'sortie', quantite: 20, date: formatDate(subDays(today, 3)), motif: 'Commande client C-2024-089', responsable: 'Grace Mwamba' },
  { id: 3, produit_id: 4, produit: 'Capteur thermique T500', type: 'sortie', quantite: 50, date: formatDate(subDays(today, 2)), motif: 'Commande client C-2024-091', responsable: 'Grace Mwamba' },
  { id: 4, produit_id: 6, produit: 'Cartons 40x30x20', type: 'entree', quantite: 1000, date: formatDate(subDays(today, 1)), motif: 'Réapprovisionnement', responsable: 'Fiston Ilunga' },
  { id: 5, produit_id: 2, produit: 'Aluminium 6061', type: 'sortie', quantite: 200, date: formatDate(today), motif: 'Production lot #4521', responsable: 'Patrick Kabongo' },
  { id: 6, produit_id: 5, produit: 'Valve hydraulique VH30', type: 'entree', quantite: 30, date: formatDate(subDays(today, 7)), motif: 'Production terminée', responsable: 'Gloire Kalala' },
  { id: 7, produit_id: 8, produit: 'Joint torique NBR 50mm', type: 'sortie', quantite: 85, date: formatDate(subDays(today, 4)), motif: 'Maintenance machines', responsable: 'Fiston Ilunga' },
  { id: 8, produit_id: 9, produit: 'Papier A4 80g', type: 'entree', quantite: 200, date: formatDate(subDays(today, 10)), motif: 'Commande fournisseur', responsable: 'Bénédicte Ngoy' },
];

// ==================== CLIENTS ====================
export const clients = [
  { id: 1, code: 'CLI-001', nom: 'Congo Industrie SA', contact: 'Josué Mutombo', email: 'j.mutombo@congoindustrie.cd', telephone: '+243 81 234 56 78', adresse: '15 Avenue de la Paix, Gombe', ville: 'Kinshasa', type: 'Entreprise', statut: 'Actif', ca_total: 185400.00, solde: 12500.00, date_creation: formatDate(subDays(today, 365)) },
  { id: 2, code: 'CLI-002', nom: 'TechKin Solutions SARL', contact: 'Merveille Bakala', email: 'm.bakala@techkin.cd', telephone: '+243 99 876 54 32', adresse: '42 Boulevard du 30 Juin, Gombe', ville: 'Kinshasa', type: 'Entreprise', statut: 'Actif', ca_total: 324800.00, solde: 0, date_creation: formatDate(subDays(today, 540)) },
  { id: 3, code: 'CLI-003', nom: 'Bâtiment Katanga Express', contact: 'Christian Kasongo', email: 'c.kasongo@batkatanga.cd', telephone: '+243 97 123 45 67', adresse: '8 Avenue Lumumba', ville: 'Lubumbashi', type: 'Entreprise', statut: 'Actif', ca_total: 98200.00, solde: 5600.00, date_creation: formatDate(subDays(today, 200)) },
  { id: 4, code: 'CLI-004', nom: 'AutoParts Kin Distribution', contact: 'Exaucé Nkunku', email: 'e.nkunku@autopartskin.cd', telephone: '+243 85 456 78 90', adresse: '25 Avenue Kasa-Vubu, Barumbu', ville: 'Kinshasa', type: 'Entreprise', statut: 'Actif', ca_total: 456700.00, solde: 28900.00, date_creation: formatDate(subDays(today, 730)) },
  { id: 5, code: 'CLI-005', nom: 'EnergieKongo Plus', contact: 'Alliance Kapinga', email: 'a.kapinga@energiekongo.cd', telephone: '+243 81 567 89 01', adresse: '60 Avenue Mobutu', ville: 'Kisangani', type: 'Entreprise', statut: 'Inactif', ca_total: 67500.00, solde: 0, date_creation: formatDate(subDays(today, 400)) },
  { id: 6, code: 'CLI-006', nom: 'AgroKongo Industries', contact: 'Providence Banza', email: 'p.banza@agrokongo.cd', telephone: '+243 99 678 90 12', adresse: '12 Zone Industrielle, Kamalondo', ville: 'Lubumbashi', type: 'Entreprise', statut: 'Actif', ca_total: 211300.00, solde: 15200.00, date_creation: formatDate(subDays(today, 180)) },
  { id: 7, code: 'CLI-007', nom: 'PharmaCongo SA', contact: 'Espérance Lukaku', email: 'e.lukaku@pharmacongo.cd', telephone: '+243 85 789 01 23', adresse: '3 Avenue de la Science, Limete', ville: 'Kinshasa', type: 'Entreprise', statut: 'Actif', ca_total: 543200.00, solde: 42000.00, date_creation: formatDate(subDays(today, 600)) },
  { id: 8, code: 'CLI-008', nom: 'TransCongo Logistik', contact: 'Chance Mbemba', email: 'c.mbemba@transcongo.cd', telephone: '+243 97 890 12 34', adresse: '78 Route de Matadi', ville: 'Matadi', type: 'Entreprise', statut: 'Actif', ca_total: 178900.00, solde: 8700.00, date_creation: formatDate(subDays(today, 300)) },
];

export const commandes = [
  { id: 1, numero: 'CMD-2024-001', client_id: 1, client: 'Congo Industrie SA', date: formatDate(subDays(today, 15)), montant: 12500.00, statut: 'Livrée', paiement: 'Payée' },
  { id: 2, numero: 'CMD-2024-002', client_id: 2, client: 'TechKin Solutions SARL', date: formatDate(subDays(today, 12)), montant: 28450.00, statut: 'Livrée', paiement: 'Payée' },
  { id: 3, numero: 'CMD-2024-003', client_id: 4, client: 'AutoParts Kin Distribution', date: formatDate(subDays(today, 10)), montant: 45200.00, statut: 'En cours', paiement: 'Partielle' },
  { id: 4, numero: 'CMD-2024-004', client_id: 7, client: 'PharmaCongo SA', date: formatDate(subDays(today, 8)), montant: 67800.00, statut: 'En cours', paiement: 'En attente' },
  { id: 5, numero: 'CMD-2024-005', client_id: 3, client: 'Bâtiment Katanga Express', date: formatDate(subDays(today, 5)), montant: 15600.00, statut: 'En préparation', paiement: 'En attente' },
  { id: 6, numero: 'CMD-2024-006', client_id: 6, client: 'AgroKongo Industries', date: formatDate(subDays(today, 3)), montant: 32100.00, statut: 'En préparation', paiement: 'En attente' },
  { id: 7, numero: 'CMD-2024-007', client_id: 8, client: 'TransCongo Logistik', date: formatDate(subDays(today, 1)), montant: 19800.00, statut: 'Nouvelle', paiement: 'En attente' },
  { id: 8, numero: 'CMD-2024-008', client_id: 1, client: 'Congo Industrie SA', date: formatDate(today), montant: 8900.00, statut: 'Nouvelle', paiement: 'En attente' },
];

// ==================== FOURNISSEURS ====================
export const fournisseurs = [
  { id: 1, code: 'FRN-001', nom: 'CongoMetal SARL', contact: 'Gentil Tshisekedi', email: 'g.tshisekedi@congometal.cd', telephone: '+243 81 901 23 45', adresse: '45 Zone Industrielle, Limete', ville: 'Kinshasa', categorie: 'Matières premières', statut: 'Actif', note: 4.5, total_achats: 289000.00, solde_du: 18500.00, delai_moyen: '5 jours', date_creation: formatDate(subDays(today, 800)) },
  { id: 2, code: 'FRN-002', nom: 'EmbalCongo', contact: 'Grâce Lumumba', email: 'g.lumumba@embalcongo.cd', telephone: '+243 99 012 34 56', adresse: '12 Avenue Sendwe, Kamalondo', ville: 'Lubumbashi', categorie: 'Emballages', statut: 'Actif', note: 4.2, total_achats: 45600.00, solde_du: 3200.00, delai_moyen: '3 jours', date_creation: formatDate(subDays(today, 500)) },
  { id: 3, code: 'FRN-003', nom: 'TechPieces Kin', contact: 'Fiston Kalala', email: 'f.kalala@techpieces.cd', telephone: '+243 97 234 56 78', adresse: '78 Avenue de la Libération', ville: 'Kinshasa', categorie: 'Pièces détachées', statut: 'Actif', note: 3.8, total_achats: 124300.00, solde_du: 8900.00, delai_moyen: '7 jours', date_creation: formatDate(subDays(today, 600)) },
  { id: 4, code: 'FRN-004', nom: 'BuroCongo', contact: 'Bénédicte Ilunga', email: 'b.ilunga@burocongo.cd', telephone: '+243 85 345 67 89', adresse: '22 Avenue Kabinda', ville: 'Mbuji-Mayi', categorie: 'Consommables', statut: 'Actif', note: 4.0, total_achats: 18900.00, solde_du: 0, delai_moyen: '2 jours', date_creation: formatDate(subDays(today, 300)) },
  { id: 5, code: 'FRN-005', nom: 'ChimieCongo SA', contact: 'Christian Ngoy', email: 'c.ngoy@chimiecongo.cd', telephone: '+243 81 456 78 90', adresse: '5 Zone Industrielle Kipushi', ville: 'Lubumbashi', categorie: 'Matières premières', statut: 'Actif', note: 4.7, total_achats: 356000.00, solde_du: 42000.00, delai_moyen: '4 jours', date_creation: formatDate(subDays(today, 900)) },
  { id: 6, code: 'FRN-006', nom: 'LogiEquip Congo', contact: 'Josué Mbemba', email: 'j.mbemba@logiequip.cd', telephone: '+243 99 567 89 01', adresse: '90 Route de Likasi', ville: 'Kolwezi', categorie: 'Équipements', statut: 'Inactif', note: 3.2, total_achats: 78500.00, solde_du: 0, delai_moyen: '10 jours', date_creation: formatDate(subDays(today, 450)) },
];

export const bonsCommande = [
  { id: 1, numero: 'BC-2024-001', fournisseur_id: 1, fournisseur: 'CongoMetal SARL', date: formatDate(subDays(today, 20)), montant: 22500.00, statut: 'Reçue', paiement: 'Payé' },
  { id: 2, numero: 'BC-2024-002', fournisseur_id: 5, fournisseur: 'ChimieCongo SA', date: formatDate(subDays(today, 15)), montant: 42000.00, statut: 'Reçue', paiement: 'En attente' },
  { id: 3, numero: 'BC-2024-003', fournisseur_id: 3, fournisseur: 'TechPieces Kin', date: formatDate(subDays(today, 10)), montant: 8900.00, statut: 'En transit', paiement: 'En attente' },
  { id: 4, numero: 'BC-2024-004', fournisseur_id: 2, fournisseur: 'EmbalCongo', date: formatDate(subDays(today, 5)), montant: 3200.00, statut: 'En transit', paiement: 'En attente' },
  { id: 5, numero: 'BC-2024-005', fournisseur_id: 1, fournisseur: 'CongoMetal SARL', date: formatDate(subDays(today, 2)), montant: 18500.00, statut: 'Envoyée', paiement: 'En attente' },
  { id: 6, numero: 'BC-2024-006', fournisseur_id: 4, fournisseur: 'BuroCongo', date: formatDate(today), montant: 1450.00, statut: 'Brouillon', paiement: 'En attente' },
];

// ==================== TRESORERIE ====================
export const comptesBancaires = [
  { id: 1, nom: 'Compte courant principal', banque: 'Rawbank', numero: 'CD01 0001 0000 1234 5678 9012 345', solde: 285400.00, type: 'Courant' },
  { id: 2, nom: 'Compte épargne entreprise', banque: 'Trust Merchant Bank', numero: 'CD01 0002 0000 1234 5678 9012 346', solde: 150000.00, type: 'Épargne' },
  { id: 3, nom: 'Compte opérationnel', banque: 'Equity BCDC', numero: 'CD01 0003 0000 1234 5678 9012 347', solde: 42800.00, type: 'Courant' },
];

export const transactions = [
  { id: 1, date: formatDate(subDays(today, 1)), description: 'Paiement client - Congo Industrie SA', type: 'entree', categorie: 'Ventes', montant: 12500.00, compte_id: 1, compte: 'Compte courant principal', reference: 'PAY-CLI-001' },
  { id: 2, date: formatDate(subDays(today, 1)), description: 'Règlement fournisseur - CongoMetal SARL', type: 'sortie', categorie: 'Achats', montant: 22500.00, compte_id: 1, compte: 'Compte courant principal', reference: 'PAY-FRN-001' },
  { id: 3, date: formatDate(subDays(today, 2)), description: 'Salaires du mois', type: 'sortie', categorie: 'Salaires', montant: 85000.00, compte_id: 1, compte: 'Compte courant principal', reference: 'SAL-2024-02' },
  { id: 4, date: formatDate(subDays(today, 3)), description: 'Paiement client - TechKin Solutions SARL', type: 'entree', categorie: 'Ventes', montant: 28450.00, compte_id: 1, compte: 'Compte courant principal', reference: 'PAY-CLI-002' },
  { id: 5, date: formatDate(subDays(today, 4)), description: 'Loyer bureaux', type: 'sortie', categorie: 'Charges fixes', montant: 8500.00, compte_id: 3, compte: 'Compte opérationnel', reference: 'LOYER-2024-02' },
  { id: 6, date: formatDate(subDays(today, 5)), description: 'Paiement client - AutoParts Kin Distribution', type: 'entree', categorie: 'Ventes', montant: 45200.00, compte_id: 1, compte: 'Compte courant principal', reference: 'PAY-CLI-004' },
  { id: 7, date: formatDate(subDays(today, 5)), description: 'Facture électricité SNEL', type: 'sortie', categorie: 'Charges fixes', montant: 3200.00, compte_id: 3, compte: 'Compte opérationnel', reference: 'ELEC-2024-02' },
  { id: 8, date: formatDate(subDays(today, 7)), description: 'Paiement client - PharmaCongo SA', type: 'entree', categorie: 'Ventes', montant: 67800.00, compte_id: 1, compte: 'Compte courant principal', reference: 'PAY-CLI-007' },
  { id: 9, date: formatDate(subDays(today, 8)), description: 'Achat équipement informatique', type: 'sortie', categorie: 'Investissements', montant: 15600.00, compte_id: 1, compte: 'Compte courant principal', reference: 'INV-2024-005' },
  { id: 10, date: formatDate(subDays(today, 10)), description: 'Frais bancaires', type: 'sortie', categorie: 'Charges fixes', montant: 450.00, compte_id: 1, compte: 'Compte courant principal', reference: 'FRB-2024-02' },
  { id: 11, date: formatDate(subDays(today, 12)), description: 'Paiement client - AgroKongo Industries', type: 'entree', categorie: 'Ventes', montant: 32100.00, compte_id: 1, compte: 'Compte courant principal', reference: 'PAY-CLI-006' },
  { id: 12, date: formatDate(subDays(today, 14)), description: 'Assurance entreprise', type: 'sortie', categorie: 'Charges fixes', montant: 4200.00, compte_id: 1, compte: 'Compte courant principal', reference: 'ASS-2024-02' },
];

// ==================== PERSONNEL ====================
export const departements = [
  { id: 1, nom: 'Direction générale', responsable: 'Patrick Kabongo', effectif: 3 },
  { id: 2, nom: 'Production', responsable: 'Gloire Kalala', effectif: 18 },
  { id: 3, nom: 'Commercial', responsable: 'Grace Mwamba', effectif: 8 },
  { id: 4, nom: 'Logistique', responsable: 'Fiston Ilunga', effectif: 12 },
  { id: 5, nom: 'Ressources Humaines', responsable: 'Bénédicte Ngoy', effectif: 4 },
  { id: 6, nom: 'Comptabilité & Finance', responsable: 'Christian Kasongo', effectif: 5 },
  { id: 7, nom: 'Informatique', responsable: 'Exaucé Nkunku', effectif: 6 },
];

export const employes = [
  { id: 1, matricule: 'EMP-001', nom: 'Kabongo', prenom: 'Patrick', email: 'p.kabongo@lab-erp.cd', telephone: '+243 81 100 00 01', poste: 'Directeur Général', departement_id: 1, departement: 'Direction générale', date_embauche: formatDate(subDays(today, 2500)), type_contrat: 'CDI', salaire: 12000.00, statut: 'Actif' },
  { id: 2, matricule: 'EMP-002', nom: 'Kalala', prenom: 'Gloire', email: 'g.kalala@lab-erp.cd', telephone: '+243 99 200 00 02', poste: 'Directeur Production', departement_id: 2, departement: 'Production', date_embauche: formatDate(subDays(today, 1800)), type_contrat: 'CDI', salaire: 8500.00, statut: 'Actif' },
  { id: 3, matricule: 'EMP-003', nom: 'Mwamba', prenom: 'Grace', email: 'g.mwamba@lab-erp.cd', telephone: '+243 97 300 00 03', poste: 'Directrice Commerciale', departement_id: 3, departement: 'Commercial', date_embauche: formatDate(subDays(today, 1500)), type_contrat: 'CDI', salaire: 8000.00, statut: 'Actif' },
  { id: 4, matricule: 'EMP-004', nom: 'Ilunga', prenom: 'Fiston', email: 'f.ilunga@lab-erp.cd', telephone: '+243 85 400 00 04', poste: 'Responsable Logistique', departement_id: 4, departement: 'Logistique', date_embauche: formatDate(subDays(today, 1200)), type_contrat: 'CDI', salaire: 7000.00, statut: 'Actif' },
  { id: 5, matricule: 'EMP-005', nom: 'Ngoy', prenom: 'Bénédicte', email: 'b.ngoy@lab-erp.cd', telephone: '+243 81 500 00 05', poste: 'Responsable RH', departement_id: 5, departement: 'Ressources Humaines', date_embauche: formatDate(subDays(today, 900)), type_contrat: 'CDI', salaire: 6500.00, statut: 'Actif' },
  { id: 6, matricule: 'EMP-006', nom: 'Kasongo', prenom: 'Christian', email: 'c.kasongo@lab-erp.cd', telephone: '+243 99 600 00 06', poste: 'Directeur Financier', departement_id: 6, departement: 'Comptabilité & Finance', date_embauche: formatDate(subDays(today, 1000)), type_contrat: 'CDI', salaire: 9000.00, statut: 'Actif' },
  { id: 7, matricule: 'EMP-007', nom: 'Nkunku', prenom: 'Exaucé', email: 'e.nkunku@lab-erp.cd', telephone: '+243 97 700 00 07', poste: 'DSI', departement_id: 7, departement: 'Informatique', date_embauche: formatDate(subDays(today, 700)), type_contrat: 'CDI', salaire: 8000.00, statut: 'Actif' },
  { id: 8, matricule: 'EMP-008', nom: 'Mutombo', prenom: 'Josué', email: 'j.mutombo@lab-erp.cd', telephone: '+243 85 800 00 08', poste: 'Chef d\'équipe Production', departement_id: 2, departement: 'Production', date_embauche: formatDate(subDays(today, 600)), type_contrat: 'CDI', salaire: 5500.00, statut: 'Actif' },
  { id: 9, matricule: 'EMP-009', nom: 'Bakala', prenom: 'Merveille', email: 'm.bakala@lab-erp.cd', telephone: '+243 81 900 00 09', poste: 'Commercial Senior', departement_id: 3, departement: 'Commercial', date_embauche: formatDate(subDays(today, 450)), type_contrat: 'CDI', salaire: 5000.00, statut: 'Actif' },
  { id: 10, matricule: 'EMP-010', nom: 'Kapinga', prenom: 'Alliance', email: 'a.kapinga@lab-erp.cd', telephone: '+243 99 100 00 10', poste: 'Comptable', departement_id: 6, departement: 'Comptabilité & Finance', date_embauche: formatDate(subDays(today, 300)), type_contrat: 'CDI', salaire: 4200.00, statut: 'Actif' },
  { id: 11, matricule: 'EMP-011', nom: 'Banza', prenom: 'Providence', email: 'p.banza@lab-erp.cd', telephone: '+243 97 110 00 11', poste: 'Développeur Full-Stack', departement_id: 7, departement: 'Informatique', date_embauche: formatDate(subDays(today, 200)), type_contrat: 'CDI', salaire: 5500.00, statut: 'Actif' },
  { id: 12, matricule: 'EMP-012', nom: 'Lukaku', prenom: 'Espérance', email: 'e.lukaku@lab-erp.cd', telephone: '+243 85 120 00 12', poste: 'Stagiaire RH', departement_id: 5, departement: 'Ressources Humaines', date_embauche: formatDate(subDays(today, 60)), type_contrat: 'Stage', salaire: 1200.00, statut: 'Actif' },
  { id: 13, matricule: 'EMP-013', nom: 'Tshisekedi', prenom: 'Gentil', email: 'g.tshisekedi@lab-erp.cd', telephone: '+243 81 130 00 13', poste: 'Opérateur Machine', departement_id: 2, departement: 'Production', date_embauche: formatDate(subDays(today, 150)), type_contrat: 'CDD', salaire: 3800.00, statut: 'Actif' },
  { id: 14, matricule: 'EMP-014', nom: 'Mbemba', prenom: 'Chance', email: 'c.mbemba@lab-erp.cd', telephone: '+243 99 140 00 14', poste: 'Magasinier', departement_id: 4, departement: 'Logistique', date_embauche: formatDate(subDays(today, 100)), type_contrat: 'CDI', salaire: 3500.00, statut: 'Actif' },
  { id: 15, matricule: 'EMP-015', nom: 'Lumumba', prenom: 'Grâce', email: 'g.lumumba@lab-erp.cd', telephone: '+243 97 150 00 15', poste: 'Assistante Direction', departement_id: 1, departement: 'Direction générale', date_embauche: formatDate(subDays(today, 400)), type_contrat: 'CDI', salaire: 4000.00, statut: 'Congé maternité' },
];

export const conges = [
  { id: 1, employe_id: 9, employe: 'Merveille Bakala', type: 'Congé payé', date_debut: formatDate(subDays(today, 3)), date_fin: formatDate(subDays(today, -4)), jours: 5, statut: 'Approuvé' },
  { id: 2, employe_id: 15, employe: 'Grâce Lumumba', type: 'Congé maternité', date_debut: formatDate(subDays(today, 30)), date_fin: formatDate(subDays(today, -60)), jours: 90, statut: 'Approuvé' },
  { id: 3, employe_id: 11, employe: 'Providence Banza', type: 'RTT', date_debut: formatDate(subDays(today, -7)), date_fin: formatDate(subDays(today, -7)), jours: 1, statut: 'En attente' },
  { id: 4, employe_id: 4, employe: 'Fiston Ilunga', type: 'Congé payé', date_debut: formatDate(subDays(today, -14)), date_fin: formatDate(subDays(today, -21)), jours: 5, statut: 'En attente' },
  { id: 5, employe_id: 8, employe: 'Josué Mutombo', type: 'Maladie', date_debut: formatDate(subDays(today, 2)), date_fin: formatDate(subDays(today, -1)), jours: 3, statut: 'Approuvé' },
];

// ==================== CHART DATA ====================
export const ventesParMois = [
  { mois: 'Sep', ventes: 145000, achats: 98000 },
  { mois: 'Oct', ventes: 178000, achats: 112000 },
  { mois: 'Nov', ventes: 156000, achats: 89000 },
  { mois: 'Déc', ventes: 198000, achats: 125000 },
  { mois: 'Jan', ventes: 167000, achats: 105000 },
  { mois: 'Fév', ventes: 210000, achats: 132000 },
];

export const repartitionCA = [
  { name: 'PharmaCongo SA', value: 543200, color: '#026bc7' },
  { name: 'AutoParts Kin Dist.', value: 456700, color: '#0e88e9' },
  { name: 'TechKin Solutions', value: 324800, color: '#38a3f8' },
  { name: 'AgroKongo Industries', value: 211300, color: '#7dc2fc' },
  { name: 'Autres', value: 529600, color: '#baddfd' },
];

export const stockParCategorie = [
  { categorie: 'Matières premières', valeur: 59425 },
  { categorie: 'Produits finis', valeur: 147425 },
  { categorie: 'Emballages', valeur: 8000 },
  { categorie: 'Pièces détachées', valeur: 2208 },
  { categorie: 'Consommables', valeur: 2825 },
];

export const tresorerieEvolution = [
  { mois: 'Sep', solde: 320000 },
  { mois: 'Oct', solde: 345000 },
  { mois: 'Nov', solde: 378000 },
  { mois: 'Déc', solde: 412000 },
  { mois: 'Jan', solde: 445000 },
  { mois: 'Fév', solde: 478200 },
];

export const effectifParDepartement = [
  { departement: 'Direction', effectif: 3 },
  { departement: 'Production', effectif: 18 },
  { departement: 'Commercial', effectif: 8 },
  { departement: 'Logistique', effectif: 12 },
  { departement: 'RH', effectif: 4 },
  { departement: 'Finance', effectif: 5 },
  { departement: 'IT', effectif: 6 },
];
