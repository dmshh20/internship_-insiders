import { PrismaClient } from '@prisma/client';
import express, { response, Router } from 'express';
import type { Request, Response } from 'express';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authMiddleware } from '../getUser/getUser';

const app = express();

app.use(express.json());

const prisma = new PrismaClient()
const adminRoutes = Router()


adminRoutes.get('/users', authMiddleware, async (req: Request, res: Response) => {
    try {
        const roleId = Number(req.roleId)
        console.log('role', roleId);
        
        if (roleId !== 2) {
            res.send({message: 'Only for admin'})
            return
        }

        const allUsers = await prisma.user.findMany()
        
        return res.send({allUsers})

    } catch(error) {
        console.log(error);
        
        throw error
    }
})

adminRoutes.delete('/books/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const roleId = Number(req.roleId);
        if (roleId !== 2) {
            return res.send({ message: 'Only for admin' });
        }

        const bookId = Number(req.params.id);

        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book) {
            return res.send({ message: 'Book not found' });
        }

        await prisma.book.delete({ where: { id: bookId } });

        return res.send({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error(error);
        throw error
    }
});



export default adminRoutes