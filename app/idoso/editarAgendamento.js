import { use, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { supabase } from "../../utils/supabase";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function editarAgendamento(){
  const router = useRouter();

  const [nomeEvento, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataEvento, setData] = useState("");
  const [horaEvento, setHora] = useState("");

  async function salvarEvento() {
    if(!nomeEvento || !dataEvento){
      Alert.alert("Atenção!", "Preencha pelo menos o nome e a data do agentamento");
      return;
    }

    const user = (await supabase.auth.getUser()).data.user;

    const {error} = await supabase.from('agendamento').insert([
      {
        nome_evento: nomeEvento,
        descricao, 
        data_evento: dataEvento,
        hora_evento: horaEvento,
        id_paciente: user.id,
      },
    ]);

    if (error) {
      console.error("Error ao salvar evento: ", error);
      Alert.alert("Error", "Não foi possível salavar o evento");
    } else {
      console.alert("Sucesso", "Evento criado com sucesso!");
      router.back();
    }

  }

}
