import { Ionicons } from '@expo/vector-icons';
import { decode } from 'base-64';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { supabase } from "../../utils/supabase";

const manager = new BleManager();

async function getUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        console.log("Erro: ", error);
        return null;
    }

    return data.user;
}

async function getUserId(userId) {
    const { data, error } = await supabase
        .from("paciente")
        .select("id")
        .eq("id_user", userId)
        .single();

    if (error) {
        console.log("Erro busca: ", error);
        return null;
    }

    return data.id;
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

export default function BLEHeartRate() {
    const router = useRouter();

    const [device, setDevice] = useState(null);
    const [bpm, setBpm] = useState("");
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

    async function requestPermissions() {
        await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);
    }

    useEffect(() => {
        requestPermissions();
    }, []);

    const conectar = () => {
        console.log("Escaneando");
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.error(error);
                return;
            }

            if (device.name === 'EMAH') {
                console.log('Encontramos:', device.name);
                manager.stopDeviceScan();

                device.connect()
                    .then(d => d.discoverAllServicesAndCharacteristics())
                    .then(d => {
                        setDevice(d);
                        receberBPM(d);
                    });
            }
        });
    };

    const decodificarBPM = (dadosBase) => {
        if (!dadosBase) {
            return null;
        }

        const dadoBinario = decode(dadosBase);
        const tamanho = dadoBinario.length;

        if (tamanho < 2) {
            console.log("Dado incompleto.")
            return null;
        }

        const bytes = new Uint8Array(tamanho);

        for (let index = 0; index < tamanho; index++) {
            bytes[index] = dadoBinario.charCodeAt(index);
        }
        const dadoView = new DataView(bytes.buffer);
        const flags = dadoView.getUint8(0);
        const bpm16Bit = (flags & 0x01) === 1;

        let bpm;
        const bpmOffset = 1;

        try {
            if (bpm16Bit) {
                bpm = dadoView.getUint16(bpmOffset, true);
            } else {
                bpm = dadoView.getUint8(bpmOffset);
            }
            return bpm;

        } catch (e) {
            console.error("Erro ao ler dados binários do BPM:", e);
            return null;
        }

    }

    const receberBPM = async (device) => {
        const serviceUUID = '180D';
        const characteristicUUID = '2A37';

        device.monitorCharacteristicForService(
            serviceUUID,
            characteristicUUID,
            (error, characteristic) => {
                if (error) {
                    console.error(error);
                    return;
                }

                const bpmCaracteristica = characteristic.value;

                console.log("Valor bruto BLE:", bpmCaracteristica);

                const bpm = decodificarBPM(bpmCaracteristica);

                if (bpm !== null) {
                    const bpmString = bpm.toString();
                    console.log("BPM extraído:", bpmString);

                    const bpmNumerico = parseInt(bpmString, 10);

                    setBpm(bpmString);
                    salvarBatimentoNoBanco(pacienteId, bpmNumerico);

                } else {
                    console.log("Falha ao decodificar o valor de BPM.");
                }
            }
        );

    };

    return (
        <View style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <View style={styles.backCircle}>
                        <Ionicons name="arrow-back" size={24} color="#321904" />
                    </View>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Monitor de Batimentos</Text>
            </View>

            <View style={styles.container}>

                <View style={styles.bpmBox}>
                    <Ionicons name="heart" size={40} color="#F28B0C" />
                    <Text style={styles.bpmText}>{bpm || "--"} BPM</Text>
                </View>

                <TouchableOpacity style={styles.primaryButton} onPress={conectar}>
                    <Text style={styles.buttonText}>Conectar à pulseira sensorial</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        height: 70,
        justifyContent: "center",
        marginBottom: 15,
    },
    backButton: {
        position: "absolute",
        left: 20,
        top: 20,
    },
    backCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#321904",
        justifyContent: "center",
        alignItems: "center",
        top: 20,
    },
    headerTitle: {
        left: 15,
        fontSize: 25,
        color: "#321904",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        top: 20,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    bpmBox: {
        backgroundColor: "#f7eee5ff",
        width: "100%",
        padding: 65,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 380,
        elevation: 3,
        shadowColor: "#321904",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    bpmText: {
        fontSize: 40,
        fontWeight: "bold",
        color: "#321904",
        marginTop: 10,
    },
    primaryButton: {
        backgroundColor: "#F28B0C",
        paddingVertical: 16,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: "100%",
        alignItems: "center",
    },
    buttonText: {
        color: "#321904",
        fontSize: 20,
        fontWeight: "bold",
    },
});
