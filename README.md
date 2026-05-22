# Klaro — Module Demandes d'aide financière

Test technique Fullstack Angular 15 / NestJS 9.

## Démarrage rapide

### Avec Docker (recommandé)

```bash
docker-compose up --build
```

- API : http://localhost:3000
- Frontend : http://localhost:4200

### En local

**1. PostgreSQL**

```bash
docker run -d --name klaro-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=klaro -p 5432:5432 postgres:15-alpine
```

**2. Backend**

```bash
cd backend
npm install
npm run migrate
npm run start:dev
```

**3. Frontend**

```bash
cd frontend
npm install
npm start
```

## API

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/aid-requests` | Créer une demande (statut `PENDING`) |
| GET | `/aid-requests?beneficiaryId=&status=&page=&limit=` | Lister avec filtres et pagination |
| PATCH | `/aid-requests/:id/status` | Mettre à jour le statut |

### Règles métier

- Montant : `> 0` et `≤ 5000 €`
- Transitions : `PENDING → UNDER_REVIEW | REJECTED`, `UNDER_REVIEW → APPROVED | REJECTED`
- Max 2 demandes actives (`PENDING` ou `UNDER_REVIEW`) par bénéficiaire

## Choix techniques

- **Knex** : léger, migrations explicites, requêtes SQL lisibles sans couche ORM lourde. Alternative Hasura non requise pour ce périmètre CRUD + règles métier.
- **Angular standalone** : structure moderne, moins de boilerplate que NgModules.
- **BehaviorSubject** dans `AidRequestService` pour partager l'état entre formulaire et listes sans NgRx.
- **Auth mockée** : `AuthService.currentUserId` en dur (`1632d0d2-aaf3-429b-9229-5c0d79e8789a`).

### Avec plus de temps

- Authentification JWT + guards par rôle (bénéficiaire vs gestionnaire) côté front et back
- Pagination et filtres côté UI (le backend les supporte déjà)
- Transaction sérialisée sur la création pour éviter une race condition sur le compteur de demandes actives
- Exposer les transitions de statut autorisées depuis le backend au lieu de dupliquer la logique côté frontend
- Mises à jour optimistes sur les changements de statut (rollback en cas d'erreur serveur)
- Codes d'erreur structurés côté API (`{ code: "AID_400_01", ... }`) + mapping i18n côté frontend pour des messages utilisateur localisés

## Tests

```bash
cd backend && npm test
cd frontend && npm test -- --watch=false --browsers=ChromeHeadless
```

## Partie 3 — Réflexion technique

### 1. Migration Angular 15 → 19

Difficultés majeures : passage aux **standalone components** obligatoires, adoption des **Signals** (remplacement progressif de RxJS pour l'état local), et le **nouveau control flow** (`@if`, `@for`) qui remplace `*ngIf`/`*ngFor`. Ordre : d'abord standalone + control flow, puis signals sur l'état local, enfin migration Material M3 et suppression de zone.js optionnelle.

### 2. Hasura vs NestJS REST

Hasura pour les **lectures simples** avec filtres/pagination (ex. `GET aid-requests` avec `beneficiaryId` et `status`) : génération automatique, pas de code à maintenir. NestJS pour les **écritures avec règles métier** (transitions de statut, plafond 5000€, max 2 demandes actives) où la logique doit rester centralisée et testable unitairement.

### 3. BehaviorSubject vs NgRx / Signals

Pour une évolution robuste : **Angular Signals** (v16+) pour l'état UI local (plus simple, moins de boilerplate que NgRx). NgRx si l'app grossit (effets de bord complexes, cache normalisé, time-travel debug). Le BehaviorSubject actuel suffit pour ce module isolé.
