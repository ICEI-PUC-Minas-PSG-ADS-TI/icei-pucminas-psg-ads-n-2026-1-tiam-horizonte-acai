import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Modal, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Sidebar = ({ isOpen, onClose, user }) => {
  const navigation = useNavigation();
  const fotoPadrao = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const menuItens = [
    { nome: 'Cadastrar Produtos', screen: 'NovoProduto' },
    { nome: 'Cadastrar Clientes', screen: 'Clientes' },
    { nome: 'Cadastrar Venda', screen: 'Vendas' },
    { nome: 'Gerar Relatórios', screen: 'Relatorios' },
    { nome: 'Gerar Rankings', screen: 'Rankings' },
    { nome: 'Cadastrar Colaborador', screen: 'Colaboradores' },
    { nome: 'Configurações', screen: 'Configuracoes' },
  ];

  const handleNavigate = (screen) => {
    onClose();
    // No Mobile, usamos o nome da rota definido no Stack.Navigator
    navigation.navigate(screen);
  };

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="none" // Controlaremos o deslize via container ou deixaremos o fade
      onRequestClose={onClose}
    >
      {/* Overlay escuro */}
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose} 
      />

      <View style={styles.sidebar}>
        <View style={styles.headerSidebar}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeBtn}>X</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          {/* Área de Perfil */}
          <View style={styles.profileArea}>
            <View style={styles.fotoContainer}>
              <Image 
                source={{ uri: user?.foto || fotoPadrao }} 
                style={styles.fotoSidebar} 
              />
            </View>
            <View style={styles.textosPerfil}>
              <Text style={styles.userName}>{user?.nome || 'Usuário'}</Text>
              <Text style={styles.cargoBadge}>{user?.cargo || 'Gestor'}</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.permTitle}>Permissões:</Text>
          
          <ScrollView style={styles.nav}>
            {menuItens.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.navItem} 
                onPress={() => handleNavigate(item.screen)}
              >
                <Text style={styles.navText}>• {item.nome}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.statusRow}>
            <Text style={styles.statusText}>Status: <Text style={{fontWeight: 'bold'}}>Online</Text></Text>
            <View style={styles.bolinhaOnline} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0, // Mantendo o comportamento de deslizar da direita
    width: width * 0.75, // 75% da largura da tela
    height: '100%',
    backgroundColor: 'white',
    padding: 25,
    elevation: 5, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
  },
  headerSidebar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
  },
  closeBtn: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4a3061',
    padding: 5,
  },
  profileArea: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fotoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#7ed957',
    overflow: 'hidden',
    backgroundColor: '#eee',
  },
  fotoSidebar: {
    width: '100%',
    height: '100%',
  },
  textosPerfil: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cargoBadge: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  permTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4a3061',
    fontSize: 16,
  },
  nav: {
    flex: 1,
  },
  navItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  navText: {
    color: '#444',
    fontSize: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 20,
  },
  statusText: {
    fontSize: 18,
    color: '#000',
    marginRight: 10,
  },
  bolinhaOnline: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00ff00',
    shadowColor: '#00ff00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    elevation: 5,
  },
});

export default Sidebar;