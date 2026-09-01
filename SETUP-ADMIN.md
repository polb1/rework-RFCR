# Panell d'administració — Setup

Backoffice a `/admin` amb Google Sign-In i persistència via commits a GitHub (Vercel redeploya automàticament).

## 1) Google Cloud — crear OAuth Client ID

1. https://console.cloud.google.com/apis/credentials
2. **Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Authorized JavaScript origins:
   - `http://localhost:5173`
   - `https://<domini-vercel>.vercel.app`
   - (i el domini custom que acabis configurant)
5. Copia el **Client ID**

## 2) GitHub — Personal Access Token

1. https://github.com/settings/personal-access-tokens
2. **Generate new token → Fine-grained**
3. Repository access: **només** `polb1/rework-RFCR`
4. Permissions: **Contents → Read and write**
5. Copia el token (només es veu un cop)

## 3) Variables d'entorn a Vercel

A **Project → Settings → Environment Variables**:

| Nom                    | Valor                                 | Àmbit |
|------------------------|---------------------------------------|-------|
| `VITE_GOOGLE_CLIENT_ID`| El Client ID de Google                | Production + Preview |
| `GOOGLE_CLIENT_ID`     | El mateix Client ID                   | Production + Preview |
| `ADMIN_EMAIL`          | `polboleda021@gmail.com`              | Production + Preview |
| `GITHUB_TOKEN`         | El PAT del pas 2                      | Production + Preview |
| `GITHUB_REPO`          | `polb1/rework-RFCR`                   | Production + Preview |
| `GITHUB_BRANCH`        | `main`                                | Production + Preview |

## 4) Local (opcional, per provar el login)

`.env.local`:

```
VITE_GOOGLE_CLIENT_ID=<client id>
```

Nota: el desat via `/api/save` només funciona un cop desplegat a Vercel (les serverless functions no s'executen amb `vite dev`).
Per provar-ho tot en local, `vercel dev` (necessita `npm i -g vercel`).

## 5) Deploy

```bash
git push origin main
```

Vercel auto-desplega. Obre `/admin` i inicia sessió.

## Com afegir un altre editor

1. Crea `src/pages/Admin/editors/XxxEditor.jsx` (copia `NewsEditor.jsx`)
2. Registra'l a `Admin.jsx` (nav + ruta)
3. Al Publicar, es fa POST a `/api/save` amb el nom del fitxer JSON
4. La serverless verifica el login i fa el commit

## Seguretat

- L'ID token es guarda a `sessionStorage` (es perd al tancar la pestanya)
- El servidor verifica el token amb Google i comprova el `aud` i l'email whitelist
- El `GITHUB_TOKEN` viu només al servidor
- Només fitxers `*.json` a `src/data/` es poden modificar
