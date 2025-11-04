import { Ionicons } from '@expo/vector-icons';
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

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.topBox}>
                    {/* Cabeçalho */}
                    <Text style={styles.greetingText}>Perfil</Text>
                    <Ionicons name="person-outline" size={100} color="#321904" />
                </View>
                {/* Botão Sair */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={signOut}>
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
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },

    topBox: {
        backgroundColor: '#F28B0C',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        paddingVertical: 50,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    greetingText: {
        fontSize: 22,
        color: '#321904',
        fontWeight: 'bold',
        marginBottom: 15,
    },
    profileIcon: {
        marginTop: 5,
    },

    buttonContainer: {
        width: '100%',
        maxWidth: 300,
        alignSelf: 'center',
        marginBottom: 50,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    primaryButton: {
        backgroundColor: '#F28B0C',
    },
    buttonText: {
        color: '#321904',
        fontWeight: 'bold',
        fontSize: 16,
    },
});