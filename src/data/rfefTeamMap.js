// Mapping RFEF team name → local slug del standings.json.
// La RFEF publica noms llargs oficials, el nostre JSON local usa noms curts.
// Aquesta taula ens permet fusionar dades live (RFEF) amb els badges locals.
// Si arriba un nom nou (equip nou o canvi RFEF), es queda sense badge — inofensiu.

export const RFEF_TO_LOCAL = {
  'CD Arnedo': 'CD Arnedo',
  'CD Ebro': 'CD Ebro',
  'CD Tudelano': 'CD Tudelano',
  'CE Manresa': 'CE Manresa',
  'CF Calamocha': 'CF Calamocha',
  'Club Atlético Osasuna "B"': 'CA Osasuna B',
  'FC Barcelona Atlètic': 'Barça Atlètic',
  'Girona FC "B"': 'Girona FC B',
  'Náxara CD': 'Náxara CD',
  'Peña Sport FC': 'Peña Sport FC',
  'RCD Espanyol de Barcelona "B"': 'Espanyol B',
  'Reus FC Reddis': 'Reus FC Reddis',
  'SD Logroñés': 'SD Logroñés',
  'Terrassa FC': 'Terrassa FC',
  'UD Barbastro': 'UD Barbastro',
  'UD Logroñés "B"': 'UD Logroñés B',
  'UE Olot': 'UE Olot',
  'Utebo FC': 'Utebo FC',
};

// Fusiona standings live (RFEF) amb badges + noms curts locals.
export function mergeStandings(liveRows, localRows) {
  const byLocalName = Object.fromEntries(localRows.map(r => [r.team, r]));
  return liveRows.map(live => {
    const localName = RFEF_TO_LOCAL[live.team] || live.team;
    const local = byLocalName[localName] || {};
    return {
      ...live,
      team: localName,
      badge: local.badge || null,
    };
  });
}
