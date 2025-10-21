import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
} from "react-native";
import { supabase } from "../../utils/supabase";

async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.log("Erro ao obter usuário:", error);
    return null;
  }
  return data.user;
}

// 🔹 Inserir agendamento
async function addAgendamento(
  id_paciente,
  nome_evento,
  descricao,
  data_evento,
  horarios
) {
  const { data, error } = await supabase
    .from("agendamento")
    .insert([
      {
        id_paciente: id_paciente,
        nome_evento: nome_evento,
        descricao: descricao,
        data_evento: data_evento,
        horarios: horarios, // campo JSONB no banco
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
    return `${year}-${month}-${day}`; // formato ISO para o Supabase
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

    const novoEvento = await addAgendamento(
      idPaciente,
      nomeEvento.trim(),
      descricao.trim(),
      dataISO,
      horarios
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
          <View style={styles.container}>
            <Text style={styles.label}>Nome do Evento</Text>
            <TextInput
              style={styles.input}
              value={nomeEvento}
              onChangeText={setNomeEvento}
              placeholder="Ex: Consulta médica"
            />

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Ex: Avaliação de rotina"
            />

            <Text style={styles.label}>Data do Evento (DD/MM/AAAA)</Text>
            <TextInput
              style={styles.input}
              value={dataEvento}
              onChangeText={setDataEvento}
              placeholder="21/10/2025"
            />

            <Text style={styles.label}>Horário de Início</Text>
            <TextInput
              style={styles.input}
              value={horarioInicio}
              onChangeText={setHorarioInicio}
              placeholder="08:00"
            />

            <Text style={styles.label}>Horário de Término</Text>
            <TextInput
              style={styles.input}
              value={horarioFim}
              onChangeText={setHorarioFim}
              placeholder="09:00"
            />

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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 17,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "flex-start",
  },
  label: {
    marginTop: 12,
    fontWeight: "bold",
    color: "#321904",
    fontSize: 15,
  },
  input: {
    backgroundColor: "#F7F4EF",
    padding: 14,
    borderRadius: 8,
    marginTop: 6,
    marginBottom: 12,
    color: "#321904",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0D8C3",
  },
  botaoSalvar: {
    backgroundColor: "#F28B0C",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  textoBotao: {
    color: "#321904",
    fontWeight: "bold",
    fontSize: 16,
  },
});
