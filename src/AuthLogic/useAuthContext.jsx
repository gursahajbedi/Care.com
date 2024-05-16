import { AuthContext } from "./AuthContext";
import { useContext } from "react";

export default function useAuthContext(){
    return useContext(AuthContext)
}