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
import { Calendar as CalendarView } from "react-native-calendars";
import { supabase } from "../../utils/supabase";

export default function Agenda() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idPaciente = params.id;
  const id_paciente = Number(idPaciente);

  const [selected, setSelected] = useState("");

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

      console.log("Status inicial da permissão:", status);

      if (status === "undetermined") {
        console.log("Status indeterminado. Solicitando permissão...");
        const { status: newStatus } =
          await Calendar.requestCalendarPermissionsAsync();
        console.log("Novo status após a solicitação:", newStatus);
      } else if (status === "denied") {
        console.log("Permissão negada anteriormente.");
        alertaFalhaNaPermissao();
      } else {
        console.log("Permissão já concedida.");
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
    else setEventos(eventos);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView style={styles.scrollContent}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <View style={styles.backCircle}>
                  <Ionicons name="arrow-back" size={24} color="#321904" />
                </View>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Agenda</Text>
            </View>

            <CalendarView
              onDayPress={(day) => {
                setSelected(day.dateString);
                console.log("selected day", day);
              }}
              markedDates={{
                [selected]: {
                  selected: true,
                  disableTouchEvent: true,
                  selectedDotColor: "orange",
                },
              }}
            />
          </View>
        </ScrollView>
        <View>
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={() => router.push({
                pathname: '/idoso/adicionarAgendamento',
                params: { id: id_paciente },
              })
            }
          >
            <Ionicons name="add" size={28} color="#321904" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

async function getDefaultCalendarSource() {
  const defaultCalendar = await Calendar.getDefaultCalendarAsync();
  return defaultCalendar.source;
}

async function createCalendar() {
  const defaultCalendarSource =
    Platform.OS === "ios"
      ? await getDefaultCalendarSource()
      : { isLocalAccount: true, name: "Expo Calendar" };

  const newCalendarID = await Calendar.createCalendarAsync({
    title: "Expo Calendar",
    color: "blue",
    entityType: Calendar.EntityTypes.EVENT,
    sourceId: defaultCalendarSource.id,
    source: defaultCalendarSource,
    name: "internalCalendarName",
    ownerAccount: "personal",
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });
  console.log(`Your new calendar ID is: ${newCalendarID}`);
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { padding: 17 },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "flex-start",
  },
  header: {
    height: 60,
    justifyContent: "center",
    marginBottom: 20,
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
  botaoAdicionar: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    padding: 14,
    elevation: 5,
    shadowColor: "#321904",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
