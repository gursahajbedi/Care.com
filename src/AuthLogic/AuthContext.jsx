import React, { createContext, useEffect, useReducer } from "react";

export const initialValue = { user: null };

export const AuthContext = createContext(initialValue);

export const reducer = (auth, action) => {
    switch(action.type){
        case 'login':
            return { ...auth, user: action.payload };
        case 'logout':
            return { user: null };
        default:
            return auth;
    }
}

export const AuthContextProvider = ({ children }) => {
    const [auth, dispatch] = useReducer(reducer, initialValue);

    useEffect(()=>{
        const user=JSON.parse(localStorage.getItem("user"))
        if(user){
            dispatch({type: 'login', payload: user})
        }
    },[])


    return (
        <AuthContext.Provider value={{auth,dispatch}}>
            {children}
        </AuthContext.Provider>
    );
}