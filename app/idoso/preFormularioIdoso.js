import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform,} from "react-native";

export default function PreFormularioIdoso() {
  const router = useRouter();
  const [etapa, setEtapa] = useState(1);
  const totalEtapas = 6;

  const [sexo, setSexo] = useState("");
  const [moraSozinho, setMoraSozinho] = useState("");
  const [sono, setSono] = useState("");
  const [atividadeFisica, setAtividadeFisica] = useState("");
  const [tipoAtividade, setTipoAtividade] = useState("");
  const [bebidas, setBebidas] = useState("");
  const [fumo, setFumo] = useState("");

  const [doencas, setDoencas] = useState({});
  const [cirurgias, setCirurgias] = useState("");
  const [aparelhos, setAparelhos] = useState({});
  const [alergias, setAlergias] = useState("");

  const [usoMedicamentos, setUsoMedicamentos] = useState("");
  const [quaisMedicamentos, setQuaisMedicamentos] = useState("");
  const [esquecimento, setEsquecimento] = useState("");

  const [autonomia, setAutonomia] = useState({});
  const [emocional, setEmocional] = useState({});
  const [cuidador, setCuidador] = useState("");
  const [nomeCuidador, setNomeCuidador] = useState("");
  const [telefoneCuidador, setTelefoneCuidador] = useState("");
  const [postoSaude, setPostoSaude] = useState("");

  const toggleItem = (state, setState, item) => {
    setState({ ...state, [item]: !state[item] });
  };

  const avancar = () => {
    if (etapa < totalEtapas) setEtapa(etapa + 1);
    else router.push("/idoso/menuInicial");
  };

  const voltar = () => {
    if (etapa > 1) setEtapa(etapa - 1);
    else router.back();
  };

  const renderDivider = () => <View style={styles.divider} />;

  //todas as etapas 
  const renderEtapa = () => {
    switch (etapa) {
      //etapa 1
      case 1:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações gerais e hábitos</Text>

            <Text style={styles.label}>Sexo:</Text>
            {["Masculino", "Feminino", "Prefiro não dizer"].map((op) => (
              <TouchableOpacity
                key={op}
                style={styles.radioOption}
                onPress={() => setSexo(op)}
              >
                <Ionicons
                  name={sexo === op ? "radio-button-on" : "radio-button-off"}
                  size={24}
                  color="#F28B0C"
                />
                <Text style={styles.optionText}>{op}</Text>
              </TouchableOpacity>
            ))}
            {renderDivider()}

            <Text style={styles.label}>Você mora sozinho(a)?</Text>
            {["Sim", "Não"].map((op) => (
              <TouchableOpacity
                key={op}
                style={styles.radioOption}
                onPress={() => setMoraSozinho(op)}
              >
                <Ionicons
                  name={moraSozinho === op ? "radio-button-on" : "radio-button-off"}
                  size={24}
                  color="#F28B0C"
                />
                <Text style={styles.optionText}>{op}</Text>
              </TouchableOpacity>
            ))}
            {renderDivider()}

            <Text style={styles.label}>Quantas horas costuma dormir por noite?</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={sono}
              onChangeText={setSono}
              placeholder="Exemplo: 7 horas"
              placeholderTextColor="#7a6c5d"
            />
            {renderDivider()}

            <Text style={styles.label}>Você pratica atividade física?</Text>
            {["Sim, regularmente", "Às vezes", "Nunca"].map((op) => (
              <TouchableOpacity
                key={op}
                style={styles.radioOption}
                onPress={() => setAtividadeFisica(op)}
              >
                <Ionicons
                  name={atividadeFisica === op ? "radio-button-on" : "radio-button-off"}
                  size={24}
                  color="#F28B0C"
                />
                <Text style={styles.optionText}>{op}</Text>
              </TouchableOpacity>
            ))}
            {atividadeFisica !== "Nunca" && (
              <TextInput
                style={styles.input}
                placeholder="Qual tipo de atividade?"
                value={tipoAtividade}
                onChangeText={setTipoAtividade}
                placeholderTextColor="#7a6c5d"
              />
            )}
            {renderDivider()}

            <Text style={styles.label}>Você faz uso de bebidas alcoólicas?</Text>
            {["Nunca", "Raramente", "Frequentemente"].map((op) => (
              <TouchableOpacity
                key={op}
                style={styles.radioOption}
                onPress={() => setBebidas(op)}
              >
                <Ionicons
                  name={bebidas === op ? "radio-button-on" : "radio-button-off"}
                  size={24}
                  color="#F28B0C"
                />
                <Text style={styles.optionText}>{op}</Text>
              </TouchableOpacity>
            ))}
            {renderDivider()}

            <Text style={styles.label}>Você fuma atualmente?</Text>
            {["Sim", "Não", "Já fumei, mas parei"].map((op) => (
              <TouchableOpacity
                key={op}
                style={styles.radioOption}
                onPress={() => setFumo(op)}
              >
                <Ionicons
                  name={fumo === op ? "radio-button-on" : "radio-button-off"}
                  size={24}
                  color="#F28B0C"
                />
                <Text style={styles.optionText}>{op}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      //etapa 2
      case 2:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Histórico de saúde</Text>

            <Text style={styles.label}>Você possui alguma dessas condições?</Text>
            {[
             "Hipertensão", "Diabetes", "Artrite", "Osteoporose",
          "Doença cardíaca", "Problemas respiratórios",
          "Doença de Alzheimer", "Depressão", "Ansiedade",
          "Glaucoma", "Parkinson", "Incontinência urinária",
          "Problemas de visão", "Problemas auditivos", "Outras",
            ].map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.checkboxRow}
                onPress={() => toggleItem(doencas, setDoencas, item)}
              >
                <Ionicons
                  name={doencas[item] ? "radio-button-on" : "radio-button-off"}
                  size={24}
                  color={doencas[item] ? "#F28B0C" : "#F28B0C"}
                />
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            ))}
            {renderDivider()}

            <Text style={styles.label}>Já teve alguma cirurgia importante?</Text>
            <TextInput
              style={styles.input}
              value={cirurgias}
              onChangeText={setCirurgias}
              placeholder="Descreva se teve"
              placeholderTextColor="#7a6c5d"
            />
            {renderDivider()}

            <Text style={styles.label}>
              Usa algum aparelho de auxílio (óculos, bengala, etc.)?
            </Text>
            {["Óculos", "Bengala", "Aparelho auditivo", "Cadeira de rodas", "Nenhum"].map(
              (item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.checkboxRow}
                  onPress={() => toggleItem(aparelhos, setAparelhos, item)}
                >
                  <Ionicons
                    name={aparelhos[item] ? "radio-button-on" : "radio-button-off"}
                    size={24}
                    color={aparelhos[item] ? "#F28B0C" : "#F28B0C"}
                  />
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )
            )}
            {renderDivider()}

            <Text style={styles.label}>Você possui alguma alergia conhecida?</Text>
            <TextInput
              style={styles.input}
              value={alergias}
              onChangeText={setAlergias}
              placeholder="Descreva medicamentos ou alimentos"
              placeholderTextColor="#7a6c5d"
            />
          </View>
        );

      //etapa 3
      case 3:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uso de medicações</Text>

            <Text style={styles.label}>Você faz uso contínuo de algum medicamento?</Text>
            {["Sim", "Não"].map((op) => (
              <TouchableOpacity
                key={op}
                style={styles.radioOption}
                onPress={() => setUsoMedicamentos(op)}
              >
                <Ionicons
                  name={usoMedicamentos === op ? "radio-button-on" : "radio-button-off"}
                  size={24}
                  color="#F28B0C"
                />
                <Text style={styles.optionText}>{op}</Text>
              </TouchableOpacity>
            ))}
            {usoMedicamentos === "Sim" && (
              <TextInput
                style={[styles.input, { height: 100 }]}
                multiline
                value={quaisMedicamentos}
                onChangeText={setQuaisMedicamentos}
                placeholder="Liste os medicamentos que utiliza"
                placeholderTextColor="#7a6c5d"
              />
            )}
            {renderDivider()}

            <Text style={styles.label}>Costuma esquecer de tomar seus medicamentos?</Text>
            {["Nunca", "Raramente", "Às vezes", "Frequentemente"].map((op) => (
              <TouchableOpacity
                key={op}
                style={styles.radioOption}
                onPress={() => setEsquecimento(op)}
              >
                <Ionicons
                  name={esquecimento === op ? "radio-button-on" : "radio-button-off"}
                  size={24}
                  color="#F28B0C"
                />
                <Text style={styles.optionText}>{op}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      //etapa 4
      case 4:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Capacidades funcionais</Text>
            {[
              "Você consegue se vestir sozinho(a)?",
              "Consegue tomar banho sozinho(a)?",
              "Consegue preparar suas refeições?",
              "Consegue sair de casa sem ajuda?",
              "Consegue administrar seu próprio dinheiro?",
            ].map((q) => (
              <View key={q}>
                <Text style={styles.label}>{q}</Text>
                {["Sim", "Com ajuda", "Não"].map((op) => (
                  <TouchableOpacity
                    key={op}
                    style={styles.radioOption}
                    onPress={() =>
                      setAutonomia({ ...autonomia, [q]: op })
                    }
                  >
                    <Ionicons
                      name={
                        autonomia[q] === op
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={24}
                      color="#F28B0C"
                    />
                    <Text style={styles.optionText}>{op}</Text>
                  </TouchableOpacity>
                ))}
                {renderDivider()}
              </View>
            ))}
          </View>
        );

      //etapa 5
      case 5:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saúde mental e emocional</Text>
            {[
              "Você tem se sentido triste ou desanimado(a)?",
              "Você sente falta de energia ou motivação para atividades diárias?",
              "Você se sente sozinho(a) com frequência?",
              "Você tem boa memória para lembrar compromissos e nomes?",
            ].map((q) => (
              <View key={q}>
                <Text style={styles.label}>{q}</Text>
                {["Nunca", "Às vezes", "Frequentemente"].map((op) => (
                  <TouchableOpacity
                    key={op}
                    style={styles.radioOption}
                    onPress={() => setEmocional({ ...emocional, [q]: op })}
                  >
                    <Ionicons
                      name={
                        emocional[q] === op
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={24}
                      color="#F28B0C"
                    />
                    <Text style={styles.optionText}>{op}</Text>
                  </TouchableOpacity>
                ))}
                {renderDivider()}
              </View>
            ))}
          </View>
        );

      //etapa 6
      case 6:
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contato e acompanhamento</Text>

            <Text style={styles.label}>
              Você possui um cuidador ou familiar responsável?
            </Text>
            {["Sim", "Não"].map((op) => (
              <TouchableOpacity
                key={op}
                style={styles.radioOption}
                onPress={() => setCuidador(op)}
              >
                <Ionicons
                  name={cuidador === op ? "radio-button-on" : "radio-button-off"}
                  size={24}
                  color="#F28B0C"
                />
                <Text style={styles.optionText}>{op}</Text>
              </TouchableOpacity>
            ))}
            {renderDivider()}

            {cuidador === "Sim" && (
              <>
                <Text style={styles.label}>Nome do cuidador/familiar</Text>
                <TextInput
                  style={styles.input}
                  value={nomeCuidador}
                  onChangeText={setNomeCuidador}
                  placeholder="Digite o nome completo"
                  placeholderTextColor="#7a6c5d"
                />
                <Text style={styles.label}>Telefone do cuidador/familiar</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={telefoneCuidador}
                  onChangeText={setTelefoneCuidador}
                  placeholder="(00) 00000-0000"
                  placeholderTextColor="#7a6c5d"
                />
              </>
            )}
            {renderDivider()}

            <Text style={styles.label}>
              Médico ou posto de saúde que costuma frequentar:
            </Text>
            <TextInput
              style={styles.input}
              value={postoSaude}
              onChangeText={setPostoSaude}
              placeholder="Exemplo: Posto Central de Contagem"
              placeholderTextColor="#7a6c5d"
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={voltar}>
              <Ionicons name="arrow-back" size={22} color="#321904" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Pré-formulário</Text>
          </View>

          <Text style={styles.progressText}>
            Etapa {etapa} de {totalEtapas}
          </Text>

          {renderEtapa()}

          <TouchableOpacity style={styles.saveButton} onPress={avancar}>
            <Text style={styles.saveButtonText}>
              {etapa === totalEtapas ? "Concluir" : "Avançar"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 20, paddingBottom: 150 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 10,
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
    top: 10,
  },
  headerTitle: { fontSize: 25, fontWeight: "bold", color: "#321904", top: 10 },
  progressText: {
    textAlign: "center",
    fontSize: 18,
    color: "#7a6c5d",
    marginBottom: 15,
  },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#321904", marginBottom: 12 },
  label: { fontSize: 20, color: "#321904", marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: "#f7eee5ff",
    padding: 14,
    borderRadius: 6,
    marginBottom: 14,
    fontSize: 20,
    color: "#321904",
    textAlignVertical: "top",
  },
  radioOption: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  checkboxRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  optionText: { marginLeft: 8, fontSize: 20, color: "#321904", flexShrink: 1 },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#d8c9b8",
    marginVertical: 10,
  },
  saveButton: {
    backgroundColor: "#F28B0C",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
});
