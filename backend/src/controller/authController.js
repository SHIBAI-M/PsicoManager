const authService = require('../services/authServices.js'); 
const supabase = require('../../db.js');

async function Cadastrar(req, res) {
    const { nome, email, telefone, senha, tipoUsuario } = req.body;
    try {
        const resultado = await authService.Cadastrar(nome, email, telefone, senha, tipoUsuario);
        return res.status(201).json({ mensagem: 'Cadastro realizado!', userId: resultado.userId });
    } catch (erro) {
        return res.status(400).json({ mensagem: erro.message });
    }
}

async function Login(req, res) {
    const { email, senha } = req.body;
    try {
        const resultado = await authService.Login(email, senha);
        return res.status(200).json({
            mensagem: 'Login sucesso',
            userId: resultado.userId,
            nome: resultado.nome,
            tipoUsuario: resultado.tipoUsuario 
        });
    } catch (error) { 
        return res.status(400).json({ mensagem: error.message });
    }
}

async function ListarTodosPsicologos(req, res) {
    try {
        const { data, error } = await supabase
            .from('psicologos')
            .select(`id, profiles (nome)`);
        if (error) throw error;
        
        const formatados = data.map(p => ({ id: p.id, nome: p.profiles.nome }));
        return res.status(200).json(formatados);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = { Cadastrar, Login, ListarTodosPsicologos };