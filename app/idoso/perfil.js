import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/perfilStyles';
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