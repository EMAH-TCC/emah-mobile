import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { supabase } from '../../utils/supabase';

export default function EsqueciMinhaSenha() {
  const router = useRouter();
  const [loginInput, setLoginInput] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // função para redefinir a senha
  async function handleResetPassword() {
    if (!loginInput.trim()) {
      setError(true);
      Alert.alert('Atenção', 'Por favor, insira seu email ou telefone.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(loginInput, {
      redirectTo: 'https://seuapp.com/reset-password', // ajuste pelo back depois
    });

    setLoading(false);

    if (error) {
      Alert.alert('Erro', 'Não foi possível enviar o link. Verifique o email ou telefone e tente novamente.');
    } else {
      Alert.alert('Sucesso', 'Enviamos um link para redefinir sua senha. Verifique sua caixa de entrada.');
      router.back();
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#321904" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Recuperar Senha</Text>
          <View style={styles.invisibleSpace} />
        </View>

        <Text style={styles.instructions}>
          Digite seu email ou telefone cadastrado no campo abaixo. Enviaremos um link para redefinir sua senha.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email ou Telefone"
            placeholderTextColor={error ? 'red' : '#321904'}
            style={styles.input}
            value={loginInput}
            onChangeText={(text) => {
              setLoginInput(text);
              setError(false);
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Enviando...' : 'Enviar link de redefinição'}
            </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#321904',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 25,
    color: '#321904',
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  invisibleSpace: {
    width: 40,
  },
  instructions: {
    fontSize: 20,
    color: '#321904',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 40,
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#f7eee5ff',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 20,
    color: '#321904',
    marginBottom: 20,
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
    marginTop: 'auto',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 36,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#F28B0C',
  },
  buttonText: {
    color: '#321904',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
