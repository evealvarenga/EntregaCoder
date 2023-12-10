import passport from "passport";
import { usersManager } from "./db/manager/usersManager.js";
import { Strategy as localStrategy } from "passport-local";
import { Strategy as GitHubStrategy } from "passport-github2";
import { ExtractJwt, Strategy as JWTSrategy } from "passport-jwt";
import { hashData, compareData } from "./utils.js";
import { usersModel } from "./db/models/users.model.js";
import { Schema } from "mongoose";
import config from "./config.js"

const SECRET_KEY_JWT = config.secret_jwt
const GITHUB_CLIENT_ID = config.github_client_id
const GITHUB_CLIENT_SECRET = config.github_client_secret

//Passport Local
passport.use("signup",
    new localStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
            const { name, last_name, age } = req.body
            if (!email || !password || !name || !last_name|| !age ) {
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
    new localStrategy(
        { usernameField: "email" },
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
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }))


//Passport JWT

const fromCookies = (req) => {
    if(!req.cookies.token) {
        return console.log("ERROR")
    }
    return req.cookies.token
}

passport.use("current", new JWTSrategy(
    {jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
    secretOrKey: SECRET_KEY_JWT},
    (jwt_playload, done) => { done(null, jwt_playload)}
))

//Passport GitHub
passport.use('github',
    new GitHubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/callback",
        scope: ['user:email'],
    },
        async (accessToken, refreshToken, profile, done) => {
            const emailUser = profile.emails[0].value
            try {
                const userDB = await usersManager.findByEmail(emailUser);
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
                    email: emailUser,
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