import express from 'express'
import { SignUp } from './auth.controllers'


const route  = express.Router()

route.post("/signup",SignUp)

export default route