const supabase = require('../../db.js');

async function CriarAgendamento(dados) {
    const { data, error } = await supabase.from('agendamentos').insert([dados]).select();
    if (error) throw new Error(error.message);
    return data[0];
}

async function ListarAgendamentos(filtro) {
    try {
        
        let query = supabase.from('agendamentos').select(`
            *,
            pacientes ( id, profiles ( nome ) ),
            psicologos ( id, profiles ( nome ) ),
            salas ( id, nome )
        `);

        
        if (filtro.tipo === 'psicologo') {
            
            const { data: psi, error: erroPsi } = await supabase
                .from('psicologos')
                .select('id')
                .eq('profile_id', filtro.id);
                
            if (erroPsi) console.error("Erro ao buscar Psicólogo:", erroPsi);

            if (psi && psi.length > 0) {
                query = query.eq('psicologo_id', psi[0].id);
            } else {
                return []; 
            }

        } else if (filtro.tipo === 'paciente') {
            const { data: pac, error: erroPac } = await supabase
                .from('pacientes')
                .select('id')
                .eq('profile_id', filtro.id);
                
            if (erroPac) console.error("Erro ao buscar Paciente:", erroPac);

            if (pac && pac.length > 0) {
                query = query.eq('paciente_id', pac[0].id);
            } else {
                return []; 
            }
        }

        
        const { data, error } = await query;
        
        if (error) {
            console.error("==== ERRO DO SUPABASE NO AGENDAMENTO ====");
            console.error(error.message);
            console.error("=========================================");
            throw new Error(error.message);
        }
        
        return data;
        
    } catch (erroGeral) {
        console.error("Erro fatal no agendamentoService:", erroGeral.message);
        throw erroGeral;
    }
}

module.exports = { CriarAgendamento, ListarAgendamentos };