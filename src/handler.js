import { nanoid } from 'nanoid';
import myBook from './model.js';

export const addBookHandler = (req, res) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading = false
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
    myBook.push(newBooks);
  }
  const isSuccess = myBook.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = res.response({
      status: 'success', message: 'Buku berhasil ditambahkan', data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = res.response({
    status: 'fail', message: message,
  });
  response.code(400);
  return response;
};

export const getAllBooksHandler = (req) => {
  const name = req.query.name;
  const reading = req.query.reading;
  const finished = req.query.finished;

  const filteredBooks = filterBooks(myBook, name, reading, finished);

  const books = filteredBooks.map((book) => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
  });

  return {
    status: 'success', data: {
      books
    },
  };
};

const filterBooks = (books, name, reading, finished) => {
  console.log(books, books.length, name, reading, finished);
  if (name === undefined && reading === undefined && finished === undefined) {
    return books;
  }
  if (reading !== undefined) {
    reading = reading === '1';
  }
  if (finished !== undefined) {
    finished = finished === '1';
  }
  return books.filter((book) => {
    const nameCondition = name !== undefined ? book.name.toLowerCase().includes(name.toLowerCase()) : true;
    const readingCondition = reading !== undefined ? book.reading === reading : true;
    const finishedCondition = finished !== undefined ? book.finished === finished : true;
    return nameCondition && readingCondition && finishedCondition;
  });
};

export const getBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const book = myBook.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    return {
      status: 'success', data: { book }
    };
  }
  const response = res.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

export const updateBookByIdHandler = (req, res) => {
  const { bookId } = req.params;
  const { name, year, author, summary, publisher, pageCount, reading, readPage } = req.payload;
  const updatedAt = new Date().toISOString();
  const index = myBook.findIndex((item) => item.id === bookId);
  let message = '';
  let statusCode = 0;
  if (!name) {
    message = 'Gagal memperbarui buku. Mohon isi nama buku';
    statusCode = 400;
  } else if (readPage > pageCount) {
    message = 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount';
    statusCode = 400;
  } else if (index === -1) {
    message = 'Gagal memperbarui buku. Id tidak ditemukan';
    statusCode = 404;
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
  response.code(statusCode);
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