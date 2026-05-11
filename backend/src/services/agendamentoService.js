const supabase = require('../../db.js');

async function CriarAgendamento(dados) {
    const { data, error } = await supabase.from('agendamentos').insert([dados]).select();
    if (error) throw new Error(error.message);
    return data[0];
}

async function ListarAgendamentos(filtro) {
    let query = supabase.from('agendamentos').select(`
        *,
        pacientes!inner ( id, profiles!inner (nome_completo) ),
        psicologos!inner ( id, profiles!inner (nome_completo) )
    `);

    if (filtro.tipo === 'psicologo' && filtro.id) {
        query = query.eq('psicologo_id', filtro.id);
    } else if (filtro.tipo === 'paciente' && filtro.id) {
        query = query.eq('paciente_id', filtro.id);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
}

module.exports = { CriarAgendamento, ListarAgendamentos };