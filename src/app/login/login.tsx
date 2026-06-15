import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
    useFonts,
    Lexend_400Regular,
    Lexend_700Bold,
    Lexend_800ExtraBold,
} from "@expo-google-fonts/lexend";
import { supabase } from '../../lib/supabase';
import { Ionicons } from "@expo/vector-icons";

const ROXO = "#46295A";
const VERDE = "#5EB85E";

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);

    const [fontsLoaded] = useFonts({
        Lexend_400Regular,
        Lexend_700Bold,
        Lexend_800ExtraBold,
    });

    async function handleLogin() {
        if (!email.trim()) return setMensagem({ tipo: 'erro', texto: 'Digite seu usuário.' });
        if (!senha) return setMensagem({ tipo: 'erro', texto: 'Digite sua senha.' });

        setCarregando(true);
        setMensagem(null);
        try {
            const result = await supabase
                .from('Funcionario')
                .select('*')
                .eq('usuario', email.trim())
                .eq('senha', senha)
                .eq('ativo', true);

            if (!result.data || result.data.length === 0) {
                return setMensagem({ tipo: 'erro', texto: 'Usuário ou senha incorretos.' });
            }

            setMensagem({ tipo: 'sucesso', texto: `Bem-vindo, ${result.data[0].nome}!` });
            setTimeout(() => router.replace("/(tabs)"), 900);
        } catch (e: any) {
            setMensagem({ tipo: 'erro', texto: 'Ocorreu um erro inesperado. Tente novamente.' });
        } finally {
            setCarregando(false);
        }
    }

    if (!fontsLoaded) return <ActivityIndicator style={{ flex: 1 }} color={VERDE} />;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.conteudo}
                keyboardShouldPersistTaps="handled"
            >
                {/* Logo */}
                <View style={styles.logoContainer}>
                    <Image
                        source={require("../../assets/images/logo.png")}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                {/* Boas vindas */}
                <Text style={styles.boasVindas}>Seja bem-vindo!</Text>

                {/* Campos agrupados */}
                <View style={{ width: "60%" }}>
                    <Text style={styles.label}>Usuário</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Digite seu nome de usuário..."
                        placeholderTextColor="#aaa"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />

                    <Text style={styles.label}>Senha</Text>
                    <View style={styles.senhaContainer}>
                        <TextInput
                            style={styles.senhaInput}
                            placeholder="Digite sua senha..."
                            placeholderTextColor="#aaa"
                            secureTextEntry={!senhaVisivel}
                            value={senha}
                            onChangeText={setSenha}
                        />
                        <TouchableOpacity
                            onPress={() => setSenhaVisivel(!senhaVisivel)}
                            style={styles.senhaOlho}
                        >
                            <Ionicons
                                name={senhaVisivel ? "eye-off" : "eye"}
                                size={22}
                                color="#aaa"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Mensagem */}
                {mensagem && (
                    <View style={[styles.mensagem, mensagem.tipo === 'sucesso' ? styles.mensagemSucesso : styles.mensagemErro]}>
                        <Text style={styles.mensagemTexto}>
                            {mensagem.tipo === 'sucesso' ? '✅ ' : '❌ '}{mensagem.texto}
                        </Text>
                    </View>
                )}

                {/* Botão Login */}
                <TouchableOpacity
                    style={styles.botaoLogin}
                    onPress={handleLogin}
                    disabled={carregando}
                >
                    {carregando ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.botaoLoginTexto}>Login</Text>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: ROXO },
    conteudo: {
        flexGrow: 1,
        alignItems: "center",
        paddingHorizontal: 32,
        paddingBottom: 48,
        paddingTop: 72,
    },

    // Logo
    logoContainer: { alignItems: "center", marginBottom: 24 },
    logo: { width: 300, height: 300, marginBottom: 10 },

    // Boas vindas
    boasVindas: {
        fontFamily: "Lexend_700Bold",
        fontSize: 26,
        color: "#fff",
        textAlign: "center",
        marginBottom: 36,
        lineHeight: 36,
    },

    // Campos
    label: {
        fontFamily: "Lexend_700Bold",
        fontSize: 14,
        color: "#fff",
        marginBottom: 6,
        marginTop: 16,
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: VERDE,
        paddingHorizontal: 14,
        paddingVertical: 13,
        fontFamily: "Lexend_400Regular",
        fontSize: 14,
        color: "#333",
    },
    senhaContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 2,
        borderColor: VERDE,
        paddingHorizontal: 14,
    },
    senhaInput: {
        flex: 1,
        paddingVertical: 13,
        fontFamily: "Lexend_400Regular",
        fontSize: 14,
        color: "#333",
    },
    senhaOlho: { padding: 4 },

    // Botão
    botaoLogin: {
        marginTop: 40,
        width: "40%",
        backgroundColor: VERDE,
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    botaoLoginTexto: {
        fontFamily: "Lexend_700Bold",
        fontSize: 16,
        color: "#fff",
    },
    mensagem: {
        width: '60%',
        padding: 12,
        borderRadius: 10,
        marginTop: 16,
        alignItems: 'center',
    },
    mensagemSucesso: { backgroundColor: '#1a472a' },
    mensagemErro: { backgroundColor: '#7f1d1d' },
    mensagemTexto: { color: '#fff', fontFamily: 'Lexend_700Bold', fontSize: 14 },
});
