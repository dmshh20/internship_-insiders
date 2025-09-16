import express from 'express';
import userRouters from './register';
import bookRoutes from './books/book';

const app = express();
app.use(express.json());

app.use('/', userRouters);
app.use('/', bookRoutes);

// app.get('/', (req, res) => {
//   res.send('Server is running');
// });

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
