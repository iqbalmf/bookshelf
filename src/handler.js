import {nanoid} from 'nanoid';
import myBook from './model.js';

export const addBookHandler = (req, res) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading
  } = req.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = false;
  const newBooks = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  };
  let message = '';
  if (!name) {
    message = 'Gagal menambahkan buku. Mohon isi nama buku';
  } else if (readPage > pageCount) {
    message = 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
  } else {
    if (readPage === pageCount) {
      newBooks.finished = true;
    }
    if (readPage > 0) {
      newBooks.reading = true;
    }
    myBook.push(newBooks);
  }
  const isSuccess = myBook.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = res.response({
      status: 'success', message: 'Buku berhasil ditambakan', data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = res.response({
    statue: 'fail', message: message,
  });
  response.code(400);
  return response;
};

export const getAllBooksHander = () => {
  const books = myBook.map(book => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }
  })

  return {
    status: 'success', data: {
      books
    },
  };
};

export const getBookByIdHandler = (req, res) => {
  const {bookId} = req.params;
  const book = myBook.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success', data: {book}
    };
  }
  const response = res.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(400);
  return response;
};

export const updateBookByIdHandler = (req, res) => {
  const {bookId} = req.params;
  const {name, year, author, summary, publisher, pageCount, reading, readPage} = req.payload;
  const updatedAt = new Date().toISOString();
  const index = myBook.findIndex((item) => item.id === bookId);
  let message = '';
  if (!name) {
    message = 'Gagal memperbarui buku. Mohon isi nama buku';
  } else if (readPage > pageCount) {
    message = 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
  } else if (index === -1) {
    message = 'Gagal memperbarui buku. Id tidak ditemukan'
  } else {
    if (index !== -1) {
      myBook[index] = {
        ...myBook[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt
      };
      const response = res.response({
        status: 'success', message: 'Buku berhasil diperbarui',
      });
      response.code(200);
      return response;
    }
  }
  const response = res.response({
    status: 'fail', message: message
  });
  response.code(404);
  return response;
};

export const removeBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const index = myBook.findIndex((item) => item.id === bookId);
  if (index !== -1) {
    myBook.splice(index, 1);
    const response = res.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    });
    response.code(200);
    return response;
  }
  const response = res.response({
    status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan'
  });
  response.code(404);
  return response;
};