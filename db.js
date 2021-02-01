const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.mongoURI,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('MongoDB Connected...');
    }catch(err){
        console.error(err.message);
        process.exit(1);
    }
}

// redis connection
const redis = require('redis');
const client = redis.createClient(); // this creates a new client
client.on('connect', () => {
    console.log('Redis client connected');
});

// set catch function
function setCache (key,value) {
    return new Promise((resolve, reject) => {
        client.set(key, value, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

// get cache function
function getCache (key) {
    return new Promise((resolve, reject) => {
        client.get(key, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}

// delete cache function
function delCache (key) {
    return new Promise((resolve, reject) => {
        client.del(key, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}


module.exports = {connectDB,setCache,getCache,delCache};

