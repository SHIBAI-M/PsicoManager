const express = require('express');
const router = express.Router();
const authController = require('../controller/authController.js');
const pacienteController = require('../controller/pacienteController.js');
const agendamentoController = require('../controller/agendamentoController.js');
const prontuarioController = require('../controller/prontuarioController.js');


router.post("/evolucoes", prontuarioController.registrarEvolucao);

router.post("/auth/cadastro", authController.Cadastrar);

router.post("/auth/login", authController.Login);

router.post("/pacientes", pacienteController.CadastrarPaciente);

router.get("/agendamentos", agendamentoController.ListarAgendamentos);

router.post("/agendamentos", agendamentoController.CriarAgendamento);

router.get("/lista-pacientes", pacienteController.ListarTodosPacientes);
router.get("/lista-psicologos", authController.ListarTodosPsicologos);
router.get("/lista-salas", pacienteController.ListarSalas);

module.exports = router;