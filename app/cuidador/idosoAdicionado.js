import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    marginTop: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f7eee5ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageLabel: {
    color: '#321904',
    fontSize: 14,
    marginTop: 4,
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
    maxWidth: 300,
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
