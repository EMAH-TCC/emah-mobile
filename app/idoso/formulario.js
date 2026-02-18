import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { addQuestionario, defineSentimento, defineSintoma, vincularSentimento, vinculaSintoma } from "../../features/idoso/registroDiarioService";
import { styles } from "../../styles/formularioStyles";
import { getUser } from "../../utils/userData";

export default function Formulario() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const idPaciente = params.id;
  const id_paciente = Number(idPaciente);

  const [remedios, setRemedios] = useState([""]);
  const [notas, setNotas] = useState("");
  const [temperatura, setTemperatura] = useState([""]);
  const [peso, setPeso] = useState([""]);
  const [pressaoSistolica, setPressaoSistolica] = useState([""]);
  const [pressaoDiastolica, setPressaoDiastolica] = useState([""]);
  const [sintomasSelecionados, setSintomasSelecionados] = useState({});
  const [humorSelecionado, setHumorSelecionado] = useState({});

  const toggleItem = (state, setState, item) => {
    setState({
      ...state,
      [item]: !state[item],
    });
  };

  const adicionarRemedio = () => {
    setRemedios([...remedios, ""]);
  };

  //sintomas com icones
  const sintomas = [
    { nome: "Tontura", icon: "sync-outline" },
    { nome: "Problemas digestivos", icon: "restaurant-outline" },
    { nome: "Dor de cabeça", icon: "medkit-outline" },
    { nome: "Fadiga", icon: "bed-outline" },
    { nome: "Náusea", icon: "warning-outline" },
    { nome: "Diarreia", icon: "water-outline" },
    { nome: "Inchaço", icon: "alert-circle-outline" },
    { nome: "Febre", icon: "thermometer-outline" },
  ];

  //humores com iScones
  const humores = [
    { nome: "Calma", icon: "happy-outline" },
    { nome: "Feliz", icon: "happy-outline" },
    { nome: "Energética", icon: "flash-outline" },
    { nome: "Alegre", icon: "sunny-outline" },
    { nome: "Mudanças de humor", icon: "swap-horizontal-outline" },
    { nome: "Irritado", icon: "close-circle-outline" },
    { nome: "Triste", icon: "sad-outline" },
    { nome: "Ansioso", icon: "alert-outline" },
    { nome: "Desanimado", icon: "cloud-outline" },
    { nome: "Culpado", icon: "remove-circle-outline" },
    { nome: "Pouca energia", icon: "battery-dead-outline" },
    { nome: "Apático", icon: "ellipse-outline" },
    { nome: "Confuso", icon: "help-circle-outline" },
  ];

  async function salvarQuestionarioNoBanco() {
    try {
      const user = await getUser();
      if (!user) {
        return;
      }

      const dataInsercao = new Date();
      const idQuestionario = await addQuestionario(
        idPaciente,
        peso,
        temperatura,
        pressaoSistolica,
        pressaoDiastolica,
        remedios,
        notas,
        dataInsercao
      );

      for (const sintoma of Object.keys(sintomasSelecionados).filter(
        (key) => sintomasSelecionados[key]
      )) {
        const idSintoma = await defineSintoma(sintoma);
        await vinculaSintoma(idQuestionario, idSintoma);
      }

      for (const sentimento of Object.keys(humorSelecionado).filter(
        (key) => humorSelecionado[key]
      )) {
        const idSentimento = await defineSentimento(sentimento);
        await vincularSentimento(idQuestionario, idSentimento);
      }

      router.push("/idoso/menuInicial");
    } catch (error) {
      console.error("Erro ao salvar questionário:", error);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color="#321904" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Registro Diário</Text>
          </View>

          {/* Sintomas */}
          <View style={styles.section}>
            <Text style={styles.firstSectionTitle}>Sintomas</Text>
            {sintomas.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionRow}
                onPress={() =>
                  toggleItem(
                    sintomasSelecionados,
                    setSintomasSelecionados,
                    item.nome
                  )
                }
              >
                <Ionicons name={item.icon} size={20} color="#321904" />
                <Text style={styles.optionText}>{item.nome}</Text>
                <Ionicons
                  name={
                    sintomasSelecionados[item.nome]
                      ? "checkbox"
                      : "square-outline"
                  }
                  size={22}
                  color={
                    sintomasSelecionados[item.nome] ? "#F28B0C" : "#321904"
                  }
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Temperatura */}
          <TextInput
            style={styles.input}
            placeholder="Temperatura / °C"
            value={temperatura}
            onChangeText={setTemperatura}
            placeholderTextColor="#7a6c5d"
          />

          <View style={styles.divider} />

          {/* Remédios */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Remédios não cadastrados</Text>
            {remedios.map((remedio, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder="Remédio"
                placeholderTextColor="#7a6c5d"
                value={remedio}
                onChangeText={(text) => {
                  const novos = [...remedios];
                  novos[index] = text;
                  setRemedios(novos);
                }}
              />
            ))}
            <TouchableOpacity
              style={styles.remedioButton}
              onPress={adicionarRemedio}
            >
              <Ionicons
                name="add-circle-outline"
                size={20}
                color="#321904"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.remedioButtonText}>Adicionar remédio</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Pressão */}
          <Text style={styles.sectionTitle}>Pressão</Text>
          <TextInput
            style={styles.inputPressao}
            keyboardType="number-pad"
            value={pressaoSistolica}
            onChangeText={setPressaoSistolica}
            placeholder="Maior valor"
            placeholderTextColor="#7a6c5d"
          />
          <View style={styles.barraHorizontal}></View>
          <TextInput
            style={styles.inputPressao}
            keyboardType="number-pad"
            value={pressaoDiastolica}
            onChangeText={setPressaoDiastolica}
            placeholder="Menor valor"
            placeholderTextColor="#7a6c5d"
          />

          <View style={styles.divider} />

          {/* Humor */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Humor</Text>
            {humores.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionRow}
                onPress={() =>
                  toggleItem(humorSelecionado, setHumorSelecionado, item.nome)
                }
              >
                <Ionicons name={item.icon} size={20} color="#321904" />
                <Text style={styles.optionText}>{item.nome}</Text>
                <Ionicons
                  name={
                    humorSelecionado[item.nome] ? "checkbox" : "square-outline"
                  }
                  size={22}
                  color={humorSelecionado[item.nome] ? "#F28B0C" : "#321904"}
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Notas */}
          <Text style={styles.sectionTitle}>Notas</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            placeholder="Anote outros sintomas ou como está se sentindo"
            placeholderTextColor="#7a6c5d"
            multiline
            value={notas}
            onChangeText={setNotas}
          />

          {/* Botão salvar */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={salvarQuestionarioNoBanco}
          >
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </ScrollView>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}