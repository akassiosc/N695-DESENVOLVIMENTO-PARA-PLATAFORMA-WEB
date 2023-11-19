const express = require('express')
const mongoose = require('mongoose');

const app = express()
app.use(express.json());
const port = 3000
mongoose.connect('mongodb+srv://Akassiosc:1PkTZ8vunbyWEOLb@cluster0.dvo5hqu.mongodb.net/?retryWrites=true&w=majority');

const Cadastro = mongoose.model('Cadastro', {
    name: String,
    email: String,
    senha: String,
    confirmeSenha: String,
    endereço: String,
    complento: String,
});

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.post("/,", async (req, res) => {
    const cadastro = new Cadastro({
        name: req.body.name,
        email: req.body.email,
        senha: req.body.senha,
        confirmeSenha: req.body.confirmeSenha,
        endereço: req.body.endereço,
        complemento: req.body.complemento
    })

    await cadastro.save()
    res.send(cadastro)
})

app.listen(port, () => {
    console.log('App running')
})