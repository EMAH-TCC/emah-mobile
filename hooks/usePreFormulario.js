import { addCuidador, addPreFormulario } from "../app/idoso/insercaoPreFormulario";
import { getPacienteId, getUser } from "../utils/userData";

export function usePreFormulario(router, dadosPreFormulario, dadosCuidador) {

    async function handleConcluir() {
        try {
            console.log("Oi");

            const user = await getUser();
            console.log("User:", user);

            if (!user) return;

            const paciente_id = await getPacienteId(user.id);
            if (!paciente_id) return;

            const preFormularioId = await addPreFormulario(
                paciente_id,
                dadosPreFormulario
            );

            if (!preFormularioId) return;

            if (dadosPreFormulario.cuidador === true) {
                await addCuidador(
                    paciente_id,
                    dadosCuidador.nomeCuidador,
                    dadosCuidador.telefoneCuidador
                );
            }

            console.log("Enviou pré-formulário");
            router.push("/idoso/menuInicial");

        } catch (error) {
            console.error("Erro ao concluir formulário:", error);
        }
    }

    return { handleConcluir };
}
