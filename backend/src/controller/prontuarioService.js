const supabase = require('../../db.js');

async function SalvarEvolucao(dados) {
    
    const { data, error } = await supabase.from('prontuarios_evolucoes').insert([{
        paciente_id: dados.pacienteId,
        agendamento_id: dados.agendamentoId,
        evolucao: dados.textoEvolucao,
        status_preenchimento: 'finalizado'
    }]);

    if (error) throw new Error(error.message);
    
  
    await supabase.from('agendamentos')
        .update({ status: 'concluido' })
        .eq('id', dados.agendamentoId);

    return data;
}

module.exports = { SalvarEvolucao };