import { supabase } from '../../utils/supabase';

export async function criarCodigo(pacienteId) {
    const { data, error } = await supabase.rpc('criar_codigo_conexao', { codigo_paciente_id: pacienteId });

    if (error) {
        console.error('Erro ao gerar código:', error);
        return null;
    }
    return data;
}

export async function selectCuidadores(paciente_id) {
    const { data, error } = await supabase.rpc('selecionar_cuidadores_do_paciente', { paciente_id: paciente_id });

    if (error) {
        console.error("Erro ao inserir consulta:", error)
        return null
    }

    return data
}