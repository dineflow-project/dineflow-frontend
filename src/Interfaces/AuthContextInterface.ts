import { UserInterface  } from "../Interfaces/UserInterface";

export interface AuthContextInterface {
  isAuthenticated?: boolean,
  user?: UserInterface,
  loading?: boolean
}