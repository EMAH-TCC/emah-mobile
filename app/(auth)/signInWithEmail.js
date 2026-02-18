import { supabase } from '../../utils/supabase';

export function validateLogin({ email, password }) {
    const errors = {
        login: !email.trim(),
        password: !password.trim(),
    };

    if (errors.login || errors.password) {
        return {
            valid: false,
            errors,
            message: 'Preencha todos os campos.',
        };
    }

    return { valid: true, errors: {} };
}


export async function signInWithEmail({ email, password }) {

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { success: false, message: error.message };
    }

    const user = data?.user;

    if (!user) {
        return { success: false, message: "Usuário não encontrado." };
    }

    const { data: tipoData, error: tipoError } = await supabase
        .from("usuarios")
        .select("tipo_usuario")
        .eq("id_user", user.id)
        .single();

    if (tipoError) {
        return { success: false, message: "Erro ao buscar tipo de usuário." };
    }

    return {
        success: true,
        tipo_usuario: tipoData.tipo_usuario,
    };
}
