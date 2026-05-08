import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LuLogOut, LuKey, LuUser } from "react-icons/lu";

const Configuracoes = () => {
  const navigate = useNavigate();
  // Simulação de usuário (depois conectamos com supabase.auth)
  const [user] = useState({
    nome: 'Rique Santos',
    email: 'rique.empresa@acai.com',
    cargo: 'Administrador',
    foto: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'
  });

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <h2 style={styles.titulo}>PERFIL DO <span style={{color: '#7ed957'}}>COLABORADOR</span></h2>

        <div style={styles.fotoContainer}>
          <img src={user.foto} alt="Perfil" style={styles.fotoPerfil} />
          <button style={styles.btnAlterarFoto}>Alterar Foto</button>
        </div>

        <div style={styles.infoArea}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome Completo</label>
            <input style={styles.input} value={user.nome} readOnly />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail Corporativo</label>
            <input style={styles.input} value={user.email} readOnly />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Cargo</label>
            <input style={{...styles.input, color: '#000000', fontWeight: 'bold'}} value={user.cargo} readOnly />
          </div>
        </div>

        <div style={styles.actions}>
          <button style={styles.btnSenha}><LuKey /> Trocar Senha</button>
          <button style={styles.btnSair} onClick={() => navigate('/login')}>
            <LuLogOut /> Sair da Conta
          </button>
        </div>

        <p style={styles.voltar} onClick={() => navigate('/')}>Voltar ao Início</p>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#4a3061', minHeight: '100vh', display: 'flex', justifyContent: 'center', padding: '40px 20px' },
  box: { width: '100%', maxWidth: '400px', textAlign: 'center' },
  titulo: { color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '30px' },
  fotoContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '25px' },
  fotoPerfil: { width: '110px', height: '110px', borderRadius: '50%', border: '4px solid #7ed957', backgroundColor: 'white', marginBottom: '10px' },
  btnAlterarFoto: { background: 'none', color: '#7ed957', border: '1px solid #7ed957', padding: '4px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '11px' },
  infoArea: { display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' },
  inputGroup: { textAlign: 'left' },
  label: { color: 'white', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px', display: 'block' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#d1d1d1', fontSize: '16px' },
  actions: { display: 'flex', flexDirection: 'column', gap: '10px' },
  btnSenha: { backgroundColor: '#7ed957', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' },
  btnSair: { backgroundColor: '#ff4b4b', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' },
  voltar: { color: 'white', marginTop: '20px', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }
};

export default Configuracoes;