const agendamentoService = require('../services/agendamentoService.js');

async function CriarAgendamento(req, res) {
    try {
        const dados = await agendamentoService.CriarAgendamento(req.body);
        return res.status(201).json(dados);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

async function ListarAgendamentos(filtro) {
    let query = supabase.from('agendamentos').select(`
        *,
        pacientes ( profiles (nome_completo) ),
        psicologos ( profiles (nome_completo) ),
        salas ( nome )
    `);

   
    if (filtro.tipo === 'psicologo') {
        
        const { data: psi } = await supabase.from('psicologos').select('id').eq('profile_id', filtro.id).single();
        if (psi) query = query.eq('psicologo_id', psi.id);
    } else if (filtro.tipo === 'paciente') {
        const { data: pac } = await supabase.from('pacientes').select('id').eq('profile_id', filtro.id).single();
        if (pac) query = query.eq('paciente_id', pac.id);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
}

module.exports = { CriarAgendamento, ListarAgendamentos };