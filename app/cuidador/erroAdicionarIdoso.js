import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/retornoIdosoStyles';

export default function ErroAdicionarIdoso({ route }) {
  const router = useRouter();
  const params = useLocalSearchParams();

  const nomeIdoso = params.nome_paciente

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
            Não foi possível te adicionar como cuidador de {nomeIdoso}
          </Text>
        </View>

        {/* Botões */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/cuidador/menuInicial')}
          >
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/cuidador/inserirCodigoIdoso')}
          >
            <Text style={styles.buttonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}
