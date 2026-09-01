const MONTHS_CA = ['gen', 'feb', 'març', 'abr', 'maig', 'juny', 'jul', 'ago', 'set', 'oct', 'nov', 'des'];
const MONTHS_CA_LONG = ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'];
const WEEKDAYS_CA = ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'];

export function formatDateShort(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_CA[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateLong(iso) {
  const d = new Date(iso);
  return `${WEEKDAYS_CA[d.getDay()]} ${d.getDate()} de ${MONTHS_CA_LONG[d.getMonth()]}`;
}

export function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function diffParts(targetIso, nowMs = Date.now()) {
  const diff = Math.max(0, new Date(targetIso).getTime() - nowMs);
  const s = Math.floor(diff / 1000);
  return {
    total: diff,
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

export function resultOutcome(match, selfShortName = 'RFCR') {
  if (match.status !== 'played') return null;
  const selfIsHome = match.home.shortName === selfShortName;
  const selfScore = selfIsHome ? match.homeScore : match.awayScore;
  const rivalScore = selfIsHome ? match.awayScore : match.homeScore;
  if (selfScore > rivalScore) return 'win';
  if (selfScore < rivalScore) return 'loss';
  return 'draw';
}
