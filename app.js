// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Substitua pela sua URI do MongoDB Atlas
mongoose.connect('mongodb+srv://Akassiosc:1PkTZ8vunbyWEOLb@cluster0.dvo5hqu.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Esquema do Modelo de Usuário
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String, // Em um projeto real, você deve criptografar as senhas
    // Adicione outros campos conforme necessário
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

// Rota de processamento de pagamento
app.post('/processar-pagamento', async (req, res) => {
    // Implemente a lógica para processar o pagamento
    console.log('Dados de pagamento:', req.body);
    // Envie uma resposta de sucesso ou falha
    res.status(200).send({ message: 'Pagamento processado com sucesso!' });
});

// Inicie o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
