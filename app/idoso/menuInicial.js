import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../utils/supabase';
import { getUser, getUserId, selectNomeUser } from '../../utils/userData';

export default function MenuInicial() {
  const router = useRouter();
  const [nomeUser, setNomeUser] = useState([]);
  const params = useLocalSearchParams();
  const [tipo_usuario, setTipoUsuario] = useState(null);
  const [paciente_id, setPaciente_Id] = useState(null);

  useEffect(() => {
    async function carregarNomeUser() {

      const user = await getUser();
      if (!user) {
        return
      }

      const idPacienteParam = params.id;

      let pacienteId = null;

      if (idPacienteParam) {
        pacienteId = Number(idPacienteParam);
      } else {
        pacienteId = await getUserId(user.id);
      }
      setPaciente_Id(pacienteId);
      if (!pacienteId) {
        return
      }
      const data = await selectNomeUser(pacienteId);
      setNomeUser(data[0].nome);
    }
    carregarNomeUser();
  }, []);

  useEffect(() => {
    async function getTipoUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data, error } = await supabase.from("usuarios").select("tipo_usuario").eq("id_user", session.user.id).single();
        if (data) {
          setTipoUsuario(data.tipo_usuario);
          if (data.tipo_usuario === "paciente") {
            tipo_usuario = "paciente";
          } else if (data.tipo_usuario === "cuidador") {
            tipo_usuario = "cuidador";
          }
        }
      }
    }
    getTipoUser();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Cabeçalho */}
        <View style={styles.header}>
          {tipo_usuario === "cuidador" && (
            <Text style={styles.greetingText}>Menu do paciente: {nomeUser}</Text>
          )}

          {tipo_usuario === "paciente" && (
            <Text style={styles.greetingText}>Olá, {nomeUser}!</Text>
          )}

          <TouchableOpacity onPress={() => router.push('/idoso/perfil')}>
            <Ionicons name="person-outline" size={28} color="#321904" />
          </TouchableOpacity>
        </View>

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
            {tipo_usuario === "paciente" && (
              <TouchableOpacity style={styles.menuButton} onPress={() => router.push(
                {
                  pathname: '/idoso/formulario',
                  params: { id: paciente_id },
                }
              )}>
                <Ionicons name="clipboard-outline" size={38} color="#321904" />
                <Text style={styles.menuText}>Registro Diário</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.menuButton} onPress={() => router.push({
              pathname: '/idoso/remedios',
              params: { id: paciente_id },
            })}>
              <Ionicons name="medkit-outline" size={38} color="#321904" />
              <Text style={styles.menuText}>Remédios</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={() => router.push(
              {
                pathname: '/idoso/relatorio',
                params: { id: paciente_id },
              }
            )}>
              <Ionicons name="heart-outline" size={38} color="#321904" />
              <Text style={styles.menuText}>Relatório</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton} onPress={() => router.push({
              pathname: '/idoso/agenda',
              params: { id: paciente_id },
            })}>
              <Ionicons name="calendar-outline" size={38} color="#321904" />
              <Text style={styles.menuText}>Agenda</Text>
            </TouchableOpacity>

            {/*Batimentos para cuidador*/}
            {tipo_usuario === "cuidador" && (
              <TouchableOpacity style={styles.menuButton} onPress={() => router.push(
                {
                  pathname: '/cuidador/visualizarBpm',
                  params: { id: paciente_id },
                }
              )}>
                <Ionicons name="heart-circle" size={38} color="#321904" />
                <Text style={styles.menuText}>Batimentos</Text>
              </TouchableOpacity>
            )}
            {/*Batimentos para paciente*/}
            {tipo_usuario === "paciente" && (
              <TouchableOpacity style={styles.menuButton} onPress={() => router.push({
                pathname: '/idoso/bpm',
                params: { id: paciente_id },
              })}>
                <Ionicons name="heart-circle" size={38} color="#321904" />
                <Text style={styles.menuText}>Batimentos</Text>
              </TouchableOpacity>
            )}

            {tipo_usuario === "paciente" && (
              <TouchableOpacity style={styles.menuButton} onPress={() => router.push(
                {
                  pathname: '/idoso/listarCuidadores',
                  params: { id: paciente_id },
                }
              )}>
                <Ionicons name="person" size={38} color="#321904" />
                <Text style={styles.menuText}>Cuidadores</Text>
              </TouchableOpacity>
            )}
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
  greetingText: { fontSize: 25, color: '#321904', fontWeight: 'bold' },

  topBox: {
    height: '37%',
    backgroundColor: '#F28B0C',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: '70%',
    height: '90%',
    marginTop: 40,
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
    aspectRatio: 1,
    backgroundColor: '#f7eee5ff',
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
  menuText: { marginTop: 8, fontSize: 20, color: '#321904', fontWeight: '500' },
});
