import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const logoAcai = "https://cdn-icons-png.flaticon.com/512/5917/5917321.png";

const NovoProduto = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [categoria, setCategoria] = useState('');
  
  const [modalConfirmarAberto, setModalConfirmarAberto] = useState(false);
  const [modalErroAberto, setModalErroAberto] = useState(false);
  
  const navigate = useNavigate();
  const descricaoRef = useRef(null);

  // Auto-ajuste do textarea igual ao anterior
  useEffect(() => {
    if (descricaoRef.current) {
      descricaoRef.current.style.height = "auto";
      descricaoRef.current.style.height = `${descricaoRef.current.scrollHeight}px`;
    }
  }, [descricao]);

  const handleSalvarClick = (e) => {
    e.preventDefault();
    // Validação: se tentar salvar sem preencher todos os campos
    if (!nome || !descricao || !preco || !quantidade || !categoria) {
      setModalErroAberto(true);
      return;
    }
    setModalConfirmarAberto(true);
  };

  const confirmarCadastro = async () => {
    try {
      const { error } = await supabase
        .from('produtos')
        .insert([{ 
          nome, 
          descricao, 
          preco: parseFloat(preco), 
          quantidade: parseInt(quantidade), 
          categoria 
        }]);

      if (error) throw error;

      setModalConfirmarAberto(false);
      navigate('/');
    } catch (error) {
      alert("Erro ao cadastrar: " + error.message);
    }
  };

  return (
    <div style={styles.container}>
      <img src={logoAcai} style={styles.logoTop} alt="logo" />
      <h2 style={styles.titulo}>CADASTRAR <span style={{color: '#7ed957'}}>PRODUTO</span></h2>
      
      <form onSubmit={handleSalvarClick} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Nome do Produto</label>
          <input style={styles.input} value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Descrição</label>
          <textarea 
            ref={descricaoRef} 
            style={{...styles.input, ...styles.textarea}} 
            value={descricao} 
            onChange={(e) => setDescricao(e.target.value)} 
            rows="1" 
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Preço</label>
          <input style={styles.input} type="number" value={preco} onChange={(e) => setPreco(e.target.value)} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Quantidade</label>
          <input style={styles.input} type="number" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Categoria</label>
          <input style={styles.input} value={categoria} onChange={(e) => setCategoria(e.target.value)} />
        </div>
        <div style={styles.buttonRow}>
          <button type="submit" style={styles.btnSalvar}>Salvar</button>
          <button type="button" style={styles.btnCancelar} onClick={() => navigate('/')}>Cancelar</button>
        </div>
      </form>

      {/* MODAL DE ERRO: CAMPOS VAZIOS */}
      {modalErroAberto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{margin:0, color: 'black'}}>Atenção</h3>
              <img src={logoAcai} style={{width: '40px'}} alt="logo" />
            </div>
            <p style={{color: 'black', margin: '20px 0'}}>Por favor, preencha todos os campos antes de salvar!</p>
            <button style={styles.btnModalCancel} onClick={() => setModalErroAberto(false)}>OK</button>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO: IGUAL ERA */}
      {modalConfirmarAberto && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={{margin:0, color: 'black'}}>Confirmar</h3>
              <img src={logoAcai} style={{width: '40px'}} alt="logo" />
            </div>
            <p style={{color: 'black', margin: '20px 0'}}>Deseja realmente cadastrar o produto <strong>{nome}</strong>?</p>
            <div style={styles.modalButtons}>
              <button style={styles.btnModalConfirm} onClick={confirmarCadastro}>Salvar</button>
              <button style={styles.btnModalCancel} onClick={() => setModalConfirmarAberto(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#4a3061', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', fontFamily: 'sans-serif' },
  logoTop: { width: '80px', marginBottom: '10px' },
  titulo: { color: 'white', fontSize: '26px', fontWeight: 'bold', marginBottom: '30px' },
  form: { width: '100%', maxWidth: '350px', display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { color: 'white', fontWeight: 'bold', fontSize: '15px' },
  input: { width: '100%', padding: '12px', borderRadius: '4px', border: 'none', backgroundColor: '#d1d1d1', boxSizing: 'border-box', fontSize: '16px' },
  textarea: { resize: 'none', overflow: 'hidden', fontFamily: 'inherit', minHeight: '45px' },
  buttonRow: { display: 'flex', gap: '15px', marginTop: '10px' },
  btnSalvar: { flex: 1, padding: '12px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  btnCancelar: { flex: 1, padding: '12px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: '#d1d1d1', padding: '20px', borderRadius: '10px', width: '300px', textAlign: 'center' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  modalButtons: { display: 'flex', gap: '10px', justifyContent: 'center' },
  btnModalConfirm: { backgroundColor: 'green', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' },
  btnModalCancel: { backgroundColor: 'gray', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }
};

export default NovoProduto;