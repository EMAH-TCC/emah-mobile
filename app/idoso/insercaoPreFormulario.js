import { supabase } from "../../utils/supabase";

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

export async function addPreFormulario(pacienteId, dados) {
    const { data, error } = await supabase
        .from("pre_formulario")
        .insert([
            {
                id_paciente: pacienteId,
                ...dados,
            },
        ])
        .select();

    if (error) {
        console.error("Erro ao inserir pré-formulário:", error);
        return null;
    }

    return data[0].id;
}

export async function addCuidador(pacienteId, nome, telefone) {
    const { error } = await supabase.from("cuidador_contato").insert([
        {
            id_paciente: pacienteId,
            nome_cuidador: nome,
            telefone_cuidador: telefone,
        },
    ]);

    if (error) {
        console.error("Erro ao inserir cuidador:", error);
    }
}
