import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  useFonts,
  Lexend_400Regular,
  Lexend_700Bold,
  Lexend_800ExtraBold,
} from '@expo-google-fonts/lexend';
import { Ionicons } from '@expo/vector-icons';
import { paleta } from '@/constants/theme';

const menuItems = [
  {
    label: 'Registrar Nova Venda',
    icon: 'add-circle-outline',
    route: '/venda/registrar-venda',
  },
  {
    label: 'Meta Mensal',
    icon: 'trophy-outline',
    route: '/relatorio/meta-mensal',
  },
  {
    label: 'Gerar Relatórios',
    icon: 'bar-chart-outline',
    route: '/relatorio/gerar-relatorios',
  },
  {
    label: 'Exibir Ranking',
    icon: 'medal-outline',
    route: '/relatorio/ranking',
  },
];

export default function Vendas() {
  const router = useRouter();

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
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.back()}
          >
            <View style={styles.avatarCircle}>
              <Ionicons
                name="arrow-back-outline"
                size={22}
                color={paleta.BRANCO}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.titleWrapper}>
            <Text style={styles.titleGreen}>VENDAS</Text>
          </View>

          <View style={{ width: 36 }} />
        </View>

        {/* Cards */}
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
  gradient: {
    flex: 1,
  },

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
    marginLeft: 10,
  },

  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  titleWhite: {
    color: paleta.BRANCO,
    fontSize: 32,
    fontFamily: 'Lexend_800ExtraBold',
    letterSpacing: 2,
  },

  titleGreen: {
    color: paleta.VERDE,
    fontSize: 32,
    fontFamily: 'Lexend_800ExtraBold',
    letterSpacing: 2,
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
    marginTop: 'auto',
    paddingVertical: 24,
  },

  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});