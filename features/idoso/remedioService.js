import { supabase } from '../../utils/supabase';

export async function addRemedio(pacienteId, nome, frequencia, dose, horarios) {
    const { data, error } = await supabase
        .from('medicamento')
        .insert([{ id_paciente: pacienteId, nome: nome, frequencia: frequencia, dose: dose, horarios: horarios }])
        .select()

    if (error) {
        console.error("Erro ao inserir consulta:", error)
        return null
    }

    return data
}

export async function updateRemedio(idRemedio, pacienteId, nome, frequencia, dose, horarios) {
    const { data, error } = await supabase
        .from('medicamento')
        .update({ id_paciente: pacienteId, nome: nome, frequencia: frequencia, dose: dose, horarios: horarios })
        .eq('id', idRemedio)

    if (error) {
        console.error("Erro ao atualizar:", error)
        return null
    }

    return data
}


export async function selectRemedios(pacienteId) {
    const { data, error } = await supabase
        .from('medicamento')
        .select('id, nome')
        .eq('id_paciente', pacienteId);

    if (error) {
        console.error("Erro ao inserir consulta:", error)
        return null
    }

    return data
}

export async function deleteRemedio(idRemedio) {
    const { data, error } = await supabase
        .from('medicamento')
        .delete()
        .eq('id', idRemedio)

    if (error) {
        console.error("Erro ao deletar:", error)
        return null
    }

    return data
}