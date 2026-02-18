import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { AppState, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles/loginStyles';
import { supabase } from '../../utils/supabase';
import { signInWithEmail, validateLogin } from './signInWithEmail';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  //estados para login e controle dos erros
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ login: false, password: false });
  const [loading, setLoading] = useState(false);
  const [tipo_usuario, setTipoUsuario] = useState(null);

  async function handleLogin() {
    const validation = validateLogin({
      email: loginInput,
      password: password,
    });
    setErrors(validation.errors);

    if (!validation.valid) {
      Alert.alert('Atenção', validation.message);
      return;
    }

    setLoading(true);

    const result = await signInWithEmail({
      email: loginInput,
      password: password,
    });

    setLoading(false);

    if (!result.success) {
      Alert.alert(result.message);
      return;
    }

    if (result.tipo_usuario === "paciente") {
      router.replace('/idoso/menuInicial');
    } else if (result.tipo_usuario === "cuidador") {
      router.replace('/cuidador/menuInicial');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Botão de voltar */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#321904" />
        </TouchableOpacity>

        {/* Campos de entrada */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email ou Telefone"
            placeholderTextColor={errors.login ? 'red' : '#321904'}
            style={styles.input}
            value={loginInput}
            onChangeText={setLoginInput}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Senha"
              placeholderTextColor={errors.password ? 'red' : '#321904'}
              secureTextEntry={!showPassword}
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={24}
                color="#321904"
              />
            </TouchableOpacity>
          </View>

          {/* "Esqueci minha senha" */}
          <TouchableOpacity onPress={() => router.push('/esqueciMinhaSenha')}>
            <Text style={styles.forgotPasswordText}>Esqueceu a senha? Clique aqui</Text>
          </TouchableOpacity>
        </View>

        {/* Botão Entrar */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}