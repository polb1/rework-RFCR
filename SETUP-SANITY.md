# Setup Sanity + Vercel

## 1. Crear projecte Sanity

```bash
npx sanity@latest login
npx sanity@latest init --create-project "Reus FC Reddis" --dataset production
```

Anota el `projectId` que et dona.

## 2. Configurar variables d'entorn

Crea `.env.local` a la rel del projecte:

```
VITE_SANITY_PROJECT_ID=<el_teu_project_id>
VITE_SANITY_DATASET=production
```

## 3. Autoritzar el domini local pel Studio

A https://sanity.io/manage → el teu projecte → API → CORS origins:
- Afegir `http://localhost:5173` (amb credentials)
- Afegir `https://<el_teu_domini_vercel>.vercel.app` (amb credentials)

## 4. Migrar dades existents

Genera un token amb permisos "Editor" a https://sanity.io/manage → API → Tokens:

```bash
# Bash
export SANITY_AUTH_TOKEN="<token>"
export VITE_SANITY_PROJECT_ID="<id>"
npm run seed

# PowerShell
$env:SANITY_AUTH_TOKEN="<token>"
$env:VITE_SANITY_PROJECT_ID="<id>"
npm run seed
```

Això puja notícies, jugadors, productes, sponsors, directiva i història amb les imatges.

## 5. Provar el Studio localment

```bash
npm run dev
```

Obre http://localhost:5173/studio

## 6. Deploy a Vercel

```bash
npm i -g vercel
vercel
```

O connecta el repo a vercel.com. A **Settings → Environment Variables** afegeix:
- `VITE_SANITY_PROJECT_ID`
- `VITE_SANITY_DATASET` (production)

El `vercel.json` ja té la SPA rewrite configurada.

## Com afegeix el CMS més tipus?

El patró és:
1. Crear schema a `sanity/schemas/<tipus>.js`
2. Registrar-lo a `sanity/schemas/index.js`
3. Crear hook a `src/lib/use<Tipus>.js` que consulta amb `client.fetch(QUERY)` i cau a JSON si Sanity no està configurat
4. Substituir `import data from '../../data/xxx.json'` per `const { data } = useXxx()` a la pàgina

Actualment migrat: **notícies (llistat + detall)**. La resta funciona amb JSON i pot migrar-se gradualment.
