import {
    getGrantedPermissions,
    getSdkStatus,
    initialize,
    readRecords,
    requestPermission,
    SdkAvailabilityStatus,
} from "react-native-health-connect";
import { supabase } from "../utils/supabase";

export const checkAvailability = async () => {
    const status = await getSdkStatus();
    if (status === SdkAvailabilityStatus.SDK_AVAILABLE)
        console.log("SDK is available");
    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE)
        console.log("SDK is not available");
    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED)
        console.log("SDK is not available, provider update required");
};

export const requestSamplePermissions = async () => {
    const permissions = await requestPermission([
        { accessType: "read", recordType: "HeartRate" },
    ]);
    console.log("Granted permissions on request", permissions);
};

export const grantedPermissions = async () => {
    const permissions = await getGrantedPermissions();
    console.log("Granted permissions", permissions);
    return permissions;
};

export const initializeHealthConnect = async () => {
    const isInitialized = await initialize();
    console.log({ isInitialized });
};

export async function leBPMemSegundoPlano() {
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

export async function addBPM(pacienteId, bpm) {
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

export async function salvarBatimentoNoBanco(pacienteId, bpm) {
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