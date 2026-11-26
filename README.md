# HAPPY SHOPPING — Gestion commerciale

Application web responsive pour la gestion interne de HAPPY SHOPPING à Libreville : produits, inventaire, mouvements de stock, ventes, commandes, devis et prestations, clients, livraisons, fournisseurs et rapports.

## Enregistrement automatique

À la première ouverture dans un navigateur, l'inventaire de référence du 15 février 2026 (45 références, 130 unités) est enregistré automatiquement. Les modifications de produits, stocks, clients, fournisseurs, commandes et devis sont ensuite sauvegardées dans le stockage local du navigateur au fur et à mesure des actions. Les prix non fournis restent à 0 ; aucune vente, aucun client et aucun fournisseur fictifs ne sont ajoutés.

Ces données restent propres à ce navigateur et à cet appareil. Elles ne sont pas encore synchronisées entre appareils et ne sont pas sauvegardées dans le cloud. Effacer les données du navigateur ou désinstaller l'application peut les supprimer. Pour une utilisation réelle sur plusieurs appareils, il faut connecter une base Supabase sécurisée avec authentification, règles RLS et sauvegardes. N'enregistrez pas encore de données client sensibles.

## Démarrer

Le projet ne nécessite ni compilation ni dépendance. Pour tester en local, servez le dossier avec un serveur HTTP, par exemple :

```bash
python3 -m http.server 8000
```

Puis ouvrez `http://localhost:8000`. Les raccourcis WhatsApp ouvrent une conversation préremplie, que l'utilisateur doit vérifier et envoyer lui-même. Les devis peuvent être suivis et imprimés ; l'impression peut être enregistrée en PDF depuis le navigateur.

## Prototype et sécurité

Le dépôt fourni est public. Il ne contient aucun secret ; ne placez jamais de mots de passe ni de clés privées dans le code. L'application n'inclut pas encore d'authentification ou de base de données partagée. La synchronisation cloud Supabase, les sauvegardes serveur, les rôles et les règles RLS sont à réaliser avant toute mise en service avec des données commerciales réelles.
