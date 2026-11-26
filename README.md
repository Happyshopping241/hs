# HAPPY SHOPPING — Gestion commerciale

Application web responsive, en français, pour le suivi interne des produits, stocks, ventes, commandes, clients, livraisons, fournisseurs et indicateurs de gestion de HAPPY SHOPPING (Libreville, Gabon). Devise : FCFA. L’interface est installable comme PWA.

## Démarrer

Le projet ne nécessite ni compilation ni dépendance. Pour tester en local, servez le dossier avec un serveur HTTP, par exemple :

```bash
python3 -m http.server 8000
```

Puis ouvrez `http://localhost:8000`. Les données de démonstration sont enregistrées dans le stockage local du navigateur. Les raccourcis WhatsApp ouvrent une conversation préremplie, que l’utilisateur doit vérifier et envoyer lui-même.

## Important — version prototype

Cette première version est un prototype front-end fonctionnel, pas encore un système de gestion sécurisé prêt pour des données réelles. Elle ne contient pas d’authentification, de base de données partagée, de règles RLS Supabase ni de sauvegardes. Les données de gestion sont stockées dans le navigateur et ne se synchronisent pas entre appareils. N’y saisissez pas de véritables coordonnées clients, informations commerciales sensibles ou mots de passe.

Le dépôt fourni est public. Le code source ne contient aucun secret ; les clés privées et mots de passe ne doivent jamais être ajoutés au dépôt. Avant toute mise en service réelle, il faut notamment :

1. Décider si le code doit rester public ou être transféré dans un dépôt privé.
2. Mettre en place Supabase Auth et des politiques RLS strictes pour chaque table.
3. Migrer les données vers une base partagée, valider les opérations de stock côté serveur et tester les rôles.
4. Configurer les sauvegardes, les secrets de déploiement et les procédures de restauration.
5. Tester sur mobile et ordinateur avant d’utiliser des informations réelles.

## Modules présents

- Tableau de bord et alertes de stock.
- Catalogue produit : ajout, modification, recherche et seuil d’alerte.
- Mouvements de stock : entrées, sorties et historique.
- Commandes/ventes : saisie, suivi de statut, paiements manuels et ajustement du stock.
- Fiches clients et fournisseurs, raccourcis WhatsApp.
- Suivi des livraisons à Libreville.
- Rapports simples et export CSV.
- Paramètres de boutique et expérience PWA avec cache de l’interface.

Les données initiales sont fictives et servent uniquement à la démonstration. La gestion des paiements est manuelle ; aucune transaction n’est initiée par l’application.
