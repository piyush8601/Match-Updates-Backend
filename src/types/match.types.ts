export enum EventType {
  RUN = 'run',
  WICKET = 'wicket',
  WIDE = 'wide',
  NO_BALL = 'no_ball',
  BYE = 'bye',
  LEG_BYE = 'leg_bye',
  DOT = 'dot',
  FOUR = 'four',
  SIX = 'six',
}

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