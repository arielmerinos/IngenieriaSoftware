// src/contexts/AuthContext.tsx
import React, {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from "react";

// Define la estructura de la información del usuario
interface User {
    id: number;
    username: string;
    name: string;
    access: string;
    refresh: string;
}

// Define la interfaz para el contexto de autenticación
interface AuthContextData {
    isAuthenticated: boolean;
    user: User | null;
    authToken: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    register: (
        username: string,
        password: string,
        name: string
    ) => Promise<boolean>;
    logout: () => void;
}

// Crea el contexto con un valor inicial undefined
const AuthContext = createContext<AuthContextData | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}


export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [authToken, setAuthToken] = useState<string | null>(
        localStorage.getItem("authToken")
    );

    useEffect(() => {
        fetch('http://localhost:8000/api/auth/tokens/', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los tokens');
                }
                return response.json();
            })
            .then(data => {
                console.log(data)
                setAuthToken(data.access_token);
            })
            .catch(err => {
                console.error(err);
            });
    }, []);

    const isAuthenticated = !!authToken;

    const fetchUserData = async (token: string) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/api/user/`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
            } else {
                console.error("Error al obtener datos del usuario:", await response.json());
                setUser(null);
            }
        } catch (error) {
            console.error("Error de conexión al obtener usuario:", error);
            setUser(null);
        }
    };

    // Opcional: cargar datos del usuario al iniciar o cuando cambia el token
    useEffect(() => {
        if (authToken) {
            fetchUserData(authToken)
        }
    }, [authToken]);

    useEffect(() => {
        console.log("Usuario actualizado:", user);
    }, [user]); // Se ejecutará cuando `user` cambie

    // Función para iniciar sesión
    const login = async (
        username: string,
        password: string
    ): Promise<boolean> => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
                }/api/token/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("authToken", data.token);
                setAuthToken(data.token);
                // Opcional: cargar información del usuario y almacenarla en el estado
                // setUser({ id: 1, username, name: 'Nombre de Usuario' });
                return true;
            } else {
                console.error("Error en login", await response.json());
                return false;
            }
        } catch (error) {
            console.error("Error de conexión en login:", error);
            return false;
        }
    };

    // Función para registrar usuario
    const register = async (
        username: string,
        password: string,
        name: string
    ): Promise<boolean> => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
                }/api/user/register/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password, name }),
                }
            );
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("authToken", data.token);
                setAuthToken(data.token);
                localStorage.setItem("username", username); // Guardar el nombre de usuario en localStorag
                setUser({ id: data.id, username, name, access: data.access, refresh: data.refresh });
                setAuthToken(data.access);
                localStorage.setItem("authToken", data.access);
                console.log("Usuario registrado:", user);
                return true;
            } else {
                console.error("Error en registro", await response.json());
                return false;
            }
        } catch (error) {
            console.error("Error de conexión en registro:", error);
            console.log(error);
            return false;
        }
    };

    // Función para cerrar sesión
    const logout = () => {
        localStorage.removeItem("authToken");
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, user, authToken, login, register, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe usarse dentro de un AuthProvider");
    }
    return context;
};
