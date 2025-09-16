import { Prisma, PrismaClient } from '@prisma/client';
import express, { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../getUser/getUser';
import { error } from 'console';

const app = express();

app.use(express.json());

const prisma = new PrismaClient()
const bookLists = Router()


bookLists.get('/books/:id',authMiddleware , async (req: Request, res: Response) => {
    const { id } = req.params
    const bookId = Number(id)
    const searchOneBook = await prisma.book.findUnique({where: {id: bookId}})
    
    if (!searchOneBook) {
        res.send({message: "book not found"})
    }

    return res.send({searchOneBook})
})


bookLists.get('/books', authMiddleware,  async (req: Request, res: Response) => {
  const search = (req.query.search as string) || '';
  const sort = (req.query.sort as string) === 'desc' ? 'desc' : 'asc';

  try {
    const books = await prisma.book.findMany({
      where: {
        OR: [
          { name: {
             contains:
                search,
                mode: 'insensitive' } },
          { author:
             { name:{
                contains:
                 search, mode: 'insensitive' } } }
        ]
      },
      include: { author: true },
      orderBy: { name: sort },
    });

    res.json({books });
  } catch (err) {
    console.error(err);
    throw error
}
});






export default bookLists


