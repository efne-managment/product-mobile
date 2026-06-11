import { initialValuesUser } from '@/constants/defaultValues';
import { loginFirebase, logoutFirebase, registerFirebase } from '@/firebase/authentication';
import { getProfile } from '@/firebase/users';
import { AuthContextType, loginType, registerType, userType } from '@/types/authentication';
import * as SecureStore from 'expo-secure-store';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from "react";
import { Alert } from "react-native"

const STORAGE_KEYS = {
    keepConnected: 'efne-keepConnected',
    isFirstAccess: 'efne-isFirstAccess',
    legacyIsFirstAccess: 'efne-isFirsAccess',
    legacyUser: 'efne-user',
};

const AuthContext = createContext<AuthContextType>({
    loading: true,
    isAuthenticated: false,
    isFirstAccess: true,
    keepConnected: false,
    user: { username: "", password: "", born: new Date(), gender: "outro", loginId: "", name: "", slug: "responsavel", status: "ativo" },

    login: async () => { },
    register: async () => { },
    forgotPassword: async () => { },
    resetPassword: async () => { },
    logout: async () => { },
    editProfile: async () => { },
})

function AuthProvider({ children }: any) {
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isFirstAccess, setIsFirstAccess] = useState<boolean>(false);
    const [keepConnected, setKeepConnected] = useState<boolean>(false);

    const [user, setUser] = useState<userType>(initialValuesUser);

    const loadStoredData = async (firebaseUser: User) => {
        try {
            const isFirstAccessStored =
                await SecureStore.getItemAsync(STORAGE_KEYS.isFirstAccess) ??
                await SecureStore.getItemAsync(STORAGE_KEYS.legacyIsFirstAccess);
    
            const dataUser = await getProfile();
    
            if (dataUser) {
                setUser({
                    username: dataUser.username ?? "",
                    name: dataUser.name ?? "",
                    gender: dataUser.gender ?? "outro",
                    born: dataUser.born ?? new Date(),
                    status: dataUser.status ?? "ativo",
                    slug: dataUser.slug ?? "responsavel",
                    loginId: firebaseUser.uid,
                });
    
                setIsAuthenticated(true);
                setIsFirstAccess(isFirstAccessStored === "true");
            }
    
        } catch (e) {
            console.error("Erro ao carregar dados armazenados", e);
        }
    }
    
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), async (firebaseUser) => {
            if (firebaseUser) {
                const keepConnectedStored = await SecureStore.getItemAsync(STORAGE_KEYS.keepConnected);
                if (keepConnectedStored === 'true') {
                    setKeepConnected(true);
                    await loadStoredData(firebaseUser);
                } else {
                    setKeepConnected(false);
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        });
    
        return () => unsubscribe();
    }, []);
    
    const login = async ({ username, password, keepConnected }: loginType) => {
        try {
            const user = await loginFirebase(username, password);
            
            if (user) {
                const dataUser = await getProfile();

                if (dataUser) {                    
                    setUser({
                        username,
                        name: dataUser.name ?? "",
                        gender: dataUser.gender ?? "outro",
                        born: dataUser.born ?? new Date(),
                        status: dataUser.status ?? "ativo",
                        slug: dataUser.slug ?? "responsavel",
                        loginId: user.uid,
                    })
                    
                    if (keepConnected) {
                        await SecureStore.setItemAsync(STORAGE_KEYS.keepConnected, 'true');
                        setKeepConnected(true);
                    } else {
                        await SecureStore.deleteItemAsync(STORAGE_KEYS.keepConnected);
                        setKeepConnected(false);
                    }
                    
                    await SecureStore.setItemAsync(STORAGE_KEYS.isFirstAccess, 'false');
                    await SecureStore.deleteItemAsync(STORAGE_KEYS.legacyIsFirstAccess);
                    await SecureStore.deleteItemAsync(STORAGE_KEYS.legacyUser);

                    setIsAuthenticated(true);
                    setIsFirstAccess(false);

                } else {
                    Alert.alert("Login", "Erro ao buscar dados da conta." + dataUser);
                }
            } else {
                Alert.alert("Login", "Erro ao logar na sua conta." + user);
            }
        } catch (e) {
            Alert.alert("Login", "Não foi possível logar. Tente novamente mais tarde.");
            console.error(e)
        }
    }

    const register = async ({ name, born, gender, slug, username, password }: registerType) => {
        try {
            const user = await registerFirebase(username, password);

            if (user) {
                setIsFirstAccess(false);

                await SecureStore.deleteItemAsync(STORAGE_KEYS.legacyUser);
            }
        } catch (e) {
            Alert.alert("Cadastro", "Não foi possível cadastrar. Tente novamente mais tarde.");
        }
    }

    const forgotPassword = async () => {
        try {

        } catch (e) {
            Alert.alert("Esqueci minha senha", "Não foi possível enviar o email. Tente novamente mais tarde.");
        }
    }

    const resetPassword = async () => {
        try {

        } catch (e) {
            Alert.alert("Recuperar minha senha", "Não foi possível recuperar a senha. Tente novamente mais tarde.");
        }
    }

    const logout = async () => {
        try {
            await logoutFirebase();
            setIsAuthenticated(false);
            setKeepConnected(false);
            setUser(initialValuesUser);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.legacyUser);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.keepConnected);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.isFirstAccess);
            await SecureStore.deleteItemAsync(STORAGE_KEYS.legacyIsFirstAccess);
        } catch (e) {
            Alert.alert("Logout", "Não foi possível deslogar. Tente novamente mais tarde.");
        }
    }

    const editProfile = async () => {
        try {

        } catch (e) {
            Alert.alert("Editar perfil", "Não foi possível editar. Tente novamente mais tarde.");
        }
    }

    return (
        <AuthContext.Provider
            value={{
                loading,
                isAuthenticated,
                isFirstAccess,
                keepConnected,
                user,
                login,
                register,
                forgotPassword,
                resetPassword,
                logout,
                editProfile
            }}

        >
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => useContext(AuthContext);

export {AuthProvider, useAuth};
