import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TelaProdutos from './pages/TelaProdutos';
import NovoProduto from './pages/NovoProduto';
import EditarProduto from './pages/EditarProduto';
import DetalhesProduto from './pages/DetalhesProduto';
import Configuracoes from './pages/Configuracoes';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TelaProdutos />} />
        <Route path="/novo" element={<NovoProduto />} /> 
        <Route path="/editar/:id" element={<EditarProduto />} />
        <Route path="/detalhes/:id" element={<DetalhesProduto />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </Router>
  );
}

export default App;