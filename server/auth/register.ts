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
});


userRouters.post('/login' ,async (req: Request, res: Response) => {
    const {email, password} = req.body
    
    const existingUser = await prisma.user.findUnique({where: {email}})

    if (!existingUser) {
        res.send({message: "User not found"})
    }
    
    const payload = {id: existingUser?.id}
    console.log('ay',payload);
    

    const comparedPassword = bcrypt.compare(password, existingUser?.password as string)

    if (!comparedPassword) {
        res.send({message: 'password dont match'})
    }
    

    const token = jwt.sign(payload, process.env.SECRET_KEY as string, {expiresIn: '1h'})

    return res.send({access_token: token})
})

export default userRouters


// app.listen(3000, () => {
//   console.log('Server running on http://localhost:3000');
// });
