import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { selectUltimoBPM } from "../../features/cuidador/visualizarBpmService";
import { styles } from '../../styles/bpmStyles';

export default function Bpm() {

    const router = useRouter();

    const params = useLocalSearchParams();

    const idPaciente = params.id;
    const id_paciente = Number(idPaciente);
    const [bpm, setBpm] = useState(null);
    const [time, setTime] = useState(null);
    const [pacienteId, setPacienteId] = useState(null);

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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffffff' }}>
            <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#321904" />
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={styles.title}>Batimento Cardíaco</Text>
                    </View>
                </View>

                {/* Heart Card */}
                <View style={styles.card}>
                    <View style={styles.heartContainer}>
                        <FontAwesome6 name="heart-pulse" size={80} color="#DC2626" style={{ animation: 'pulse 1s infinite' }} />
                        <View style={styles.ping}></View>
                    </View>

                    <Text style={styles.bpm}>{bpm ?? '--'}</Text>
                    <Text style={styles.bpmLabel}>BPM</Text>

                </View>

                {/* Measurement Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Última Medição</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Data:</Text>
                        <Text style={styles.infoValue}>{formatDate(time)}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Horário:</Text>
                        <Text style={styles.infoValue}>{formatTime(time)}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}