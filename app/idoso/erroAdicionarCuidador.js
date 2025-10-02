import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ErroAdicionarCuidador({ route }) {
  const router = useRouter();

  const { nomeCuidador = 'Fulano' } = route?.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Ícone triste */}
        <View style={styles.header}>
          <Ionicons name="sad-outline" size={80} color="#321904" />
        </View>

        {/* Texto */}
        <View style={styles.content}>
          <Text style={styles.infoText}>
            Não foi possível adicionar {nomeCuidador} como cuidador
          </Text>
        </View>

        {/* Botões */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/idoso/menuInicial')}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/idoso/codigoDoIdoso')}
          >
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>

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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 20,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoText: {
    color: '#321904',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    maxWidth: 320,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    maxWidth: 300,
  },
  primaryButton: {
    backgroundColor: '#F28B0C',
  },
  secondaryButton: {
    backgroundColor: '#FBB65A',
  },
  buttonText: {
    color: '#321904',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
