import { supabase } from "../../utils/supabase";

export async function addQuestionario(
    pacienteId,
    temperatura,
    peso,
    pressaoSistolica,
    pressaoDiastolica,
    remedios,
    notas,
    dataInsercao
) {
    const { data, error } = await supabase
        .from("questionario")
        .insert([
            {
                id_paciente: pacienteId,
                temperatura: Number(temperatura),
                peso: Number(peso),
                pressao_sistolica: Number(pressaoSistolica),
                pressao_diastolica: Number(pressaoDiastolica),
                remedios,
                notas,
                data: dataInsercao,
            },
        ])
        .select();

    if (error) {
        console.error("Erro ao inserir consulta:", error);
        return null;
    }

    return data[0].id;
}

export async function insereQuestionario(dadosQuestionario) {
    const { data, error } = await supabase
        .from("questionario")
        .insert([dadosQuestionario])
        .select("id");

    if (error) throw error;
    return data.id;
}

export async function defineSintoma(nome) {
    let { data, error } = await supabase
        .from("sintoma")
        .select("id")
        .eq("nome", nome)
        .limit(1)
        .single();

    if (error && error.code !== "PGRST116") throw error;

    if (data) return data.id;

    const { data: novoData, error: novoError } = await supabase
        .from("sintoma")
        .insert([{ nome }])
        .select("id")
        .single();

    if (novoError) throw novoError;
    return novoData.id;
}

export async function vinculaSintoma(idQuestionario, idSintoma) {
    const { error } = await supabase
        .from("questionario_sintoma")
        .insert([{ id_questionario: idQuestionario, id_sintoma: idSintoma }]);
    if (error) throw error;
}

export async function defineSentimento(nome) {
    let { data, error } = await supabase
        .from("sentimento")
        .select("id")
        .eq("nome", nome)
        .limit(1)
        .single();

    if (error && error.code !== "PGRST116") throw error;

    if (data) return data.id;

    const { data: novoData, error: novoError } = await supabase
        .from("sentimento")
        .insert([{ nome }])
        .select("id")
        .single();

    if (novoError) throw novoError;
    return novoData.id;
}

export async function vincularSentimento(idQuestionario, idSentimento) {
    const { error } = await supabase
        .from("questionario_sentimento")
        .insert([
            { id_questionario: idQuestionario, id_sentimento: idSentimento },
        ]);
    if (error) throw error;
}

//Relatório

export async function selectQuestionario(pacienteId) {
    const { data: questionarios, error } = await supabase
        .from('questionario')
        .select('id, temperatura, peso, pressao_sistolica, pressao_diastolica, remedios, notas, data')
        .eq('id_paciente', pacienteId)
        .order('data', { ascending: false });

    if (error) {
        console.error("Erro ao buscar questionários:", error);
        return null;
    }

    if (!questionarios || questionarios.length === 0) return [];

    // Buscar sintomas e humores de cada questionário
    const questionariosComDetalhes = await Promise.all(
        questionarios.map(async (q) => {
            // Sintomas
            const { data: sintomasData } = await supabase
                .from("questionario_sintoma")
                .select("sintoma(nome)")
                .eq("id_questionario", q.id);

            // Humores
            const { data: humoresData } = await supabase
                .from("questionario_sentimento")
                .select("sentimento(nome)")
                .eq("id_questionario", q.id);

            return {
                ...q,
                sintomas: sintomasData?.map(s => s.sintoma.nome) || [],
                humores: humoresData?.map(h => h.sentimento.nome) || [],
            };
        })
    );

    return questionariosComDetalhes;
}

export async function selectUltimoBPM(paciente_id) {
    const { data, error } = await supabase.rpc('selecionar_batimentos_do_paciente', { paciente_id: paciente_id });

    if (error) {
        console.error("Erro ao inserir consulta:", error)
        return null
    }
    return data
}

export async function recebeUltimoBpm() {
    try {
        if (!id_paciente) return;

        const frequencia_cardiaca = await selectUltimoBPM(id_paciente);

        if (frequencia_cardiaca) {
            setBpm(frequencia_cardiaca[0].batimento);
            setTime(frequencia_cardiaca[0].data_de_criacao);
        }
    } catch (error) {
        console.log("Erro ao buscar último BPM:", error);
    }
}
