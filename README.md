# Récolte

Audit de sécurité informatique — simulation de connexions réseaux (TikTok, Instagram, Snapchat, Microsoft) avec espace admin.

Les saisies des visiteurs sont envoyées au serveur (fichier JSON via Vercel Blob) et visibles dans l’admin depuis n’importe quel appareil.

## Admin

- URL : `/admin/login`
- Utilisateur : `redouane`
- Mot de passe : `Luffylepiratedu84000`

## Dev local

```bash
npm install
npm run dev
```

En local sans `vercel dev`, l’admin utilise le `localStorage` du navigateur en secours.

## Déploiement Vercel

1. Connecter le dépôt Git à Vercel.
2. **Storage → Blob → Create → Connect to project** (génère `BLOB_READ_WRITE_TOKEN`).
3. Redéployer le projet.

Sans Blob connecté, les captures ne sont pas centralisées en production.

## Build

```bash
npm run build
npm run preview
```
