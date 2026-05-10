const express = require('express');
const supabase = require('../../db.js');
const authController = express();

function Cadastrar(){
    const {nome, email, telefone, senha} = req.body;

    console.log('Dados:', nome, email, telefone, senha);
}

module.exports = {
    Cadastrar
}