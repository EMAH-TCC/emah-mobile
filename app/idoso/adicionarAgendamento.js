import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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

async function addAgendamento(id_paciente, nome, descricao, data_evento) {
  const { data, error } = await supabase
    .from("agendamento")
    .insert([
      {
        id: id_paciente,
        nome_evento: nome,
        data_evento: data_evento,
        descricao: descricao,
      },
    ])
    .select();

  if (error) {
    console.error("Erro ao inserir consulta:", error);
    return null;
  }

  return data[0];
}

export default function AdicionarAgendamento() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const idPaciente = params.id;
  const id_paciente = Number(idPaciente);
  console.log("Id: ", id_paciente);
  const [nome_evento, setNome] = useState(params.nome_evento || "");
  const [descricao, setDescricao] = useState(params.descricao || "");
  const [data_evento, setData] = useState("");
  const [errorFields, setErrorFields] = useState([]);
  const [horarioInicio, setHoararioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");

  async function salvarAgendamentos() {
    const user = await getUser();
    if (!user) return;

    const pacienteId = id_paciente;
    if (!pacienteId) {
      return;
    }

    const [dia, mes, ano] = data_evento.split("/");
    const dataFormatada = `${ano}-${mes}-${dia}`;

    const evento = await addAgendamento(
      id_paciente,
      nome_evento,
      descricao,
      dataFormatada
    );
    console.log("Evento adicionado: ", evento);

    router.push({
      pathname: "/idoso/agenda",
      params: { id: user.id },
    });
  }

  function formataData(text) {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 2) {
      setData(cleaned);
      return;
    }
    if (cleaned.length <= 4) {
      setData(cleaned.slice(0, 2) + "/" + cleaned.slice(2));
      return;
    }
    setData(
      cleaned.slice(0, 2) +
        "/" +
        cleaned.slice(2, 4) +
        "/" +
        cleaned.slice(4, 8)
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView style={styles.scrollContent}>
          <View style={styles.container}>
            {/* Cabeçalho com botão de voltar e título */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <View style={styles.backCircle}>
                  <Ionicons name="arrow-back" size={24} color="#321904" />
                </View>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Adicionar Agendamento</Text>
            </View>

            {/* Conteúdo principal */}
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <TextInput
                style={styles.input}
                placeholder="Nome do evento"
                value={nome_evento}
                onChangeText={setNome}
              />
              <TextInput
                style={styles.input}
                placeholder="Descrição do evento"
                value={descricao}
                onChangeText={setDescricao}
              />
              <TextInput
                placeholder="Data do evento (DD/MM/AAAA)"
                placeholderTextColor={
                  errorFields.includes("data_evento") ? "red" : "#321904"
                }
                keyboardType="numeric"
                value={data_evento}
                onChangeText={formataData}
                style={styles.input}
                maxLength={10}
              />

              {/* Botões de ação */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={salvarAgendamentos}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.secondaryButton]}
                  onPress={() => router.back()}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "flex-start",
  },
  header: {
    height: 60,
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 10,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#321904",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    color: "#321904",
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
  },
  scrollContent: {
    padding: 17,
  },
  input: {
    backgroundColor: "#EDE7F6",
    padding: 14,
    borderRadius: 6,
    marginBottom: 16,
    color: "#321904",
    fontSize: 16,
  },
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
    maxWidth: 300,
  },
  primaryButton: {
    backgroundColor: "#F28B0C",
  },
  secondaryButton: {
    backgroundColor: "#FBB65A",
  },
  buttonText: {
    color: "#321904",
    fontWeight: "bold",
    fontSize: 16,
  },
});
