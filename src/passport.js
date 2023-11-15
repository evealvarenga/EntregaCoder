import passport from "passport";
import { usersManager } from "./db/manager/usersManager.js";
import { Strategy as localStrategy } from "passport-local";
import { hashData, compareData } from "./utils.js";

passport.use("signup",
    new localStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            const { name, last_name } = req.body
            if (!email || !password || !name || !last_name) {
                return done(null, false)
            }
            try {
                const hashPassword = await hashData(password);
                const createUser = await usersManager.createOne({ ...req.body, password: hashPassword });
                done(null, createUser)
            } catch (error) {
                done(error)
            }
        }))


passport.use("login",
    new localStrategy({ usernameField: "email" },
        async (email, password, done) => {
            if (!email || !password) {
                return done(null, false)
            }

            try {
                const user = await usersManager.findByEmail(email);
                if (!user) {
                    return done(null, false)
                }
                const passwordVald = await compareData(password, user.password)
                if (!passwordVald) {
                    return done(null, false)
                }
                /*      
                      if (email === adminCoder@coder.com) {
                        req.session.user = { email, name: user.name, isAdmin: true };
                      } else {
                        req.session.user = { email, name: user.name, isAdmin: false };
                      };*/
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }))

passport.serializeUser((user, done) => {
    done(null, user._id);
})

passport.deserializeUser(async (id, done) => {
    try {
        const user = await usersManager.findById(id)
        done(null, user)
    } catch (error) {
        done(error);
    }
})