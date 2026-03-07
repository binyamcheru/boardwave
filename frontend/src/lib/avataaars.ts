const AVATAAARS_BASE = 'https://api.dicebear.com/9.x/avataaars/png';

const ALLOWED_AVATAR_HOSTS = [
  'https://api.dicebear.com/9.x/avataaars/',
  'https://api.dicebear.com/8.x/avataaars/',
  'https://avataaars.io/',
];

export function avataaarsUrl(seed: string): string {
  const params = new URLSearchParams({
    seed,
    size: '128',
    backgroundColor: 'b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf',
  });
  return `${AVATAAARS_BASE}?${params.toString()}`;
}

export function randomAvataaarsUrl(): string {
  const seed =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return avataaarsUrl(seed);
}

export function randomAvataaarsGrid(count = 8): string[] {
  return Array.from({ length: count }, () => randomAvataaarsUrl());
}

export function isAllowedAvatarUrl(url: string): boolean {
  return ALLOWED_AVATAR_HOSTS.some((prefix) => url.startsWith(prefix));
}
