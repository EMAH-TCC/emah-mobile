import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/acoesRemedios';
import { supabase } from '../../utils/supabase';
import { getUser } from '../../utils/userData';

async function addRemedio(pacienteId, nome, frequencia, dose, horarios) {
    const { data, error } = await supabase
        .from('medicamento')
        .insert([{ id_paciente: pacienteId, nome: nome, frequencia: frequencia, dose: dose, horarios: horarios }])
        .select()

    if (error) {
        console.error("Erro ao inserir consulta:", error)
        return null
    }

    return data
}

export default function AdicionarRemedio() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const idPaciente = params.id;
    const id_paciente = Number(idPaciente);
    const [nome, setNome] = useState(params.nome || '');
    const [dose, setDose] = useState(params.dose || '');
    const [frequencia, setFrequencia] = useState(null);
    const [roleVezesPorDia, setRoleVezesPorDia] = useState(1);
    const [horarios, setHorarios] = useState([""]);

    const handleHorarioChange = (index, text) => {
        let numbers = text.replace(/\D/g, "");

        if (numbers.length > 4) numbers = numbers.slice(0, 4);

        if (numbers.length >= 3) {
            numbers = numbers.slice(0, 2) + ":" + numbers.slice(2);
        }

        const novosHorarios = [...horarios];
        novosHorarios[index] = numbers;
        setHorarios(novosHorarios);
    };

    const atualizarHorario = (index, novoHorario) => {
        const novosHorarios = [...horarios];
        novosHorarios[index] = novoHorario;
        setHorarios(novosHorarios);
    }

    async function salvarRemedioNoBanco() {
        const user = await getUser();
        if (!user) {
            return
        }

        const pacienteId = id_paciente;
        if (!pacienteId) {
            return
        }
        const remedio = await addRemedio(pacienteId, nome, frequencia, dose, horarios);
        console.log("Remédio adicionado: ", remedio);
        router.push({
            pathname: '/idoso/remedios',
            params: { id: pacienteId },
        });

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
                        <Text style={styles.headerTitle}>Adicionar Remédio</Text>
                    </View>

                    {/* Conteúdo geral */}
                    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                        <TextInput
                            style={styles.input}
                            placeholder="Nome do remédio"
                            value={nome}
                            onChangeText={setNome}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Dose"
                            value={dose}
                            onChangeText={setDose}
                        />
                        <Text style={styles.text}>Quantas vezes por dia?</Text>
                        <View style={styles.radioContainer}>
                            <TouchableOpacity style={styles.radioOption} onPress={() => setRoleVezesPorDia(1)}>
                                <Ionicons name={roleVezesPorDia === 1 ? 'radio-button-on' : 'radio-button-off'} size={20} color="#F28B0C" />
                                <Text style={styles.radioText}>1 vez por dia</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.radioOption} onPress={() => setRoleVezesPorDia(2)}>
                                <Ionicons name={roleVezesPorDia === 2 ? 'radio-button-on' : 'radio-button-off'} size={20} color="#F28B0C" />
                                <Text style={styles.radioText}>2 vezes por dia</Text>
                            </TouchableOpacity><TouchableOpacity style={styles.radioOption} onPress={() => setRoleVezesPorDia(3)}>
                                <Ionicons name={roleVezesPorDia === 3 ? 'radio-button-on' : 'radio-button-off'} size={20} color="#F28B0C" />
                                <Text style={styles.radioText}>3 vezes por dia</Text>
                            </TouchableOpacity><TouchableOpacity style={styles.radioOption} onPress={() => setRoleVezesPorDia(4)}>
                                <Ionicons name={roleVezesPorDia === 4 ? 'radio-button-on' : 'radio-button-off'} size={20} color="#F28B0C" />
                                <Text style={styles.radioText}>4 vezes por dia</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.text}>Horário</Text>
                        {Array.from({ length: roleVezesPorDia }).map((_, i) => (
                            <View key={i}>
                                <TextInput
                                    value={horarios[i] || ""}
                                    onChangeText={(text) => handleHorarioChange(i, text)}
                                    style={styles.inputTime}
                                    keyboardType="numeric"
                                    placeholder="HH:MM"
                                    maxLength={5}
                                />
                            </View>
                        ))}

                        <Text style={styles.text}>Qual a frequência?</Text>
                        <View style={styles.radioContainer}>
                            <TouchableOpacity style={styles.radioOption} onPress={() => setFrequencia('Todos os dias')}>
                                <Ionicons name={frequencia === 'Todos os dias' ? 'radio-button-on' : 'radio-button-off'} size={20} color="#F28B0C" />
                                <Text style={styles.radioText}>Todos os dias</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.radioOption} onPress={() => setFrequencia('1 vez por semana')}>
                                <Ionicons name={frequencia === '1 vez por semana' ? 'radio-button-on' : 'radio-button-off'} size={20} color="#F28B0C" />
                                <Text style={styles.radioText}>1 vez por semana</Text>
                            </TouchableOpacity><TouchableOpacity style={styles.radioOption} onPress={() => setFrequencia('15 em 15 dias')}>
                                <Ionicons name={frequencia === '15 em 15 dias' ? 'radio-button-on' : 'radio-button-off'} size={20} color="#F28B0C" />
                                <Text style={styles.radioText}>15 em 15 dias</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Botões do final */}
                        <View style={styles.footer}>
                            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={salvarRemedioNoBanco}>
                                <Text style={styles.buttonText}>Salvar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.back()}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}