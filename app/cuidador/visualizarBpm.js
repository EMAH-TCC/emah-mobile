import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { supabase } from '../../utils/supabase';

async function selectUltimoBPM(paciente_id) {
    const { data, error } = await supabase.rpc('selecionar_batimentos_do_paciente', { paciente_id: paciente_id });

    if (error) {
        console.error("Erro ao inserir consulta:", error)
        return null
    }
    return data
}
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

const styles = StyleSheet.create({

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#fff",
  },
  backButton: {
    position: "absolute",
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#321904",
    justifyContent: "center",
    alignItems: "center",
    top: 5,
  },
  
    title: { fontSize: 25, fontWeight: 'bold', color: '#4f1a04ff', marginTop: 0, textAlign: 'center' },
    
    card: {
        backgroundColor: '#f7eee5ff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        width: '100%',
    },
    heartContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    ping: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(220,38,38,0.2)',
        top: 0,
        left: 0,
        zIndex: -1,
    },
    bpm: { fontSize: 64, fontWeight: 'bold', color: '#C2410C' },
    bpmLabel: { fontSize: 20, color: '#EA580C', marginBottom: 12 },
    infoCard: { backgroundColor: 'rgba(249, 245, 239, 0.6)', borderRadius: 12, padding: 16, width: '100%', marginBottom: 20 },
    infoTitle: { color: '#C2410C', fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    infoLabel: { color: '#EA580C', fontSize: 20 },
    infoValue: { color: '#C2410C', fontSize: 20, fontWeight: 'bold' },
    button: { backgroundColor: '#F97316', paddingVertical: 12, paddingHorizontal: 36, borderRadius: 24 },
    buttonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
    buttonPermissoes: { backgroundColor: '#ee8439ff', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 24, alignItems: 'center', },
});
