import { useRouter } from 'expo-router';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/indexStyles';
export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Nome do aplicativo */}
        <View style={styles.contentContainer}>
          {/* Imagem */}
          <Image
            source={require('../../assets/images/emah_abraco.png')}
            style={styles.image}
            resizeMode="contain"
          />

          <View style={styles.textContainer}>
            <Text style={styles.title}>EMAH</Text>
            <Text style={styles.subtitle}>Plataforma de monitoramento da saúde</Text>
          </View>
        </View>

        {/* Botões */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => router.push('/cadastro')}
          >
            <Text style={styles.buttonText}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}
