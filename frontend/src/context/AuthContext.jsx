
import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();


export function AuthProvider({ children }) {
    const [usuarioLogado, setUsuarioLogado] = useState(null);

   
    useEffect(() => {
        const usuarioSalvo = localStorage.getItem('usuarioPsico');
        if (usuarioSalvo) {
            setUsuarioLogado(JSON.parse(usuarioSalvo));
        }
    }, []);

    
    const loginContext = (dadosUsuario) => {
        setUsuarioLogado(dadosUsuario);
        localStorage.setItem('usuarioPsico', JSON.stringify(dadosUsuario));
    };

   
    const logoutContext = () => {
        setUsuarioLogado(null);
        localStorage.removeItem('usuarioPsico');
    };

    return (
        <AuthContext.Provider value={{ usuarioLogado, loginContext, logoutContext }}>
            {children}
        </AuthContext.Provider>
    );
}