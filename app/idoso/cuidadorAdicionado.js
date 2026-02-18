import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/retornoCuidadorStyles';

export default function CuidadorAdicionado({ route }) {
  const router = useRouter();

  //devera recebe os dados do cuidador (nome e foto)
  const { nomeCuidador = 'Fulano', fotoCuidador = null } = route?.params || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Header: Foto do perfil */}
        <View style={styles.header}>
          {fotoCuidador ? (
            <Image source={{ uri: fotoCuidador }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImage}>
              <Ionicons name="person-outline" size={40} color="#F28B0C" />
            </View>
          )}
          <Text style={styles.imageLabel}>Foto de perfil do cuidador</Text>
        </View>

        {/* Texto do  meio */}
        <View style={styles.content}>
          <Text style={styles.infoText}>
            {nomeCuidador} foi adicionado como seu cuidador
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
            <Text style={styles.buttonText}>Adicionar mais um cuidador</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

