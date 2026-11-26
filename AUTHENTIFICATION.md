# Connexion Google et sauvegarde cloud

L’application sait se connecter avec Google via Supabase Auth et synchroniser automatiquement les données de gestion et devis dans une ligne privée par compte. **Elle ne peut toutefois pas se connecter avant d’avoir été configurée pour le projet Supabase du propriétaire.** Aucun identifiant OAuth ni secret ne doit être ajouté au dépôt.

## Configuration requise par le propriétaire

1. Créez un projet Supabase et exécutez le script `supabase/schema.sql` dans le SQL Editor.
2. Dans Supabase, activez Google dans **Authentication → Providers → Google**. Configurez les identifiants OAuth dans Supabase/Google Cloud et autorisez l’URL de rappel affichée par Supabase. N’inscrivez jamais le secret OAuth dans les fichiers de l’application.
3. Dans Supabase **Authentication → URL Configuration**, définissez la Site URL de l’application publiée et ajoutez ses URL exactes à la liste Redirect URLs.
4. Renseignez l’URL du projet et sa clé publique `anon`/`publishable` dans `supabase-config.js`. N’utilisez jamais la clé `service_role` dans le navigateur ou dans GitHub.
5. Publiez/rechargez l’application en HTTPS. Connectez-vous avec Google. Lors de la première connexion, les données locales existantes sont importées si le compte cloud est vide ; ensuite les données sont synchronisées automatiquement.

## Comportement et limites

- La connexion Google est gérée par Supabase Auth ; le compte utilisateur Supabase est associé à l’identité Google.
- Les données sont sauvegardées dans `public.app_data`, dont les règles RLS limitent l’accès à `auth.uid() = user_id`.
- Les données de gestion principales et les devis sont synchronisés ensemble. Une seule ligne JSON par compte est utilisée pour cette version du prototype.
- En première connexion, le contenu local du navigateur est importé seulement si aucune sauvegarde n’existe pour ce compte. Une sauvegarde cloud déjà existante remplace la copie locale de l’appareil.
- La synchronisation automatique exige une connexion réseau. Le stockage local sert de cache ; il ne remplace pas une sauvegarde Supabase.
- Les accès Google ne sont pas automatiquement limités à une seule adresse. Configurez une restriction d’utilisateurs autorisés dans Supabase avant de déployer pour le personnel.
- La clé publique Supabase est visible dans l’application par conception ; la sécurité repose sur Auth et RLS. Ne publiez pas de clé secrète/service-role.

Consultez également le guide de mise en service dans le dépôt. La configuration Supabase et Google doit être terminée avant que l’écran de connexion puisse fonctionner.
