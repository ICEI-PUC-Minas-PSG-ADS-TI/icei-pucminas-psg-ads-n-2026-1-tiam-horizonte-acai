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

const ROXO = '#46295A';
const VERDE = '#5EB85E';
const BRANCO = '#FFFFFF';

const menuItems = [
  {
    label: 'Registrar Nova Venda',
    icon: 'add-circle-outline',
    route: '/relatorio/nova-venda',
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
    return <ActivityIndicator style={{ flex: 1 }} color={VERDE} />;
  }

  return (
    <LinearGradient
      colors={[ROXO, '#2E1840', '#1A0E26']}
      style={styles.gradient}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="home" size={28} color={BRANCO} />
          </TouchableOpacity>

          <View style={styles.titleWrapper}>
            <Text style={styles.titleWhite}>VEN</Text>
            <Text style={styles.titleGreen}>DAS</Text>
          </View>
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
              <Text style={styles.cardLabel}>{item.label}</Text>
              <View style={styles.iconWrapper}>
                <Ionicons name={item.icon as any} size={36} color={ROXO} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

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
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },

  backBtn: {
    padding: 4,
    zIndex: 1,
    marginLeft: 15
  },

  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
  },

  titleWhite: {
    color: BRANCO,
    fontSize: 32,
    fontFamily: 'Lexend_800ExtraBold',
    letterSpacing: 2,
  },

  titleGreen: {
    color: VERDE,
    fontSize: 32,
    fontFamily: 'Lexend_800ExtraBold',
    letterSpacing: 2,
  },

  // Grid
  grid: {
    flex: 1,
    flexDirection: 'column',
    gap: 14,
    justifyContent: 'center',
  },

  card: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: 16,
    backgroundColor: BRANCO,
    borderWidth: 2,
    borderColor: VERDE,
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  cardLabel: {
    color: ROXO,
    fontSize: 14,
    fontFamily: 'Lexend_700Bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },

  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(70,41,90,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Footer
  footer: {
    paddingVertical: 24,
  },

  footerLine: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});