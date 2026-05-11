import React, { useState, useEffect, useContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { AuthContext } from '../context/AuthContext';
import estilos from '../css/Cadastro.module.css';

function Agenda() {
    const { usuarioLogado } = useContext(AuthContext);
    const [eventos, setEventos] = useState([]);
    const [exibirModal, setExibirModal] = useState(false);
    
    const [listaPacientes, setListaPacientes] = useState([]);
    const [listaPsicologos, setListaPsicologos] = useState([]);
    const [listaSalas, setListaSalas] = useState([]);

    const [dataSelecionada, setDataSelecionada] = useState('');
    const [pacienteId, setPacienteId] = useState('');
    const [psicologoId, setPsicologoId] = useState('');
    const [salaId, setSalaId] = useState('');
    const [horaInicio, setHoraInicio] = useState('09:00');

    useEffect(() => {
        carregarAgenda();
        carregarDadosIniciais();
    }, []);

    const carregarDadosIniciais = async () => {
        try {
            const [resPac, resPsi, resSal] = await Promise.all([
                fetch('http://localhost:5632/lista-pacientes'),
                fetch('http://localhost:5632/lista-psicologos'),
                fetch('http://localhost:5632/lista-salas')
            ]);
            
            const pacs = await resPac.json();
            const psis = await resPsi.json();
            const sals = await resSal.json();

            if (Array.isArray(pacs)) setListaPacientes(pacs);
            if (Array.isArray(psis)) setListaPsicologos(psis);
            if (Array.isArray(sals)) setListaSalas(sals);
        } catch (e) { 
            console.error("Erro ao carregar listas", e); 
        }
    };

    const carregarAgenda = async () => {
        try {
            const url = `http://localhost:5632/agendamentos?id=${usuarioLogado.userId}&tipo=${usuarioLogado.tipoUsuario}`;
            const res = await fetch(url);
            const dados = await res.json();
            
            console.log("Dados recebidos do banco:", dados); // Verifique isso no F12 do navegador

            if (Array.isArray(dados)) {
                const formatados = dados.map(a => ({
                    id: a.id,
                    
                    title: `Sessão: ${a.pacientes?.profiles?.nome || 'Paciente'}`,
                    start: a.data_inicio,
                    end: a.data_fim,
                    backgroundColor: a.status === 'concluido' ? '#10b981' : (a.status === 'pendente' ? '#f59e0b' : '#334155'),
                    textColor: '#ffffff'
                }));
                setEventos(formatados);
            }
        } catch (e) {
            console.error("Erro ao carregar agenda", e);
        }
    };

    const lidarComCliqueNoDia = (info) => {
        setDataSelecionada(info.dateStr);
        
        if (usuarioLogado.tipoUsuario === 'paciente') {
            const meuId = listaPacientes.find(p => p.nome === usuarioLogado.nome)?.id;
            setPacienteId(meuId || '');
            setPsicologoId('');
        } else if (usuarioLogado.tipoUsuario === 'psicologo') {
            const meuId = listaPsicologos.find(psi => psi.nome === usuarioLogado.nome)?.id;
            setPsicologoId(meuId || '');
            setPacienteId('');
        } else {
            setPacienteId('');
            setPsicologoId('');
        }
        
        setExibirModal(true);
    };

    const salvarAgendamento = async (e) => {
        e.preventDefault();
        
        if (!pacienteId || !psicologoId || !salaId) {
            return alert("Preencha todos os campos corretamente.");
        }

        const dadosAgendamento = {
            paciente_id: pacienteId,
            psicologo_id: psicologoId,
            sala_id: salaId,
            data_inicio: `${dataSelecionada}T${horaInicio}:00`,
            data_fim: `${dataSelecionada}T${(parseInt(horaInicio.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
            status: 'pendente'
        };

        try {
            const res = await fetch('http://localhost:5632/agendamentos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAgendamento)
            });

            if (res.ok) {
                alert("Agendamento salvo com sucesso!");
                setExibirModal(false);
                carregarAgenda();
            } else {
                const erro = await res.json();
                alert(`Erro: ${erro.mensagem}`);
            }
        } catch (error) {
            alert("Erro de conexão.");
        }
    };

    return (
        <div style={{ padding: '40px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <div className={estilos.cartao} style={{ maxWidth: '1000px', margin: '0 auto', backgroundColor: 'white' }}>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale="pt-br"
                    events={eventos}
                    dateClick={lidarComCliqueNoDia}
                />
            </div>

            {exibirModal && (
                <div style={{ position: 'fixed', top:0, left:0, width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex: 1000 }}>
                    <div className={estilos.cartao} style={{ width: '450px', backgroundColor: 'white', padding: '30px' }}>
                        <h3>Agendar Sessão</h3>
                        <form onSubmit={salvarAgendamento} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
                            
                            {usuarioLogado.tipoUsuario !== 'paciente' ? (
                                <select value={pacienteId} onChange={e => setPacienteId(e.target.value)} required>
                                    <option value="">Selecione o Paciente</option>
                                    {listaPacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                                </select>
                            ) : <p>Paciente: <strong>{usuarioLogado.nome}</strong></p>}

                            {usuarioLogado.tipoUsuario !== 'psicologo' ? (
                                <select value={psicologoId} onChange={e => setPsicologoId(e.target.value)} required>
                                    <option value="">Selecione o Psicólogo</option>
                                    {listaPsicologos.map(psi => <option key={psi.id} value={psi.id}>{psi.nome}</option>)}
                                </select>
                            ) : <p>Profissional: <strong>{usuarioLogado.nome}</strong></p>}

                            <select value={salaId} onChange={e => setSalaId(e.target.value)} required>
                                <option value="">Selecione a Sala</option>
                                {listaSalas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                            </select>

                            <input type="time" value={horaInicio} onChange={e => setHoraInicio(e.target.value)} required />

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className={estilos.botaoDestaque} style={{ flex: 1 }}>Confirmar</button>
                                <button type="button" onClick={() => setExibirModal(false)} style={{ flex: 1 }}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Agenda;