
// Configuração inicial
const express = require('express');
const app = express();

const axios = require('axios');

// forma de ler JSON / middlewares

app.use(require('cors')());

app.use(
    express.urlencoded({
        extended: true,
    }),
)

app.use(express.json())

//definindo as rotas
const router = express.Router()

// API de Teste

router.get('/teste', (req, res) => res.json({ message: 'Funcionando!' }));


// Configurando o START do servidor
app.use('/', router);


// rota inicial / endpoint

app.get('/', (req, res) => {

    // mostrar req

    res.json({ message: 'Oi Express!' })


});

//inicia o servidor
app.listen(3000);
console.log('Servidor/API funcionando!');