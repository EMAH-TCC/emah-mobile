import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { verificarCodigoConexao } from '../../features/cuidador/conexaoComIdosoService';
import { styles } from '../../styles/codigo_e_confirmacao';
import { getUser, getUserId } from "../../utils/userData";

export default function InserirCodigoIdoso() {
  const router = useRouter();
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState(false);

  async function verificarCodigo() {
    console.log("Chamou a função");
    const user = await getUser();
    if (!user) {
      return
    }
    const userId = await getUserId(user.id)
    if (!userId) {
      return
    }
    const dadosPaciente = await verificarCodigoConexao(codigo);
    if (!dadosPaciente || dadosPaciente.length === 0) {
      setErro(true);
      Alert.alert('Código inválido', 'Verifique o código e tente novamente.');
    }
    else {
      const nome_paciente = dadosPaciente[0].nome_paciente
      const id_paciente = dadosPaciente[0].id_paciente
      router.push({
        pathname: '/cuidador/confirmacaoIdoso',
        params: dadosPaciente[0],
      });
    }
  }
  function handleConnect() {
    // campo vazio
    if (codigo.trim() === '') {
      setErro(true);
      Alert.alert('Atenção', 'Por favor, preencha o campo do código.');
      return;
    }
    else {
      verificarCodigo();
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>

            {/* Botão de voltar */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#321904" />
            </TouchableOpacity>

            {/* Texto */}
            <View style={styles.content}>
              <Text style={styles.infoText}>
                O idoso deve ter uma{'\n'}conta e adicionar{'\n'}você como cuidador.
              </Text>
              <Text style={styles.infoText}>
                Quando ele fizer isso{'\n'}receberá um código{'\n'}que deve ser digitado{'\n'}aqui para conectar{'\n'}vocês:
              </Text>
            </View>

            {/* Campo para inserir o código */}
            <TextInput
              style={[styles.input, erro && styles.inputError]}
              placeholder="Insira o código"
              placeholderTextColor={erro ? 'red' : '#321904'}
              keyboardType="numeric"
              maxLength={6} // somente 6 digitos
              value={codigo}
              onChangeText={(text) => {
                const onlyDigits = text.replace(/\D/g, '');
                setCodigo(onlyDigits);
                if (erro) setErro(false);
              }}
            />

            {/* Botão para confirmar */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={handleConnect}
              >
                <Text style={styles.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}