
import { initialUserState, UserType } from "./User";


export type AuthUser = {
    user: UserType | null;
    token: string | null;
    loading: boolean;
    error: string | null;
  }
  
 const initialState: AuthUser = {
    user: initialUserState,
    token: localStorage.getItem("token") || null, 
    loading: false,
    error: null,
  };
export default initialState;