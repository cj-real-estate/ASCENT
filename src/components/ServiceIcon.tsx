/*
 * Line icons for the services grid — drawn here, not imported, so the set
 * stays consistent (1.75 stroke, 24px grid, currentColor) and adds zero
 * dependencies. Decorative: every use is aria-hidden.
 */
const PATHS: Record<string, React.ReactNode> = {
  browser: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2" />
      <path d="M3 9h18M6.2 6.8h.01M8.8 6.8h.01" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-5.2-6.5-10a6.5 6.5 0 0 1 13 0c0 4.8-6.5 10-6.5 10Z" />
      <circle cx="12" cy="10.6" r="2.3" />
    </>
  ),
  cursor: (
    <>
      <path d="M5 4.5 18 9.8l-5.4 2.1L10.5 17 5 4.5Z" />
      <path d="m13.6 13 4.7 4.7" />
    </>
  ),
  megaphone: (
    <>
      <path d="M4 10.5v3.6c0 .6.4 1 1 1h1.7l1 4a1 1 0 0 0 1 .8h1a.8.8 0 0 0 .8-1l-.9-3.8 8.9 3V6.5l-13 3.1a1 1 0 0 0-.5.9Z" />
    </>
  ),
  loop: (
    <>
      <path d="M4.5 9.5a7.5 7.5 0 0 1 13.6-2.4M19.5 14.5a7.5 7.5 0 0 1-13.6 2.4" />
      <path d="M18.5 3.5v3.8h-3.8M5.5 20.5v-3.8h3.8" />
    </>
  ),
  phone: (
    <>
      <path d="M5.2 4h3l1.5 3.8-1.9 1.5a12.5 12.5 0 0 0 5.9 5.9l1.5-1.9L19 14.8v3a1.8 1.8 0 0 1-2 1.8C10 18.9 5.1 14 4.4 7a1.8 1.8 0 0 1 .8-3Z" />
    </>
  ),
  stack: (
    <>
      <rect x="4" y="4" width="16" height="5" rx="1.4" />
      <rect x="4" y="11" width="16" height="5" rx="1.4" />
      <path d="M4 19.5h16" />
    </>
  ),
  chart: (
    <>
      <path d="M4 20V4M4 20h16" />
      <path d="M8.5 16v-5M13 16V8M17.5 16v-8.5" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
      <path d="M7.5 13h3.5M7.5 16.5h9" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 5.8v5.3c0 4.3 2.9 7.6 7 9.1 4.1-1.5 7-4.8 7-9.1V5.8L12 3Z" />
      <path d="m9.2 11.8 2 2 3.6-3.8" />
    </>
  ),
};

export function ServiceIcon({ name }: { name: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[name] ?? PATHS.stack}
    </svg>
  );
}

export default ServiceIcon;
