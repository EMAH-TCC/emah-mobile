import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    .from('paciente')
    .select('nome')
    .eq('id', pacienteId)

  if (error) {
    console.error("Erro ao consultar:", error)
    return null
  }

  return data
}
export default function MenuInicial() {
  const router = useRouter();
  const [nomeUser, setNomeUser] = useState([]);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.greetingText}>Olá, {nomeUser}!</Text>
          <TouchableOpacity onPress={() => router.push('/idoso/perfil')}>
            <Ionicons name="person-outline" size={28} color="#321904" />
          </TouchableOpacity>
        </View>

        {/* Parte laranja */}
        <View style={styles.topBox}></View>

        {/* Parte inferior dos botões */}
        <ScrollView contentContainerStyle={styles.bottomBox}>
          <View style={styles.grid}>
            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/idoso/formulario')}>
              <Ionicons name="clipboard-outline" size={38} color="#321904" />
              <Text style={styles.menuText}>Formulário</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/idoso/remedios')}>
              <Ionicons name="medkit-outline" size={38} color="#321904" />
              <Text style={styles.menuText}>Remédios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/idoso/relatorio')}>
              <Ionicons name="heart-outline" size={38} color="#321904" />
              <Text style={styles.menuText}>Relatório</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/idoso/agenda')}>
              <Ionicons name="calendar-outline" size={38} color="#321904" />
              <Text style={styles.menuText}>Agenda</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/idoso/bpm')}>
              <Ionicons name="heart-circle" size={38} color="#321904" />
              <Text style={styles.menuText}>Batimentos</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={() => router.push('/idoso/adicionarCuidador')}>
              <Ionicons name="person" size={38} color="#321904" />
              <Text style={styles.menuText}>Cuidadores</Text>
            </TouchableOpacity>
          </View>
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
    height: '37%',
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
    width: '47%',
    aspectRatio: 1, // mantém proporção quadrada
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
});
