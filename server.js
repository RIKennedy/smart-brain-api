const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'Pos1eLp836Gm',
      database : 'smart-brain'
    }
});

const app = express();

const Clarifai = require('clarifai');

const api = new Clarifai.App({
 apiKey: '1cd508ae821d4eebb282250cbcaed5eb'
});

const handleApiCall = (req, res) =>{
    api.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with api'))
}


app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
});

app.post('/signIn', (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json('incorrect form submission')
    }
    db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
        const isValid = bcrypt.compareSync(password, data[0].hash)
        if(isValid){
            return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        } else{
            res.status(400).json('wrong credentials 1')
        }
    })
    .catch(err => res.status(400).json('wrong credentials 2'))
});

app.post('/register', (req ,res) => {
    const { email, name, password } = req.body;
    if(!email || !name || !password){
        return res.status(400).json('incorrect form submission')
    }
    const hash = bcrypt.hashSync(password);
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    }).then(user => {
                        res.json(user[0]);
                })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
    .catch(err => res.status(400).json('unable to register'))
});
    

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users')
    .where({id})
    .then(user => {
        if(user.length){
            res.json(user[0]);
        }else {
            res.status(400).json('user not found')
        }
    })
    .catch(err => res.status(400).json('error getting user'))
});

app.put('/image', (req, res) =>{
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch (err => res.status(400).json('unable to get entries'))
});

app.post('/imageurl', (req, res) => {handleApiCall(req, res)})

app.listen(4000, () => {
    console.log('app is running on port 4000')
});

