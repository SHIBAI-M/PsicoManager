const prontuarioService = require('../services/prontuarioService.js');

async function registrarEvolucao(req, res) {
    try {
        const resultado = await prontuarioService.SalvarEvolucao(req.body);
        return res.status(201).json({ mensagem: "Evolução registrada e agendamento concluído!" });
    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
}

module.exports = { registrarEvolucao };