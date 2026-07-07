import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || null))

    useEffect(()=>{
        if(token){
            const decoded = jwtDecode(token)
            localStorage.setItem('user', JSON.stringify(decoded))
            setUser(decoded)
        }
    }, [token])

    return (
        <AuthContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}