import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

interface ProtectedRouteProps {
  permitidos: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({
  permitidos,
  children,
}: ProtectedRouteProps) {
  const router = useRouter();

  const [carregando, setCarregando] = useState(true);
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    async function verificarPermissao() {
      try {
        const perfil =
          await AsyncStorage.getItem(
            'tipoFuncionario'
          );

        if (
          perfil &&
          permitidos.includes(perfil)
        ) {
          setAutorizado(true);
        } else {
          router.replace('/(tabs)');
        }
      } finally {
        setCarregando(false);
      }
    }

    verificarPermissao();
  }, []);

  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!autorizado) {
    return null;
  }

  return <>{children}</>;
}