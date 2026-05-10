const express = require('express');
const app = express();

const port = 5632;

app.get('/', (req, res) => {
  res.send('Olá! O servidor está rodando perfeitamente.');
});

app.listen(port, ()=>{
    console.log(`Servidor rodando ness porta: http//localhost:${port}`);
});