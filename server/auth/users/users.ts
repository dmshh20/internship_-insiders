import { Router } from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../getUser/getUser';

const prisma = new PrismaClient();
const userRoutesQueries = Router();

userRoutesQueries.get('/books', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = Number(req.userId); 
        const books = await prisma.book.findMany({ where: { authorId: userId } });
        return res.status(200).send({ books });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Server error' });
    }
});

userRoutesQueries.put('/books/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = Number(req.userId);
        const bookId = Number(req.params.id);
        const { name, photo } = req.body;

        const book = await prisma.book.findUnique({ where: { id: bookId } });
        if (!book || book.authorId !== userId) {
            return res.status(403).send({ message: 'Not allowed to edit this book' });
        }

        const updatedBook = await prisma.book.update({
            where: { id: bookId },
            data: { name, photo }
        });

        return res.status(200).send({ updatedBook });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Server error' });
    }
});

userRoutesQueries.delete('/book/:id', authMiddleware, async (req: Request, res: Response) => {
    try {
        const bookId = Number(req.params.id);
        console.log(bookId);
        

        const existingBook = await prisma.book.findUnique({where: {id: bookId}})
        
        if (!existingBook) {
            res.send({message: 'book doesnt exists'})
        }

        await prisma.book.delete({where: {id: bookId}})

        return res.send({message: "book deleted successfully"})
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Server error' });
    }
});

export default userRoutesQueries;
