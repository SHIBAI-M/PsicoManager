const supabase = require('../../db.js');

async function CriarAgendamento(dados) {
    const { data, error } = await supabase.from('agendamentos').insert([dados]).select();
    if (error) throw new Error(error.message);
    return data[0];
}

async function ListarAgendamentos(filtro) {
    let query = supabase.from('agendamentos').select(`
        *,
        pacientes ( id, profiles (nome) ),
        psicologos ( id, profiles (nome) ),
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