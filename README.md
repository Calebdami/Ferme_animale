# Ferme Avicole — Site vitrine (Laravel + Inertia + React)

Application Laravel avec un **seul rôle : administrateur**. L'admin se connecte
pour gérer tous les réglages du site (titres, textes, images, vidéos), le
catalogue de races de poussins/volailles, les activités, la galerie, les
témoignages et les actualités. Tous les autres visiteurs voient uniquement le
site vitrine public (aucune inscription, aucun autre compte possible).

Interface **mobile first**, **mode sombre** par défaut (thème "ferme /
basse-cour" : tons terre, jaune œuf, vert pâturage).

## Stack technique

- Laravel 11 (backend + routes)
- Inertia.js + React 18 (frontend, pas d'API séparée)
- Tailwind CSS (dark mode) — mobile first
- Vite (bundler)
- Base de données : SQLite par défaut (facile à démarrer en local), MySQL/Postgres possibles

## Prérequis à installer sur votre poste

- PHP >= 8.2 avec les extensions habituelles (mbstring, pdo_sqlite, fileinfo, curl, xml…)
- Composer 2
- Node.js >= 18 et npm

## Installation (première fois)

```bash
# 1. Se placer dans le dossier du projet dézippé
cd ferme-avicole

# 2. Installer les dépendances PHP
composer install

# 3. Installer les dépendances JS
npm install

# 4. Copier le fichier d'environnement puis générer la clé d'application
cp .env.example .env
php artisan key:generate

# 5. Créer la base de données SQLite (si vous gardez SQLite, ce qui est recommandé en local)
touch database/database.sqlite

# 6. Lancer les migrations + les données de démonstration
#    (crée le compte admin, les réglages par défaut, les pages, des races
#    de poussins et activités d'exemple à modifier/supprimer ensuite)
php artisan migrate --seed

# 7. Créer le lien symbolique de stockage public (obligatoire pour afficher
#    les images/vidéos uploadées depuis l'admin)
php artisan storage:link
```

### Compte administrateur par défaut

Défini dans `.env` (modifiable avant le `db:seed`, ou changez le mot de passe
ensuite depuis `php artisan tinker`) :

```
ADMIN_EMAIL=admin@ferme-avicole.test
ADMIN_PASSWORD=changeme123
```

Connexion admin : `http://localhost:8000/admin/connexion`

**Changez ce mot de passe avant toute mise en ligne.**

## Démarrer le projet en local

Deux serveurs à lancer en parallèle (deux terminaux), ou un seul avec le script `dev` fourni :

```bash
# Terminal 1 — serveur Laravel
php artisan serve

# Terminal 2 — serveur Vite (hot reload du frontend)
npm run dev
```

Puis ouvrez `http://localhost:8000`.

Astuce : le script `composer.json` fourni par Laravel expose aussi une
commande combinée si vous préférez :

```bash
composer run dev
```

(elle lance en parallèle `php artisan serve`, la queue, les logs et `npm run dev`)

## Build pour la mise en production

```bash
npm run build
```

Puis configurez votre hébergement (Apache/Nginx pointant vers `/public`,
variables `.env` de production, `php artisan migrate --force`,
`php artisan config:cache`, `php artisan storage:link`).

## Ce que l'administrateur peut gérer depuis `/admin`

- **Réglages du site** : nom du site, titre/sous-titre de la bannière
  d'accueil, image et vidéo d'en-tête, chiffres clés, coordonnées de
  contact (téléphone, WhatsApp, e-mail, adresse, horaires, carte), réseaux
  sociaux.
- **Pages** : contenu texte de chaque page (À propos, Races, Activités,
  Locaux, Qualité & biosécurité, FAQ) + image d'illustration + publication.
- **Types de volailles** : catalogue complet (nom, catégorie, origine,
  description, caractéristiques, âges disponibles, tarif, photo,
  disponibilité).
- **Activités** : liste des activités de la ferme (élevage, vente,
  dépistage sanitaire, vaccination, conseil…) avec icône.
- **Médias** : bibliothèque de photos/vidéos organisée par catégorie
  (galerie, locaux, équipe, bannière).
- **Témoignages** : avis clients affichés sur la page d'accueil.
- **Actualités** : articles de blog/annonces (arrivages, événements…).
- **Messages reçus** : messages envoyés depuis le formulaire de contact
  public.

## Structure des pages publiques

`/`, `/a-propos`, `/races-poussins` (+ fiche détail par race),
`/nos-activites`, `/nos-locaux`, `/qualite-biosecurite`, `/galerie`,
`/actualites` (+ détail par article), `/faq`, `/contact`.

## Notes

- Il n'existe volontairement **aucune page d'inscription** : un seul compte
  admin, créé par le seeder. Pour changer l'e-mail/mot de passe plus tard :

  ```bash
  php artisan tinker
  >>> $u = App\Models\User::first();
  >>> $u->update(['email' => 'nouveau@mail.com', 'password' => Hash::make('nouveau-mot-de-passe')]);
  ```

- Les fichiers uploadés (images/vidéos) sont stockés dans
  `storage/app/public` et servis via `public/storage` (lien symbolique créé
  par `php artisan storage:link`).
- Le projet est livré **sans** `vendor/` ni `node_modules/` (à générer via
  `composer install` / `npm install`) afin de garder l'archive légère.
