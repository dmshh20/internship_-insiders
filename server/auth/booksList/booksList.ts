import { PrismaClient } from '@prisma/client';
import express, { Router } from 'express';
import type { Request, Response } from 'express';
import { authMiddleware } from '../getUser/getUser';

const app = express();

app.use(express.json());

const prisma = new PrismaClient()
const bookRoutes = Router()


