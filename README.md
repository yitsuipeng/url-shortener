# 使用 Node.js + Express 的短網址服務
demo page link: http://54.150.14.134/

## Tech Used
#### 開始旅程
- Redis
- MongoDB
- Node.js / Express
- Mocha / Chai
- EC2 / NGINX

## Flow
### 創建短網址連結 POST /api/url/shorten
1. check if the original url is alive
2. check if the shorten url is already stored in MongoDB
3. if yes, respond the requested url
4. if not, create shorten url and save in MongoDB
5. save the url code as key and the original url as value in redis
### 進入短網址連結 GET /:code
1. check if the url code is stored in redis
2. if yes, redirect to the origin url
3. if not, check if the shorten url is already stored in MongoDB
4. if yes, copy the requested url to redis and redirect to the origin url
5. if not, respond 'No Url Found' with status 404

## To-Dos
1. In order to prevent the posibility of collision with Hash, the way to encode the original url with sequenced id auto-created by database can be considered. 
2. With the current querying flow, it would consume lots of cpu resource to deal with huge amount of requests in a short time on querying MongoDB if redis missed data in any cases (not sure the posibility). A better solution which I had searched is to copy all data from MongoDB to Redis once querying MongoDB to get the original url was happend. Therefore, the high frequency of querying MongoDB will be prevented.
3. The fake data for test isn't seperated from production collections, as a result, this can be optimized.

