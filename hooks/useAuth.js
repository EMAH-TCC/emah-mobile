import { Alert } from 'react-native'
import { supabase } from "../utils/supabase"

export function useAuth() {

    async function signUpEmail({
        email,
        password,
        birthDate,
        phone,
        role,
        name,
        sobrenome,
        setLoading
    }) {
        setLoading(true)
        const {
            data: { user },
            error,
        } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            Alert.alert(error.message)
            setLoading(false)
            return false;
        }

        const [day, month, year] = birthDate.split("/")
        const dataDeNascimentoFormatada = `${year}-${month}-${day}`
        const telefoneLimpo = phone.replace(/\D/g, "")

        const nomeTabela = role === 'idoso' ? "paciente" : "cuidador"

        if (user) {
            const { data: usuarioInserido, error: insertError } =
                await supabase
                    .from(nomeTabela)
                    .insert([
                        {
                            nome: name,
                            sobrenome: sobrenome,
                            telefone: telefoneLimpo,
                            email: email,
                            data_de_nascimento: dataDeNascimentoFormatada,
                            id_user: user.id,
                        },
                    ])
                    .select("id")
                    .single()

            if (insertError) {
                Alert.alert("Erro ao cadastrar usuário.")
                setLoading(false)
                return false;
            }

            const { error: insertError2 } =
                await supabase.from("usuarios").insert([
                    {
                        id: usuarioInserido.id,
                        id_user: user.id,
                        tipo_usuario: nomeTabela,
                    },
                ])

            if (insertError2) {
                Alert.alert("Erro ao cadastrar na tabela usuários.")
            }
        }

        Alert.alert("Cadastro realizado!")
        setLoading(false)
        return true;
    }

    return { signUpEmail }
}
