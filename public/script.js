let currentTeachersData = [];
let filterDate = null;

document.getElementById('uploadForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById('file');
  const sheetNameInput = document.getElementById('sheetName');
  const filterDateInput = document.getElementById('filterDate');
  const file = fileInput.files[0];
  const sheetName = sheetNameInput.value || 'Lærervakter';

  if (!file) {
    showError('Please select a file');
    return;
  }

  // Set filter date if provided
  filterDate = filterDateInput.value ? new Date(filterDateInput.value) : null;

  showLoading(true);
  hideError();
  hideResults();

  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('sheetName', sheetName);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process file');
    }

    const data = await response.json();
    displayResults(data);
  } catch (error) {
    showError(error.message);
  } finally {
    showLoading(false);
  }
});

function showLoading(show) {
  const loading = document.getElementById('loading');
  loading.style.display = show ? 'block' : 'none';
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
}

function hideError() {
  document.getElementById('error').style.display = 'none';
}

function hideResults() {
  document.getElementById('results').style.display = 'none';
}

function displayResults(data) {
  const resultsDiv = document.getElementById('results');
  const resultsContent = document.getElementById('resultsContent');

  let html = '';

  if (data.teachers.length === 0) {
    html = '<p>No teacher data found in the sheet.</p>';
  } else {
    data.teachers.forEach(teacher => {
      let filteredDates = teacher.dates;
      
      // Apply date filter if set
      if (filterDate) {
        filteredDates = teacher.dates.filter(date => isDateOnOrAfter(date, filterDate));
      }

      html += `
        <div class="teacher-card">
          <div class="teacher-name">👨‍🏫 ${escapeHtml(teacher.name)}</div>
          <div class="teacher-dates">
            ${filteredDates.length > 0
              ? filteredDates
                  .map(date => {
                    const dateStr = escapeHtml(date.toString());
                    const formatted = dateStr.replace(/\(([^)]+)\)/, '<span class="date-time">($1)</span>');
                    return `<span class="date-badge">${formatted}</span>`;
                  })
                  .join('')
              : '<span class="date-badge empty">No scheduled dates</span>'
            }
          </div>
        </div>
      `;
    });
  }

  resultsContent.innerHTML = html;
  currentTeachersData = data.teachers;
  resultsDiv.style.display = 'block';

  // Scroll to results
  resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

function isDateOnOrAfter(dateString, filterDate) {
  // Extract DD.MM from the date string (e.g., "04.05" from "04.05 (08.30-11.45)")
  const match = dateString.toString().match(/(\d{2})\.(\d{2})/);
  if (!match) return true;
  
  const day = parseInt(match[1]);
  const month = parseInt(match[2]);
  
  // Get filter date components
  const filterDay = filterDate.getDate();
  const filterMonth = filterDate.getMonth() + 1; // getMonth() returns 0-11
  
  // Compare month first, then day
  if (month !== filterMonth) {
    return month > filterMonth;
  }
  return day >= filterDay;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.getElementById('copyOneNoteBtn').addEventListener('click', async () => {
  if (!currentTeachersData || currentTeachersData.length === 0) {
    alert('No data to copy. Please upload a file first.');
    return;
  }

  try {
    // Build HTML table
    let html = '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">';
    html += '<tr style="background-color: #667eea; color: white;"><th style="font-weight: bold;">Teacher Name</th><th style="font-weight: bold;">Scheduled Dates</th></tr>';
    
    currentTeachersData.forEach((teacher, idx) => {
      let dates = teacher.dates;
      if (filterDate) {
        dates = dates.filter(date => isDateOnOrAfter(date, filterDate));
      }
      
      const bgColor = idx % 2 === 0 ? 'white' : '#f5f5f5';
      let datesText = dates.length > 0 
        ? dates.map((date, dateIdx) => {
          const isBold = (dateIdx + 1) % 2 === 0;
          return isBold ? `<strong>${escapeHtml(date)}</strong>` : escapeHtml(date);
        }).join(' | ')
        : 'No schedules';
      
      html += `<tr style="background-color: ${bgColor};"><td>${escapeHtml(teacher.name)}</td><td>${datesText}</td></tr>`;
    });
    
    html += '</table>';

    // Copy as HTML to clipboard
    const blob = new Blob([html], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blob })];
    await navigator.clipboard.write(data);
    alert('Table copied to clipboard! Paste it into OneNote using Ctrl+V');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    // Fallback: try copying as text if HTML copy fails
    try {
      let textTable = 'Teacher Name\tScheduled Dates\n';
      currentTeachersData.forEach(teacher => {
        let dates = teacher.dates;
        if (filterDate) {
          dates = dates.filter(date => isDateOnOrAfter(date, filterDate));
        }
        const datesText = dates.length > 0 ? dates.join(' | ') : 'No schedules';
        textTable += `${teacher.name}\t${datesText}\n`;
      });
      await navigator.clipboard.writeText(textTable);
      alert('Table copied to clipboard (as text)! Paste it into OneNote using Ctrl+V');
    } catch (fallbackError) {
      alert('Error copying to clipboard: ' + error.message);
    }
  }
});

document.getElementById('exportPdfBtn').addEventListener('click', async () => {
  if (!currentTeachersData || currentTeachersData.length === 0) {
    alert('No data to export. Please upload a file first.');
    return;
  }

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text('Teacher Schedule', 15, 15);

    // Prepare table data with filtered dates
    const tableData = currentTeachersData.map(teacher => {
      let dates = teacher.dates;
      if (filterDate) {
        dates = dates.filter(date => isDateOnOrAfter(date, filterDate));
      }
      
      let datesText = dates.length > 0 ? dates.join(' | ') : 'No schedules';
      
      return [
        teacher.name,
        datesText
      ];
    });

    // Generate table
    doc.autoTable({
      head: [['Teacher Name', 'Scheduled Dates']],
      body: tableData,
      startY: 25,
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 120 }
      },
      styles: {
        fontSize: 10,
        cellPadding: 6,
        halign: 'left',
        valign: 'top'
      },
      headStyles: {
        fillColor: [102, 126, 234],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      bodyStyles: {
        valign: 'middle'
      },
      didDrawCell: (data) => {
        // Only process the dates column (index 1) in body cells
        if (data.column.index === 1 && data.row.section === 'body') {
          const text = data.cell.text[0];
          const dates = text.split(' | ');
          
          // Clear the default text
          const startX = data.cell.x + data.cell.padding('left');
          const startY = data.cell.y + data.cell.padding('top') + 7;
          
          doc.setFontSize(10);
          let currentX = startX;
          
          dates.forEach((date, idx) => {
            // Alternate between bold and normal - 2nd, 4th, 6th etc are bold
            const isBold = (idx + 1) % 2 === 0;
            doc.setFont(undefined, isBold ? 'bold' : 'normal');
            
            doc.text(date, currentX, startY);
            currentX += doc.getTextWidth(date) + 2;
            
            // Add separator if not last date
            if (idx < dates.length - 1) {
              doc.text(' | ', currentX, startY);
              currentX += doc.getTextWidth(' | ') + 2;
            }
          });
        }
      }
    });

    // Save the PDF
    doc.save('teacher_schedule.pdf');
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF: ' + error.message);
  }
});
