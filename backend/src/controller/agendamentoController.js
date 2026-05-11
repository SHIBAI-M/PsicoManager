const agendamentoService = require('../services/agendamentoService.js');

async function ListarAgendamentos(req, res) {
    try {
        
        const { id, tipo } = req.query;
        
        
        const agenda = await agendamentoService.ListarAgendamentos({ id, tipo });
        
        return res.status(200).json(agenda);
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

async function CriarAgendamento(req, res) {
    try {
        
        const dados = req.body;
        
        
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