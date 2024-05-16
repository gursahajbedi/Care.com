/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext,useEffect } from "react";
import { useReducer } from "react";


export const initialValue={user:null}

export const AuthContext=createContext(initialValue)


export const reducer=(state,action)=>{
    switch(action.type){
        case 'login':
            return {...state,user:action.payload}
        case 'logout':
            return {user:null}
        default:
            return state
    }
}


export const AuthContextProvider=({children})=>{
    const [auth,dispatchs]=useReducer(reducer,initialValue)

    useEffect(()=>{
        const user=JSON.parse(localStorage.getItem("user")) 
        dispatchs({type:"login",payload:user})
    },[dispatchs])

    return (
        <AuthContext.Provider value={{auth,dispatchs}}>
            {children}
        </AuthContext.Provider>
    )
}