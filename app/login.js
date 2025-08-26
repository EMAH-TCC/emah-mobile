import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  //estados para login e controle dos erros
  const [loginInput, setLoginInput] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ login: false, password: false });

  // funçao para validar os campos
  function validateLogin() {
    const newErrors = {
      login: !loginInput.trim(),
      password: !password.trim(),
    };
    setErrors(newErrors);

    if (newErrors.login || newErrors.password) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return false;
    }
    return true;
  }

  function handleLogin() {
    if (!validateLogin()) return;

    //logica para checar username/email/telefone futuramente
    const isUserValid = true; //simulaçao

    if (!isUserValid) {
      Alert.alert('Erro', 'Usuário ou senha inválidos.');
      return;
    }

    router.push('/menuInicial');
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
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#321904',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 40,
    width: '100%',
    maxWidth: 300,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#C7BEC9',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 16,
    fontSize: 16,
    color: '#321904',
    marginBottom: 20,
    width: '100%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C7BEC9',
    borderRadius: 6,
    paddingRight: 8,
    width: '100%',
  },
  eyeIcon: {
    paddingHorizontal: 5,
  },
  forgotPasswordText: {
    color: '#321904',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'right',
    textDecorationLine: 'underline',
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
    marginBottom: 12,
    width: '100%',
  },
  primaryButton: {
    backgroundColor: '#F28B0C',
  },
  buttonText: {
    color: '#321904',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
