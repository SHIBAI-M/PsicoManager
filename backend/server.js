const express = require('express');
const cors = require('cors'); // O CORS tem que ser importado aqui!
const rotas = require('./src/routes/routes.js'); // Importa o seu arquivo de rotas

const app = express();

app.use(cors());
app.use(express.json());

app.use(rotas);

const PORT = 5632;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});