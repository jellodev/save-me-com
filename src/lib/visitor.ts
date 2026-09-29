const OWN_TRIALS_KEY = "own-trials";
const MAX_OWN_TRIALS = 20;
const REFERRED_KEY = "referred";

function ownTrials(): string[] {
  try {
    const value = JSON.parse(localStorage.getItem(OWN_TRIALS_KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function rememberOwnTrial(token: string) {
  try {
    const trials = [token, ...ownTrials().filter((t) => t !== token)].slice(0, MAX_OWN_TRIALS);
    localStorage.setItem(OWN_TRIALS_KEY, JSON.stringify(trials));
  } catch {}
}

export function isOwnTrial(token: string) {
  return ownTrials().includes(token);
}

export function markReferred() {
  try {
    sessionStorage.setItem(REFERRED_KEY, "1");
  } catch {}
}

export function wasReferred() {
  try {
    return sessionStorage.getItem(REFERRED_KEY) === "1";
  } catch {
    return false;
  }
}
