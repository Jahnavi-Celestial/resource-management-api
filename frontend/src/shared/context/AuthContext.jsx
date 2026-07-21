import { createContext, useEffect, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || null))
    const [permissions, setPermissions] = useState([]);

    useEffect(()=>{
        if(token){
            try{
                const decoded = jwtDecode(token)
                localStorage.setItem('user', JSON.stringify(decoded))
                setUser(decoded)
                setPermissions(decoded.permissions || [])
            }catch(err){
                console.error("Invalid token decoded", err)
                setToken(null)
                setUser(null)
                setPermissions([])
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        }else{
            setPermissions([])
        }
    }, [token])

    const hasPermission = (permissionName) => {
        return permissions.includes(permissionName)
    }

    const contextValue = useMemo(() => ({
        token,
        setToken,
        user,
        setUser,
        permissions,
        hasPermission
    }), [token, setToken, user, permissions, hasPermission]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}