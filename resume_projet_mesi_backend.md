# 📚 Résumé du Projet — MESI Backend

## 🎯 C'est quoi MESI ?

**MESI** est une **plateforme éducative** (type ed-tech) qui connecte :
- des **élèves** (students)
- leurs **parents**
- des **professeurs** (teachers)
- des **administrateurs**

L'objectif est de permettre à des parents de trouver des profs particuliers pour leurs enfants, et à ces profs de créer du contenu pédagogique structuré (parcours d'apprentissage, cours, évaluations…).

---

## 🛠️ Stack Technique

| Composant | Technologie |
|-----------|-------------|
| **Langage** | Python 3.13+ |
| **Framework API** | FastAPI (async) |
| **Serveur** | Uvicorn (ASGI) |
| **ORM** | SQLAlchemy 2.x (async) |
| **Driver DB** | asyncpg |
| **Base de données** | PostgreSQL |
| **Migrations** | Alembic |
| **Validation** | Pydantic v2 + pydantic-settings |
| **Gestionnaire de paquets** | `uv` (remplacement moderne de pip/poetry) |
| **Linting / Formatting** | Ruff |
| **Tests** | pytest + pytest-asyncio + httpx |
| **Hooks Git** | pre-commit |

---

## 🏗️ Architecture en Couches

Le projet suit une **architecture en couches stricte** inspirée du DDD (Domain-Driven Design) :

```
Requête HTTP
     │
     ▼
┌─────────────┐
│   api/v1/   │  ← Routers FastAPI : reçoit la requête, valide via Pydantic, délègue
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  services/  │  ← Logique métier : orchestration, règles business
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  repositories/   │  ← Accès données : SEULE couche qui parle à SQLAlchemy/DB
└──────┬───────────┘
       │
       ▼
┌─────────────┐
│  database/  │  ← Session async, engine PostgreSQL
└─────────────┘
```

> **Règle d'or** : chaque couche ne parle qu'à la couche immédiatement en dessous. Un router ne touche jamais la DB directement.

---

## 📁 Structure des Fichiers Source

```
src/mesi_backend/
├── main.py              # Point d'entrée : création de l'app FastAPI, lifespan, exception handler global
├── api/v1/
│   ├── router.py        # Agrège tous les sous-routers v1
│   └── health.py        # Endpoint GET /api/v1/health (vérification DB)
├── core/
│   ├── config.py        # Configuration via .env (pydantic-settings, cache LRU)
│   ├── constants.py     # Constantes globales
│   ├── exceptions.py    # Hiérarchie d'exceptions métier (AppException → 404/401/403)
│   ├── logging.py       # Setup des logs
│   └── security.py      # Dataclass CurrentUser (utilisateur connecté)
├── database/
│   ├── base.py          # Base déclarative SQLAlchemy
│   └── session.py       # Engine async + AsyncSessionLocal
├── dependencies/
│   ├── database.py      # get_db() : injecteur de session DB par requête (commit/rollback auto)
│   └── auth.py          # get_current_user(), require_admin(), require_owns_teacher_assignment()
├── repositories/
│   ├── base_repository.py    # BaseRepository[T] générique : get_by_id, list (paginé), create, update, delete
│   └── health_repository.py  # Repository spécifique pour le health check
├── schemas/
│   ├── health.py        # Schéma de réponse du health check
│   ├── error.py         # Format d'erreur standard : {"error": {"code": ..., "detail": ...}}
│   └── pagination.py    # PaginationParams + Page[T] générique
├── services/
│   └── health_service.py     # Service du health check
├── models/              # (vide pour l'instant, sera peuplé de modèles SQLAlchemy)
├── middlewares/         # (vide, prêt pour CORS, logging des requêtes, etc.)
├── clients/             # (vide, prêt pour des API externes : email, paiement, etc.)
├── tasks/               # (vide, prêt pour des tâches asynchrones : Celery, etc.)
└── utils/               # (vide, prêt pour des fonctions utilitaires)
```

---

## 🗄️ Base de Données — 54 Tables

La migration baseline crée **54 tables** organisées en grands domaines :

### 👤 Authentification & Utilisateurs
| Table | Rôle |
|-------|------|
| `users` | Compte utilisateur de base (email, password_hash, avatar, status…) |
| `sessions` | Sessions actives (device, IP, user_agent) |
| `refresh_tokens` | Tokens de renouvellement JWT |
| `password_resets` | Demandes de réinitialisation de mot de passe |
| `login_history` | Historique des connexions (succès/échec) |
| `user_auth_providers` | OAuth / SSO (Google, etc.) |

### 🔐 Rôles & Permissions (RBAC)
| Table | Rôle |
|-------|------|
| `roles` | Rôles (admin, teacher, parent, student…) |
| `permissions` | Permissions granulaires par code |
| `role_permissions` | Liaison rôle ↔ permission |
| `user_roles` | Liaison utilisateur ↔ rôle |

### 👨‍👩‍👧 Profils Métier
| Table | Rôle |
|-------|------|
| `admins` | Profil admin (lié à users) |
| `parents` | Profil parent (profession, adresse) |
| `teachers` | Profil prof (bio, expérience, diplôme, note, vérifié) |
| `teacher_certifications` | Certifications des profs |
| `students` | Profil élève (date de naissance) |

### 💰 Finance
| Table | Rôle |
|-------|------|
| `wallets` | Portefeuille électronique du prof |
| `wallet_transactions` | Historique des transactions (type, montant avant/après) |

### 🏫 Structure Scolaire
| Table | Rôle |
|-------|------|
| `school_years` | Années scolaires (avec indicateur d'année courante) |
| `classes` | Classes (6ème, 5ème, Terminale… avec cycle et niveau) |
| `subjects` | Matières (Maths, Français, Physique…) |
| `system_settings` | Paramètres système clé/valeur |

### 🔗 Mise en Relation Profs / Élèves
| Table | Rôle |
|-------|------|
| `parent_students` | Lien parent ↔ élève (avec type de relation) |
| `student_school_years` | Inscription d'un élève à une année scolaire + classe |
| `student_subjects` | Matières suivies par un élève cette année |
| `teacher_assignments` | Affectation d'un prof à (année, classe, matière) — unique |
| `teacher_requests` | Demande d'un parent pour un prof |
| `teacher_students` | Relation effective prof ↔ élève (acceptée) |
| `favorite_teachers` | Profs mis en favoris par un parent |

### 📖 Contenu Pédagogique
| Table | Rôle |
|-------|------|
| `learning_paths` | Parcours d'apprentissage créé par un prof |
| `chapters` | Chapitres d'un parcours (ordonnés) |
| `courses` | Cours dans un chapitre (durée, ordre, aperçu) |
| `course_resources` | Fichiers attachés à un cours (PDF, vidéo…) |
| `course_enrollments` | Inscription d'un élève à un parcours |
| `student_course_progress` | Progression d'un élève dans un cours (%, temps passé) |
| `course_bookmarks` | Marque-page vidéo d'un élève dans un cours |

### 📝 Évaluations & QCM
| Table | Rôle |
|-------|------|
| `evaluations` | Évaluation liée à un cours |
| `evaluation_questions` | Questions (QCM, texte libre, etc.) |
| `evaluation_answers` | Réponses possibles (avec indicateur de correction) |
| `student_evaluations` | Passage d'une évaluation par un élève |
| `student_evaluation_answers` | Réponses données par l'élève |

### 🧠 Tests d'Intelligence
| Table | Rôle |
|-------|------|
| `intelligence_levels` | Niveaux définis par plage de score |
| `intelligence_tests` | Tests d'intelligence par classe |
| `intelligence_questions` | Questions du test |
| `intelligence_question_answers` | Réponses possibles (scorées) |
| `student_intelligence_tests` | Résultat d'un élève à un test (avec date de prochain test) |
| `student_intelligence_answers` | Réponses données par l'élève |

### 💬 Messagerie & Notifications
| Table | Rôle |
|-------|------|
| `groups` | Groupes de discussion |
| `group_members` | Membres d'un groupe |
| `conversations` | Conversations (liées à un groupe ou un cours) |
| `conversation_members` | Membres d'une conversation (lu, muet, archivé) |
| `messages` | Messages (texte, avec support de réponse à un message) |
| `message_attachments` | Pièces jointes à un message |
| `notifications` | Notifications utilisateur (type, lu, data JSON) |

### 📊 Traçabilité
| Table | Rôle |
|-------|------|
| `activity_logs` | Journal d'actions (qui, quoi, sur quelle entité, depuis quelle IP) |

---

## 🔒 Sécurité & Authentification

L'authentification est actuellement un **placeholder** en attente du vrai module JWT :

- Chaque requête doit envoyer un header `X-User-Id: <uuid>` 
- `get_current_user()` lit ce header et construit un objet `CurrentUser(id=uuid)`
- `require_admin()` vérifie en DB si l'utilisateur a le rôle `admin` (via `user_roles + roles`)
- `require_owns_teacher_assignment()` vérifie que le prof connecté est bien propriétaire de l'affectation demandée

> ⚠️ À remplacer par une vraie validation JWT/token quand le module auth sera développé.

---

## ⚙️ Mécanismes Clés

### Gestion des Erreurs
Un handler global dans `main.py` intercepte toutes les `AppException` et les transforme en JSON standardisé :
```json
{"error": {"code": "not_found", "detail": "Resource not found"}}
```

Les sous-classes disponibles : `NotFoundError` (404), `UnauthorizedError` (401), `ForbiddenError` (403).

### Gestion des Sessions DB
`get_db()` est une dépendance FastAPI qui :
1. Ouvre une session SQLAlchemy par requête HTTP
2. Fait un **COMMIT** automatique si tout s'est bien passé
3. Fait un **ROLLBACK** automatique en cas d'erreur

### BaseRepository Générique
`BaseRepository[T]` fournit des CRUD prêts à l'emploi pour n'importe quel modèle :
- `get_by_id(uuid)` → retourne l'objet ou `None`
- `list(page, size)` → retourne `(items, total)` pour la pagination
- `create(instance)` → flush en DB sans commit
- `update(instance, **fields)` → mise à jour dynamique par champs
- `delete(instance)` → suppression

### Pagination
`Page[T]` est un schéma générique Pydantic qui encapsule tout résultat de liste :
```json
{"items": [...], "total": 45, "page": 2, "size": 20, "pages": 3}
```

---

## 🧪 Tests

Stratégie de tests **sans pollution** entre tests :
- Chaque test s'exécute dans une **transaction annulée (SAVEPOINT)**
- La base de test (`mesi_backend_test`) n'est jamais modifiée définitivement
- `client` est un `AsyncClient` httpx branché directement sur l'app FastAPI (sans réseau)

Lancer les tests :
```bash
uv run pytest
```

---

## 🔧 Commandes Essentielles

```bash
# Installer les dépendances
uv sync

# Appliquer les migrations (crée les 54 tables)
uv run alembic upgrade head

# Lancer le serveur de développement
uv run uvicorn mesi_backend.main:app --reload

# Vérifier que l'API fonctionne
# GET http://localhost:8000/api/v1/health → {"status": "ok", "database": "ok"}

# Lancer les tests
uv run pytest

# Linter + Formatter
uv run ruff check .
uv run ruff format .

# Nouvelle migration
uv run alembic revision -m "description"
```

---

## 📌 État Actuel du Projet

| Domaine | État |
|---------|------|
| Infrastructure (FastAPI, DB, sessions) | ✅ Complet |
| Schéma de base de données (54 tables) | ✅ Complet |
| Architecture en couches | ✅ Mise en place |
| Endpoint health check | ✅ Fonctionnel |
| Authentification JWT réelle | 🚧 Placeholder (X-User-Id header) |
| Modèles SQLAlchemy (models/) | 🚧 À créer |
| Endpoints métier (users, teachers, etc.) | 🚧 À créer |
| Clients externes (email, paiement) | 🚧 À créer |
| Tâches asynchrones | 🚧 À créer |
| Middlewares | 🚧 À créer |

> Le projet est une **base solide et bien structurée**, prête à être développée fonctionnalité par fonctionnalité.
