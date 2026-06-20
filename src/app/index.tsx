import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


export const ROXO = '#46295A';
export const ROXO_CLARO = '#5C3876';
export const VERDE = '#5EB85E';
{/*const BRANCO = '#FFFFFF';

const menuItems = [
  {
    label: 'Produtos',
    icon: 'cube-outline',
    route: '/produto',
  },
  {
    label: 'Clientes',
    icon: 'people-outline',
    route: '/clientes',
  },
  {
    label: 'Relatório',
    icon: 'bar-chart-outline',
    route: '/relatorio',
  },
  {
    label: 'Colaboradores',
    icon: 'briefcase-outline',
    route: '/colaboradores',
  },
];

export default function Index() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={[ROXO, '#2E1840', '#1A0E26']}
      style={styles.gradient}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>

        {/* Header }
        <View style={styles.header}>
          <Image
            source={require('../assets/images/logo-sem-fundo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('../login')}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person-outline" size={20} color={BRANCO} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Ionicons name="menu-outline" size={28} color={BRANCO} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Greeting }
        <View style={styles.greeting}>
          <Text style={styles.greetingLabel}>Bem-vindo de volta 👋</Text>
          <Text style={styles.greetingTitle}>Horizonte do Açaí</Text>
        </View>

        {/* Menu Grid }
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
                  <Ionicons name={item.icon as any} size={26} color={VERDE} />
                </View>
                <Text style={styles.cardLabel}>{item.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Linha decorativa inferior }
        <View style={styles.footer}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>Gestão simplificada</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    paddingBottom: 4,
  },
  logo: {
    width: 120,
    height: 56,
  },
  headerActions: {
    position: 'absolute',
    right: 0,
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 4,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: VERDE,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Greeting
  greeting: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
  },
  greetingLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  greetingTitle: {
    color: BRANCO,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Grid
  grid: {
    flex: 1,
    flexDirection: 'column',
    gap: 12,
    justifyContent: 'center',
  },
  card: {
    width: '47%',
    height: 160,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: BRANCO,
    borderWidth: 2,
    borderColor: VERDE,

    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(94,184,94,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    color: ROXO,
    fontSize: 16,
    fontWeight: '700',
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
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});*/}

import RankingVendedores from '../components/ranking-vendedores';

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <RankingVendedores />
    </View>
  )
}