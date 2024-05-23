<<<<<<< HEAD
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

export default function useAuthContext(){
    return useContext(AuthContext)
=======
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function useAuthContext(){
    return useContext(AuthContext);
>>>>>>> master
}