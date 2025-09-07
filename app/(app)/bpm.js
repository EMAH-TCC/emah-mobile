import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { getGrantedPermissions, getSdkStatus, initialize, readRecords, requestPermission, SdkAvailabilityStatus } from 'react-native-health-connect';

const checkAvailability = async () => {
    const status = await getSdkStatus();
    if (status === SdkAvailabilityStatus.SDK_AVAILABLE) {
        console.log('SDK is available');
    }

    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) {
        console.log('SDK is not available');
    }

    if (
        status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED
    ) {
        console.log('SDK is not available, provider update required');
    }
};

const requestSamplePermissions = async () => {
    const permissions = requestPermission([
        {
            accessType: 'read',
            recordType: 'HeartRate',
        }
    ]);
    console.log('Granted permissions on request ', permissions);
};

const grantedPermissions = () => {
    getGrantedPermissions().then((permissions) => {
        console.log('Granted permissions ', permissions);
    });
};

const initializeHealthConnect = async () => {
    const isInitialized = await initialize();
    console.log({ isInitialized });
};

async function leBPMemSegundoPlano() {
    var tempoFinal = new Date
    var tempoInicial = new Date(tempoFinal.getTime() - (60 * 60 * 1000))
    const records = await readRecords("HeartRate", {
        timeRangeFilter: {
            operator: 'between',
            startTime: tempoInicial.toISOString(),
            endTime: tempoFinal.toISOString()
        }
    });
    return records
}

async function insereBpmNoBanco() {
    leBPMemSegundoPlano().then(records => console.log(records))
}

export default function Bpm() {
    const [bpm, setBpm] = useState(null)
    const [time, setTime] = useState(null)

    const coletaUltimoBpm = async () => {
        try {
            const registros = await leBPMemSegundoPlano();
            if (registros.records.length > 0) {
                const ultimoRegistro = registros.records[registros.records.length - 1]
                if (ultimoRegistro.samples && ultimoRegistro.samples.length > 0) {
                    const ultimoSample = ultimoRegistro.samples[ultimoRegistro.samples.length - 1]

                    setBpm(ultimoSample.beatsPerMinute)
                    setTime(ultimoSample.time)
                    console.log(`Esse foi o batimento cardíaco: ${bpm} coletado pelo Health Connect na hora ${time} na última hora. `)

                }
            }
        } catch (error) {
            console.log('Houve um erro: ', error)
        }
    };

    useEffect(() => {
        const init = async () => {
            await initializeHealthConnect();
            await requestSamplePermissions();
            const granted = await grantedPermissions();
            await coletaUltimoBpm();
        };

        init();
    }, []);

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.header}>Seus Batimentos Cardíacos</Text>
                </View>
                <View style={styles.container}>
                    <FontAwesome6 name="heart-pulse" size={100} color="darkred" />
                </View>
                <View style={styles.container}>
                    <Button title="Check availability" onPress={checkAvailability} />
                    <Button
                        title="Request sample permissions"
                        onPress={requestSamplePermissions}
                    />
                    <Button title="Get granted permissions" onPress={grantedPermissions} />
                </View>
                <View style={styles.container}>
                    <Text>
                        BPM: {bpm}
                    </Text>
                    <Text>
                        Data de Criação: {time}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18
    },
    header: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#F28B0C',
        alignItems: 'center',
        justifyContent: 'center',
        textAlignVertical: 'center',
        height: 90,
        fontSize: 20
    }
});
