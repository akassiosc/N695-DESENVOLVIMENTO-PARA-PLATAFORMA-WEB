const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// URI do MongoDB Atlas 
const mongoDBURI = 'mongodb+srv://Akassiosc:yQXNgN7JSB7pMARK@cluster0.dvo5hqu.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(mongoDBURI);

// Esquema do Modelo de Usuário
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);

app.use((req, res, next) => {
    // Verificar se o usuário é administrador
    if (req.body.email !== 'administrador@gmail.com') {
        return res.status(403).send({ message: 'Acesso negado.' });
    }
    next();
});

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

// Rota para login de usuário
app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).send({ message: 'Usuário não encontrado.' });
        }


        if (user.password !== req.body.password) {
            return res.status(401).send({ message: 'Senha incorreta.' });
        }

        res.send({ message: 'Login bem-sucedido.' });
    } catch (error) {
        res.status(500).send(error);
    }
});


// Rota de processamento de pagamento 
app.post('/processar-pagamento', async (req, res) => {
    console.log('Dados de pagamento:', req.body);
    res.status(200).send({ message: 'Pagamento processado com sucesso!' });
});

// Inicie o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
