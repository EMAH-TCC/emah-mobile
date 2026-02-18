import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/retornoCuidadorStyles';

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