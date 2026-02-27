# Eksamensvakt Project - Copilot Instructions

A web application that parses Excel spreadsheets to extract teacher schedules.

## Project Overview

**Eksamensvakt** (Teacher Schedule Parser) is a Node.js/Express web application that:
- Accepts Excel file uploads
- Parses teacher names and attendance marks ("X")
- Maps attendance to corresponding dates in column headers
- Displays formatted schedule results in a web interface

## Technology Stack

- **Backend**: Express.js (Node.js)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Excel Parsing**: xlsx library
- **File Upload**: Multer
- **Port**: 3000

## Project Structure

```
src/
  ├── index.js          # Express server & API routes
  └── excelParser.js    # Excel file parsing logic
public/
  ├── index.html        # Web interface
  ├── style.css         # UI styling
  └── script.js         # Frontend logic
.github/
  └── copilot-instructions.md
```

## Getting Started

- Install dependencies: `npm install`
- Run server: `npm start` or `npm run dev` (with auto-reload)
- Access at: `http://localhost:3000`

## Key Features

- Accept Excel files (.xlsx, .xls)
- Parse specified sheet (default: "Lærervakter")
- Identify teachers in first column
- Map "X" marks to dates in first row
- Display results in formatted teacher cards
- Responsive web interface

## Development Guidelines

- Follow Node.js/Express best practices
- Keep frontend logic in public/script.js
- Parser logic in src/excelParser.js
- Use semantic HTML and CSS
- Test with various Excel formats
- Handle errors gracefully

## API Endpoints

- `GET /` - Serve main page
- `POST /api/upload` - Upload and process Excel file
- `GET /public/*` - Serve static assets

## Common Tasks

1. **Add features**: Extend excelParser.js for new parsing logic
2. **Change styling**: Edit public/style.css
3. **Modify UI**: Update public/index.html
4. **Debug server**: Run `npm run dev` for auto-reload

