import RankingVendedores from '@/components/ranking-vendedores'
import ProtectedRoute from '@/components/ProtectedRoute';
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
        <RankingVendedores />
      </View>
    </ProtectedRoute>
  )
}