import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, useParams } from 'react-router-dom';

const DetalhesProduto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    const fetchProduto = async () => {
      const { data, error } = await supabase.from('produtos').select('*').eq('id', id).single();
      if (data) setProduto(data);
    };
    fetchProduto();
  }, [id]);

  if (!produto) return <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>Carregando...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>{produto.nome}</h2>
        <p><strong>Descrição:</strong> {produto.descricao}</p>
        <p><strong>Preço:</strong> R$ {produto.preco}</p>
        <p><strong>Quantidade:</strong> {produto.quantidade} UND</p>
        <p><strong>Categoria:</strong> {produto.categoria}</p>
        <button style={styles.btnVoltar} onClick={() => navigate('/')}>Voltar</button>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#4a3061', minHeight: '100vh', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '100%', maxWidth: '400px' },
  titulo: { color: '#4a3061', marginBottom: '20px', borderBottom: '2px solid #7ed957' },
  btnVoltar: { width: '100%', padding: '12px', marginTop: '20px', backgroundColor: '#4a3061', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }
};

export default DetalhesProduto;