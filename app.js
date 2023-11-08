const express = require('express');
const app = express();
const port = 3000; //porta padrão

const axios = require('axios');

app.use(require('cors')());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//definindo as rotas
const router = express.Router();

// API de Teste

router.get('/teste', (req, res) => res.json({ message: 'Funcionando!' }));


// Configurando o START do servidor
app.use('/', router);

// API de consulta CEP

app.get('cep/:cep', async (req, res) => {
    const { cep } = req.params;
    try {
        const url = `http://viacep.com.br/ws/${cep}/json/`;
        const response = await axios.get(url);
        return res.status(200).send(response.data);

    } catch (erro) {
        return res.status(500).send({ error: 'ERRO ao consultar o CEP' });

    }

});

//inicia o servidor
app.listen(port);
console.log('Servidor/API funcionando!');