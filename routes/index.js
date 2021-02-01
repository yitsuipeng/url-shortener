require('dotenv').config();
const express = require('express');
const router = express.Router();

const Url = require('../models/Url');
const {getCache, setCache} = require('../db')

router.get('/admin', async (req, res) => {
    const url = await Url.find();
    res.render('admin',{url:url});
});

router.get('/:code', async(req,res)=>{
    try{
        // check redis
        let result =  await getCache(req.params.code);

        // redis exist
        if(result){
            console.log('get from cache');
            return res.redirect(result);

        // redis not exist, query in DB and copy to redis
        }else{
            const url = await Url.findOne({urlCode: req.params.code});
            if(url){
                console.log('get from db');
                setCache(req.params.code,url.longUrl);
                return res.redirect(url.longUrl);
            }else{
                return res.status(404).json('No Url Found');
            }
        }
        
    }catch(err){
        console.error(err);
        res.status(500).json('Server error');
    }
});

module.exports = router;