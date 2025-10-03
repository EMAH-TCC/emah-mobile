import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../utils/supabase';

async function getUser() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log("Erro: ", error);
    return null;
  }

  return data.user;
}

async function getUserId(userId) {
  const { data, error } = await supabase.from('usuarios').select('id').eq('id_user', userId).single()

  if (error) {
    console.log("Erro busca: ", error);
    return null;
  }

  return data.id
}

async function selectNomeUser(pacienteId) {
  const { data, error } = await supabase
    .from('cuidador')
    .select('nome')
    .eq('id', pacienteId)

  if (error) {
    console.error("Erro ao consultar:", error)
    return null
  }

  return data
}
async function selectPacientes(cuidador_id) {
  const { data, error } = await supabase.rpc('selecionar_pacientes_do_cuidador', { cuidador_id: cuidador_id });

  if (error) {
    console.error("Erro ao inserir consulta:", error)
    return null
  }

  return data
}

export default function MenuInicial() {
  const router = useRouter();
  const [nomeUser, setNomeUser] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const [selectedPaciente, setSelectedPaciente] = useState(null);

  useEffect(() => {
    async function carregarNomeUser() {
      const user = await getUser();
      if (!user) {
        return
      }
      const pacienteId = await getUserId(user.id)
      if (!pacienteId) {
        return
      }
      const data = await selectNomeUser(pacienteId);
      setNomeUser(data[0].nome);
    }
    carregarNomeUser();
  }, []);

  useEffect(() => {
    async function carregarPacientes() {
      const user = await getUser();
      if (!user) {
        return
      }
      const cuidador_id = await getUserId(user.id)
      if (!cuidador_id) {
        return
      }
      const pacientes = await selectPacientes(cuidador_id);
      if (pacientes) {
        setPacientes(pacientes);
      }
    }
    carregarPacientes();
  }, []);
  const abrirMenu = (item, event) => {
    const { pageY } = event.nativeEvent;
    setMenuPosition({ top: pageY - 20, right: 40 });
    setSelectedPaciente(item);
    setModalVisible(true);
  };

  const fecharMenu = () => {
    setModalVisible(false);
    setSelectedPaciente(null);
  };

  const removerPaciente = () => {
    if (selectedRemedio) {
      router.push({
        pathname: '/cuidador/removerPaciente',
        params: selectedPaciente,
      });
      fecharMenu();
    }
  };

  const renderPacientes = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => router.push({
        pathname: '/idoso/menuInicial',
        params: { id: item.id_paciente, nome: item.nome_paciente },
      })}>
        <Text style={styles.cardText}>{item.nome_paciente}</Text>
      </TouchableOpacity>

      {/* Botão de opções 
      <TouchableOpacity
        style={styles.optionsButton}
        onPress={(e) => abrirMenu(item, e)}
      >
        <Ionicons name="ellipsis-vertical" size={20} color="#321904" />
      </TouchableOpacity>*/}
    </View >
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.greetingText}>Olá, {nomeUser}!</Text>
          <TouchableOpacity onPress={() => router.push('/cuidador/perfil')}>
            <Ionicons name="person-outline" size={28} color="#321904" />
          </TouchableOpacity>
        </View>

        {/* Parte laranja */}
        <View style={styles.topBox}></View>

        {/* Parte inferior dos botões */}
        <ScrollView contentContainerStyle={styles.bottomBox}>
          <View style={styles.grid}>

            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/cuidador/inserirCodigoIdoso')}>
              <Ionicons name="person" size={38} color="#321904" />
              <Text style={styles.menuText}>Adicionar Idoso</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={pacientes}
            keyExtractor={(item) => item.id}
            renderItem={renderPacientes}
            ListEmptyComponent={<Text>Idosos não encontrados</Text>}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />

          {/* menu suspenso
          <Modal
            transparent={true}
            visible={modalVisible}
            animationType="fade"
            onRequestClose={fecharMenu}
          >
            /*<TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={fecharMenu}>
              <View style={[styles.menuContainer, { top: menuPosition.top, right: menuPosition.right }]}>
                <TouchableOpacity style={styles.menuItem} onPress={removerPaciente}>
                  <Text style={styles.menuText}>Remover paciente</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>*/}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },

  header: {
    paddingTop: 20,
    position: 'absolute',
    top: 10,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  greetingText: { fontSize: 20, color: '#321904', fontWeight: 'bold' },

  topBox: {
    height: '43%',
    backgroundColor: '#F28B0C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  bottomBox: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 40,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuButton: {
    width: '100%',
    height: 100,
    backgroundColor: '#E5D9F2',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#321904',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginBottom: 18,
  },
  menuText: { marginTop: 8, fontSize: 18, color: '#321904', fontWeight: '500' },
  listContent: { paddingBottom: 20 },
  card: {
    backgroundColor: '#f5ece0ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  cardText: { color: '#321904', fontSize: 20, marginBottom: 4 },
  cardTextPressao: { color: '#321904', fontSize: 20, marginBottom: 4, marginLeft: 90 },
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
  barraHorizontal: {
    height: 1,
    backgroundColor: 'grey',
    width: 30,
    marginLeft: 80,
    paddingInline: 17,
  }
});