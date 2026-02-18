import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/menuInicialidosoStyles';
import { supabase } from '../../utils/supabase';
import { getUser, getUserId, selectNomeUser } from "../../utils/userData";

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
        <View style={styles.topBox}>
          <Image
            source={require('../../assets/images/emah_abraco.png')}
            style={styles.topImage}
            resizeMode="contain"
          />
        </View>

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