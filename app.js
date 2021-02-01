const express = require('express');
const {connectDB} = require('./db');

const app = express();

connectDB();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json({extended: false}));

app.use('/',require('./routes/index'));
app.use('/api/url',require('./routes/url'));

// 小鮮肉教學

app.get('/', async (req, res) => {
    // const shortUrls = await ShortUrl.find();
    res.render('index');
});

// app.post('/shortUrls', async(req, res) => {
//     await ShortUrl.create({full: req.body.fullUrl});
//     res.redirect('/');
// });

// app.get('/:shortUrl', async(req, res) => {
//     const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl});
//     if(shortUrl == null) return res.sendStatus(404);

//     shortUrl.clicks++
//     shortUrl.save()

//     res.redirect(shortUrl.full);
// });

app.listen(5000, () => {
    console.log('port: 5000');
});
