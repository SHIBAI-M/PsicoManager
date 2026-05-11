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
        carregarListas();
    }, []);

    const carregarListas = async () => {
        try {
            const [resPac, resPsi, resSalas] = await Promise.all([
                fetch('http://localhost:5632/lista-pacientes'),
                fetch('http://localhost:5632/lista-psicologos'),
                fetch('http://localhost:5632/lista-salas')
            ]);
            setListaPacientes(await resPac.json());
            setListaPsicologos(await resPsi.json());
            setListaSalas(await resSalas.json());
        } catch (e) { console.error("Erro ao carregar dados", e); }
    };

    const carregarAgenda = async () => {
        try {
            const url = `http://localhost:5632/agendamentos?id=${usuarioLogado.userId}&tipo=${usuarioLogado.tipoUsuario}`;
            const res = await fetch(url);
            const dados = await res.json();
            
            const formatados = dados.map(a => ({
                id: a.id,
                title: `Sessão: ${a.pacientes?.profiles?.nome_completo || 'Consulta'}`,
                start: a.data_inicio,
                end: a.data_fim,
                backgroundColor: a.status === 'concluido' ? '#10b981' : (a.status === 'pendente' ? '#f59e0b' : '#334155')
            }));
            setEventos(formatados);
        } catch (e) { console.error("Erro ao carregar agenda", e); }
    };

    const lidarComCliqueNoDia = async (info) => {
        setDataSelecionada(info.dateStr);
        
        
        if (usuarioLogado.tipoUsuario === 'paciente') {
            
            const res = await fetch(`http://localhost:5632/agendamentos?id=${usuarioLogado.userId}&tipo=paciente`);
            
            setPacienteId(listaPacientes.find(p => p.nome === usuarioLogado.nome)?.id || '');
        } else if (usuarioLogado.tipoUsuario === 'psicologo') {
            setPsicologoId(listaPsicologos.find(p => p.nome === usuarioLogado.nome)?.id || '');
        }
        
        setExibirModal(true);
    };

    const salvarAgendamento = async (e) => {
        e.preventDefault();
        const dados = {
            paciente_id: pacienteId,
            psicologo_id: psicologoId,
            sala_id: salaId,
            data_inicio: `${dataSelecionada}T${horaInicio}:00`,
            data_fim: `${dataSelecionada}T${(parseInt(horaInicio.split(':')[0]) + 1).toString().padStart(2, '0')}:00`,
            status: 'pendente'
        };

        const res = await fetch('http://localhost:5632/agendamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (res.ok) {
            alert("Agendamento realizado!");
            setExibirModal(false);
            carregarAgenda();
        } else {
            alert("Erro ao salvar agendamento.");
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
                        <h3>Novo Agendamento</h3>
                        <form onSubmit={salvarAgendamento} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <select value={pacienteId} onChange={e => setPacienteId(e.target.value)} required disabled={usuarioLogado.tipoUsuario === 'paciente'}>
                                <option value="">Selecione o Paciente</option>
                                {listaPacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                            </select>

                            <select value={psicologoId} onChange={e => setPsicologoId(e.target.value)} required disabled={usuarioLogado.tipoUsuario === 'psicologo'}>
                                <option value="">Selecione o Psicólogo</option>
                                {listaPsicologos.map(psi => <option key={psi.id} value={psi.id}>{psi.nome}</option>)}
                            </select>

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