import { BackUser } from "../../shared/interfaces";

export interface ClientRoom {
  name: string;
  password: string;
}

export interface BackRoom {
	id: string;
	name: string;
	password: string | null;
	dateCreate: number;
	initiatorId: string;
	users: string[];
}

export enum RoomUserEvent {
	join = 'join',
	leave = 'leave',
	update = 'update',
}