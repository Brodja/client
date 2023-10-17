import { BackRoom } from "../rooms-page/room.interface";

export interface User {
  login?: string;
  email: string;
  password: string;
}

export interface Message {
  message: string;
}

export interface BackUser {
  id: string;
  login: string;
  email: string;
  password: string;
  currentRoomId: string | null;
  currentGame: BackRoom | null;
  peerId: string | null;
  localCall: any | undefined;
}
