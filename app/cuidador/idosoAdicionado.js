import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/retornoIdosoStyles';

export default function IdosoAdicionado() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const nomeIdoso = params.nome;
  console.log(nomeIdoso)

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Foto do perfil */}

        {/*fotoIdoso ? (
            <Image source={{ uri: fotoIdoso }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImage}>
              <Ionicons name="person-outline" size={40} color="#F28B0C" />
            </View>
          )}
          <Text style={styles.imageLabel}>Foto de perfil do idoso</Text>
        </View>
        {/* Texto do meio */}
        <View style={styles.content}>
          <Text style={styles.infoText}>
            Você foi adicionado como cuidador de {nomeIdoso}
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
            <Text style={styles.buttonText}>Adicionar mais um idoso</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}
