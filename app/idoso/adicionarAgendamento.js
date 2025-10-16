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


{
  /* */
  /* async function salvarAgendamentos() {
  const user = await getUser();
  if (!user) return;

  const pacienteId = id_paciente;
  if (!pacienteId) {
    console.log("ID do paciente inválido");
    return;
  }

  const evento = await addAgendamento(
    pacienteId, 
    nome_evento,
    descricacao,
    data_evento
  );

  console.log("Evento adicionado:", evento);

  router.push({
    pathname: "/idoso/agenda",
    params: { id: pacienteId },
  });
}*/
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

  async function salvarAgendamentos() {
    const user = await getUser();
    if (!user) return;

    const pacienteId = id_paciente;
    if (!pacienteId) {
      return;
    }

    const evento = await addAgendamento(
      id_paciente,
      nome_evento,
      descricao,
      data_evento
    );
    console.log("Evento adicionado: ", evento);

    router.push({
      pathname: "/idoso/agenda",
      params: { id: user.id },
    });
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
              style={styles.input}
              placeholder="Data do evento (AAAA-MM-DD)"
              value={data_evento}
              onChangeText={setData}
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
