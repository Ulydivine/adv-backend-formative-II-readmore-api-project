# ReadMore API

## 1. Project Description

ReadMore API is a bookstore API that I built using Node.js, Express.js, MongoDB, and Mongoose.

The API manages two main things: authors and books. An author can have many books, and each book belongs to one author.

I created this project to practise building REST API endpoints, connecting to a database, and adding business rules.

## 2. Technologies Used

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- dotenv
- nodemon

## 3. Project Structure

My project is organised into different folders:

```text
readmore-api-project/
│
├── controllers/
│   ├── authorController.js
│   └── bookController.js
│
├── models/
│   ├── Author.js
│   └── Book.js
│
├── routes/
│   ├── authorRoutes.js
│   └── bookRoutes.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

- **models:** Define the fields for authors and books.
- **controllers:** Contain the functions that handle requests and responses.
- **routes:** Connect the API URLs to their controller functions.
- **server.js:** Connects to MongoDB and starts the Express server.
- **.env:** Stores the database connection string and port number.

## 4. Database Models

### Author Model

The Author model has these fields:

- name
- country
- bio

### Book Model

The Book model has these fields:

- title
- genre
- price
- publishedYear
- author

The author field stores the ID of an author. I used Mongoose references to connect books to their authors.

## 5. API Endpoints

### Author Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/authors` | Create an author |
| GET | `/authors` | Get all authors |
| GET | `/authors/:id` | Get one author |
| PUT | `/authors/:id` | Update an author |
| DELETE | `/authors/:id` | Delete an author |
| GET | `/authors/:id/books` | Get books written by an author |
| GET | `/authors/:id/stats` | Get statistics about an author's books |

### Book Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/books` | Create a book |
| GET | `/books` | Get all books |
| GET | `/books/:id` | Get one book |
| PUT | `/books/:id` | Update a book |
| DELETE | `/books/:id` | Delete a book |

## 6. Business Rules

I added six business rules to make sure the API handles data correctly.

### Rule 1: Check if the author exists

Before creating a book, the API checks whether the author exists. If the author does not exist, it returns status code 400.

### Rule 2: Prevent duplicate book titles

An author cannot have two books with the same title. The check is case-insensitive.

For example, "The Silent Sea" and "the silent sea" are treated as the same title.

The API returns status code 409 if the book already exists for that author. Different authors can still have books with the same title.

### Rule 3: Validate book price and publication year

The book price must be greater than zero.

The publication year must not be in the future or before 1450.

If these values are not valid, the API returns status code 422.

### Rule 4: Prevent deleting authors who still have books

I chose Option A, which means an author cannot be deleted while they still have books.

The API returns status code 409 if the author has books. If the author has no books, they can be deleted.

### Rule 5: Filter and sort books

I updated the GET `/books` endpoint to support different query parameters:

- `genre` filters books by genre.
- `minPrice` finds books with a minimum price.
- `maxPrice` finds books with a maximum price.
- `author` filters books by author ID.
- `search` searches for a word in the book title without checking uppercase or lowercase letters.
- `sort` sorts by price, title, or published year.
- `order` sorts in ascending or descending order.

These filters can also be used together.

Example:

```text
GET /books?genre=Fiction&minPrice=20&sort=price&order=desc
```

### Rule 6: Author statistics

I added the GET `/authors/:id/stats` endpoint.

It returns:

- Author name
- Number of books
- Average book price
- Cheapest book
- Most expensive book

If an author has no books, the book count and average price are returned as zero, and the cheapest and most expensive book values are returned as null.

## 7. How to Run the Project

### Step 1: Install dependencies

Open the project folder in your terminal and run:

```bash
npm install
```

### Step 2: Set up environment variables

├── .env                 (local file, not uploaded to GitHub)

### Step 3: Start the server

Run:

```bash
npm run dev
```

The server should connect to MongoDB and run at:

```text
http://localhost:3000
```

### Step 4: Check the server

Open another terminal and run:

```bash
curl http://localhost:3000
```

The API should return a message showing that ReadMore API is running.

## 8. Testing

I tested the API using curl commands in the terminal.

I checked creating, getting, updating, and deleting authors and books. I also tested the business rules using valid and invalid data.

Some of the responses I checked included:

- 200 for successful requests.
- 201 for successfully creating records.
- 400 for invalid requests.
- 404 when a record was not found.
- 409 for duplicate titles and blocked author deletion.
- 422 for invalid book prices and publication years.

I also tested book filtering, sorting, and author statistics.
I also tested author statistics with an author who had books and another author who had no books.

## 9. Conclusion

This project helped me practise building an API with Express.js and connecting it to MongoDB using Mongoose.

I also learned how to connect two models, organise routes and controllers, and use business rules to control the data being saved in the database.

