import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
    const { data, error } = await supabase.from('paciente').select('id').eq('id_user', userId).single()

    if (error) {
        console.log("Erro busca: ", error);
        return null;
    }

    return data.id
}

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

    const idRemedio = Number(params.id);

    async function removerRemedioNoBanco() {
        const user = await getUser();
        if (!user) {
            return
        }

        const pacienteId = await getUserId(user.id)
        if (!pacienteId) {
            return
        }
        const remedio = await deleteRemedio(idRemedio);
        router.push('/idoso/remedios'); // volta para a lista
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

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        height: 60,
        justifyContent: 'center',
        marginBottom: 10,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 10,
    },
    backCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#321904',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        color: '#321904',
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    input: {
        backgroundColor: '#EDE7F6',
        padding: 14,
        borderRadius: 6,
        marginBottom: 16,
        color: '#321904',
        fontSize: 16,
    },
    text: {
        padding: 14,
        color: '#321904',
        fontSize: 16,
    },
    footer: {
        paddingVertical: 20,
        alignItems: 'center',
    },
    button: {
        paddingVertical: 14,
        borderRadius: 6,
        alignItems: 'center',
        marginBottom: 12,
        width: '100%',
        maxWidth: 300,
    },
    primaryButton: {
        backgroundColor: '#F28B0C',
    },
    secondaryButton: {
        backgroundColor: '#FBB65A',
    },
    buttonText: {
        color: '#321904',
        fontWeight: 'bold',
        fontSize: 16,
    },
    radioContainer: { marginTop: 10, alignSelf: 'flex-start' },
    radioOption: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    radioText: { marginLeft: 8, color: '#321904', fontSize: 16 },
    inputTime: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        borderWidth: 1,
        borderColor: "#322323ff",
        padding: 15,
        width: 100,
        textAlign: "center",
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 10,
    },
});
