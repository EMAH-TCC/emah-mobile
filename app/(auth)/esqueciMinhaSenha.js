import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/esqueciMinhaSenhaStyles';
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
