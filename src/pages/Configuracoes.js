import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  SafeAreaView 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
// Importando ícones compatíveis com Expo
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 

const Configuracoes = () => {
  const navigation = useNavigation();

  const [user] = useState({
    nome: 'Rique Santos',
    email: 'rique.empresa@acai.com',
    cargo: 'Administrador',
    foto: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.box}>
          <Text style={styles.titulo}>
            PERFIL DO <Text style={{color: '#7ed957'}}>COLABORADOR</Text>
          </Text>

          <View style={styles.fotoContainer}>
            <Image source={{ uri: user.foto }} style={styles.fotoPerfil} />
            <TouchableOpacity style={styles.btnAlterarFoto}>
              <Text style={styles.textoBtnFoto}>Alterar Foto</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoArea}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput style={styles.input} value={user.nome} editable={false} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail Corporativo</Text>
              <TextInput style={styles.input} value={user.email} editable={false} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cargo</Text>
              <TextInput 
                style={[styles.input, { color: '#000000', fontWeight: 'bold' }]} 
                value={user.cargo} 
                editable={false} 
              />
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.btnSenha}>
              <Feather name="key" size={18} color="black" />
              <Text style={styles.textoBtnSenha}>Trocar Senha</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.btnSair} 
              onPress={() => navigation.navigate('Login')}
            >
              <Feather name="log-out" size={18} color="white" />
              <Text style={styles.textoBtnSair}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.voltar}>Voltar ao Início</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#4a3061' 
  },
  scrollContent: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  box: { 
    width: '100%', 
    maxWidth: 400, 
    alignItems: 'center' 
  },
  titulo: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 30 
  },
  fotoContainer: { 
    alignItems: 'center', 
    marginBottom: 25 
  },
  fotoPerfil: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    borderWidth: 4, 
    borderColor: '#7ed957', 
    backgroundColor: 'white', 
    marginBottom: 10 
  },
  btnAlterarFoto: { 
    borderWidth: 1, 
    borderColor: '#7ed957', 
    paddingVertical: 4, 
    paddingHorizontal: 12, 
    borderRadius: 20 
  },
  textoBtnFoto: { 
    color: '#7ed957', 
    fontSize: 11 
  },
  infoArea: { 
    width: '100%', 
    gap: 15, 
    marginBottom: 30 
  },
  inputGroup: { 
    width: '100%' 
  },
  label: { 
    color: 'white', 
    fontSize: 13, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  input: { 
    width: '100%', 
    padding: 12, 
    borderRadius: 8, 
    backgroundColor: '#d1d1d1', 
    fontSize: 16,
    color: '#333'
  },
  actions: { 
    width: '100%', 
    gap: 10 
  },
  btnSenha: { 
    backgroundColor: '#7ed957', 
    padding: 12, 
    borderRadius: 8, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 8 
  },
  textoBtnSenha: { 
    fontWeight: 'bold', 
    color: 'black' 
  },
  btnSair: { 
    backgroundColor: '#ff4b4b', 
    padding: 12, 
    borderRadius: 8, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 8 
  },
  textoBtnSair: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
  voltar: { 
    color: 'white', 
    marginTop: 20, 
    textDecorationLine: 'underline', 
    fontSize: 14 
  }
});

export default Configuracoes;