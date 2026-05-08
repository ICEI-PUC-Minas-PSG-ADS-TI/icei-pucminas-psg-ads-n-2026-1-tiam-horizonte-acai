import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // IMPORTANTE: Troca de import
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const logoAcai = "https://cdn-icons-png.flaticon.com/512/5917/5917321.png";

const TelaProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [produtoParaExcluir, setProdutoParaExcluir] = useState(null);
  
  const navigate = useNavigate();

  // Simulação de usuário (depois isso virá do Login)
  const [usuarioLogado] = useState({ nome: 'ADM', cargo: 'Gestor' });

  // 1. Lógica do Supabase para buscar produtos
  useEffect(() => {
    fetchProdutos();
  }, []);

  async function fetchProdutos() {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .order('nome', { ascending: true });
    
    if (data) setProdutos(data);
    if (error) console.log("Erro ao buscar:", error.message);
  }

  // 2. Lógica do Supabase para excluir
  const handleExcluir = async () => {
    if (produtoParaExcluir) {
      const { error } = await supabase
        .from('produtos')
        .delete()
        .eq('id', produtoParaExcluir.id);

      if (!error) {
        setModalExcluirAberto(false);
        setProdutoParaExcluir(null);
        fetchProdutos(); // Atualiza a lista
      } else {
        alert("Erro ao excluir: " + error.message);
      }
    }
  };

  const produtosFiltrados = produtos.filter(p => 
    p.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <img src={logoAcai} style={styles.marcaDagua} alt="bg" />

      <div style={styles.box}>
        <div style={styles.logoContainer}>
          <img src={logoAcai} style={styles.logoTopo} alt="logo" />
        </div>

        <header style={styles.header}>
          <span style={styles.icon}>🏠</span>
          <h2 style={styles.logoText}>PROD<span style={{color: '#7ed957'}}>UTOS</span></h2>
          <span 
            style={{...styles.icon, cursor: 'pointer'}} 
            onClick={() => setMenuAberto(true)}
          >
            ☰
          </span>
        </header>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Buscar Produto</label>
          <input 
            style={styles.input} 
            placeholder="Digite o nome..." 
            value={busca} 
            onChange={(e) => setBusca(e.target.value)} 
          />
        </div>

        <div style={styles.lista}>
          {produtosFiltrados.map(p => (
            <div key={p.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{p.nome}</h3>
              
              <div style={styles.estoqueRow}>
                <span>Estoque: {p.quantidade} UND</span>
                {/* Visual exato do status */}
                <div style={styles.statusGroup}>
                  <div style={{
                    ...styles.bolinha, 
                    backgroundColor: Number(p.quantidade) <= 10 ? 'red' : '#7ed957'
                  }} />
                  <span style={{fontSize: '14px', fontWeight: 'bold', color: '#4a3061'}}>
                    {Number(p.quantidade) <= 10 ? 'Baixo' : 'OK'}
                  </span>
                </div>
              </div>

              {/* Visual exato dos três botões */}
              <div style={styles.actions}>
                <button style={styles.btnAction} onClick={() => navigate(`/editar/${p.id}`)}>Editar</button>
                <button style={styles.btnAction} onClick={() => navigate(`/detalhes/${p.id}`)}>Ver Mais</button>
                <button 
                  style={{...styles.btnAction, backgroundColor: 'red'}} 
                  onClick={() => {
                    setProdutoParaExcluir(p);
                    setModalExcluirAberto(true);
                  }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button style={styles.btnNovo} onClick={() => navigate('/novo')}>Novo Produto +</button>
      </div>

      {/* MODAL CINZA DE EXCLUIR RESTAURADO */}
      {modalExcluirAberto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{margin:0, color: 'black'}}>Excluir Produto</h3>
              <img src={logoAcai} style={{width: '40px'}} alt="logo" />
            </div>
            <p style={{color: 'black', margin: '20px 0'}}>Deseja realmente excluir o produto<br/><strong>{produtoParaExcluir?.nome}</strong>?</p>
            <div style={styles.modalButtons}>
              <button style={styles.btnModalConfirm} onClick={handleExcluir}>Excluir</button>
              <button style={styles.btnModalCancel} onClick={() => setModalExcluirAberto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      <Sidebar 
        isOpen={menuAberto} 
        onClose={() => setMenuAberto(false)} 
        user={usuarioLogado} 
      />
    </div>
  );
};

// ESTILOS IDÊNTICOS AOS ORIGINAIS
const styles = {
  container: { backgroundColor: '#4a3061', minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '20px', position: 'relative', fontFamily: 'sans-serif', overflowX: 'hidden' },
  marcaDagua: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '320px', opacity: '0.15', zIndex: 1, pointerEvents: 'none' },
  box: { width: '100%', maxWidth: '400px', zIndex: 2, position: 'relative' },
  logoContainer: { display: 'flex', justifyContent: 'center', marginBottom: '10px' },
  logoTopo: { width: '80px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '70px' },
  logoText: { color: 'white', margin: 0, fontWeight: 'bold', fontSize: '24px' },
  icon: { color: 'white', fontSize: '28px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
  label: { color: 'white', fontWeight: 'bold', fontSize: '16px' },
  input: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#d1d1d1', fontSize: '16px' },
  lista: { maxHeight: '50vh', overflowY: 'auto', paddingRight: '5px' },
  card: { backgroundColor: 'white', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '3px solid #7ed957', boxShadow: '0px 4px 6px rgba(0,0,0,0.2)' },
  cardTitle: { margin: '0 0 10px 0', color: '#4a3061', fontSize: '18px' },
  estoqueRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', color: '#4a3061', fontWeight: 'bold' },
  statusGroup: { display: 'flex', alignItems: 'center', gap: '8px' },
  bolinha: { width: '12px', height: '12px', borderRadius: '50%' },
  actions: { display: 'flex', gap: '8px' },
  btnAction: { flex: 1, padding: '8px 2px', backgroundColor: '#4a3061', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' },
  btnNovo: { width: '100%', padding: '15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer', fontSize: '18px' },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#d1d1d1', padding: '20px', borderRadius: '10px', width: '300px', textAlign: 'center' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalButtons: { display: 'flex', gap: '10px', justifyContent: 'center' },
  btnModalConfirm: { backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  btnModalCancel: { backgroundColor: 'gray', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }
};

export default TelaProdutos;