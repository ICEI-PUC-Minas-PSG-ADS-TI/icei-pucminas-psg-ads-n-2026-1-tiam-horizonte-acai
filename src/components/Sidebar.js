import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, user }) => {
  const navigate = useNavigate();

  // Caso não venha foto do banco, usamos essa padrão
  const fotoPadrao = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const menuItens = [
    { nome: 'Cadastrar Produtos', path: '/novo' },
    { nome: 'Cadastrar Clientes', path: '/clientes' },
    { nome: 'Cadastrar Venda', path: '/vendas' },
    { nome: 'Gerar Relatórios', path: '/relatorios' },
    { nome: 'Gerar Rankings', path: '/rankings' },
    { nome: 'Cadastrar Colaborador', path: '/colaboradores' },
    { nome: 'Configurações', path: '/configuracoes' },
  ];

  return (
    <>
      {isOpen && <div style={styles.overlay} onClick={onClose} />}

      <div style={{ ...styles.sidebar, right: isOpen ? '0' : '-100%' }}>
        
        <div style={styles.headerSidebar}>
          <span style={styles.closeBtn} onClick={onClose}>X</span>
        </div>

        <div style={styles.userInfo}>
          {/* --- NOVA ÁREA DE PERFIL COM FOTO --- */}
          <div style={styles.profileArea}>
            <div style={styles.fotoContainer}>
              <img 
                src={user?.foto || fotoPadrao} 
                alt="Perfil" 
                style={styles.fotoSidebar} 
              />
            </div>
            <div style={styles.textosPerfil}>
              <p style={styles.userName}><strong>{user?.nome || 'Usuário'}</strong></p>
              <span style={styles.cargoBadge}>{user?.cargo || 'Gestor'}</span>
            </div>
          </div>
          {/* ----------------------------------- */}
          
          <div style={styles.divider} />
          
          <p style={styles.permTitle}>Permissões:</p>
          <nav style={styles.nav}>
            {menuItens.map((item, index) => (
              <div 
                key={index} 
                style={styles.navItem} 
                onClick={() => { navigate(item.path); onClose(); }}
              >
                • {item.nome}
              </div>
            ))}
          </nav>

          <div style={styles.statusRow}>
            <strong>Status:</strong> Online 
            <div style={styles.bolinhaOnline} />
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 },
  sidebar: { position: 'fixed', top: 0, width: '75%', maxWidth: '300px', height: '100%', backgroundColor: 'white', zIndex: 1000, transition: '0.4s ease-in-out', padding: '25px', color: 'black', display: 'flex', flexDirection: 'column' },
  headerSidebar: { display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' },
  closeBtn: { fontSize: '26px', cursor: 'pointer', fontWeight: 'bold', color: '#4a3061' },
  
  // Estilos da nova área de perfil
  profileArea: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' },
  fotoContainer: { width: '60px', height: '60px', borderRadius: '50%', border: '2px solid #7ed957', overflow: 'hidden', backgroundColor: '#eee' },
  fotoSidebar: { width: '100%', height: '100%', objectFit: 'cover' },
  textosPerfil: { display: 'flex', flexDirection: 'column', gap: '2px' },
  userName: { fontSize: '16px', margin: 0, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' },
  cargoBadge: { fontSize: '12px', color: '#666', fontWeight: 'bold', textTransform: 'uppercase' },

  userInfo: { display: 'flex', flexDirection: 'column', height: '100%' },
  divider: { height: '1px', backgroundColor: '#eee', margin: '15px 0' },
  permTitle: { fontWeight: 'bold', marginBottom: '10px', color: '#4a3061', fontSize: '16px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '10px' },
  navItem: { padding: '10px 5px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', color: '#444', fontSize: '15px' },
  statusRow: { marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px', paddingBottom: '20px', fontSize: '18px' },
  bolinhaOnline: { width: '14px', height: '14px', borderRadius: '50%', backgroundColor: '#00ff00', boxShadow: '0 0 8px #00ff00' }
};

export default Sidebar;