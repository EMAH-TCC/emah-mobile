import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { selectQuestionario, selectUltimoBPM } from '../../features/idoso/registroDiarioService';
import { styles } from '../../styles/relatorioStyles';
import { getUser } from '../../utils/userData';

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
