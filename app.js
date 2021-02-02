const express = require('express');
const {connectDB} = require('./db');

const app = express();

connectDB();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json({extended: false}));

// 創建短網址連結
app.use('/api/url',require('./controllers/url'));
// 進入短網址連結
app.use('/',require('./controllers/index'));

app.get('/', async (req, res) => {
    res.render('index');
});

app.listen(5000, () => {
    console.log('port: 5000');
});

module.exports = {app};
