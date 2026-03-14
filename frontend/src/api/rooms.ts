import { API_BASE } from '../config';

export function normalizeRoomCode(code: string): string {
  const trimmed = code.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('room-') ? trimmed : `room-${trimmed}`;
}

export async function joinRoomByCode(token: string, code: string) {
  const res = await fetch(`${API_BASE}/api/rooms/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code: normalizeRoomCode(code) }),
  });

  const data = (await res.json()) as { room?: { code: string }; error?: string };
  if (!res.ok || !data.room) {
    throw new Error(data.error || 'Failed to join room');
  }

  return data.room;
}

export async function updateRoomThumbnail(token: string, roomId: string, thumbnail: string) {
  const res = await fetch(`${API_BASE}/api/rooms/${encodeURIComponent(roomId)}/thumbnail`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ thumbnail }),
  });

  if (!res.ok) {
    throw new Error('Failed to save board thumbnail');
  }
}
