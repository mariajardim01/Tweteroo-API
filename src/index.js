import express from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import joi from "joi";
import httpStatus from "http-status";
import tweetValidation from "../components/tweetValidation.js";
import cors from "cors";

dotenv.config()

const mongoClient = new MongoClient(process.env.DATABASE_URL)
let db;

mongoClient.connect()
.then(()=>{console.log("Conectado com sucesso");
    db = mongoClient.db()
})
.catch(()=>{console.log("Não foi possível conectar")})

const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT

app.post('/sign-up',async (req, res) => {
  const username = req.body.username
  const avatar = req.body.avatar

  let newUser = {
    username: username,
    avatar: avatar
  }
  
  const userSchema = joi.object({
    username: joi.string(),
	avatar: joi.string()
  })

  const validation = await userSchema.validate(newUser, { abortEarly : false })
  if (validation.error){
    res.status(httpStatus.UNPROCESSABLE_ENTITY).send(validation.error.details.map((error)=>{
       return error.message
    }))
  }

  try{
       await db.collection("users").insertOne(newUser)

      res.sendStatus(httpStatus.CREATED) 
  }
  catch{
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
  }
  

})

app.post('/tweets', async (req,res)=>{
let username = req.body.username
let tweet = req.body.tweet

let response = tweetValidation(username, tweet)

if (response.errorMessages){
res.status(httpStatus.UNPROCESSABLE_ENTITY).send(response.errorMessages)
}

try{
    if(response.newTweet){
    db.collection("tweets").insertOne(response.newTweet)
    return res.sendStatus(httpStatus.CREATED)}
 }
 catch{
     return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
 }

})

app.get('/tweets', async (req, res)=>{
    let completeTweets = []
    try{
        const tweets = await db.collection("tweets").find().toArray()
        
        if (tweets.length > 0){
            completeTweets = await Promise.all(tweets.map(async(tweet)=>{
                const user = await db.collection("users").findOne({username: tweet.username})
                
                return {
                    _id : tweet._id,
                    username: tweet.username,
                    avatar: user ? user.avatar : null,
                    tweet: tweet.tweet
                }

            
                
            }))
        }
        res.status(httpStatus.OK).send(completeTweets)
    }
    catch{
        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)

    }
})

app.put('/tweets/:id', async (req,res)=>{
    let id = req.params.id
    let username = req.body.username
    let tweet = req.body.tweet

    let response = tweetValidation(username, tweet)

    if (response.errorMessages){
      res.status(httpStatus.UNPROCESSABLE_ENTITY).send(response.errorMessages)
    }

    try{
        const updatedTweet = {
            username: username,
            tweet: tweet
        }
        const response = await db.collection("tweets").updateOne({_id: new ObjectId(id)}, { $set: updatedTweet } )
        if (response.error){
            res.sendStatus(httpStatus.NOT_FOUND)
        }
        res.sendStatus(httpStatus.NO_CONTENT)
    }
    catch{
        res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)

    }
})

app.delete('/tweets/:id', async (req, res)=>{
    const id = req.params.id
    
    try{
       let result = await db.collection("tweets").deleteOne({_id: new ObjectId(id)})
       if (result.deletedCount == 0){
        return res.sendStatus(httpStatus.NOT_FOUND)
       }
       return res.sendStatus(httpStatus.NO_CONTENT)
    }
    catch{
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR)
    }

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})