import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/acoesRemedios';
import { supabase } from '../../utils/supabase';
import { getUser } from '../../utils/userData';

async function deleteRemedio(idRemedio) {
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

export default function RemoverRemedio() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const idRemedio = Number(params.idRemedio);
    const idPaciente = params.idPaciente;
    const id_paciente = Number(idPaciente);

    async function removerRemedioNoBanco() {

        const user = await getUser();
        if (!user) {
            return
        }

        const pacienteId = id_paciente;
        if (!pacienteId) {
            return
        }
        const remedio = await deleteRemedio(idRemedio);

        router.push({
            pathname: '/idoso/remedios',
            params: { id: pacienteId },
        }); // volta para a lista
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <View style={styles.container}>

                    {/* Header com botão de voltar e o titulo */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <View style={styles.backCircle}>
                                <Ionicons name="arrow-back" size={24} color="#321904" />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Remover Remédio</Text>
                    </View>

                    {/* Conteúdo geral */}
                    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                        {/* Botões do final */}
                        <View style={styles.footer}>
                            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={removerRemedioNoBanco}>
                                <Text style={styles.buttonText}>Remover Remédio</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}