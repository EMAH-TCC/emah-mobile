import { Ionicons } from "@expo/vector-icons";
import * as Calendar from "expo-calendar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar as CalendarView, LocaleConfig } from "react-native-calendars";
import { supabase } from "../../utils/supabase";

LocaleConfig.locales ['pt-br'] = {
  monthNames: [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
    'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ],
    monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
    'Quinta-feira', 'Sexta-feira', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'

}

LocaleConfig.defaultLocale = 'pt-br';

export default function Agenda() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idPaciente = params.id;
  const id_paciente = Number(idPaciente);

  const [selected, setSelected] = useState("");
  const [eventos, setEventos] = useState([]);

  const alertaFalhaNaPermissao = () =>
    Alert.alert(
      "Permissão não concedida",
      "Não foi possível acessar o seu calendário local.",
      [{ text: "Ok", style: "cancel" }],
      { cancelable: true }
    );

  useEffect(() => {
    const requestPermissionIfNeeded = async () => {
      const { status } = await Calendar.getCalendarPermissionsAsync();

      if (status === "undetermined") {
        const { status: newStatus } =
          await Calendar.requestCalendarPermissionsAsync();
      } else if (status === "denied") {
        alertaFalhaNaPermissao();
      }
    };

    requestPermissionIfNeeded();

    if (selected) {
      buscarEventos(selected);
    }
  }, [selected]);

  async function buscarEventos(data) {
    const { data: eventosDoDia, error } = await supabase
      .from("agendamento")
      .select("*")
      .eq("data_evento", data)
      .eq("id_paciente", id_paciente);

    if (error) console.error(error);
    else setEventos(eventosDoDia || []);
  }

  async function excluirEventos(idEvento) {
      const { error } = await supabase
      .from("agendamento")
      .delete()
      .eq("id", idEvento);

    if (error) console.error(error);
    else buscarEventos(selected);
  }

  const handleDayPress = (day) => {
    setSelected(day.dateString);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.mainHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color="#321904" />
            </TouchableOpacity>
            <Text style={styles.mainHeaderTitle}>Agenda</Text>
          </View>

          {/* Cabeçalho */}
          <View style={styles.header}>
            <Ionicons name="calendar-outline" size={24} color="#FF8C42" />
            <Text style={styles.headerTitle}>Agenda de Cuidados</Text>
          </View>

          {/* Card do calendário */}
          <View style={styles.cardCalendario}>
            <Text style={styles.dataSelecionadaTitulo}>Data selecionada</Text>
            <Text style={styles.dataSelecionadaTexto}>
              {selected
                ? new Date(selected + "T00:00:00").toLocaleDateString("pt-BR", {
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "Selecione uma data"}
            </Text>

            <CalendarView
              onDayPress={handleDayPress}
              markedDates={{
                [selected]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedColor: "#FF8C42",
                },
              }}
              monthFormat="MMMM yyyy"
              firstDay={1}
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#321904",
                selectedDayBackgroundColor: "#FF8C42",
                todayTextColor: "#FF8C42",
                arrowColor: "#FF8C42",
                textMonthFontWeight: "bold",
                textDayFontSize: 20,
                textMonthFontSize: 20,
              }}
            />
          </View>

          {/* Agenda do dia */}
          <View style={styles.agendaDiaHeader}>
            <Ionicons name="calendar-outline" size={20} color="#FF8C42" />
            <Text style={styles.agendaDiaTitulo}>Agenda do Dia</Text>
          </View>

          <View style={styles.listaEventos}>
            {eventos.length === 0 ? (
              <Text style={styles.semEventos}>
                Nenhum evento para esta data.
              </Text>
            ) : (
              eventos.map((item) => (
                <View key={item.id} style={styles.eventoCard}>

                  <View style={styles.eventoCabecalho}>

                    <Text style={styles.horarioTexto}>
                      {item.horarios?.inicio} - {item.horarios?.fim}
                    </Text>

                    <View style={styles.tagMedicamento}>
                      <Text style={styles.tagTexto}>
                        {
                          item.categoria && item.categoria.trim() != ""
                          ? item.categoria : "Sem categoria"
                        }
                      </Text>
                    </View>

                    <TouchableOpacity onPress={() => excluirEventos(item.id)}>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#cc3a3a"
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.eventoTitulo}>{item.nome_evento}</Text>

                  {item.descricao ? (
                    <Text style={{fontSize: 18, color: "#555", marginTop: 4}}>
                      {item.descricao}
                    </Text>
                  ) : null}

                </View>
              ))
            )}
          </View>

          {/* Botão flutuante */}
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={() =>
              router.push({
                pathname: "/idoso/adicionarAgendamento",
                params: { id: id_paciente },
              })
            }
          >
            <Ionicons name="add" size={28} color="#ffddc5ff" />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scroll: { padding: 20, paddingBottom: 60 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#321904",
  },

    mainHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    position: "relative",
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
  },
  mainHeaderTitle: { fontSize: 25, fontWeight: "bold", color: "#321904" },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#321904",
    marginBottom: 10,
  },

  cardCalendario: {
    borderWidth: 1,
    borderColor: "#FFD9B3",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  dataSelecionadaTitulo: {
    fontSize: 20,
    color: "#321904",
    marginBottom: 4,
    fontWeight: "500",
  },
  dataSelecionadaTexto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#321904",
    marginBottom: 12,
    textTransform: "capitalize",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  botaoPrincipal: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#FF8C42",
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginRight: 10,
  },
  textoBotaoPrincipal: {
    color: "#fff",
    fontWeight: "bold",
  },
  botaoSecundario: {
    flex: 1,
    flexDirection: "row",
    borderColor: "#FF8C42",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  textoBotaoSecundario: {
    color: "#FF8C42",
    fontWeight: "bold",
  },

  agendaDiaHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  agendaDiaTitulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#321904",
  },

  listaEventos: {
    marginBottom: 20,
  },
  eventoCard: {
    borderWidth: 1,
    borderColor: "#FFD9B3",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
  },
  eventoCabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  horarioTexto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#321904",
  },
  tagMedicamento: {
    backgroundColor: "#FFF0E0",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tagTexto: {
    color: "#FF8C42",
    fontWeight: "600",
    fontSize: 20,
  },
  eventoTitulo: {
    fontSize: 20,
    color: "#321904",
  },
  semEventos: {
    textAlign: "center",
    color: "#999",
    fontStyle: "italic",
    marginTop: 15,
  },

  botaoAdicionar: {
    alignSelf: "center",
    backgroundColor: "#FF8C42",
    borderRadius: 30,
    padding: 14,
    marginTop: 10,
    elevation: 5,
    shadowColor: "#321904",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
