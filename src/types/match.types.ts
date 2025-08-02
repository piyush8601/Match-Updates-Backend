
export enum MatchStatus {
  NOT_STARTED = 'not_started',
  ONGOING = 'ongoing',
  PAUSED = 'paused',
  COMPLETED = 'completed',
}

export interface Team {
  name: string;
  players: string[];
}