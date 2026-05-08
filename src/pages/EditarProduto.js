import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';
import { LuPencilLine } from "react-icons/lu";

const logoAcai = "https://cdn-icons-png.flaticon.com/512/5917/5917321.png";

const EditarProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados dos campos
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoria, setCategoria] = useState('');

  // Estado que controla se o campo está liberado para edição (False = Bloqueado)
  const [editando, setEditando] = useState({
    nome: false,
    descricao: false,
    preco: false,
    quantidade: false,
    categoria: false
  });

  const [modalConfirmarAberto, setModalConfirmarAberto] = useState(false);
  const descricaoRef = useRef(null);

  // Carrega os dados do Supabase ao abrir a tela
  useEffect(() => {
    const carregarProduto = async () => {
      const { data, error } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', id)
        .single();
      
      if (data) {
        setNome(data.nome);
        setDescricao(data.descricao);
        setPreco(data.preco);
        setQuantidade(data.quantidade);
        setCategoria(data.categoria);
      }
    };
    carregarProduto();
  }, [id]);

  // Ajuste automático do textarea da descrição
  useEffect(() => {
    if (descricaoRef.current) {
      descricaoRef.current.style.height = "auto";
      descricaoRef.current.style.height = `${descricaoRef.current.scrollHeight}px`;
    }
  }, [descricao]);

  // Função para "destravar" o campo ao clicar no lápis
  const liberarCampo = (campo) => {
    setEditando(prev => ({
      ...prev,
      [campo]: true // Libera apenas o campo clicado
    }));
  };

  const salvarAlteracoes = async () => {
    try {
      const { error } = await supabase
        .from('produtos')
        .update({
          nome,
          descricao,
          preco: parseFloat(preco),
          quantidade: parseInt(quantidade),
          categoria
        })
        .eq('id', id);

      if (error) throw error;
      navigate('/');
    } catch (error) {
      alert("Erro ao atualizar: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.logoContainer}>
          <img src={logoAcai} alt="Logo" style={styles.logo} />
        </div>
        
        <h2 style={styles.titulo}>EDITAR <span style={{color: '#7ed957'}}>PRODUTO</span></h2>
        
        <div style={styles.form}>
          {/* CAMPO NOME */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome do Produto</label>
            <div style={styles.inputWrapper}>
              <input 
                style={{...styles.input, backgroundColor: editando.nome ? '#fff' : '#d1d1d1'}} 
                value={nome} 
                onChange={(e) => setNome(e.target.value)} 
                readOnly={!editando.nome}
              />
              <LuPencilLine style={styles.editIcon} onClick={() => liberarCampo('nome')} />
            </div>
          </div>

          {/* CAMPO DESCRIÇÃO */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Descrição</label>
            <div style={styles.inputWrapper}>
              <textarea 
                ref={descricaoRef}
                style={{...styles.input, ...styles.textarea, backgroundColor: editando.descricao ? '#fff' : '#d1d1d1'}} 
                value={descricao} 
                onChange={(e) => setDescricao(e.target.value)} 
                readOnly={!editando.descricao}
                rows="1"
              />
              <LuPencilLine style={styles.editIcon} onClick={() => liberarCampo('descricao')} />
            </div>
          </div>

          {/* CAMPO PREÇO */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Preço</label>
            <div style={styles.inputWrapper}>
              <input 
                style={{...styles.input, backgroundColor: editando.preco ? '#fff' : '#d1d1d1'}} 
                type="number"
                value={preco} 
                onChange={(e) => setPreco(e.target.value)} 
                readOnly={!editando.preco}
              />
              <LuPencilLine style={styles.editIcon} onClick={() => liberarCampo('preco')} />
            </div>
          </div>

          {/* CAMPO ESTOQUE */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Estoque</label>
            <div style={styles.inputWrapper}>
              <input 
                style={{...styles.input, backgroundColor: editando.quantidade ? '#fff' : '#d1d1d1'}} 
                type="number"
                value={quantidade} 
                onChange={(e) => setQuantidade(e.target.value)} 
                readOnly={!editando.quantidade}
              />
              <LuPencilLine style={styles.editIcon} onClick={() => liberarCampo('quantidade')} />
            </div>
          </div>

          <div style={styles.buttonRow}>
            <button style={styles.btnSalvar} onClick={() => setModalConfirmarAberto(true)}>Salvar</button>
            <button style={styles.btnCancelar} onClick={() => navigate('/')}>Cancelar</button>
          </div>
        </div>
      </div>

      {/* MODAL CINZA DE CONFIRMAÇÃO */}
      {modalConfirmarAberto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{margin:0, color: 'black'}}>Confirmar Edição</h3>
              <img src={logoAcai} style={{width: '40px'}} alt="logo" />
            </div>
            <p style={{color: 'black', margin: '20px 0'}}>Deseja salvar as alterações deste produto?</p>
            <div style={styles.modalButtons}>
              <button style={styles.btnModalConfirm} onClick={salvarAlteracoes}>Confirmar</button>
              <button style={styles.btnModalCancel} onClick={() => setModalConfirmarAberto(false)}>Voltar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#4a3061', minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '40px 20px', fontFamily: 'sans-serif' },
  box: { width: '100%', maxWidth: '380px' },
  logoContainer: { display: 'flex', justifyContent: 'center', marginBottom: '10px' },
  logo: { width: '80px' },
  titulo: { color: 'white', textAlign: 'center', fontSize: '24px', fontWeight: 'bold', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { color: 'white', fontWeight: 'bold', fontSize: '14px' },
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  input: { width: '100%', padding: '12px', paddingRight: '45px', borderRadius: '8px', border: 'none', fontSize: '16px', color: '#333', transition: '0.3s' },
  textarea: { resize: 'none', overflow: 'hidden', minHeight: '45px' },
  editIcon: { position: 'absolute', right: '12px', color: '#4a3061', cursor: 'pointer', fontSize: '22px', zIndex: 10, padding: '5px' },
  buttonRow: { display: 'flex', gap: '15px', marginTop: '20px' },
  btnSalvar: { flex: 1, padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  btnCancelar: { flex: 1, padding: '12px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#d1d1d1', padding: '25px', borderRadius: '15px', width: '300px', textAlign: 'center' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalButtons: { display: 'flex', gap: '10px', justifyContent: 'center' },
  btnModalConfirm: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' },
  btnModalCancel: { backgroundColor: 'gray', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }
};

export default EditarProduto;