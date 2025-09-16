import { PrismaClient } from '@prisma/client';
import express from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt'

const app = express();

app.use(express.json());

const prisma = new PrismaClient()


app.post('/register', async  (req: Request, res: Response) => {
    console.log('body', req);
    const {email, name, password} = req.body

    const existingUser = await prisma.signUp.findUnique({where: {email}})

    if (existingUser) {
        res.send({message: 'user already exists'})
    }
    const hash = await bcrypt.hash(password, 10)

    const createUser = await prisma.signUp.create({
        data: {
            name,
            email,
            password: hash
        }
    })

    return res.send({createUser})
});





app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
