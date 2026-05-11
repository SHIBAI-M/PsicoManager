const supabase = require('../../db.js');

async function SalvarEvolucao(dados) {
   
    const { data: prontuario, error: errorProntuario } = await supabase
        .from('prontuarios_evolucoes')
        .insert([{
            paciente_id: dados.paciente_id,
            psicologo_id: dados.psicologo_id,
            agendamento_id: dados.agendamento_id,
            evolucao: dados.evolucao,
            status: 'finalizado'
        }]);

    if (errorProntuario) throw new Error("Erro ao salvar prontuário: " + errorProntuario.message);
    
    const { error: errorAgendamento } = await supabase
        .from('agendamentos')
        .update({ status: 'concluido' })
        .eq('id', dados.agendamento_id);

    if (errorAgendamento) throw new Error("Erro ao atualizar agenda: " + errorAgendamento.message);

    return { sucesso: true };
}

module.exports = { SalvarEvolucao };