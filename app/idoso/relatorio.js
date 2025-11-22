import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

async function selectQuestionario(pacienteId) {
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

async function selectUltimoBPM(paciente_id) {
    const { data, error } = await supabase.rpc('selecionar_batimentos_do_paciente', { paciente_id: paciente_id });

    if (error) {
        console.error("Erro ao inserir consulta:", error)
        return null
    }
    return data
}

async function recebeUltimoBpm() {
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



export default function Relatorio() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const idPaciente = params.id;
    const id_paciente = Number(idPaciente);
    const [questionarios, setQuestionarios] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedRemedio, setSelectedRemedio] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
    const [bpm, setBpm] = useState(null);
    const [time, setTime] = useState(null);

    useEffect(() => {
        async function carregarRelatorios() {
            const user = await getUser();
            if (!user) {
                return
            }
            const pacienteId = id_paciente;
            if (!pacienteId) {
                return
            }
            const dados = await selectQuestionario(pacienteId);
            if (dados) {
                setQuestionarios(dados);
            }
        }
        carregarRelatorios();
    }, []);


    async function recebeUltimoBpm() {
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

    useEffect(() => {
        recebeUltimoBpm();
    }, [id_paciente]);
    const date = new Date(time);
    const formatDate = (time) => {
        if (!time) return '--/--/----';
        const date = new Date(time);
        if (isNaN(date.getTime())) return '--/--/----';
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const formatTime = (time) => {
        if (!time) return '--:--';
        const date = new Date(time);
        if (isNaN(date.getTime())) return '--:--';
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const abrirMenu = (item, event) => {
        const { pageY } = event.nativeEvent;
        setMenuPosition({ top: pageY - 20, right: 40 });
        setSelectedRemedio(item);
        setModalVisible(true);
    };

    const fecharMenu = () => {
        setModalVisible(false);
        setSelectedRemedio(null);
    };

    const removerRemedio = () => {
        if (selectedRemedio) {
            router.push({
                pathname: '/idoso/removerRemedio',
                params: selectedRemedio,
            });
            fecharMenu();
        }
    };

    const alterarDados = () => {
        if (selectedRemedio) {
            router.push({
                pathname: '/idoso/editarRemedio',
                params: selectedRemedio,
            });
            fecharMenu();
        }
    };

    const formatarData = (dataRecebida) => {
        const dataFormatada = new Date(dataRecebida);
        return dataFormatada.toLocaleDateString("pt-BR")
    }

    const formatarRemedios = (remedios) => {
        const remediosListados = JSON.parse(remedios)
        remediosListados.map(remedio => remedio.trim()).join(", ");
        return remediosListados;
    }

    const renderQuestionario = ({ item }) => (
        <View style={styles.card}>
            <Text style={styles.cardText}>Questionário do dia : {formatarData(item.data)}</Text>
            <Text style={styles.cardText}>Temperatura: {item.temperatura} °C</Text>
            <Text style={styles.cardText}>Peso: {item.peso}Kg</Text>
            <Text style={styles.cardText}>Pressão: {item.pressao_sistolica}</Text>
            <View style={styles.barraHorizontal}></View>
            <Text style={styles.cardTextPressao}>{item.pressao_diastolica}</Text>
            <Text style={styles.cardText}>Remédios: {formatarRemedios(item.remedios)}</Text>


            <Text style={styles.cardText}>Sintomas:</Text>
            {item.sintomas.length > 0
                ? item.sintomas.map((s, i) => <Text key={i} style={styles.cardText}>- {s}</Text>)
                : <Text style={styles.cardText}>Nenhum</Text>
            }

            <Text style={styles.cardText}>Humores:</Text>
            {item.humores.length > 0
                ? item.humores.map((h, i) => <Text key={i} style={styles.cardText}>- {h}</Text>)
                : <Text style={styles.cardText}>Nenhum</Text>
            }

            <Text style={styles.cardText}>Notas: {item.notas}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.container}>

                        {/* Header com botão de voltar e o titulo */}
                        <View style={styles.header}>
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                <View style={styles.backCircle}>
                                    <Ionicons name="arrow-back" size={24} color="#321904" />
                                </View>
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Relatório</Text>
                        </View>

                        {/* lista de questionarios */}
                        <FlatList
                            data={questionarios}
                            keyExtractor={(item) => item.id}
                            renderItem={renderQuestionario}
                            ListEmptyComponent={<Text>Questionários não encontrados</Text>}
                            contentContainerStyle={styles.listContent}
                            scrollEnabled={false}
                        />

                    </View>
                </ScrollView>

                {/* menu suspenso */}
                <Modal
                    transparent={true}
                    visible={modalVisible}
                    animationType="fade"
                    onRequestClose={fecharMenu}
                >
                    <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={fecharMenu}>
                        <View style={[styles.menuContainer, { top: menuPosition.top, right: menuPosition.right }]}>
                            <TouchableOpacity style={styles.menuItem} onPress={removerRemedio}>
                                <Text style={styles.menuText}>Remover relatório</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuItem} onPress={alterarDados}>
                                <Text style={styles.menuText}>Alterar dados</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// Estilos
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { flexGrow: 1 },
    container: { flex: 1, paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'flex-start' },

    header: {
        height: 60,
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
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
        top: 10,
    },
    headerTitle: {
        fontSize: 25,
        color: '#321904',
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
        top: 10,
    },

    listContent: { paddingBottom: 20 },
    card: {
        backgroundColor: '#f5ece0ff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        position: 'relative',
    },
    cardText: { color: '#321904', fontSize: 20, marginBottom: 4 },
    cardTextPressao: { color: '#321904', fontSize: 20, marginBottom: 4, marginLeft: 90 },
    optionsButton: { position: 'absolute', top: 10, right: 10 },

    addButton: {
        backgroundColor: '#F28B0C',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 6,
        marginTop: 20,
        marginBottom: 100,
    },
    addButtonText: { color: '#321904', fontWeight: 'bold', fontSize: 16 },

    modalOverlay: { flex: 1, backgroundColor: 'transparent' },
    menuContainer: {
        position: 'absolute',
        backgroundColor: '#F7F2FA',
        borderRadius: 8,
        paddingVertical: 10,
        width: 180,
        elevation: 5,
    },
    menuItem: { paddingVertical: 12, paddingHorizontal: 16 },
    menuText: { fontSize: 16, color: '#321904' },
    barraHorizontal: {
        height: 1,
        backgroundColor: 'grey',
        width: 30,
        marginLeft: 80,
        paddingInline: 17,
    }
});
