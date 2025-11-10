import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../utils/supabase';

async function getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.log("Erro: ", error);
        return null;
    }

    return data.user;
}

async function getUserId(userId) {
    const { data, error } = await supabase.from('usuarios').select('id').eq('id_user', userId).single()

    if (error) {
        console.log("Erro busca: ", error);
        return null;
    }

    return data.id
}

async function conectarPacienteECuidador(id_paciente, id_cuidador) {
    const { data, error } = await supabase.rpc('conectar_paciente_cuidador', { codigo_paciente_id: id_paciente, codigo_cuidador_id: id_cuidador });

    if (error) {
        console.error('Erro ao conectar usuários:', error);
        return null;
    }
    return data;
}
async function selectNomeCuidador(userId) {
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
export default function ConfirmacaoIdoso() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const nome_paciente = params.nome_paciente
    const id_paciente = params.id_paciente

    const [codigo, setCodigo] = useState('');
    const [erro, setErro] = useState(false);
    const idPaciente = Number(id_paciente);

    async function conectar_Paciente_Cuidador() {
        const user = await getUser();
        if (!user) {
            return
        }
        const userId = await getUserId(user.id)
        if (!userId) {
            return
        }
        const conexaoPacienteCuidador = await conectarPacienteECuidador(idPaciente, userId);
        if (!conexaoPacienteCuidador) {
            setErro(true);
            console.log('A conexão não foi bem-sucedida');
            router.push({
                pathname: '/cuidador/erroAdicionarIdoso',
                params: { nome: nome_paciente },
            });
        }
        else {
            console.log(conexaoPacienteCuidador);
            router.push({
                pathname: '/cuidador/idosoAdicionado',
                params: { nome: nome_paciente },
            });
        }
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.container}>

                        {/* Botão de voltar */}
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#321904" />
                        </TouchableOpacity>

                        {/* Texto */}
                        <View style={styles.content}>
                            <Text style={styles.infoText}>
                                O idoso com esse código é: {nome_paciente}</Text>
                            <Text style={styles.infoText}>
                                Deseja adicioná-lo como seu paciente?
                            </Text>
                        </View>

                        {/* Botão para confirmar */}
                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[styles.button, styles.primaryButton]}
                                onPress={conectar_Paciente_Cuidador}
                            >
                                <Text style={styles.buttonText}>Sim</Text>
                            </TouchableOpacity>
                            <Text></Text>
                            <TouchableOpacity
                                style={[styles.button, styles.primaryButton]}
                                onPress={() => router.back()}
                            >
                                <Text style={styles.buttonText}>Não, obrigada</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Estilos
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    backButton: {
        alignSelf: 'flex-start',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#321904',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    content: {
        alignItems: 'center',
        marginBottom: 50,
        marginTop: 100,
    },
    infoText: {
        color: '#321904',
        fontSize: 22,
        textAlign: 'center',
        marginBottom: 25,
        fontWeight: '500',
        maxWidth: 320,
        lineHeight: 30,
    },
    input: {
        backgroundColor: '#f7eee5ff',
        color: '#321904',
        fontSize: 20,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 6,
        textAlign: 'center',
        width: '100%',
        maxWidth: 300,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    inputError: {
        color: 'red',
    },
    footer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 16,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        width: '100%',
        maxWidth: 300,
    },
    primaryButton: {
        backgroundColor: '#F28B0C',
    },
    buttonText: {
        color: '#321904',
        fontWeight: 'bold',
        fontSize: 20,
    },
});
