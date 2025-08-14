import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MenuInicial() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.greetingText}>Olá</Text>
          <TouchableOpacity onPress={() => router.push('/perfil')}>
            <Ionicons name="person-outline" size={28} color="#321904" />
          </TouchableOpacity>
        </View>

        {/* Parte laranja */}
        <View style={styles.topBox}></View>

        {/* Parte inferior dos botões*/}
        <View style={styles.bottomBox}>
          <View style={styles.grid}>
            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/formulario')}>
              <Ionicons name="clipboard-outline" size={38} color="#321904" />
              <Text style={styles.menuText}>Formulário</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/remedios')}>
              <Ionicons name="medkit-outline" size={38} color="#321904" />
              <Text style={styles.menuText}>Remédios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/relatorio')}>
              <Ionicons name="heart-outline" size={38} color="#321904" />
              <Text style={styles.menuText}>Relatório</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/agenda')}>
              <Ionicons name="calendar-outline" size={38} color="#321904" />
              <Text style={styles.menuText}>Agenda</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },

  header: {
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  greetingText: {
    fontSize: 18,
    color: '#321904',
    fontWeight: 'bold',
  },

  topBox: {
    flex: 1,
    backgroundColor: '#F28B0C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  bottomBox: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuButton: {
    width: '47%',
    height: '45%',
    backgroundColor: '#E5D9F2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#321904',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 10,
  },
  menuText: {
    marginTop: 8,
    fontSize: 18,
    color: '#321904',
    fontWeight: '500',
  },
});
