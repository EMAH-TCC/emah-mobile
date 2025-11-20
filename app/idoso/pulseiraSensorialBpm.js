import { decode } from 'base-64';
import { useEffect, useState } from 'react';
import { Button, PermissionsAndroid, Text, View } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

export default function BLEHeartRate() {
    const [device, setDevice] = useState(null);
    const [bpm, setBpm] = useState("");

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
                    // Define o estado na sua aplicação
                    setBpm(bpmString);
                } else {
                    console.log("Falha ao decodificar o valor de BPM.");
                }
            }
        );

    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 24, marginBottom: 20 }}>BPM: {bpm}</Text>
            <Button title="Conectar ao ESP32" onPress={conectar} />
        </View>
    );
}
