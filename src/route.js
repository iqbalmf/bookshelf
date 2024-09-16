import {
  addBookHandler,
  getAllBooksHander,
  getBookByIdHandler,
  removeBookByIdHandler,
  updateBookByIdHandler
} from './handler.js';

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHander
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: getBookByIdHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: updateBookByIdHandler
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: removeBookByIdHandler
  }
];

export default routes;