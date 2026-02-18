import { supabase } from '../../utils/supabase';

export async function verificarCodigoConexao(codigo) {
    const { data, error } = await supabase.rpc('verificar_codigo_conexao', { codigo_inserido: codigo });
    if (data) {
        console.log("Tem dado: ", data);
    }
    if (error) {
        console.error('Erro ao verificar código código:', error);
        return null;
    }
    return data;
}
export async function selectNomeCuidador(userId) {
    const { data, error } = await supabase
        .from('cuidador')
        .select('nome')
        .eq('id', userId)

    if (error) {
        console.error("Erro ao consultar:", error)
        return null
    }

    return data
}

export async function conectarPacienteECuidador(id_paciente, id_cuidador) {
    const { data, error } = await supabase.rpc('conectar_paciente_cuidador', { codigo_paciente_id: id_paciente, codigo_cuidador_id: id_cuidador });

    if (error) {
        console.error('Erro ao conectar usuários:', error);
        return null;
    }
    return data;
}
