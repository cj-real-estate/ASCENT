/*
 * Reading credentials out of the environment.
 *
 * Every value here was pasted by hand into a dashboard, so it arrives with
 * the damage that implies: stray whitespace, a trailing newline, a leading
 * "Bearer " copied along with the token, or — worst of all — a name typed in
 * the wrong case. Environment names ARE case-sensitive, so a variable saved
 * as `GHL_API_Token` is a different variable from `GHL_API_TOKEN` and reads
 * as unset. That failure is invisible: nothing errors, the credential simply
 * isn't there, and leads quietly stop arriving. It has already cost this
 * site's GHL integration one round trip; the email leg reads the same way.
 *
 * So: accept the variant, normalise the value, and say loudly enough in the
 * log that the name gets fixed.
 */

/* One warning per misnamed variable per process. readEnv runs on every
 * request — and on every field of the diagnostic — so an un-deduped warning
 * is thousands of identical log lines a day, which is both a cost and a way
 * to bury the lines that matter. */
const casingWarned = new Set<string>();

/** Trimmed value for `name`, falling back to a case-variant of the same name. */
export function readEnv(name: string): string {
  const exact = (process.env[name] ?? "").trim();
  if (exact) return exact;

  const match = Object.keys(process.env).find(
    (key) => key.toLowerCase() === name.toLowerCase(),
  );
  if (!match) return "";
  const value = (process.env[match] ?? "").trim();
  if (value && !casingWarned.has(match)) {
    casingWarned.add(match);
    console.warn(
      `[ENV_CASE] using "${match}" — rename it to "${name}" (names are case-sensitive)`,
    );
  }
  return value;
}

/**
 * Same, for a value used as a bearer token. A pasted "Bearer pit-…" is the
 * common slip; strip the prefix rather than sending "Bearer Bearer …".
 */
export function readSecret(name: string): string {
  return readEnv(name).replace(/^Bearer\s+/i, "");
}

/**
 * Variable NAMES this deployment can see, never values. A boolean can only
 * say "missing"; this says "you named it GHL_API_Token" — which is the whole
 * diagnosis in one line, and safe to expose because a name is not a secret.
 */
export function envNamesMatching(pattern: RegExp): string[] {
  return Object.keys(process.env)
    .filter((key) => pattern.test(key))
    .sort();
}
