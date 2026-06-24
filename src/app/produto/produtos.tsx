import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_800ExtraBold,
} from "@expo-google-fonts/lexend";
import { Ionicons } from '@expo/vector-icons';
import { sincronizarVendas } from '@/utils/sincronizar-vendas';
import { paleta } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.75, 340);

export default function Index() {
  const router = useRouter();

  const [tipoFuncionario, setTipoFuncionario] = useState('');
  const [menuItems, setMenuItems] = useState<any[]>([]);

  useEffect(() => {
    sincronizarVendas();
    async function carregar() {
      const tipo = await AsyncStorage.getItem('tipoFuncionario');
      setTipoFuncionario(tipo ?? '');

      switch (tipo) {
        case 'ADMINISTRADOR':
          setMenuItems([
            { label: 'Produtos',      icon: 'cube-outline',       route: '/produto/produtos' },
            { label: 'Clientes',      icon: 'people-outline',     route: '/clientes/clientes' },
            { label: 'Vendas',        icon: 'cash-outline',       route: '/venda/vendas' },
            { label: 'Colaboradores', icon: 'briefcase-outline',  route: '/colaborador/colaboradores' },
            { label: 'Relatórios',    icon: 'bar-chart-outline',  route: '/relatorio/relatorio-vendas' },
          ]);
          break;
        case 'GESTOR':
          setMenuItems([
            { label: 'Produtos',      icon: 'cube-outline',       route: '/produto/produtos' },
            { label: 'Clientes',      icon: 'people-outline',     route: '/clientes/clientes' },
            { label: 'Colaboradores', icon: 'briefcase-outline',  route: '/colaborador/colaboradores' },
            { label: 'Relatórios',    icon: 'bar-chart-outline',  route: '/relatorio/relatorio-vendas' },
          ]);
          break;
        case 'VENDEDOR':
          setMenuItems([
            { label: 'Vendas',   icon: 'cash-outline',    route: '/venda/vendas' },
            { label: 'Ranking',  icon: 'trophy-outline',  route: '/clientes/ranking-cliente' },
          ]);
          break;
        case 'ESTOQUISTA':
          setMenuItems([
            { label: 'Produtos', icon: 'cube-outline', route: '/produto/produtos' },
          ]);
          break;
        default:
          setMenuItems([]);
      }
    }
    carregar();
  }, []);

  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
    Lexend_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator style={{ flex: 1 }} color={paleta.VERDE} />;
  }

  return (
    <LinearGradient
      colors={[paleta.ROXO, '#2E1840', '#1A0E26']}
      style={styles.gradient}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../../assets/images/logo-sem-fundo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('../perfil/perfil')}
          >
            <View style={styles.avatarCircle}>
              <Ionicons name="person-outline" size={22} color={paleta.BRANCO} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Menu — scrollável quando há muitos itens */}
        <ScrollView
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.cardInner}>
                <View style={styles.iconWrapper}>
                  <Ionicons name={item.icon as any} size={36} color={paleta.VERDE} />
                </View>
                <Text style={styles.cardLabel}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer decorativo */}
        <View style={styles.footer}>
          <View style={styles.footerLine} />
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },

  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // ── Header ──────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },

  logo: {
    width: 160,
    height: 72,
  },

  iconBtn: {
    padding: 4,
  },

  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: paleta.VERDE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Grid / ScrollView ────────────────────────────────────
  grid: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },

  card: {
    width: CARD_WIDTH,
    height: 120,
    borderRadius: 20,
    backgroundColor: paleta.BRANCO,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  cardInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  iconWrapper: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: 'rgba(94,184,94,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardLabel: {
    color: paleta.ROXO,
    fontSize: 15,
    fontFamily: 'Lexend_700Bold',
    textAlign: 'center',
    marginTop: 10,
  },

  // ── Footer ───────────────────────────────────────────────
  footer: {
    paddingVertical: 20,
  },

  footerLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});