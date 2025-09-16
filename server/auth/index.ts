import express from 'express';
import userRouters from './register';
import bookRoutes from './mybooks/book';
import bookLists from './booksList/booksList';
import exchangeBook from './exchange/exchangeBook';
import adminRoutes from './admin/admin';
import userRoutesQueries from './users/users';

const app = express();
app.use(express.json());

app.use('/', userRouters);
app.use('/', bookRoutes);
app.use('/', bookLists);
app.use('/', exchangeBook);
app.use('/', adminRoutes);
app.use('/', userRoutesQueries);



const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
