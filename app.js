const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// URI do MongoDB Atlas
const mongoDBURI = 'mongodb+srv://Caio:<rGmANC1X7nDrtkn9!@#>@uniformongodb.qlhrn6x.mongodb.net/';
mongoose.connect(mongoDBURI);

// Esquema do Modelo de Usuário
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const User = mongoose.model('User', UserSchema);

// Middleware para verificar se o usuário é administrador
const ADMIN_EMAIL = 'administrador@gmail.com';

const adminMiddleware = (req, res, next) => {
    const { useremail } = req.headers;

    if (!useremail || useremail.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        return res.status(403).send({ error: 'Acesso negado: Permissão de administrador necessária.' });
    }

    next();
};

// Rota para criar um novo usuário
app.post('/users', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).send(newUser);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);

        if (error.code === 11000) {
            // Tratar erro de duplicação de chave única (por exemplo, e-mail duplicado)
            res.status(400).send('E-mail já registrado.');
        } else {
            res.status(500).send('Erro interno ao criar usuário.');
        }
    }
});

// Rota para listar todos os usuários
app.get('/users', adminMiddleware, async (req, res) => {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    try {
        const users = await User.find()
            .skip((page - 1) * limit)
            .limit(limit);

        res.send(users);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error.message);
        res.status(500).json({ error: 'Erro ao buscar usuários', message: error.message });
    }
});

// Rota para deletar um usuário
app.delete('/users/:id', adminMiddleware, async (req, res) => {
    try {
        const isValidObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
        if (!isValidObjectId) {
            return res.status(400).send('ID de usuário inválido');
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        res.status(500).send('Erro interno ao excluir usuário');
    }
});

// Rota para atualizar um usuário
app.put('/users/:id', adminMiddleware, async (req, res) => {
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
