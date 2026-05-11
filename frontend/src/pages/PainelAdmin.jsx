import { Link } from 'react-router-dom';

function PainelAdmin() {
    return (
        <div>
            <h1>Bem-vindo, Administrador!</h1>
            
            <div className="botoes-acoes">
                <Link to="/novo-paciente">
                    <button>👤 Cadastrar Novo Paciente</button>
                </Link>
                <Link to="/agenda">
                    <button>📅 Ver Agenda da Clínica</button>
                </Link>
                <Link to="/financeiro">
                    <button>💰 Financeiro</button>
                </Link>
            </div>
        </div>
    );
}

export default PainelAdmin;