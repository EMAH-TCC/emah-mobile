import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../styles/adicionarAgendamento";
import { supabase } from "../../utils/supabase";

async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.log("Erro ao obter usuário:", error);
    return null;
  }
  return data.user;
}

async function addAgendamento(
  id_paciente,
  nome_evento,
  descricao,
  data_evento,
  horarios,
  categoria
) {
  const { data, error } = await supabase
    .from("agendamento")
    .insert([
      {
        id_paciente: id_paciente,
        nome_evento: nome_evento,
        descricao: descricao,
        data_evento: data_evento,
        horarios: horarios,
        categoria: categoria,
      },
    ])
    .select();

  if (error) {
    console.error("Erro ao inserir agendamento:", error);
    Alert.alert("Erro", "Não foi possível salvar o agendamento.");
    return null;
  }

  return data[0];
}

export default function AdicionarAgendamento() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idPaciente = Number(params.id);

  const [nomeEvento, setNomeEvento] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataEvento, setDataEvento] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");

  const [tipoEvento, setTipoEvento] = useState("");
  const [tipoCustom, setTipoCustom] = useState("");

  function isValidDateBR(dateStr) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateStr)) return false;
    const [day, month, year] = dateStr.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  function parseDateBR(dateStr) {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  }

  function isValidTime(timeStr) {
    const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return regex.test(timeStr);
  }

  async function salvarAgendamento() {
    const user = await getUser();
    if (!user) return;

    // Validação dos campos
    if (!nomeEvento.trim()) {
      Alert.alert("Erro", "Preencha o nome do evento.");
      return;
    }
    if (!descricao.trim()) {
      Alert.alert("Erro", "Preencha a descrição do evento.");
      return;
    }
    if (!dataEvento.trim() || !isValidDateBR(dataEvento.trim())) {
      Alert.alert("Erro", "Informe uma data válida no formato DD/MM/AAAA.");
      return;
    }
    if (!horarioInicio.trim() || !isValidTime(horarioInicio.trim())) {
      Alert.alert("Erro", "Informe um horário de início válido (HH:MM).");
      return;
    }
    if (!horarioFim.trim() || !isValidTime(horarioFim.trim())) {
      Alert.alert("Erro", "Informe um horário de término válido (HH:MM).");
      return;
    }
    if (horarioInicio >= horarioFim) {
      Alert.alert(
        "Erro",
        "O horário de início deve ser anterior ao horário de término."
      );
      return;
    }

    const horarios = {
      inicio: horarioInicio.trim(),
      fim: horarioFim.trim(),
    };

    const dataISO = parseDateBR(dataEvento.trim());

    let categoria = tipoEvento;

    if (tipoEvento === "Outro") {
      if (!tipoCustom.trim()) {
        Alert.alert("Outro", "Por favor, digite a categoria do evento.");
        return;
      }
      categoria = tipoCustom.trim();
    }

    const novoEvento = await addAgendamento(
      idPaciente,
      nomeEvento.trim(),
      descricao.trim(),
      dataISO,
      horarios,
      categoria
    );

    if (novoEvento) {
      Alert.alert("Sucesso", "Agendamento salvo com sucesso!");
      router.push(`/idoso/agenda?id=${idPaciente}`);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color="#321904" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Agenda</Text>
          </View>

          <View style={styles.container}>
            <Text style={styles.label}>Nome do Evento</Text>
            <TextInput
              style={styles.input}
              value={nomeEvento}
              onChangeText={setNomeEvento}
              placeholder="Ex: Consulta médica"
              placeholderTextColor="#7a6c5d"
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Ex: Avaliação de rotina"
              placeholderTextColor="#7a6c5d"
            />

            <Text style={styles.label}>Data do Evento (DD/MM/AAAA)</Text>
            <TextInput
              style={styles.input}
              value={dataEvento}
              onChangeText={setDataEvento}
              placeholder="21/10/2025"
              placeholderTextColor="#7a6c5d"
            />

            <Text style={styles.label}>Horário de Início</Text>
            <TextInput
              style={styles.input}
              value={horarioInicio}
              onChangeText={setHorarioInicio}
              placeholder="08:00"
              placeholderTextColor="#7a6c5d"
            />

            <Text style={styles.label}>Horário de Término</Text>
            <TextInput
              style={styles.input}
              value={horarioFim}
              onChangeText={setHorarioFim}
              placeholder="09:00"
              placeholderTextColor="#7a6c5d"
            />

            <Text style={styles.label}>Categoria do Evento</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={tipoEvento}
                onValueChange={(value) => setTipoEvento(value)}
                dropdownIconColor="#321904"
                style={styles.label}
              >
                <Picker.Item label="Selecione uma categoria" value="" />
                <Picker.Item label="Consulta médica" value="Consulta médica" />
                <Picker.Item label="Exame" value="Exame" />
                <Picker.Item label="Lembrete" value="Lembrete" />
                <Picker.Item label="Outro" value="Outro" />
              </Picker>
            </View>

            {tipoEvento === "Outro" && (
              <TextInput
                style={styles.input}
                value={tipoCustom}
                onChangeText={setTipoCustom}
                placeholder="Digite sua categoria"
                placeholderTextColor="#7a6c5d"
              />
            )}

            <TouchableOpacity
              style={styles.botaoSalvar}
              onPress={salvarAgendamento}
            >
              <Text style={styles.textoBotao}>Salvar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

