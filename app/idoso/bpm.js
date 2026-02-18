import { Ionicons } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  getGrantedPermissions,
  getSdkStatus,
  initialize,
  readRecords,
  requestPermission,
  SdkAvailabilityStatus,
} from "react-native-health-connect";

import { styles } from "../../styles/bpmStyles";
import { supabase } from "../../utils/supabase";
import { getUser, getUserId } from "../../utils/userData";

const checkAvailability = async () => {
  const status = await getSdkStatus();
  if (status === SdkAvailabilityStatus.SDK_AVAILABLE)
    console.log("SDK is available");
  if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE)
    console.log("SDK is not available");
  if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED)
    console.log("SDK is not available, provider update required");
};

const requestSamplePermissions = async () => {
  const permissions = await requestPermission([
    { accessType: "read", recordType: "HeartRate" },
  ]);
  console.log("Granted permissions on request", permissions);
};

const grantedPermissions = async () => {
  const permissions = await getGrantedPermissions();
  console.log("Granted permissions", permissions);
  return permissions;
};

const initializeHealthConnect = async () => {
  const isInitialized = await initialize();
  console.log({ isInitialized });
};

async function leBPMemSegundoPlano() {
  const tempoFinal = new Date();
  const tempoInicial = new Date(tempoFinal.getTime() - 60 * 60 * 1000);
  const records = await readRecords("HeartRate", {
    timeRangeFilter: {
      operator: "between",
      startTime: tempoInicial.toISOString(),
      endTime: tempoFinal.toISOString(),
    },
  });
  return records;
}

async function addBPM(pacienteId, bpm) {
  const { data, error } = await supabase
    .from("frequencia_cardiaca")
    .insert([{ id_paciente: pacienteId, bpm: bpm }])
    .select();

  if (error) {
    console.error("Erro ao inserir batimento cardíaco:", error);
    return null;
  }

  return data;
}

async function salvarBatimentoNoBanco(pacienteId, bpm) {
  console.log(pacienteId);
  if (!pacienteId || !bpm) {
    return;
  }
  try {
    await addBPM(pacienteId, bpm);
    console.log("Batimento adicionado:", bpm);
  } catch (error) {
    console.log("Erro ao salvar batimento:", error);
  }
}
export default function Bpm() {
  const router = useRouter();
  const [bpm, setBpm] = useState(null);
  const [time, setTime] = useState(null);
  const [pacienteId, setPacienteId] = useState(null);

  useEffect(() => {
    async function carregarUser() {
      const user = await getUser();
      if (!user) {
        return;
      }
      const pacienteId = await getUserId(user.id);

      setPacienteId(pacienteId);
      if (!pacienteId) {
        return;
      }
    }
    carregarUser();
  }, []);

  const coletaUltimoBpm = async () => {
    try {
      const registros = await leBPMemSegundoPlano();
      if (registros.records.length > 0) {
        const ultimoRegistro = registros.records[registros.records.length - 1];
        if (ultimoRegistro.samples && ultimoRegistro.samples.length > 0) {
          const ultimoSample =
            ultimoRegistro.samples[ultimoRegistro.samples.length - 1];
          setBpm(ultimoSample.beatsPerMinute);
          setTime(new Date(ultimoSample.time));
          console.log("Coleta");
          salvarBatimentoNoBanco(pacienteId, bpm);
        }
      }
    } catch (error) {
      console.log("Houve um erro:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await initializeHealthConnect();
      await requestSamplePermissions();
      await grantedPermissions();
      await coletaUltimoBpm();
    };
    init();
  }, [pacienteId]);

  const formatDate = (date) =>
    date
      ? date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      : "--/--/----";
  const formatTime = (date) =>
    date
      ? date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      : "--:--";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffffff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#321904" />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={styles.title}>Batimento Cardíaco</Text>
          </View>
        </View>

        {/* Conteúdo rolável */}
        <ScrollView
          contentContainerStyle={{ padding: 24, alignItems: "center" }}
        >
          {/* Heart Card */}
          <View style={styles.card}>
            <View style={styles.heartContainer}>
              <FontAwesome6
                name="heart-pulse"
                size={80}
                color="#DC2626"
                style={{ animation: "pulse 1s infinite" }}
              />
              <View style={styles.ping}></View>
            </View>

            <Text style={styles.bpm}>{bpm ?? "--"}</Text>
            <Text style={styles.bpmLabel}>BPM</Text>
          </View>

          {/* Measurement Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Última Medição</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Data:</Text>
              <Text style={styles.infoValue}>{formatDate(time)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Horário:</Text>
              <Text style={styles.infoValue}>{formatTime(time)}</Text>
            </View>
          </View>

          {/* Botões */}
          {/*
          <View style={{ width: "100%", marginBottom: 20 }}>
            <TouchableOpacity
              style={styles.buttonPermissoes}
              onPress={checkAvailability}
            >
              <Text style={styles.buttonText}>Check Availability</Text>
            </TouchableOpacity>

            <View style={{ height: 10 }} />

            <TouchableOpacity
              style={styles.buttonPermissoes}
              onPress={requestSamplePermissions}
            >
              <Text style={styles.buttonText}>Request Permissions</Text>
            </TouchableOpacity>

            <View style={{ height: 10 }} />

            <TouchableOpacity
              style={styles.buttonPermissoes}
              onPress={grantedPermissions}
            >
              <Text style={styles.buttonText}>Get Granted Permissions</Text>
            </TouchableOpacity>
          </View>
*/}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
