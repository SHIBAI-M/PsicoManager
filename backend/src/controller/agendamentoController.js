const agendamentoService = require('../services/agendamentoService.js');

async function ListarAgendamentos(req, res) {
    try {
        // Pega os parâmetros da URL (id e tipo do usuário logado)
        const { id, tipo } = req.query;
        
        // Manda pro Service fazer o trabalho pesado com o Supabase
        const agenda = await agendamentoService.ListarAgendamentos({ id, tipo });
        
        return res.status(200).json(agenda);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

async function CriarAgendamento(req, res) {
    try {
        // Pega os dados do formulário preenchido no Frontend
        const dados = req.body;
        
        // Manda pro Service salvar no banco
        const resultado = await agendamentoService.CriarAgendamento(dados);
        
        return res.status(201).json(resultado);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = {
    ListarAgendamentos,
    CriarAgendamento
};