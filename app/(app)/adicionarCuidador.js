import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdicionarCuidador() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
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
            onPress={() => router.push('/codigoDoIdoso')} //tela que ira mostrar o codigo
          >
            <Text style={styles.buttonText}>Sim</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/menuInicial')} //tela inicial (menu) do aplicativo
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

// Estilos
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    color: '#321904',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#F28B0C',
  },
  primaryButton: {
    backgroundColor: '#F28B0C',
  },
  secondaryButton: {
    backgroundColor: '#fff',
  },
  buttonText: {
    color: '#321904',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoText: {
    color: '#321904',
    fontSize: 14,
    textAlign: 'center',
  },
});
