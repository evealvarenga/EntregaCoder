import passport from "passport";
import { usersManager } from "./db/manager/usersManager.js";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { hashData, compareData } from "./utils.js";
import { usersModel } from "./db/models/users.model.js";


//Passport Local
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
                return done(null, createUser)
            } catch (error) {
                return done(error)
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
                if (email === "adminCoder@coder.com") {
                    req.session.user = { email, name: user.name, isAdmin: true };
                } else {
                    req.session.user =  { email: user.email, name: user.name, isAdmin: false };
                };
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }))


//Passport GitHub
passport.use('github',
    new GitHubStrategy({
        clientID: "Iv1.5cf21636df5e094c",
        clientSecret: "7a8f917759ffd040f7124f9fb55081ddf7b99095",
        callbackURL: "http://localhost:8080/api/sessions/callback",
        scope: ['user:email'],
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const userDB = await usersManager.findByEmail(profile._json.email);
                // LOGIN
                if (userDB) {
                    if (userDB.isGithub) {
                        return done(null, userDB);
                    } else {
                        return done(null, false);
                    }
                }
                // SIGNUP
                const user = {
                    name: profile._json.name.split(" ")[0],
                    last_name: profile._json.name.split(" ")[1],
                    email: profile._json.email,
                    password: " ",
                    isGithub: true,
                };
                const createdUser = await usersManager.createOne(user);
                return done(null, createdUser);
            } catch (error) {
                return done(error);
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