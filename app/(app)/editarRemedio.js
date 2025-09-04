import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';

export default function EditarRemedio() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [nome, setNome] = useState(params.nome || '');
  const [dose, setDose] = useState(params.dose || '');
  const [frequencia, setFrequencia] = useState(params.frequencia || '');
  const [horario, setHorario] = useState(params.horario || '');

  const salvarAlteracoes = () => {
    console.log('Remédio atualizado:', { id: params.id, nome, dose, frequencia, horario });
    router.push('/remedios'); // volta para a lista
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>

          {/* Header com botão de voltar e o titulo */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <View style={styles.backCircle}>
                <Ionicons name="arrow-back" size={24} color="#321904" />
              </View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Editar Remédio</Text>
          </View>

          {/* Conteúdo geral */}
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            <TextInput
              style={styles.input}
              placeholder="Nome do remédio"
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              style={styles.input}
              placeholder="Dose"
              value={dose}
              onChangeText={setDose}
            />
            <TextInput
              style={styles.input}
              placeholder="Frequência"
              value={frequencia}
              onChangeText={setFrequencia}
            />
            <TextInput
              style={styles.input}
              placeholder="Horário"
              value={horario}
              onChangeText={setHorario}
            />
          </ScrollView>

          {/* Botões do final */}
          <View style={styles.footer}>
            <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={salvarAlteracoes}>
              <Text style={styles.buttonText}>Salvar alterações</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => router.back()}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    height: 60,
    justifyContent: 'center',
    marginBottom: 10,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 10,
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#321904',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    color: '#321904',
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  input: {
    backgroundColor: '#EDE7F6',
    padding: 14,
    borderRadius: 6,
    marginBottom: 16,
    color: '#321904',
    fontSize: 16,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
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
    backgroundColor: '#F28B0C',
  },
  secondaryButton: {
    backgroundColor: '#FBB65A',
  },
  buttonText: {
    color: '#321904',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
