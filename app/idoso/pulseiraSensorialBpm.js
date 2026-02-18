import { Ionicons } from '@expo/vector-icons';
import { decode } from 'base-64';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';
import { PermissionsAndroid, Text, TouchableOpacity, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { styles } from '../../styles/pulseiraSensorialStyles';
import { supabase } from "../../utils/supabase";
import { getPacienteId, getUser } from "../../utils/userData";

const manager = new BleManager();

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
            const pacienteId = await getPacienteId(user.id);

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
            if (device.name === "EMAH") {
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