export interface Member {
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
}

export interface LiveParticipant {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface Room {
  id: string;
  code: string;
  title: string;
  updatedAt: string;
  thumbnail?: string | null;
  isLive?: boolean;
  liveCount?: number;
  liveParticipants?: LiveParticipant[];
  members: Member[];
}

export type TabType = 'all' | 'owned' | 'joined';
