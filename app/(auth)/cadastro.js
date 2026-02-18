import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, AppState, Image, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { styles } from '../../styles/cadastroStyles';
import { supabase } from '../../utils/supabase';

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Cadastro() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('idoso');
  const [profileImage, setProfileImage] = useState(null);
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [email, setEmail] = useState('');
  const [errorFields, setErrorFields] = useState([]);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [shortPassword, setShortPassword] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [loading, setLoading] = useState(false)
  const { signUpEmail } = useAuth();

  function chooseImageSource() {
    Alert.alert(
      "Foto de Perfil",
      "Selecione uma opção",
      [
        { text: "Tirar Foto", onPress: () => pickImageFromCamera() },
        { text: "Escolher da Galeria", onPress: () => pickImageFromGallery() },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  }

  async function pickImageFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Precisamos da sua permissão para acessar as fotos!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  }

  async function pickImageFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Precisamos da sua permissão para usar a câmera!');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  }

  function handleBirthDateChange(text) {
    let cleaned = text.replace(/\D/g, '');
    if (cleaned.length <= 2) {
      setBirthDate(cleaned);
      return;
    }
    if (cleaned.length <= 4) {
      setBirthDate(cleaned.slice(0, 2) + '/' + cleaned.slice(2));
      return;
    }
    setBirthDate(cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8));
  }

  function handlePhoneChange(text) {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 2) {
      setPhone(cleaned);
      return;
    }
    if (cleaned.length <= 6) {
      setPhone('(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2));
      return;
    }
    if (cleaned.length <= 10) {
      setPhone('(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2, 6) + '-' + cleaned.slice(6));
      return;
    }
    setPhone('(' + cleaned.slice(0, 2) + ') ' + cleaned.slice(2, 7) + '-' + cleaned.slice(7, 11));
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  async function handleRegister() {
    const emptyFields = [];
    if (!name.trim()) emptyFields.push('name');
    if (!sobrenome.trim()) emptyFields.push('sobrenome');
    if (!email.trim()) emptyFields.push('email');
    if (!birthDate.trim()) emptyFields.push('birthDate');
    if (!phone.trim()) emptyFields.push('phone');
    if (!password.trim()) emptyFields.push('password');
    if (!confirmPassword.trim()) emptyFields.push('confirmPassword');

    setErrorFields(emptyFields);

    if (!validateEmail(email)) {
      setInvalidEmail(true);
      return;
    } else {
      setInvalidEmail(false);
    }

    if (emptyFields.length > 0) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      setShortPassword(true);
      return;
    } else {
      setShortPassword(false);
    }

    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);
    const success = await signUpEmail({
      name,
      sobrenome,
      email,
      password,
      birthDate,
      phone,
      role,
      setLoading,
    });
    if (!success) return;

    if (role === 'idoso') {
      router.push('/idoso/preFormularioIdoso');
    } else {
      router.push('/cuidador/menuInicial');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Botão de voltar */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#321904" />
          </TouchableOpacity>

          <View style={styles.centeredContent}>
            {/* Foto de perfil */}
            <TouchableOpacity style={styles.profileContainer} onPress={chooseImageSource}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <View style={styles.profileImage}>
                  <Ionicons name="person-outline" size={40} color="#F28B0C" />
                </View>
              )}
              <Text style={styles.profileText}>Adicione sua foto de perfil</Text>
            </TouchableOpacity>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Nome"
                placeholderTextColor={errorFields.includes('name') ? 'red' : '#321904'}
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <TextInput
                placeholder="Sobrenome"
                placeholderTextColor={errorFields.includes('sobrenome') ? 'red' : '#321904'}
                style={styles.input}
                value={sobrenome}
                onChangeText={setSobrenome}
              />

              <TextInput
                placeholder="E-mail"
                placeholderTextColor={errorFields.includes('email') ? 'red' : '#321904'}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              {invalidEmail && (
                <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>
                  Digite um e-mail válido.
                </Text>
              )}

              <TextInput
                placeholder="Data de nascimento (DD/MM/AAAA)"
                placeholderTextColor={errorFields.includes('birthDate') ? 'red' : '#321904'}
                keyboardType="numeric"
                value={birthDate}
                onChangeText={handleBirthDateChange}
                style={styles.input}
                maxLength={10}
              />

              <TextInput
                placeholder="Telefone"
                placeholderTextColor={errorFields.includes('phone') ? 'red' : '#321904'}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={handlePhoneChange}
                style={styles.input}
                maxLength={16}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Senha"
                  placeholderTextColor={errorFields.includes('password') ? 'red' : '#321904'}
                  secureTextEntry={!showPassword}
                  style={[styles.inputPassword, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={24} color="#321904" />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  placeholder="Confirmar senha"
                  placeholderTextColor={errorFields.includes('confirmPassword') ? 'red' : '#321904'}
                  secureTextEntry={!showConfirmPassword}
                  style={[styles.inputPassword, { flex: 1 }]}
                  value={confirmPassword}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setPasswordMismatch(password !== text);
                  }}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  <Ionicons name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'} size={24} color="#321904" />
                </TouchableOpacity>
              </View>
              {passwordMismatch && (
                <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>
                  As senhas não coincidem.
                </Text>
              )}
              {shortPassword && (
                <Text style={{ color: 'red', fontSize: 12, marginBottom: 10 }}>
                  A senha deve ter no mínimo 6 caracteres.
                </Text>
              )}

              <View style={styles.radioContainer}>
                <TouchableOpacity style={styles.radioOption} onPress={() => setRole('idoso')}>
                  <Ionicons name={role === 'idoso' ? 'radio-button-on' : 'radio-button-off'} size={20} color="#F28B0C" />
                  <Text style={styles.radioText}>Sou idoso(a)</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.radioOption} onPress={() => setRole('cuidador')}>
                  <Ionicons name={role === 'cuidador' ? 'radio-button-on' : 'radio-button-off'} size={20} color="#F28B0C" />
                  <Text style={styles.radioText}>Sou cuidador(a)</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleRegister}>
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
