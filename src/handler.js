/* eslint-disable no-unused-vars */
const { nanoid } = require('nanoid')
const books = require('./books')

// Fungsi addBooks untuk menambahkan data buku dalam list buku array
const addBooks = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  const id = nanoid(16)
  const finished = pageCount === readPage
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt
  }

  // Ini akan dieksekusi jika client tidak melampirkan (name) pada request body
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  // Ini akan dieksekusi jika client memasukan nilai readPage lebih besar dari pageCount
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  books.push(newBook) // push new book to books array

  const isSuccess = books.filter((book) => book.id === id).length > 0 // Ini untuk check data pushed

  // Ini akan dieksekusi jika data buku berhasil ditambahkan
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }
  // Ini akam dieksekusi jika data gagal ditambahkan
  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

// Fungsi getAllBooks untuk mengambil data buku dalam list buku array
const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query

  if (name !== undefined) {
    const query = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()))
    const response = h.response({
      status: 'success',
      data: {
        books: query.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  }

  // Ini akan mengeksekusi tampilan buku yang sedang dibaca apabila nilai reading: true dan akan menampilkan buku tidak dibaca apabila nilai reading: false
  if (reading) {
    const query = books.filter((book) => book.reading === !!Number(reading))
    const response = h.response({
      status: 'success',
      data: {
        books: query.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  }

  // Ini akan mengeksekusi tampilan buku yang sudah dibaca apabila nilai finished: true dan akan menampilkan buku belum selesai dibaca apabila nilai finished: false
  if (finished) {
    const query = books.filter((book) => book.finished === !!Number(finished))
    const response = h.response({
      status: 'success',
      data: {
        books: query.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        }))
      }
    })
    response.code(200)
    return response
  }

  // Ini akan menampilkan semua buku
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
      }))
    }
  })
  response.code(200)
  return response
}

// Fungsi getDetailBookById untuk mengambil data buku dalam list buku array berdasarkan ID
const getDetailBookById = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((book) => book.id === bookId)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book
      }
    }
  }

  // response akan membalikan nilai code 404 dan menampilkan message 'Buku tidak ditemukan'
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

// Fungsi updateBookById untuk mengubah data Buku sesuai Id buku yang dipilih
const updateBookById = (request, h) => {
  const { bookId } = request.params

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  const updatedAt = new Date().toDateString()

  const i = books.findIndex((book) => book.id === bookId)

  if (i !== -1) {
    books[i] = {
      ...books[i],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

// Fungsi deleteBookById untuk menghapus data Buku sesuai Id buku yang dipilih
const deleteBookById = (request, h) => {
  const { bookId } = request.params

  const i = books.findIndex((book) => book.id === bookId)

  if (i !== -1) {
    books.splice(i, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBooks, getAllBooks, getDetailBookById, updateBookById, deleteBookById }
