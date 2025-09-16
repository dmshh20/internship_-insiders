import { PrismaClient } from '@prisma/client';
import express, { Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const app = express();

app.use(express.json());

const prisma = new PrismaClient()
const userRouters = Router()

userRouters.post('/register', async  (req: Request, res: Response) => {
    try {

const {email, name, password} = req.body

    const existingUser = await prisma.user.findUnique({where: {email}})

    if (existingUser) {
        res.send({message: 'user already exists'})
    }
    const hash = await bcrypt.hash(password, 10)

    const createUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hash
        }
    })

    return res.send({createUser})

    } catch(error) {
        throw error
    }
});


userRouters.post('/login' ,async (req: Request, res: Response) => {
   try {
     const {email, password} = req.body
    
    const existingUser = await prisma.user.findUnique({where: {email}})

    if (!existingUser) {
        res.send({message: "User not found"})
    }
    
    const payload = {id: existingUser?.id, email: existingUser?.email, name: existingUser?.name}
    console.log('ay',payload);
    

    const comparedPassword = bcrypt.compare(password, existingUser?.password as string)

    if (!comparedPassword) {
        res.send({message: 'password dont match'})
    }
    

    const token = jwt.sign(payload, process.env.SECRET_KEY as string, {expiresIn: '1h'})

    return res.send({access_token: token})


   } catch(error) {
    console.log(error);
    throw error
    
   }
})

export default userRouters


// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });
