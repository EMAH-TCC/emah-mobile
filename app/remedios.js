import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Remedios() {
  const router = useRouter();

  const [remedios, setRemedios] = useState([
    { id: '1', nome: 'Nome do remédio', dose: 'Dose', frequencia: 'Frequência', horario: 'Horário' },
    { id: '2', nome: 'Nome do remédio', dose: 'Dose', frequencia: 'Frequência', horario: 'Horário' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRemedio, setSelectedRemedio] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  const abrirMenu = (item, event) => {
    const { pageY } = event.nativeEvent;
    setMenuPosition({ top: pageY - 20, right: 40 });
    setSelectedRemedio(item);
    setModalVisible(true);
  };

  const fecharMenu = () => {
    setModalVisible(false);
    setSelectedRemedio(null);
  };

  const removerRemedio = () => {
    if (selectedRemedio) {
      setRemedios(remedios.filter(remedio => remedio.id !== selectedRemedio.id));
      fecharMenu();
    }
  };

  const alterarDados = () => {
    if (selectedRemedio) {
      router.push({
        pathname: '/editarRemedio',
        params: selectedRemedio,
      });
      fecharMenu();
    }
  };

  const renderRemedio = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>{item.nome}</Text>
      <Text style={styles.cardText}>{item.dose}</Text>
      <Text style={styles.cardText}>{item.frequencia}</Text>
      <Text style={styles.cardText}>{item.horario}</Text>

      {/* Botão de opções */}
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={(e) => abrirMenu(item, e)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#321904" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            
            {/* Header com botão de voltar e o titulo */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <View style={styles.backCircle}>
                  <Ionicons name="arrow-back" size={24} color="#321904" />
                </View>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Remédios</Text>
            </View>

            {/* lista de remedios */}
            <FlatList
              data={remedios}
              keyExtractor={(item) => item.id}
              renderItem={renderRemedio}
              contentContainerStyle={styles.listContent}
              scrollEnabled={false}
            />

            {/* botão para adicionar remedio */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/adicionarRemedio')} // navegação para a nova tela
            >
              <Ionicons name="add-circle-outline" size={20} color="#321904" style={{ marginRight: 8 }} />
              <Text style={styles.addButtonText}>Adicionar remédio</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Botão da tela inicial */}
        <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/menuInicial')}>
          <Ionicons name="home-outline" size={28} color="#321904" />
        </TouchableOpacity>

        {/* menu suspenso */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={fecharMenu}
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={fecharMenu}>
            <View style={[styles.menuContainer, { top: menuPosition.top, right: menuPosition.right }]}>
              <TouchableOpacity style={styles.menuItem} onPress={removerRemedio}>
                <Text style={styles.menuText}>Remover remédio</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={alterarDados}>
                <Text style={styles.menuText}>Alterar dados</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1 },
  container: { flex: 1, paddingHorizontal: 20, paddingVertical: 10, justifyContent: 'flex-start' },

  header: {
    height: 60,
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 10,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#321904',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#321904',
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },

  listContent: { paddingBottom: 20 },
  card: {
    backgroundColor: '#C7BEC9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  cardText: { color: '#321904', fontSize: 16, marginBottom: 4 },
  optionsButton: { position: 'absolute', top: 10, right: 10 },

  addButton: {
    backgroundColor: '#F28B0C',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 6,
    marginTop: 20,
    marginBottom: 100,
  },
  addButtonText: { color: '#321904', fontWeight: 'bold', fontSize: 16 },

  homeButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 14,
    elevation: 5,
    shadowColor: '#321904',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  modalOverlay: { flex: 1, backgroundColor: 'transparent' },
  menuContainer: {
    position: 'absolute',
    backgroundColor: '#F7F2FA',
    borderRadius: 8,
    paddingVertical: 10,
    width: 180,
    elevation: 5,
  },
  menuItem: { paddingVertical: 12, paddingHorizontal: 16 },
  menuText: { fontSize: 16, color: '#321904' },
});
