
export type userType = {
    name: string,
    gender: "feminino" | "masculino" | "outro",
    username: string,
    password?: string,
    born: Date,
    status: "ativo" | "inativo",
    slug: "master" | "administrador" | "treinador" | "responsavel",
    loginId: string
}

export type loginType = {
    username: string,
    password: string,
    keepConnected: boolean,
}

export type registerType = {
    name: string,
    born: string,
    gender: string,
    slug: string,
    username: string,
    password: string,
}

export type AuthContextType = {
    loading: boolean,
    isAuthenticated: boolean,
    isFirstAccess: boolean,
    keepConnected: boolean,

    user: userType,

    login: ({ }: loginType) => Promise<void>,
    register: ({ }: registerType) => Promise<void>,
    forgotPassword: (username: string) => Promise<void>,
    resetPassword: (username: string, password: string, passwordConfirm: string) => Promise<void>,
    logout: () => Promise<void>,
    editProfile: () => Promise<void>,
}

export type GenderType = {
    value: string,
    label: string,
}