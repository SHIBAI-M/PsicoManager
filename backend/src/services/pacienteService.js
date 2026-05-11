const supabase = require('../../db.js');

async function CriarPaciente(nome, email, cpf, dataNascimento, telefone) {
    const senhaPadrao = 'paciente123'; 
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: senhaPadrao,
    });
    if (authError) throw new Error(authError.message);

    const userId = authData.user.id;

    const { error: profileError } = await supabase.from('profiles').insert([{
        id: userId,
        nome_completo: nome, 
        email: email,
        tipo_perfil: 'paciente'
    }]);
    if (profileError) throw new Error(profileError.message);

    const { error: pacienteError } = await supabase.from('pacientes').insert([{
        profile_id: userId,
        cpf: cpf,
        data_nascimento: dataNascimento,
        telefone: telefone
    }]);
    if (pacienteError) throw new Error(pacienteError.message);

    return { userId };
}

module.exports = { CriarPaciente };