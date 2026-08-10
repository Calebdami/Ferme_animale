<!DOCTYPE html>
<html lang="fr" class="dark">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#14120F" />
    <title inertia>{{ config('app.name', 'Ferme Avicole') }}</title>

    <meta name="description" content="{{ $page['props']['seo']['description'] ?? "Élevage avicole spécialisé : poussins, volailles, dépistage sanitaire et accompagnement des éleveurs." }}" />

    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />

    @routes
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="bg-soil-950">
    @inertia
</body>
</html>
