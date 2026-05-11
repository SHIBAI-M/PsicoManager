import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function AreaPsicologo() {
    const { usuarioLogado } = useContext(AuthContext);
    const [agenda, setAgenda] = useState([]);

    useEffect(() => {
       
        fetch(`http://localhost:5632/agendamentos?id=${usuarioLogado.userId}&tipo=psicologo`)
            .then(res => res.json())
            .then(setAgenda);
    }, []);

    const registrarEvolucao = (agendamentoId) => {
        const texto = prompt("Descreva a evolução do paciente nesta sessão:");
        if (texto) {
           
            console.log("Salvando evolução para agendamento:", agendamentoId, texto);
            alert("Evolução salva no prontuário!");
        }
    };

    return (
        <div style={{ padding: '30px' }}>
            <h2>Painel do Psicólogo</h2>
            <p>Agenda de Atendimentos:</p>
            <table>
                <thead>
                    <tr>
                        <th>Paciente</th>
                        <th>Horário</th>
                        <th>Ação</th>
                    </tr>
                </thead>
                <tbody>
                    {agenda.map(item => (
                        <tr key={item.id}>
                            <td>{item.pacientes?.profiles?.nome}</td>
                            <td>{new Date(item.data_inicio).toLocaleTimeString()}</td>
                            <td>
                                <button onClick={() => registrarEvolucao(item.id)}>✍️ Evolução</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default AreaPsicologo;