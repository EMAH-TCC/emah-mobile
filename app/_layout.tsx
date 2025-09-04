import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/utils/supabase";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>

    )
}

function MainLayout() {
    const { setAuth } = useAuth()

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {

            if (session) {
                setAuth(session.user)
                router.replace('/(app)/menuInicial')
                return;
            }

            setAuth(null)
            router.replace('/')

        });
    }, []);

    return (
        <Stack>
            {/* Rotas auth */}
            <Stack.Screen name="(auth)/index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/login" />
            <Stack.Screen name="(auth)/cadastro" />

            {/* Rotas app */}
            <Stack.Screen name="(app)/menuInicial" options={{ headerShown: false }} />
            <Stack.Screen name="(app)/perfil" />
            <Stack.Screen name="(app)/adicionarCuidador" />
            <Stack.Screen name="(app)/codigoDoIdoso" />
            <Stack.Screen name="(app)/cuidadorAdicionado" />
            <Stack.Screen name="(app)/editarRemedio" />
            <Stack.Screen name="(app)/erroAdicionarCuidador" />
            <Stack.Screen name="(app)/erroAdicionarIdoso" />
            <Stack.Screen name="(app)/idosoAdicionado" />
            <Stack.Screen name="(app)/inserirCodigoIdoso" />
            <Stack.Screen name="(app)/remedios" />
        </Stack>
    )
}