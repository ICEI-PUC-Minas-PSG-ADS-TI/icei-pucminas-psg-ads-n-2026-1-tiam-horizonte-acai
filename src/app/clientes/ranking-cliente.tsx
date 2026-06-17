import ProtectedRoute from '@/components/ProtectedRoute';
import RankingClientes from '../../components/ranking-clientes'
import { View } from 'react-native'

export default function Ranking() {
  return (
    <ProtectedRoute
      permitidos={[
        'GESTOR',
        'VENDEDOR',
        'ADMINISTRADOR',
      ]}
    >
      <View style={{ flex: 1 }}>
        <RankingClientes />
      </View>
    </ProtectedRoute>
  )
}