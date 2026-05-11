const pacienteService = require('../services/pacienteService.js');
const supabase = require('../../db.js');

async function CadastrarPaciente(req, res) {
    const { nome, email, cpf, dataNascimento, telefone } = req.body;
    try {
        const { data: clinica, error: clinicaError } = await supabase.from('clinica').select('id').limit(1).single();
        if (clinicaError || !clinica) return res.status(400).json({ mensagem: "Nenhuma clínica cadastrada." });

        const resultado = await pacienteService.CriarPaciente(nome, email, cpf, dataNascimento, telefone, clinica.id);
        return res.status(201).json({ mensagem: 'Sucesso!', userId: resultado.userId });
    } catch (erro) {
        return res.status(400).json({ mensagem: erro.message });
    }
}

async function ListarTodosPacientes(req, res) {
    try {
        const { data, error } = await supabase
            .from('pacientes')
            .select(`id, profiles (nome)`);
        if (error) throw error;

        const formatados = data.map(p => ({ id: p.id, nome: p.profiles.nome }));
        return res.status(200).json(formatados);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

async function ListarSalas(req, res) {
    try {
        const { data, error } = await supabase.from('salas').select('*');
        if (error) throw error;
        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = { CadastrarPaciente, ListarTodosPacientes, ListarSalas };