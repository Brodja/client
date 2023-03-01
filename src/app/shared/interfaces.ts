export interface User {
  login?: string;
  email: string;
  password: string;
}

export interface Room {
  id: string;
  name: string;
}

export interface Message {
  message: string;
}