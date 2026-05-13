import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import estilos from '../css/Header.module.css';

function AreaPaciente() {
    const { usuarioLogado } = useContext(AuthContext);
    const [consultas, setConsultas] = useState([]);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/agendamentos?id=${usuarioLogado.userId}&tipo=paciente`)
            .then(res => res.json())
            .then(setConsultas);
    }, [usuarioLogado]);

    return (
        <div style={{ padding: '30px' }}>
            <h1>Bem-vindo, {usuarioLogado.nome}!</h1>
            <h3>Minhas Próximas Sessões</h3>
            <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
                {consultas.map(c => (
                    <div key={c.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                        <p><strong>Data:</strong> {new Date(c.data_inicio).toLocaleString()}</p>
                        <p><strong>Status:</strong> {c.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default AreaPaciente;