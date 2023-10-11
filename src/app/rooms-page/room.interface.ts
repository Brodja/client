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
	users: any[];
}