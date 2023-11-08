onst express = require('express');
const app = express();
const port = 3000; //porta padrão

app.use(require('cors')());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//definindo as rotas
const router = express.Router();

// Configurando o START do servidor
app.use('/', router);

// API de consulta CEP

app.get(('cep/:cep', async (req, res) => {
    const { cep } = req.params
    try {
        const url = `http://viacep.com.br/ws/${cep}/json/`;

    } catch (erro) {

    }


}))

//inicia o servidor
app.listen(port);
console.log('API funcionando!');