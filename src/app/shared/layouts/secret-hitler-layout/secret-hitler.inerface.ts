export interface IGame {
  gameId: string;
  name: string;
  dateCreate: number;
  initiatorId: string;
  users: IGameUser[];
  voteCounter: number;
  liberalAdoptedLaw: number;
  fascistAdoptedLaws: number;
  veto: boolean;
}

export interface IGameUser {
  id: string;
  login: string;
  globalRole: GlobalRole;
  // socket: Socket;
  // socket: string;
  gameRole: GameRole;
  lastVote?: boolean;
  lastAction?: ILastAction;
  killed?: boolean;
}

export enum GlobalRole {
  liberal = 'liberal',
  fascist = 'fascist',
  hitler = 'hitler',
}

export enum GameRole {
  president = 'president',
  chancellor = 'chancellor',
  candidate_president = 'candidate_president',
  candidate_chancellor = 'candidate_chancellor',
  expresident = 'expresident',
  exchancellor = 'exchancellor',
  free = 'free',
}

export interface ILastAction {
  // event: GameSocketEvent | null;
  dataToSend: any;
}
