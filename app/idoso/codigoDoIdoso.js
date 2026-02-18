import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { criarCodigo } from '../../features/idoso/conexaoComCuidadorService';
import { getPacienteId, getUser } from "../../utils/userData";

export default function CodigoDoIdoso() {
  const router = useRouter();
  const [codigo, setCodigo] = useState(null);

  useEffect(() => {
    async function carregarCodigo() {
      const user = await getUser();
      if (!user) {
        return
      }
      const pacienteId = await getPacienteId(user.id)
      if (!pacienteId) {
        return
      }
      const codigo = await criarCodigo(pacienteId);
      if (codigo) {
        setCodigo(codigo);
      }
    }
    carregarCodigo();
  }, []);

  //funçao para copiar para a area de transferencia
  async function copiarCodigo() {
    await Clipboard.setStringAsync(codigo);
    alert('Código copiado: ' + codigo);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Botão de voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#321904" />
        </TouchableOpacity>

        {/* Conteúdo */}
        <View style={styles.content}>
          {/* Texto informativo */}
          <Text style={styles.infoText}>
            Seu cuidador deve ter uma conta cadastrada.
          </Text>
          <Text style={styles.infoText}>
            Este é o código que ele deve digitar para que vocês se conectem:
          </Text>

          {/* Código gerado */}
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{codigo}</Text>
          </View>

          {/* Botão para copiar código */}
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={copiarCodigo}
          >
            <Text style={styles.buttonText}>Copiar código</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#321904',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  infoText: {
    color: '#321904',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
    maxWidth: 320,
  },
  codeContainer: {
    backgroundColor: '#F28B0C',
    borderRadius: 6,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginVertical: 30,
    alignItems: 'center',
  },
  codeText: {
    fontSize: 24,
    color: '#321904',
    fontWeight: 'bold',
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
    backgroundColor: '#FBB65A',
  },
  buttonText: {
    color: '#321904',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
