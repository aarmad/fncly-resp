# 💸 Fncly — Gestionnaire de Finances Personnelles

Une application full-stack moderne pour gérer vos finances personnelles : suivi des revenus, dépenses, catégories, graphiques interactifs et export PDF.

---

## 🛠️ Stack Technique

| Côté | Technologie |
|------|------------|
| **Backend** | Laravel 11 (API REST, Sanctum Auth, DomPDF) |
| **Frontend** | Vue 3 (Vite, Pinia, Vue Router, TailwindCSS, Chart.js) |
| **Base de données** | MySQL |
| **Déploiement** | Vercel (frontend) |

---

## ✨ Fonctionnalités

- 🔐 **Authentification** : Inscription & Connexion avec création automatique de catégories par défaut
- 📊 **Tableau de bord** : Solde, Revenus et Dépenses avec filtres dynamiques par période
- 💸 **Transactions** : Historique complet avec CRUD, filtres multi-critères (date, type, catégorie) et pagination
- 📈 **Statistiques** : Graphiques interactifs (Barres & Donut) et calcul du taux d'épargne
- 📄 **Export PDF** : Génération d'un rapport financier dynamique selon la période sélectionnée
- 🌙 **Mode Sombre** : Support complet du thème clair/sombre

---

## 🚀 Installation

### 1. Base de données

Créer une base de données MySQL nommée `fncly_resp` (ou adapter le nom dans `backend/.env`).

### 2. Configuration du Backend

```sh
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Modifier `.env` pour renseigner vos identifiants de base de données, puis :

```sh
php artisan migrate
php artisan db:seed        # (optionnel) données de démonstration
php artisan serve          # démarre sur http://localhost:8000
```

### 3. Configuration du Frontend

```sh
cd frontend
npm install
npm run dev                # démarre sur http://localhost:5173
```

---

## 📦 Déploiement sur Vercel

Le frontend peut être déployé directement sur Vercel. Le fichier `vercel.json` est déjà configuré pour gérer le routing Vue Router côté client.

**Paramètres de Build Vercel :**
- **Framework Preset** : Vite
- **Root Directory** : `frontend`
- **Build Command** : `npm run build`
- **Output Directory** : `dist`

> ⚠️ Pensez à configurer l'URL de votre API Laravel (backend) dans les variables d'environnement Vercel si vous hébergez le backend séparément.

---

## 📁 Structure du Projet

```
fncly_resp/
├── backend/          # API Laravel 11
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── TransactionController.php
│   │   │   └── CategoryController.php
│   │   └── Models/
│   ├── database/
│   └── routes/api.php
└── frontend/         # App Vue 3
    ├── src/
    │   ├── components/   # Sidebar, Loader
    │   ├── views/        # Dashboard, Transactions, Statistiques
    │   ├── stores/       # Pinia (auth)
    │   └── router/
    └── vercel.json
```
