require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

const validUrl = require('valid-url');

const Url = require('../models/Url');
const {setCache,delCache} = require('../db');

router.post('/shorten', async (req, res) => {

    const { longUrl } = req.body;
    const baseUrl = 'http://54.150.14.134';
    const { status } = await axios.get(longUrl);

    // create url code
    const urlCode = randomString(8);

    // check long url
    if(validUrl.isUri(longUrl) && status === 200) {
        try{
            let url = await Url.findOne({longUrl});

            if(url){
                res.status(200).json({shortenUrl : url.shortUrl});
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
                res.status(200).send({shortenUrl : shortUrl});
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

function randomString(digits){

    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (let i = 0; i < digits; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  
  }

module.exports = router;