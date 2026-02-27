import xlsx from 'xlsx';

export function parseExcelFile(filePath, sheetName) {
  try {
    // Fixed column positions:
    // - Teacher names in column A (index 0)
    // - Date columns start at column E (index 4)
    const TEACHER_COLUMN = 0;
    const DATE_START_COLUMN = 4;

    // Read the Excel file
    const workbook = xlsx.readFile(filePath);

    // Check if sheet exists
    if (!workbook.SheetNames.includes(sheetName)) {
      throw new Error(`Sheet "${sheetName}" not found. Available sheets: ${workbook.SheetNames.join(', ')}`);
    }

    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

    if (data.length < 2) {
      throw new Error('Excel sheet must have at least a header row and data rows');
    }

    // Extract headers (first row) starting from the date columns
    const headers = data[0];

    // Process each row starting from row 2
    const teacherSchedule = {};

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Get teacher name from column A
      const teacherName = row[TEACHER_COLUMN];
      
      if (!teacherName || teacherName.toString().trim() === '') {
        continue; // Skip empty rows
      }

      teacherSchedule[teacherName] = [];

      // Check each column starting from column E for '1' marks
      for (let j = DATE_START_COLUMN; j < row.length; j++) {
        const cell = row[j];
        const header = headers[j];

        // Check if cell contains '1' (attendance mark)
        if (cell && (cell === 1 || cell.toString() === '1')) {
          if (header !== undefined && header !== null) {
            teacherSchedule[teacherName].push(header);
          }
        }
      }
    }

    // Format the result with time replacements
    const result = {
      sheetName,
      teachers: Object.entries(teacherSchedule).map(([name, dates]) => ({
        name,
        dates: dates
          .filter(d => d !== undefined && d !== null && d.toString().trim() !== '')
          .map(d => {
            // Replace A and B with time ranges in parentheses
            let dateStr = d.toString();
            dateStr = dateStr.replace(/ A\b/, ' (08.30-11.45)');
            dateStr = dateStr.replace(/ B\b/, ' (11.45-15.00)');
            return dateStr;
          })
      }))
    };

    return result;
  } catch (error) {
    throw new Error(`Error parsing Excel file: ${error.message}`);
  }
}
