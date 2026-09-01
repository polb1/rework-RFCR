# Live data — API-Football

Integració amb https://www.api-football.com per obtenir marcadors, classificació i partits en temps real.

## 1) Registre a API-Football

1. Ves a https://www.api-football.com/pricing i crea compte gratuït (100 req/dia)
2. Copia la **API Key** del dashboard

## 2) Trobar els IDs (León de Segunda Federación Grup 2 + Reus FCR)

Executa aquests requests amb la teva clau (des de la terminal, Postman o al navegador amb una extensió d'headers):

**A) Buscar la lliga** (Segunda Federación Espanyola):
```
GET https://v3.football.api-sports.io/leagues?country=Spain&search=Segunda%20Federaci
Header: x-apisports-key: <la_teva_clau>
```
Anota el `league.id`. Hi ha diferents grups; el Grup 2 (Catalunya/Aragó/Navarra/La Rioja) sol tenir un ID específic per temporada.

**B) Buscar l'equip**:
```
GET https://v3.football.api-sports.io/teams?search=Reus%20FC%20Reddis
Header: x-apisports-key: <la_teva_clau>
```
Anota el `team.id`.

## 3) Configurar Vercel

A **Vercel → Project → Settings → Environment Variables** afegeix:

| Nom | Valor | Àmbit |
|-----|-------|-------|
| `APIFOOTBALL_KEY` | clau de api-football.com | Production + Preview |
| `APIFOOTBALL_LEAGUE_ID` | ID numèric del grup | Production + Preview |
| `APIFOOTBALL_TEAM_ID` | ID numèric del RFCR | Production + Preview |
| `APIFOOTBALL_SEASON` | any temporada, ex `2026` | Production + Preview |

**Redeploy** perquè s'apliquin.

## 4) Endpoints disponibles

Un cop desplegat:

- `GET /api/live?type=next` → pròxim partit (cached 5 min)
- `GET /api/live?type=last` → últims 5 resultats (cached 5 min)
- `GET /api/live?type=standings` → classificació completa (cached 15 min)
- `GET /api/live?type=live` → partit en directe si n'hi ha, si no `null` (cached 30s)

## 5) Consum de la quota (100 req/dia)

La caché en memòria del lambda + el `s-maxage` HTTP redueixen dramàticament les crides:

| Endpoint | TTL | Cost estimat/dia |
|----------|-----|------------------|
| `next` | 5 min | ~10 req |
| `standings` | 15 min | ~5 req |
| `live` (30s durant 2h partit) | 30s | ~240 req **⚠️** |
| `last` | 5 min | ~5 req |

**⚠️ El polling de `live` cada 30 segons durant un partit consumeix la quota gratuïta ràpidament.** Recomanacions:
- Només activar `useLive('live', ..., 30000)` quan la data del partit sigui *avui* i estigui dins la finestra de +/- 2h
- Per producció seriosa, passar al pla **Pro** ($19/mes = 7.500 req/dia)

## 6) Frontend

Les dades estàtiques (`src/data/matches.json`, `standings.json`) segueixen sent el **fallback**. Els components les utilitzen amb el hook `useLive`:

```jsx
import { useLive } from '../lib/useLive.js';
import matches from '../data/matches.json';

const { data: nextMatch } = useLive('next', matches.find(m => m.status === 'scheduled'));
```

En `vite dev` (local) mai crida `/api/live` — sempre torna el fallback.

## Migració a una altra API

Si algun dia canvies a una altra font, només cal modificar `api/live.js` (les funcions `normalizeFixture` i `normalizeStanding`) per adaptar-les al format nou. La resta del frontend (hooks + components) no s'altera.
