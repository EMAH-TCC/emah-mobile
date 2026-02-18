import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { conectarPacienteECuidador } from '../../features/cuidador/conexaoComIdosoService';
import { styles } from '../../styles/codigo_e_confirmacao';
import { getUser, getUserId } from "../../utils/userData";

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

