import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TelaRelatorios from './src/pages/TelaRelatorios';

// Importação das telas convertidas
import TelaProdutos from './src/pages/TelaProdutos';
import NovoProduto from './src/pages/NovoProduto';
import EditarProduto from './src/pages/EditarProduto';
import DetalhesProduto from './src/pages/DetalhesProduto';
import Configuracoes from './src/pages/Configuracoes';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: '#4a3061' } 
        }}
      >
        {/* Registro de todas as rotas do aplicativo */}
        <Stack.Screen name="Home" component={TelaProdutos} />
        <Stack.Screen name="NovoProduto" component={NovoProduto} />
        <Stack.Screen name="EditarProduto" component={EditarProduto} />
        <Stack.Screen name="DetalhesProduto" component={DetalhesProduto} />
        <Stack.Screen name="Configuracoes" component={Configuracoes} />
        <Stack.Screen name="TelaRelatorios" component={TelaRelatorios} options={{ headerShown: false }} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}