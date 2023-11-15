import passport from "passport";
import { usersManager } from "./db/manager/usersManager.js";

passport.serializeUser((user, done) =>{
    //_id
    done(null, user._id);
})

passport.deserializeUser(async(id,done) =>{
    try {
        const user = await usersManager.findById(id)
        done(null,user)
    } catch (error) {
        done(error);
    }
})