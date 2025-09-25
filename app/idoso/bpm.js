import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getGrantedPermissions, getSdkStatus, initialize, readRecords, requestPermission, SdkAvailabilityStatus } from 'react-native-health-connect';

const checkAvailability = async () => {
    const status = await getSdkStatus();
    if (status === SdkAvailabilityStatus.SDK_AVAILABLE) console.log('SDK is available');
    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE) console.log('SDK is not available');
    if (status === SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) console.log('SDK is not available, provider update required');
};

const requestSamplePermissions = async () => {
    const permissions = await requestPermission([{ accessType: 'read', recordType: 'HeartRate' }]);
    console.log('Granted permissions on request', permissions);
};

const grantedPermissions = async () => {
    const permissions = await getGrantedPermissions();
    console.log('Granted permissions', permissions);
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
            operator: 'between',
            startTime: tempoInicial.toISOString(),
            endTime: tempoFinal.toISOString()
        }
    });
    return records;
}

export default function Bpm() {
    const [bpm, setBpm] = useState(null);
    const [time, setTime] = useState(null);

    const coletaUltimoBpm = async () => {
        try {
            const registros = await leBPMemSegundoPlano();
            if (registros.records.length > 0) {
                const ultimoRegistro = registros.records[registros.records.length - 1];
                if (ultimoRegistro.samples && ultimoRegistro.samples.length > 0) {
                    const ultimoSample = ultimoRegistro.samples[ultimoRegistro.samples.length - 1];
                    setBpm(ultimoSample.beatsPerMinute);
                    setTime(new Date(ultimoSample.time));
                }
            }
        } catch (error) {
            console.log('Houve um erro:', error);
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
    }, []);

    const formatDate = (date) => date ? date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '--/--/----';
    const formatTime = (date) => date ? date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--';

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffffff' }}>
            <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
                {/* Header */}
                <Text style={styles.title}>Batimento Cardíaco</Text>
                <Text style={styles.subtitle}>Sua última medição</Text>

                {/* Heart Card */}
                <View style={styles.card}>
                    <View style={styles.heartContainer}>
                        <FontAwesome6 name="heart-pulse" size={80} color="#DC2626" style={{ animation: 'pulse 1s infinite' }} />
                        <View style={styles.ping}></View>
                    </View>

                    <Text style={styles.bpm}>{bpm ?? '--'}</Text>
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

                <View style={{ width: '100%', marginBottom: 20 }}>
                    <TouchableOpacity style={styles.buttonPermissoes} onPress={checkAvailability}>
                        <Text style={styles.buttonText}>Check Availability</Text>
                    </TouchableOpacity>

                    <View style={{ height: 10 }} />

                    <TouchableOpacity style={styles.buttonPermissoes} onPress={requestSamplePermissions}>
                        <Text style={styles.buttonText}>Request Permissions</Text>
                    </TouchableOpacity>

                    <View style={{ height: 10 }} />

                    <TouchableOpacity style={styles.buttonPermissoes} onPress={grantedPermissions}>
                        <Text style={styles.buttonText}>Get Granted Permissions</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: { fontSize: 24, fontWeight: 'bold', color: '#4f1a04ff', marginTop: 20, textAlign: 'center' },
    subtitle: { fontSize: 16, color: '#4f1a04ff', marginBottom: 20, textAlign: 'center' },
    card: {
        backgroundColor: '#fff9f4ff',
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        width: '100%',
    },
    heartContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    ping: {
        position: 'absolute',
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(220,38,38,0.2)',
        top: 0,
        left: 0,
        zIndex: -1,
    },
    bpm: { fontSize: 64, fontWeight: 'bold', color: '#C2410C' },
    bpmLabel: { fontSize: 18, color: '#EA580C', marginBottom: 12 },
    infoCard: { backgroundColor: 'rgba(249, 245, 239, 0.6)', borderRadius: 12, padding: 16, width: '100%', marginBottom: 20 },
    infoTitle: { color: '#C2410C', fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    infoLabel: { color: '#EA580C', fontSize: 16 },
    infoValue: { color: '#C2410C', fontSize: 16, fontWeight: 'bold' },
    button: { backgroundColor: '#F97316', paddingVertical: 12, paddingHorizontal: 36, borderRadius: 24 },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    buttonPermissoes: { backgroundColor: '#ee8439ff', paddingVertical: 12, paddingHorizontal: 32, borderRadius: 24, alignItems: 'center', },
});
