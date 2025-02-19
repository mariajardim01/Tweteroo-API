
import joi from "joi";
import httpStatus from "http-status"

export default function tweetValidation(username, tweet){
    const newTweet = {
        username: username,
        tweet: tweet
    }
    
    const bodySchema = joi.object({
        username: joi.string(),
        tweet: joi.string()
    })
    
    const validation = bodySchema.validate(newTweet, { abortEarly : false })
    if (validation.error){
       const errorMessages = validation.error.details.map((error)=>{
         return error.message
       })
       return {errorMessages: errorMessages}
    }
    return {newTweet: newTweet}
    
    
    
}