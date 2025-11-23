import {object, string, boolean} from 'yup';

const LoginSchema = object({
    username: string()
        .email("Formato de e-mail inválido.")
        .trim()
        .required("E-mail é obrigatório."),
    password: string()
            .trim()
            .required("Senha é obrigatório."),
    keepConnected: boolean(),
});

export default LoginSchema;