import { useContext} from "react";
import { AuthContext } from "../context/authContext.js";
export const useAuth = () => {
  const context= useContext(AuthContext);
  if(context === undefined){
      throw new Error('useAuth must be used with a AuthProvider');
  }
  return context;
};