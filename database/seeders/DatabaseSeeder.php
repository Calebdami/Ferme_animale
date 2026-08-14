<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Page;
use App\Models\PoultryType;
use App\Models\Setting;
use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedAdmin();
        $this->seedSettings();
        $this->seedPages();
        $this->seedPoultryTypes();
        $this->seedActivities();
        $this->seedTestimonials();
    }

    private function seedAdmin(): void
    {
        User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'damilarekpanou@gmail.com')],
            [
                'name' => 'Administrateur',
                'password' => Hash::make(env('ADMIN_PASSWORD', '123456789')),
                'email_verified_at' => now(),
            ]
        );
    }

    private function seedSettings(): void
    {
        $settings = [
            ['group' => 'general', 'key' => 'site_name', 'type' => 'text', 'label' => 'Nom du site', 'value' => 'Ferme Avicole'],
            ['group' => 'hero', 'key' => 'hero_title', 'type' => 'text', 'label' => 'Titre principal (accueil)', 'value' => 'Une volaille d’exception, du couvoir jusqu’à votre élevage'],
            ['group' => 'hero', 'key' => 'hero_subtitle', 'type' => 'textarea', 'label' => 'Sous-titre (accueil)', 'value' => 'Élevage spécialisé de poussins et volailles : sélection génétique rigoureuse, dépistage sanitaire systématique et accompagnement des éleveurs.'],
            ['group' => 'hero', 'key' => 'hero_image', 'type' => 'image', 'label' => 'Image d’en-tête', 'value' => null],
            ['group' => 'hero', 'key' => 'hero_video', 'type' => 'video', 'label' => 'Vidéo d’en-tête (optionnelle)', 'value' => null],
            ['group' => 'stats', 'key' => 'stat_years', 'type' => 'text', 'label' => 'Années d’expérience', 'value' => '12'],
            ['group' => 'stats', 'key' => 'stat_races', 'type' => 'text', 'label' => 'Races proposées', 'value' => '15'],
            ['group' => 'stats', 'key' => 'stat_capacity', 'type' => 'text', 'label' => 'Capacité de production / mois', 'value' => '50 000 poussins'],
            ['group' => 'stats', 'key' => 'stat_clients', 'type' => 'text', 'label' => 'Clients servis', 'value' => '800+'],
            ['group' => 'about', 'key' => 'founding_year', 'type' => 'text', 'label' => 'Année de fondation', 'value' => '2013'],
            ['group' => 'about', 'key' => 'team_size', 'type' => 'text', 'label' => 'Taille de l’équipe', 'value' => '18'],
            ['group' => 'about', 'key' => 'farm_area', 'type' => 'text', 'label' => 'Superficie exploitée', 'value' => '4,5 hectares'],
            ['group' => 'contact', 'key' => 'contact_phone', 'type' => 'text', 'label' => 'Téléphone', 'value' => '+229 00 00 00 00'],
            ['group' => 'contact', 'key' => 'contact_whatsapp', 'type' => 'text', 'label' => 'WhatsApp', 'value' => '+229 00 00 00 00'],
            ['group' => 'contact', 'key' => 'contact_email', 'type' => 'text', 'label' => 'E-mail', 'value' => 'contact@ferme-avicole.test'],
            ['group' => 'contact', 'key' => 'contact_address', 'type' => 'textarea', 'label' => 'Adresse', 'value' => 'Route de la ferme, Cotonou, Bénin'],
            ['group' => 'contact', 'key' => 'contact_hours', 'type' => 'textarea', 'label' => 'Horaires', 'value' => 'Lun–Sam : 7h30–18h00'],
            ['group' => 'contact', 'key' => 'map_embed_url', 'type' => 'text', 'label' => 'URL carte (Google Maps embed)', 'value' => null],
            ['group' => 'social', 'key' => 'social_facebook', 'type' => 'text', 'label' => 'Facebook', 'value' => null],
            ['group' => 'social', 'key' => 'social_instagram', 'type' => 'text', 'label' => 'Instagram', 'value' => null],
            ['group' => 'social', 'key' => 'social_whatsapp', 'type' => 'text', 'label' => 'Lien WhatsApp', 'value' => null],
        ];

        foreach ($settings as $setting) {
            Setting::firstOrCreate(['key' => $setting['key']], $setting);
        }
    }

    private function seedPages(): void
    {
        $pages = [
            [
                'slug' => 'a-propos',
                'title' => 'Qui sommes-nous',
                'subtitle' => 'Notre histoire, nos valeurs, notre équipe',
                'content' => "Fondée pour répondre aux besoins des éleveurs locaux, notre ferme s'est spécialisée exclusivement dans la volaille : sélection génétique, incubation, dépistage sanitaire et accompagnement technique.\n\nModifiez ce texte depuis l'espace admin pour raconter votre propre histoire.",
                'meta_description' => 'Découvrez l’histoire, les valeurs et l’équipe de notre ferme avicole.',
            ],
            [
                'slug' => 'races-poussins',
                'title' => 'Nos races de poussins et volailles',
                'subtitle' => 'Poussins de chair, pondeuses, reproducteurs et races locales',
                'content' => "Retrouvez ici l'ensemble des races disponibles, avec leurs caractéristiques et leur disponibilité.",
                'meta_description' => 'Catalogue des races de poussins et volailles disponibles à la vente.',
            ],
            [
                'slug' => 'nos-activites',
                'title' => 'Nos activités',
                'subtitle' => 'De l’élevage au dépistage sanitaire',
                'content' => "Élevage, vente, dépistage sanitaire, vaccination et accompagnement technique : découvrez l'ensemble de nos activités.",
                'meta_description' => 'Les activités de notre ferme avicole : élevage, vente, dépistage sanitaire, conseil.',
            ],
            [
                'slug' => 'nos-locaux',
                'title' => 'Nos installations',
                'subtitle' => 'Poulaillers, couvoir, zone de quarantaine',
                'content' => "Présentation de nos infrastructures et de nos mesures de biosécurité.",
                'meta_description' => 'Découvrez les installations et infrastructures de notre ferme avicole.',
            ],
            [
                'slug' => 'qualite-biosecurite',
                'title' => 'Qualité, sanitaire et biosécurité',
                'subtitle' => 'Notre engagement pour une volaille saine',
                'content' => "Nos protocoles sanitaires, nos partenariats vétérinaires et nos normes de traçabilité.",
                'meta_description' => 'Nos protocoles qualité, sanitaires et de biosécurité.',
            ],
            [
                'slug' => 'faq',
                'title' => 'Questions fréquentes',
                'subtitle' => 'Tout ce qu’il faut savoir avant de commander',
                'content' => "Ajoutez ici vos questions fréquentes depuis l'espace admin.",
                'meta_description' => 'Réponses aux questions fréquentes sur nos poussins et volailles.',
            ],
        ];

        foreach ($pages as $page) {
            Page::firstOrCreate(['slug' => $page['slug']], $page);
        }
    }

    private function seedPoultryTypes(): void
    {
        $types = [
            ['name' => 'Poussin chair standard', 'category' => 'chair', 'origin' => 'Souche importée sélectionnée', 'description' => 'Croissance rapide, idéal pour la production de poulets de chair.', 'characteristics' => 'Poids adulte élevé, bon indice de consommation.', 'available_ages' => '1 jour, démarré 2 semaines', 'price' => 'Sur devis'],
            ['name' => 'Poussin pondeuse', 'category' => 'ponte', 'origin' => 'Souche pondeuse performante', 'description' => 'Excellente productivité en œufs sur le long terme.', 'characteristics' => 'Ponte précoce, forte persistance de ponte.', 'available_ages' => '1 jour, prêt à pondre', 'price' => 'Sur devis'],
            ['name' => 'Poussin race locale rustique', 'category' => 'autre', 'origin' => 'Sélection locale', 'description' => 'Race rustique adaptée au climat local, bonne résistance.', 'characteristics' => 'Résistance élevée aux maladies, croissance modérée.', 'available_ages' => '1 jour, démarré 3 semaines', 'price' => 'Sur devis'],
            ['name' => 'Reproducteurs', 'category' => 'reproducteur', 'origin' => 'Lignée sélectionnée', 'description' => 'Sujets destinés à la reproduction et à l’amélioration génétique.', 'characteristics' => 'Sélection génétique rigoureuse, suivi sanitaire renforcé.', 'available_ages' => 'Sur réservation', 'price' => 'Sur devis'],
            ['name' => 'Pintades', 'category' => 'pintade', 'origin' => 'Élevage local', 'description' => 'Volaille rustique très demandée pour sa chair.', 'characteristics' => 'Bonne résistance, croissance modérée.', 'available_ages' => '1 jour, démarré', 'price' => 'Sur devis'],
        ];

        foreach ($types as $i => $type) {
            PoultryType::firstOrCreate(
                ['slug' => Str::slug($type['name']).'-'.($i + 1)],
                $type + ['position' => $i, 'is_available' => true]
            );
        }
    }

    private function seedActivities(): void
    {
        $activities = [
            ['title' => 'Élevage et production', 'icon' => 'feather', 'description' => 'Du couvoir à la vente, un suivi rigoureux à chaque étape de croissance.'],
            ['title' => 'Vente de poussins et volailles', 'icon' => 'shopping-bag', 'description' => 'Commande, réservation et livraison selon vos besoins.'],
            ['title' => 'Dépistage sanitaire', 'icon' => 'shield-check', 'description' => 'Contrôles vétérinaires réguliers pour garantir un cheptel sain.'],
            ['title' => 'Vaccination', 'icon' => 'syringe', 'description' => 'Protocoles vaccinaux adaptés à chaque catégorie de volaille.'],
            ['title' => 'Conseil et accompagnement', 'icon' => 'chat', 'description' => 'Appui technique aux éleveurs, débutants comme confirmés.'],
        ];

        foreach ($activities as $i => $activity) {
            Activity::firstOrCreate(['title' => $activity['title']], $activity + ['position' => $i, 'is_published' => true]);
        }
    }

    private function seedTestimonials(): void
    {
        $testimonials = [
            ['author_name' => 'Éleveur partenaire', 'author_role' => 'Client depuis 3 ans', 'content' => 'Des poussins toujours en bonne santé et un suivi sérieux après la vente.', 'rating' => 5],
            ['author_name' => 'Coopérative agricole', 'author_role' => 'Client institutionnel', 'content' => 'Un accompagnement technique précieux pour nos membres éleveurs.', 'rating' => 5],
        ];

        foreach ($testimonials as $testimonial) {
            Testimonial::firstOrCreate(['author_name' => $testimonial['author_name']], $testimonial + ['is_published' => true]);
        }
    }
}
