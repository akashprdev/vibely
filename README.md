# Library app

## Prerequisites

- Node.js >= 18
- npm / pnpm / yarn
- A Neon account (if using Neon)

## Quick Start

Follow these steps to get the project running locally.

1. Clone the repo and install dependencies

```bash
git clone <repository-url>
cd /path-to-project
npm install
```

2. Create the `.env` file

Create a `.env` in the project root and add your database URL:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
```

If you are using Neon or Drizzle Studio, copy the provided `DATABASE_URL` from their dashboard.

3. Run in development

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

5. Linting & formatting

```bash
npm run lint
npm run lint:fix
npm run format
```

6. Schema push to database (Drizzle)

```bash
npx drizzle-kit push
```

See Drizzle docs for detailed migration workflows: https://orm.drizzle.team/docs

## Troubleshooting

- If `npm run dev` crashes, verify your `.env` and that the database is reachable.
- Use `npm run lint` to surface TypeScript/style issues.

## How to know the project started

When `npm run dev` starts successfully you should see:

```
🚀 Server running on http://localhost:3000
Database connected successfully
```

## API Docs

### Book

- **GET** `/api/book/`
  - Description: List all books
  - Response: `200 OK`
    ```json
    {
      "status": "success",
      "data": []
    }
    ```

- **POST** `/api/book/add`
  - Description: Create a new book
  - Request body (required):
    ```json
    { "title": "Book Title", "author": "Author Name", "publishedYear": "2023-01-01" }
    ```
  - Response: `201 Created` `{ "message": "Book added successfully" }`

- **GET** `/api/book/:id`
  - Description: Get a single book by ID
  - Response: `200 OK`
    ```json
    {
      "status": "success",
      "data": {}
    }
    ```

- **PUT** `/api/book/update/:id`
  - Description: Update book fields
  - Request body (example):
    ```json
    { "title": "New Title", "author": "New Author", "publishedYear": "2024-01-01" }
    ```
  - Response: `200 OK` `{ "message": "Book updated successfully" }`

- **DELETE** `/api/book/delete/:id`
  - Response: `200 OK` `{ "message": "Book deleted successfully" }`

### Example curl

```bash
# list books
curl -s http://localhost:3000/api/book/ | jq

# add book
curl -X POST http://localhost:3000/api/book/add \
  -H "Content-Type: application/json" \
  -d '{"title":"My Book","author":"Me","publishedYear":"2023-01-01"}'
```
