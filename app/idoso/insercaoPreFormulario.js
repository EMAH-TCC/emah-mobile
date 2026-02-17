import { supabase } from "../../utils/supabase";

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
