import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../utils/supabase';

const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error.message);
    } else {
        console.log('User signed out successfully.');
    }
};
export default function Perfil() {

    const router = useRouter();

    return (
        <SafeAreaView style={styles.safeArea}>
            
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#321904" />
            </TouchableOpacity>


            <View style={styles.container}>

                <View style={styles.topBox}>
                    <Text style={styles.greetingText}>Perfil</Text>
                    <Ionicons name="person-outline" size={80} color="#321904" />

                    <Text style={styles.profileName}>Nome do idoso</Text>
                </View>

                <View style={styles.middleButtons}>
                    <TouchableOpacity style={[styles.button, styles.primaryButton]}
                        onPress={() => router.push('/idoso/dadosConta')}>
                        <Text style={styles.buttonText}>Dados da minha conta</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.primaryButton]}
                        onPress={() => router.push('/idoso/contatosEmergencia')}>
                        <Text style={styles.buttonText}>Contatos de emergência</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.button, styles.primaryButton]}
                        onPress={() => router.push('/idoso/dadosSaude')}>
                        <Text style={styles.buttonText}>Meus dados de saúde</Text>
                    </TouchableOpacity>

                     <TouchableOpacity style={[styles.button, styles.primaryButton]}
                        onPress={() => router.push('/idoso/ajuda')}>
                        <Text style={styles.buttonText}>Ajuda/Suporte</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.signOutButton]} onPress={signOut}>
                        <Text style={styles.buttonText}>Sair da Conta</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#321904",
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 15,
        zIndex: 10,
        position: 'absolute',
        top: 20,
    },

    container: {
        flex: 1,
        justifyContent: 'space-between'
    },

    topBox: {
        backgroundColor: '#fdba62ff',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        paddingVertical: 50,
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingTop: 60,
    },

    greetingText: {
        fontSize: 25,
        color: '#321904',
        fontWeight: 'bold',
        marginBottom: 15,
        marginTop: -20,
    },

    profileName: {
        fontSize: 20,
        color: '#321904',
        marginTop: 10,
        fontWeight: "600"
    },

    middleButtons: {
        width: "100%",
        alignItems: "center",
        marginTop: 0,
        gap: 20
    },

    buttonContainer: {
        width: '100%',
        maxWidth: 370,
        alignSelf: 'center',
        marginBottom: 50,
    },

    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        width: '85%',
        alignSelf: "center"
    },

    primaryButton: {
        backgroundColor: '#F28B0C',
    },

    signOutButton: {
        backgroundColor: '#FBB65A',
    },

    buttonText: {
        color: '#321904',
        fontWeight: 'bold',
        fontSize: 20,
    },
});
