# Eksamensvakt - Teacher Schedule Parser

A web application that parses Excel spreadsheets to extract teacher schedules. Upload a file with teacher names and mark dates with "X", and the app will create a clean list of each teacher's scheduled dates.

## Features

- 📤 Upload Excel files (.xlsx, .xls)
- 🔍 Automatically parse teacher schedules
- 📊 Map "X" marks to corresponding dates
- 📋 Beautiful, responsive web interface
- 🎯 Works with any sheet name

## Installation

```bash
npm install
```

## Running the App

### Production
```bash
npm start
```

### Development (with auto-reload)
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## How to Use

### Prepare Your Excel File
1. **Teachers Column**: List teacher names in the first column (Column A)
2. **Dates Header**: Put dates/times in the first row (row 1), starting from column B
3. **Mark Attendance**: Enter "X" (case-insensitive) in cells where teachers are scheduled
4. **Sheet Name**: Use "Lærervakter" as the sheet name (or specify a different name when uploading)

### Upload & View Results
1. Open the web app at `http://localhost:3000`
2. Click "Upload & Process" and select your Excel file
3. (Optional) Enter a custom sheet name if not using "Lærervakter"
4. The app will display each teacher with their scheduled dates

## Example Excel Layout

| Teacher     | Date 1 | Date 2 | Date 3 |
|------------|--------|--------|--------|
| John Smith | X      |        | X      |
| Jane Doe   |        | X      | X      |
| Bob Brown  | X      | X      |        |

**Result:**
- John Smith: Date 1, Date 3
- Jane Doe: Date 2, Date 3
- Bob Brown: Date 1, Date 2

## Technical Stack

- **Backend**: Express.js (Node.js)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Excel Parsing**: xlsx library
- **File Upload**: Multer

## Project Structure

```
.
├── src/
│   ├── index.js          # Express server & routes
│   └── excelParser.js    # Excel parsing logic
├── public/
│   ├── index.html        # Web interface
│   ├── style.css         # Styling
│   └── script.js         # Frontend logic
├── package.json          # Dependencies
└── README.md             # This file
```

## Requirements

- Node.js 14+
- npm

## Troubleshooting

**"Sheet not found" error**: Make sure the sheet name matches exactly. Excel sheet names are case-sensitive.

**No dates appearing**: Check that:
- Dates are in the first row
- Attendance marks are exactly "X" (or "x")
- Teacher names are in the first column

## License

ISC

