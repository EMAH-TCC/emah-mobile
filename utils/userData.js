import { supabase } from "./supabase";

export async function getUser() {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
        console.log("Erro: ", error);
        return null;
    }

    return data.user;
}

export async function getPacienteId(userId) {
    const { data, error } = await supabase.from('paciente').select('id').eq('id_user', userId).single()

    if (error) {
        console.log("Erro busca: ", error);
        return null;
    }

    return data.id
}


export async function getUserId(userId) {
    const { data, error } = await supabase.from('usuarios').select('id').eq('id_user', userId).single()

    if (error) {
        console.log("Erro busca: ", error);
        return null;
    }

    return data.id
}

export async function selectNomeUser(pacienteId) {
    const { data, error } = await supabase
        .from('paciente')
        .select('nome')
        .eq('id', pacienteId)

    if (error) {
        console.error("Erro ao consultar:", error)
        return null
    }

    return data
}

export async function getTipoUser() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
        return null;
    }

    const { data, error } = await supabase
        .from("usuarios")
        .select("tipo_usuario")
        .eq("id_user", session.user.id)
        .single();

    return data?.tipo_usuario ?? null;
}
