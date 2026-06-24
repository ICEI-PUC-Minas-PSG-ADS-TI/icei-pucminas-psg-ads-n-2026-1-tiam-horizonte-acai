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
} from 'react-native';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_800ExtraBold,
} from "@expo-google-fonts/lexend";
import { Ionicons } from '@expo/vector-icons';
import { sincronizarVendas } from '@/utils/sincronizar-vendas';
import { paleta } from '@/constants/theme'
import { pageGradientProps } from '@/constants/theme'

/*const menuItems = [
  {
    label: 'Produtos',
    icon: 'cube-outline',
    route: '/produto/produtos',
  },
  {
    label: 'Clientes',
    icon: 'people-outline',
    route: '/clientes/clientes',
  },
  {
    label: 'Vendas',
    icon: 'cash-outline',
    route: '/venda/vendas',
  },
  {
    label: 'Colaboradores',
    icon: 'briefcase-outline',
    route: '/colaborador/colaboradores',
  },
];*/

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
          {
            label: 'Produtos',
            icon: 'cube-outline',
            route: '/produto/produtos',
          },
          {
            label: 'Clientes',
            icon: 'people-outline',
            route: '/clientes/clientes',
          },
          {
            label: 'Vendas',
            icon: 'cash-outline',
            route: '/venda/vendas',
          },
          {
            label: 'Colaboradores',
            icon: 'briefcase-outline',
            route: '/colaborador/colaboradores',
          },
          {
            label: 'Relatórios',
            icon: 'bar-chart-outline',
            route: '/relatorio/relatorio-vendas',
          },
        ]);
        break;

      case 'GESTOR':
        setMenuItems([
          {
            label: 'Produtos',
            icon: 'cube-outline',
            route: '/produto/produtos',
          },
          {
            label: 'Clientes',
            icon: 'people-outline',
            route: '/clientes/clientes',
          },
          {
            label: 'Colaboradores',
            icon: 'briefcase-outline',
            route: '/colaborador/colaboradores',
          },
          {
            label: 'Relatórios',
            icon: 'bar-chart-outline',
            route: '/relatorio/relatorio-vendas',
          },
        ]);
        break;

      case 'VENDEDOR':
        setMenuItems([
          {
            label: 'Vendas',
            icon: 'cash-outline',
            route: '/venda/vendas',
          },
          {
            label: 'Ranking',
            icon: 'trophy-outline',
            route: '/clientes/ranking-cliente',
          },
        ]);
        break;

      case 'ESTOQUISTA':
        setMenuItems([
          {
            label: 'Produtos',
            icon: 'cube-outline',
            route: '/produto/produtos',
          },
        ]);
        break;

      default:
        setMenuItems([]);
        break;
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
    <LinearGradient {...pageGradientProps()}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>

        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('../assets/images/logo-sem-fundo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push('../perfil/perfil')}
            >
              <View style={styles.avatarCircle}>
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={paleta.BRANCO}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons
                name="menu-outline"
                size={34}
                color={paleta.BRANCO}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Grid */}
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.card}
              activeOpacity={0.75}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.cardGradient}>
                <View style={styles.iconWrapper}>
                  <Ionicons
                    name={item.icon as any}
                    size={40}
                    color={paleta.VERDE}
                  />
                </View>

                <Text style={styles.cardLabel}>
                  {item.label}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Linha decorativa inferior */}
        <View style={styles.footer}>
          <View style={styles.footerLine} />
        </View>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingHorizontal: 24,
  },

  // Header
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 12,
  },

  logo: {
    width: 200,
    height: 100,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    gap: 14,
    height: 80,
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

  // Grid
  grid: {
    flex: 1,
    flexDirection: 'column',
    gap: 12,
    justifyContent: 'center',
  },

  card: {
    width: '75%',
    height: 145,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: paleta.BRANCO,
    borderWidth: 2,
    borderColor: paleta.VERDE,
    margin: 'auto',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  cardGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: 'rgba(94,184,94,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardLabel: {
    color: paleta.ROXO,
    fontSize: 16,
    fontFamily: 'Lexend_700Bold',
    textAlign: 'center',
    marginTop: 16,
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 'auto',
    paddingVertical: 24,
  },

  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  footerText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontFamily: 'Lexend_400Regular',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});