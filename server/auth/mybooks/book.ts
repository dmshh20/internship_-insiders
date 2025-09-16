import { PrismaClient } from '@prisma/client';
import express, { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../getUser/getUser';

const app = express();

app.use(express.json());

const prisma = new PrismaClient()
const bookRoutes = Router()

bookRoutes.post('/me/books', authMiddleware ,async (req: Request, res: Response) => {
   try {
    const userId = Number(req.userId)
    const { name, authorId, photo} = req.body

    const creatingBook = await prisma.book.create({
        data: {
            name,
            authorId: userId,
            photo,
        }
    })

    return res.send({creatingBook})
   } catch(error) {
        console.log(error);
        throw error
        
   }
})

bookRoutes.get('/me/books', authMiddleware, async (req: Request, res: Response) => {
   try {
 const getBooks =  await prisma.book.findMany({where: {
       authorId: Number(req.userId )
    }})

    return res.send({getBooks})

   } catch(error) {
    console.log(error);
    throw error
    
   }
})

bookRoutes.delete('/me/books/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const bookId = Number(req.params.id);
    const userId = Number(req.userId);

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (book.authorId !== userId) {
      return res.status(403).json({ message: 'You can delete only your books' });
    }

    await prisma.book.delete({
      where: { id: bookId },
    });

    return res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});



export default bookRoutes