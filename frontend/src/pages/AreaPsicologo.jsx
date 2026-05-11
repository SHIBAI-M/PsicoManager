import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import estilos from '../css/Cadastro.module.css';

function AreaPsicologo() {
    const { usuarioLogado } = useContext(AuthContext);
    const [agenda, setAgenda] = useState([]);

    useEffect(() => {
        carregarAgenda();
    }, []);

    const carregarAgenda = async () => {
        try {
            
            const res = await fetch(`http://localhost:5632/agendamentos?id=${usuarioLogado.userId}&tipo=psicologo`);
            const dados = await res.json();
            if (Array.isArray(dados)) {
                setAgenda(dados);
            }
        } catch (erro) {
            console.error("Erro ao buscar agenda do psicólogo", erro);
        }
    };

    const registrarEvolucao = async (agendamento) => {
        const nomePaciente = agendamento.pacientes?.profiles?.nome || 'Paciente';
        const texto = prompt(`Descreva a evolução da sessão de ${nomePaciente}:`);
        
        if (!texto) return;

        const dadosEvolucao = {
            paciente_id: agendamento.paciente_id,
            psicologo_id: agendamento.psicologo_id,
            agendamento_id: agendamento.id,
            evolucao: texto
        };

        try {
            const res = await fetch('http://localhost:5632/evolucoes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosEvolucao)
            });

            if (res.ok) {
                alert("Evolução salva com sucesso! A sessão agora aparecerá verde na agenda.");
                carregarAgenda();
            } else {
                const erro = await res.json();
                alert(`Erro: ${erro.mensagem}`);
            }
        } catch (error) {
            alert("Erro de conexão ao salvar prontuário.");
        }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div className={estilos.cartao} style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white' }}>
                <h2 style={{ marginBottom: '20px', color: '#1e293b' }}>Painel de Atendimentos</h2>
                <p style={{ color: '#64748b', marginBottom: '30px' }}>
                    Bem-vindo, <strong>{usuarioLogado.nome}</strong>. Abaixo estão seus agendamentos:
                </p>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                            <th style={{ padding: '12px' }}>Paciente</th>
                            <th style={{ padding: '12px' }}>Data e Hora</th>
                            <th style={{ padding: '12px' }}>Sala</th>
                            <th style={{ padding: '12px' }}>Status</th>
                            <th style={{ padding: '12px' }}>Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        {agenda.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '12px', fontWeight: '500' }}>
                                    {item.pacientes?.profiles?.nome || 'Desconhecido'}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {new Date(item.data_inicio).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {item.salas?.nome || 'N/A'}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        padding: '4px 8px', 
                                        borderRadius: '12px', 
                                        fontSize: '12px',
                                        backgroundColor: item.status === 'concluido' ? '#dcfce7' : '#fef3c7',
                                        color: item.status === 'concluido' ? '#166534' : '#92400e'
                                    }}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {item.status === 'pendente' ? (
                                        <button 
                                            onClick={() => registrarEvolucao(item)}
                                            style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                                        >
                                            ✍️ Evolução
                                        </button>
                                    ) : (
                                        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Finalizado</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {agenda.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                                    Nenhum agendamento encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AreaPsicologo;