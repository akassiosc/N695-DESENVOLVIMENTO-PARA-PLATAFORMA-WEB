// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// URI do MongoDB Atlas (substitua com a sua própria URI)
const mongoDBURI = 'sua_uri_do_mongodb_atlas';
mongoose.connect(mongoDBURI);

// Esquema do Modelo de Usuário
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);

// Rota para criar um novo usuário
app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Rota para listar todos os usuários
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Rota para deletar um usuário
app.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).send(error);
    }
});

// Rota para atualizar um usuário
app.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.send(updatedUser);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Rota de processamento de pagamento (exemplo)
app.post('/processar-pagamento', async (req, res) => {
    console.log('Dados de pagamento:', req.body);
    res.status(200).send({ message: 'Pagamento processado com sucesso!' });
});

// Inicie o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
