import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/adicionarCuidador';

export default function AdicionarCuidador() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <View style={styles.backCircle}>
            <Ionicons name="arrow-back" size={24} color="#321904" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.container}>

        {/* Ícone */}
        <View style={styles.iconContainer}>
          <Ionicons name="person-add-outline" size={60} color="#321904" />
        </View>

        {/* Texto */}
        <Text style={styles.title}>Deseja adicionar um cuidador?</Text>

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/idoso/codigoDoIdoso')} //tela que ira mostrar o codigo
          >
            <Text style={styles.buttonText}>Sim</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/idoso/menuInicial')} //tela inicial (menu) do aplicativo
          >
            <Text style={styles.buttonText}>Não</Text>
          </TouchableOpacity>
        </View>

        {/* Texto informativo */}
        <Text style={styles.infoText}>Você será redirecionado para o menu inicial</Text>

      </View>
    </SafeAreaView>
  );
}
