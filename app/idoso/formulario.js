import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../utils/supabase';

async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log("Erro: ", error);
    return null;
  }

  return data.user;
}

async function addQuestionario(pacienteId, temperatura, peso, pressaoSistolica, pressaoDiastolica, remedios, notas, dataInsercao) {
  const { data, error } = await supabase
    .from('questionario')
    .insert([{ id_paciente: pacienteId, temperatura: temperatura, peso: peso, pressao_sistolica: pressaoSistolica, pressao_diastolica: pressaoDiastolica, remedios: remedios, notas: notas, data: dataInsercao }])
    .select()

  if (error) {
    console.error("Erro ao inserir consulta:", error)
    return null
  }

  return data
}
export default function Formulario() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const idPaciente = params.id;
  const id_paciente = Number(idPaciente);

  //estados interativos
  const [sintomasSelecionados, setSintomasSelecionados] = useState({});
  const [humorSelecionado, setHumorSelecionado] = useState({});
  const [remedios, setRemedios] = useState([""]);
  const [notas, setNotas] = useState("");
  const [temperatura, setTemperatura] = useState([""]);
  const [peso, setPeso] = useState([""]);
  const [pressaoSistolica, setPressaoSistolica] = useState([""]);
  const [pressaoDiastolica, setPressaoDiastolica] = useState([""]);

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
    { nome: "...", icon: "ellipsis-horizontal-outline" },
  ];

  //humores com icones
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
    { nome: "...", icon: "ellipsis-horizontal-outline" },
  ];

  async function salvarQuestionarioNoBanco() {
    const user = await getUser();
    if (!user) {
      return
    }

    const dataInsercao = new Date();
    const questionario = await addQuestionario(pacienteId, temperatura, peso, pressaoSistolica, pressaoDiastolica, remedios, notas, dataInsercao);
    router.push('/idoso/menuInicial');
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#321904" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Formulário</Text>
          </View>

          {/* Sintomas */}
          <View style={styles.section}>
            <Text style={styles.firstSectionTitle}>Sintomas</Text>
            {sintomas.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.optionRow}
                onPress={() => toggleItem(sintomasSelecionados, setSintomasSelecionados, item.nome)}
              >
                <Ionicons name={item.icon} size={20} color="#321904" />
                <Text style={styles.optionText}>{item.nome}</Text>
                <Ionicons
                  name={sintomasSelecionados[item.nome] ? "checkbox" : "square-outline"}
                  size={22}
                  color={sintomasSelecionados[item.nome] ? "#F28B0C" : "#321904"}
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

          {/* Peso */}
          <TextInput
            style={styles.input}
            placeholder="Peso / Kg"
            value={peso}
            onChangeText={setPeso}
            placeholderTextColor="#7a6c5d"
          />

          <View style={styles.divider} />

          {/* Remédios */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Remédios</Text>
            {remedios.map((remedio, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder="Adicionar remédio"
                placeholderTextColor="#7a6c5d"
                value={remedio}
                onChangeText={(text) => {
                  const novos = [...remedios];
                  novos[index] = text;
                  setRemedios(novos);
                }}
              />
            ))}
            <TouchableOpacity style={styles.remedioButton} onPress={adicionarRemedio}>
              <Ionicons name="add-circle-outline" size={20} color="#321904" style={{ marginRight: 6 }} />
              <Text style={styles.remedioButtonText}>Adicionar remédio</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Pressão */}
          <Text style={styles.sectionTitle}>Pressão</Text>
          <TextInput
            style={styles.inputPressao}
            keyboardType='number-pad'
            value={pressaoSistolica}
            onChangeText={setPressaoSistolica}
            placeholder="Maior valor"
            placeholderTextColor="#7a6c5d"
          />
          <View style={styles.barraHorizontal}></View>
          <TextInput
            style={styles.inputPressao}
            keyboardType='number-pad'
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
                onPress={() => toggleItem(humorSelecionado, setHumorSelecionado, item.nome)}
              >
                <Ionicons name={item.icon} size={20} color="#321904" />
                <Text style={styles.optionText}>{item.nome}</Text>
                <Ionicons
                  name={humorSelecionado[item.nome] ? "checkbox" : "square-outline"}
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
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Anote outros sintomas ou como está se sentindo"
            placeholderTextColor="#7a6c5d"
            multiline
            value={notas}
            onChangeText={setNotas}
          />

          {/* Botão salvar */}
          <TouchableOpacity style={styles.saveButton} onPress={salvarQuestionarioNoBanco}>
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Botão Home */}
        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/idoso/menuInicial')}>
          <Ionicons name="home-outline" size={28} color="#321904" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 20, paddingBottom: 120 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#321904',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#321904' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#321904', marginBottom: 10 },
  firstSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#321904',
    marginBottom: 10,
    marginTop: 18,
  },
  optionRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  optionText: { flex: 1, marginLeft: 8, color: '#321904', fontSize: 16 },
  input: {
    backgroundColor: '#EDE7F6',
    padding: 14,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 16,
    color: '#321904',
  },
  inputPressao: {
    backgroundColor: '#EDE7F6',
    width: 110,
    padding: 14,
    borderRadius: 6,
    marginBottom: 16,
    fontSize: 16,
    color: '#321904',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginVertical: 15,
  },
  remedioButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBB65A',
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  remedioButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#321904',
  },
  saveButton: {
    backgroundColor: '#F28B0C',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  homeButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 14,
    elevation: 5,
    shadowColor: '#321904',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  separator: {
    fontSize: 20,
    marginHorizontal: 5,
  },
  barraHorizontal: {
    height: 1,
    backgroundColor: 'grey',
    width: 115,
    marginVertical: 10,
  }
});
