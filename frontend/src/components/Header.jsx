import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import logo from '../assets/psico.png'; 
import estilos from '../css/Header.module.css'; 

function Header() {
    const { usuarioLogado, logoutContext } = useContext(AuthContext);
    const navegar = useNavigate();

    const lidarComLogout = () => {
        logoutContext();
        navegar('/login');
    };

    return (
        <header className={estilos.cabecalho}>
            <div className={estilos.logo}>
                <Link to="/">
                    <img src={logo} alt="Logo da Clínica" width="150" />
                </Link>
            </div>

            <nav className={estilos.menu}>
                {usuarioLogado ? (
                    <>
                        
                        <Link to="/agendamento" className={estilos.link}>📅 Agenda</Link>

                        
                        {usuarioLogado.tipoUsuario === 'adminClinica' && (
                            <>
                                <Link to="/painel-admin" className={estilos.link}>🏢 Painel Admin</Link>
                                <Link to="/novo-paciente" className={estilos.link}>➕ Novo Paciente</Link>
                            </>
                        )}

                        
                        {usuarioLogado.tipoUsuario === 'psicologo' && (
                            <Link to="/painel-psicologo" className={estilos.link}>🛋️ Minha Área</Link>
                        )}

                        
                        {usuarioLogado.tipoUsuario === 'paciente' && (
                            <Link to="/area-paciente" className={estilos.link}>👤 Meus Dados</Link>
                        )}

                        <button onClick={lidarComLogout} className={estilos.botaoDestaque}>
                            Sair
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className={estilos.link}>Entrar</Link>
                        <Link to="/" className={estilos.botaoDestaque}>Cadastrar</Link>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Header;