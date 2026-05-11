const supabase = require('../../db.js'); 

async function Cadastrar(userName, email, telefone, senha, tipoUsuario) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: senha,
    });

    if (authError) throw new Error(authError.message); 

    const userId = authData.user.id;

    const { error: profileError } = await supabase
        .from('profiles')
        .insert([{
            id: userId,
            nome: userName, 
            email: email,
            tipo_perfil: tipoUsuario
        }]);

    if (profileError) throw new Error('Erro ao criar perfil público.');

    const { data: clinica } = await supabase.from('clinica').select('id').limit(1).single();

    if (tipoUsuario === 'paciente') {
        await supabase.from('pacientes').insert([
            { profile_id: userId, telefone: telefone, clinica_id: clinica?.id }
        ]);
    } else if (tipoUsuario === 'psicologo') {
        await supabase.from('psicologos').insert([
            { profile_id: userId, clinica_id: clinica?.id }
        ]);
    } else if (tipoUsuario === 'adminClinica') {
        await supabase.from('clinica').insert([{ dono_id: userId }]);
    }

    return { userId };
}

async function Login(email, senha) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
    });

    if (authError) throw new Error(authError.message); 

    const userId = authData.user.id;
    
    const { data: perfilData, error: perfilError } = await supabase
        .from('profiles')
        .select('nome, tipo_perfil')
        .eq('id', userId)
        .single();

    if (perfilError) throw new Error("Erro ao buscar perfil.");

    return {
        userId: userId,
        nome: perfilData.nome,
        tipoUsuario: perfilData.tipo_perfil
    };
}

module.exports = { Cadastrar, Login };