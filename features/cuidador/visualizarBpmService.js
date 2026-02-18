import { supabase } from '../../utils/supabase';

export async function selectUltimoBPM(paciente_id) {
    const { data, error } = await supabase.rpc('selecionar_batimentos_do_paciente', { paciente_id: paciente_id });

    if (error) {
        console.error("Erro ao inserir consulta:", error)
        return null
    }
    return data
}