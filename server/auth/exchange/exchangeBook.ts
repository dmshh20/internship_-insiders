import { Prisma, PrismaClient } from '@prisma/client';
import express, { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../getUser/getUser';
import nodemailer from 'nodemailer'
import senderMail from '../nodemailer/mailer';


const app = express();

app.use(express.json());

const prisma = new PrismaClient()
const exchangeBook = Router()

exchangeBook.post('/exchange', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = Number(req.userId)
        const userEmail = req.userEmail 
        const username = req.username

        const availableBooks = await prisma.book.findMany({where: {authorId: userId}, select: {name: true}})
        const booksList = availableBooks.map(book => `- ${book.name}`).join('\n');

         if (!userEmail) {
            return res.status(400).json({ message: 'User email not found' });
        }

        await senderMail(userEmail as string, 'Welcome!', `${userEmail}\n${username}.\n You have ${booksList} for exchange`)

        return res.send({message: 'email was sent'})
    } catch(error) {
        console.log(error);
        
        throw error
    }
})

exchangeBook.post('/exchange/:bookId', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.userId);
    const userEmail = req.userEmail;
    const username = req.username;
    const bookId = Number(req.params.bookId);

    if (!userEmail) {
      return res.status(400).json({ message: 'User email not found' });
    }

    const bookToExchange = await prisma.book.findUnique({
      where: { id: bookId },
      include: { author: true }
    });

    if (!bookToExchange) {
      return res.status(404).json({ message: 'Sook not found' });
    }

    if (bookToExchange.authorId === userId) {
      return res.status(400).json({ message: "You cant exchange your own book" });
    }

    const ownerEmail = bookToExchange.author.email;
    const emailText = `${username} wants to exchange for your book: "${bookToExchange.name}"`;

    await senderMail(ownerEmail, 'Book Exchange Request', emailText);

    return res.json({ message: `Exchange request sent for "${bookToExchange.name}"` });
  } catch (error) {
    console.error(error);
    throw error
}
});




export default exchangeBook