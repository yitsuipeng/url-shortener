require('dotenv').config();
const express = require('express');
const router = express.Router();

const validUrl = require('valid-url');
const shortid = require('shortid');

const Url = require('../models/Url');
const {setCache,delCache} = require('../db')

router.post('/shorten', async (req, res) => {

    const { longUrl } = req.body;
    const baseUrl = 'http://'+req.hostname+':5000';

    // create url code
    const urlCode = shortid.generate();

    // check long url
    if(validUrl.isUri(longUrl)) {
        try{
            let url = await Url.findOne({longUrl});

            if(url){
                res.json(url);
            } else {
                const shortUrl = baseUrl + '/' + urlCode;
                url = new Url({
                    longUrl,
                    shortUrl,
                    urlCode,
                    date: new Date()
                });
                await url.save();
                await setCache(urlCode,longUrl);
                res.status(200).json(url);
            }
        } catch (err) {
            console.error(err);
            res.status(500).json('Server error');
        };

    }else{
        res.status(401).json('Invalid long url');
    }

});

router.post('/delete', async (req, res) => {

    try{
        let url = await Url.findOne({shortUrl: req.body.shortUrl});

        if(url){
            await url.deleteOne();
            await delCache(url.urlCode);
            res.status(200).json('delete complete');
        } else {
            res.status(400).json('No Shorten Url Found');
        }       

    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    };
});

module.exports = router;