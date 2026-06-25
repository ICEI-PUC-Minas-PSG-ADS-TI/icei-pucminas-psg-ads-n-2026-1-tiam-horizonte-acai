import CriarMeta from '@/components/criar-meta'
import ProtectedRoute from '@/components/ProtectedRoute';
import { View } from 'react-native'

export default function Ranking() {
  return (
    <ProtectedRoute
      permitidos={[
        'GESTOR',
        'ADMINISTRADOR',
      ]}
    >
      <View style={{ flex: 1 }}>
        <CriarMeta />
      </View>
    </ProtectedRoute>
  )
}