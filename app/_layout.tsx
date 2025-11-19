import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";

export default function RootLayout() {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>

    )
}

function MainLayout() {
    const { setAuth } = useAuth()
    const [tipo_usuario, setTipoUsuario] = useState<"paciente" | "cuidador" | null>(null);
    async function getUser() {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
            console.log("Erro: ", error);
            return null;
        }

        return data.user;
    }
    async function getTipoUsuario(userId: string) {
        const { data, error } = await supabase
            .from("usuarios")
            .select("tipo_usuario")
            .eq("id_user", userId)
            .single();

        if (error) {
            console.log("Erro busca: ", error);
            return null;
        }

        return data.tipo_usuario;
    }

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const user = await getUser();
                if (!user?.id) {
                    console.log("Usuário não encontrado");
                    return;
                }

                const tipo_usuario = await getTipoUsuario(user.id);

                setAuth(session.user);

                if (tipo_usuario === "paciente") {
                    router.replace('/idoso/menuInicial');
                } else if (tipo_usuario === "cuidador") {
                    router.replace('/cuidador/menuInicial');
                }
                return;
            }

            setAuth(null);
            router.replace('/');
        });

        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []);

    return (
        <Stack>
            {/* Rotas auth */}
            <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/cadastro" options={{ headerShown: false }} />

            {/* Rotas idoso */}
            <Stack.Screen name="idoso/menuInicial" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/perfil" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/adicionarCuidador" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/codigoDoIdoso" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/cuidadorAdicionado" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/editarRemedio" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/erroAdicionarCuidador" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/remedios" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/bpm" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/formulario" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/relatorio" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/adicionarRemedio" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/removerRemedio" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/agenda" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/adicionarAgendamento" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/listarCuidadores" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/preFormularioIdoso" options={{ headerShown: false }} />
            <Stack.Screen name="idoso/pulseiraSensorialBpm" options={{ headerShown: false }} />


            {/* Rotas cuidador */}
            <Stack.Screen name="cuidador/menuInicial" options={{ headerShown: false }} />
            <Stack.Screen name="cuidador/erroAdicionarIdoso" options={{ headerShown: false }} />
            <Stack.Screen name="cuidador/idosoAdicionado" options={{ headerShown: false }} />
            <Stack.Screen name="cuidador/inserirCodigoIdoso" options={{ headerShown: false }} />
            <Stack.Screen name="cuidador/perfil" options={{ headerShown: false }}
            />
            <Stack.Screen name="cuidador/menuIdosoParaCuidador" options={{ headerShown: false }} />
            <Stack.Screen name="cuidador/removerPaciente" options={{ headerShown: false }} />
            <Stack.Screen name="cuidador/confirmacaoIdoso" options={{ headerShown: false }} />
            <Stack.Screen name="cuidador/visualizarBpm" options={{ headerShown: false }} />
        </Stack>
    )
}