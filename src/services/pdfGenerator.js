// src/services/pdfGenerator.js
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

class PDFGeneratorService {
  constructor() {
    this.defaultOptions = {
      filename: 'Financial_Plan.pdf',
      format: 'a4',
      orientation: 'portrait',
      margin: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      fontSizes: {
        title: 20,
        subtitle: 16,
        heading: 14,
        subheading: 12,
        body: 10
      }
    };
  }

  /**
   * Generate a PDF from financial data
   * @param {Object} financialData - User's financial data
   * @param {Object} userData - Basic user information
   * @param {Object} options - PDF generation options
   * @returns {Promise<Blob>} PDF document as a Blob
   */
  async generatePDF(financialData, userData = {}, options = {}) {
    try {
      console.log('Generating PDF with financial data:', financialData);
      
      // Merge default options with provided options
      const mergedOptions = {
        ...this.defaultOptions,
        ...options
      };
      
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: mergedOptions.orientation,
        unit: 'mm',
        format: mergedOptions.format
      });
      
      // Set initial position
      let yPos = mergedOptions.margin.top;
      
      // Add title and date
      this.addTitle(doc, 'Financial Plan', yPos, mergedOptions);
      yPos += 15;
      
      // Add generation date and user info
      this.addText(doc, `Generated on: ${new Date().toLocaleDateString('en-GB')}`, yPos, mergedOptions);
      yPos += 10;
      
      if (userData.name) {
        this.addText(doc, `Prepared for: ${userData.name}`, yPos, mergedOptions);
        yPos += 10;
      }
      
      // Add completion score if available
      if (financialData.completionScore !== undefined) {
        this.addText(doc, `Profile Completion: ${financialData.completionScore}%`, yPos, mergedOptions);
        yPos += 15;
      } else {
        yPos += 5;
      }
      
      // Add divider
      this.addDivider(doc, yPos, mergedOptions);
      yPos += 10;
      
      // Add summary section
      this.addSubtitle(doc, 'Financial Summary', yPos, mergedOptions);
      yPos += 10;
      
      // Add summary content
      const summaryText = this.generateSummaryText(financialData);
      yPos = this.addParagraph(doc, summaryText, yPos, mergedOptions);
      yPos += 15;
      
      // Add income section if data exists
      if (financialData.income && financialData.income.length > 0) {
        yPos = this.addSection(doc, 'Income', financialData.income, yPos, mergedOptions);
      }
      
      // Add expenses section if data exists
      if (financialData.expenses && financialData.expenses.length > 0) {
        yPos = this.addSection(doc, 'Expenses', financialData.expenses, yPos, mergedOptions);
      }
      
      // Add goals section if data exists
      if (financialData.goals && financialData.goals.length > 0) {
        yPos = this.addSection(doc, 'Financial Goals', financialData.goals, yPos, mergedOptions);
      }
      
      // Add assets section if data exists
      if (financialData.assets && financialData.assets.length > 0) {
        yPos = this.addSection(doc, 'Assets', financialData.assets, yPos, mergedOptions);
      }
      
      // Add debts section if data exists
      if (financialData.debts && financialData.debts.length > 0) {
        yPos = this.addSection(doc, 'Debts', financialData.debts, yPos, mergedOptions);
      }
      
      // Add risk tolerance section if data exists
      if (financialData.riskTolerance) {
        yPos = this.addRiskToleranceSection(doc, financialData.riskTolerance, yPos, mergedOptions);
      }
      
      // Add insights section if data exists
      if (financialData.insights && financialData.insights.length > 0) {
        yPos = this.addInsightsSection(doc, financialData.insights, yPos, mergedOptions);
      }
      
      // Add next steps section
      yPos = this.addNextStepsSection(doc, financialData, yPos, mergedOptions);
      
      // Add footer
      this.addFooter(doc, mergedOptions);
      
      // Save and return the PDF
      return doc.output('blob');
    } catch (error) {
      console.error('Error generating PDF:', error);
      throw new Error(`Failed to generate PDF: ${error.message}`);
    }
  }

  /**
   * Generate and download a PDF
   * @param {Object} financialData - User's financial data
   * @param {Object} userData - Basic user information
   * @param {Object} options - PDF generation options
   */
  async generateAndDownloadPDF(financialData, userData = {}, options = {}) {
    try {
      const pdfBlob = await this.generatePDF(financialData, userData, options);
      const filename = options.filename || this.defaultOptions.filename;
      
      // Create a download link
      const link = document.createElement('a');
      link.href = URL.createObjectURL(pdfBlob);
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
      
      return true;
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw new Error(`Failed to download PDF: ${error.message}`);
    }
  }

  /**
   * Generate PDF from HTML element
   * @param {HTMLElement} element - HTML element to convert to PDF
   * @param {Object} options - PDF generation options
   * @returns {Promise<Blob>} PDF document as a Blob
   */
  async generatePDFFromHTML(element, options = {}) {
    try {
      // Merge default options with provided options
      const mergedOptions = {
        ...this.defaultOptions,
        ...options
      };
      
      // Capture the HTML element as a canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false
      });
      
      // Calculate dimensions
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210 - (mergedOptions.margin.left + mergedOptions.margin.right); // A4 width in mm minus margins
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      // Create PDF
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      let position = mergedOptions.margin.top;
      
      // Add title
      doc.setFontSize(mergedOptions.fontSizes.title);
      doc.setFont('helvetica', 'bold');
      doc.text('Financial Plan', mergedOptions.margin.left, position);
      position += 15;
      
      // Add date
      doc.setFontSize(mergedOptions.fontSizes.body);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, mergedOptions.margin.left, position);
      position += 10;
      
      // Add first page of content
      doc.addImage(
        imgData, 
        'PNG', 
        mergedOptions.margin.left, 
        position, 
        imgWidth, 
        imgHeight
      );
      heightLeft -= (pageHeight - position);
      
      // Add additional pages if needed
      let pageCount = 1;
      while (heightLeft > 0) {
        position = mergedOptions.margin.top; // Reset position for new page
        doc.addPage();
        pageCount++;
        
        doc.addImage(
          imgData, 
          'PNG', 
          mergedOptions.margin.left, 
          position - (pageHeight * (pageCount - 1)), 
          imgWidth, 
          imgHeight
        );
        
        heightLeft -= (pageHeight - mergedOptions.margin.top - mergedOptions.margin.bottom);
      }
      
      // Add footer to each page
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        this.addFooter(doc, mergedOptions);
      }
      
      return doc.output('blob');
    } catch (error) {
      console.error('Error generating PDF from HTML:', error);
      throw new Error(`Failed to generate PDF from HTML: ${error.message}`);
    }
  }

  /**
   * Add a title to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {string} text - Title text
   * @param {number} y - Y position
   * @param {Object} options - Options
   */
  addTitle(doc, text, y, options) {
    doc.setFontSize(options.fontSizes.title);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 100); // Dark blue
    doc.text(text, options.margin.left, y);
    doc.setTextColor(0); // Reset to black
  }

  /**
   * Add a subtitle to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {string} text - Subtitle text
   * @param {number} y - Y position
   * @param {Object} options - Options
   */
  addSubtitle(doc, text, y, options) {
    doc.setFontSize(options.fontSizes.subtitle);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 100); // Dark blue
    doc.text(text, options.margin.left, y);
    doc.setTextColor(0); // Reset to black
  }

  /**
   * Add a heading to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {string} text - Heading text
   * @param {number} y - Y position
   * @param {Object} options - Options
   */
  addHeading(doc, text, y, options) {
    doc.setFontSize(options.fontSizes.heading);
    doc.setFont('helvetica', 'bold');
    doc.text(text, options.margin.left, y);
  }

  /**
   * Add a subheading to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {string} text - Subheading text
   * @param {number} y - Y position
   * @param {Object} options - Options
   */
  addSubheading(doc, text, y, options) {
    doc.setFontSize(options.fontSizes.subheading);
    doc.setFont('helvetica', 'bold');
    doc.text(text, options.margin.left, y);
  }

  /**
   * Add text to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {string} text - Text content
   * @param {number} y - Y position
   * @param {Object} options - Options
   */
  addText(doc, text, y, options) {
    doc.setFontSize(options.fontSizes.body);
    doc.setFont('helvetica', 'normal');
    doc.text(text, options.margin.left, y);
  }

  /**
   * Add a paragraph to the PDF with word wrapping
   * @param {jsPDF} doc - PDF document
   * @param {string} text - Paragraph text
   * @param {number} y - Y position
   * @param {Object} options - Options
   * @returns {number} New Y position after adding paragraph
   */
  addParagraph(doc, text, y, options) {
    doc.setFontSize(options.fontSizes.body);
    doc.setFont('helvetica', 'normal');
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - options.margin.left - options.margin.right;
    
    const splitText = doc.splitTextToSize(text, maxWidth);
    doc.text(splitText, options.margin.left, y);
    
    return y + (splitText.length * 5); // Approximate line height
  }

  /**
   * Add a divider line to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {number} y - Y position
   * @param {Object} options - Options
   */
  addDivider(doc, y, options) {
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setDrawColor(200, 200, 200); // Light gray
    doc.setLineWidth(0.5);
    doc.line(
      options.margin.left, 
      y, 
      pageWidth - options.margin.right, 
      y
    );
    doc.setDrawColor(0); // Reset to black
  }

  /**
   * Add a data section to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {string} title - Section title
   * @param {Array} data - Section data
   * @param {number} y - Y position
   * @param {Object} options - Options
   * @returns {number} New Y position after adding section
   */
  addSection(doc, title, data, y, options) {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = options.margin.top;
    }
    
    // Add section title
    this.addSubtitle(doc, title, y, options);
    y += 10;
    
    // Add divider
    this.addDivider(doc, y, options);
    y += 10;
    
    // Process data based on section type
    if (title === 'Income') {
      return this.addIncomeSection(doc, data, y, options);
    } else if (title === 'Expenses') {
      return this.addExpensesSection(doc, data, y, options);
    } else if (title === 'Financial Goals') {
      return this.addGoalsSection(doc, data, y, options);
    } else if (title === 'Assets') {
      return this.addAssetsSection(doc, data, y, options);
    } else if (title === 'Debts') {
      return this.addDebtsSection(doc, data, y, options);
    }
    
    return y;
  }

  /**
   * Add income section to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {Array} incomeData - Income data
   * @param {number} y - Y position
   * @param {Object} options - Options
   * @returns {number} New Y position after adding section
   */
  addIncomeSection(doc, incomeData, y, options) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const colWidth = (pageWidth - options.margin.left - options.margin.right) / 3;
    
    // Add headers
    doc.setFontSize(options.fontSizes.subheading);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', options.margin.left, y);
    doc.text('Amount', options.margin.left + colWidth, y);
    doc.text('Frequency', options.margin.left + (colWidth * 2), y);
    y += 8;
    
    // Add income items
    doc.setFontSize(options.fontSizes.body);
    doc.setFont('helvetica', 'normal');
    
    let totalAnnualIncome = 0;
    
    incomeData.forEach(income => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage();
        y = options.margin.top;
        
        // Re-add headers on new page
        doc.setFontSize(options.fontSizes.subheading);
        doc.setFont('helvetica', 'bold');
        doc.text('Description', options.margin.left, y);
        doc.text('Amount', options.margin.left + colWidth, y);
        doc.text('Frequency', options.margin.left + (colWidth * 2), y);
        y += 8;
        
        doc.setFontSize(options.fontSizes.body);
        doc.setFont('helvetica', 'normal');
      }
      
      // Format amount as currency
      const formattedAmount = `£${income.amount.toLocaleString()}`;
      
      // Calculate annual equivalent
      let annualAmount = income.amount;
      if (income.frequency === 'monthly') {
        annualAmount *= 12;
      } else if (income.frequency === 'weekly') {
        annualAmount *= 52;
      }
      totalAnnualIncome += annualAmount;
      
      // Add income item
      doc.text(income.text, options.margin.left, y);
      doc.text(formattedAmount, options.margin.left + colWidth, y);
      doc.text(income.frequency, options.margin.left + (colWidth * 2), y);
      y += 6;
    });
    
    // Add divider
    y += 2;
    this.addDivider(doc, y, options);
    y += 8;
    
    // Add total
    doc.setFont('helvetica', 'bold');
    doc.text('Total Annual Income:', options.margin.left, y);
    doc.text(`£${totalAnnualIncome.toLocaleString()}`, options.margin.left + colWidth, y);
    y += 15;
    
    return y;
  }

  /**
   * Add expenses section to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {Array} expensesData - Expenses data
   * @param {number} y - Y position
   * @param {Object} options - Options
   * @returns {number} New Y position after adding section
   */
  addExpensesSection(doc, expensesData, y, options) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const colWidth = (pageWidth - options.margin.left - options.margin.right) / 3;
    
    // Add headers
    doc.setFontSize(options.fontSizes.subheading);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', options.margin.left, y);
    doc.text('Amount', options.margin.left + colWidth, y);
    doc.text('Frequency', options.margin.left + (colWidth * 2), y);
    y += 8;
    
    // Add expense items
    doc.setFontSize(options.fontSizes.body);
    doc.setFont('helvetica', 'normal');
    
    let totalMonthlyExpenses = 0;
    
    expensesData.forEach(expense => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage();
        y = options.margin.top;
        
        // Re-add headers on new page
        doc.setFontSize(options.fontSizes.subheading);
        doc.setFont('helvetica', 'bold');
        doc.text('Description', options.margin.left, y);
        doc.text('Amount', options.margin.left + colWidth, y);
        doc.text('Frequency', options.margin.left + (colWidth * 2), y);
        y += 8;
        
        doc.setFontSize(options.fontSizes.body);
        doc.setFont('helvetica', 'normal');
      }
      
      // Format amount as currency
      const formattedAmount = `£${expense.amount.toLocaleString()}`;
      
      // Calculate monthly equivalent
      let monthlyAmount = expense.amount;
      if (expense.frequency === 'yearly') {
        monthlyAmount /= 12;
      } else if (expense.frequency === 'weekly') {
        monthlyAmount *= 4.33; // Average weeks per month
      }
      totalMonthlyExpenses += monthlyAmount;
      
      // Add expense item
      doc.text(expense.text, options.margin.left, y);
      doc.text(formattedAmount, options.margin.left + colWidth, y);
      doc.text(expense.frequency, options.margin.left + (colWidth * 2), y);
      y += 6;
    });
    
    // Add divider
    y += 2;
    this.addDivider(doc, y, options);
    y += 8;
    
    // Add total
    doc.setFont('helvetica', 'bold');
    doc.text('Total Monthly Expenses:', options.margin.left, y);
    doc.text(`£${totalMonthlyExpenses.toLocaleString()}`, options.margin.left + colWidth, y);
    y += 15;
    
    return y;
  }

  /**
   * Add goals section to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {Array} goalsData - Goals data
   * @param {number} y - Y position
   * @param {Object} options - Options
   * @returns {number} New Y position after adding section
   */
  addGoalsSection(doc, goalsData, y, options) {
    // Add goals
    doc.setFontSize(options.fontSizes.body);
    doc.setFont('helvetica', 'normal');
    
    goalsData.forEach((goal, index) => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage();
        y = options.margin.top;
      }
      
      // Add goal number and text
      doc.setFont('helvetica', 'bold');
      doc.text(`Goal ${index + 1}:`, options.margin.left, y);
      doc.setFont('helvetica', 'normal');
      
      // Handle goal text (might be long)
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - options.margin.left - options.margin.right - 20; // Subtract some space for the "Goal X:" prefix
      const goalText = doc.splitTextToSize(goal.text, maxWidth);
      
      doc.text(goalText, options.margin.left + 20, y);
      y += (goalText.length * 6);
      
      // Add goal details if available
      if (goal.amounts && goal.amounts.length > 0) {
        doc.text(`Target Amount: £${goal.amounts[0].toLocaleString()}`, options.margin.left + 20, y);
        y += 6;
      }
      
      if (goal.timeframes && goal.timeframes.length > 0) {
        const timeframe = goal.timeframes[0];
        doc.text(`Timeframe: ${timeframe.value} ${timeframe.unit}${timeframe.value !== 1 ? 's' : ''}`, options.margin.left + 20, y);
        y += 6;
      }
      
      if (goal.type && goal.type.length > 0) {
        doc.text(`Type: ${goal.type.join(', ')}`, options.margin.left + 20, y);
        y += 6;
      }
      
      y += 6; // Add some space between goals
    });
    
    y += 5; // Add some extra space after the goals section
    
    return y;
  }

  /**
   * Add assets section to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {Array} assetsData - Assets data
   * @param {number} y - Y position
   * @param {Object} options - Options
   * @returns {number} New Y position after adding section
   */
  addAssetsSection(doc, assetsData, y, options) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const colWidth = (pageWidth - options.margin.left - options.margin.right) / 3;
    
    // Add headers
    doc.setFontSize(options.fontSizes.subheading);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', options.margin.left, y);
    doc.text('Amount', options.margin.left + colWidth, y);
    doc.text('Type', options.margin.left + (colWidth * 2), y);
    y += 8;
    
    // Add asset items
    doc.setFontSize(options.fontSizes.body);
    doc.setFont('helvetica', 'normal');
    
    let totalAssets = 0;
    
    assetsData.forEach(asset => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage();
        y = options.margin.top;
        
        // Re-add headers on new page
        doc.setFontSize(options.fontSizes.subheading);
        doc.setFont('helvetica', 'bold');
        doc.text('Description', options.margin.left, y);
        doc.text('Amount', options.margin.left + colWidth, y);
        doc.text('Type', options.margin.left + (colWidth * 2), y);
        y += 8;
        
        doc.setFontSize(options.fontSizes.body);
        doc.setFont('helvetica', 'normal');
      }
      
      // Format amount as currency
      const formattedAmount = `£${asset.amount.toLocaleString()}`;
      totalAssets += asset.amount;
      
      // Add asset item
      doc.text(asset.text, options.margin.left, y);
      doc.text(formattedAmount, options.margin.left + colWidth, y);
      doc.text(asset.type || 'Other', options.margin.left + (colWidth * 2), y);
      y += 6;
    });
    
    // Add divider
    y += 2;
    this.addDivider(doc, y, options);
    y += 8;
    
    // Add total
    doc.setFont('helvetica', 'bold');
    doc.text('Total Assets:', options.margin.left, y);
    doc.text(`£${totalAssets.toLocaleString()}`, options.margin.left + colWidth, y);
    y += 15;
    
    return y;
  }

  /**
   * Add debts section to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {Array} debtsData - Debts data
   * @param {number} y - Y position
   * @param {Object} options - Options
   * @returns {number} New Y position after adding section
   */
  addDebtsSection(doc, debtsData, y, options) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const colWidth = (pageWidth - options.margin.left - options.margin.right) / 3;
    
    // Add headers
    doc.setFontSize(options.fontSizes.subheading);
    doc.setFont('helvetica', 'bold');
    doc.text('Description', options.margin.left, y);
    doc.text('Amount', options.margin.left + colWidth, y);
    doc.text('Type', options.margin.left + (colWidth * 2), y);
    y += 8;
    
    // Add debt items
    doc.setFontSize(options.fontSizes.body);
    doc.setFont('helvetica', 'normal');
    
    let totalDebts = 0;
    
    debtsData.forEach(debt => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage();
        y = options.margin.top;
        
        // Re-add headers on new page
        doc.setFontSize(options.fontSizes.subheading);
        doc.setFont('helvetica', 'bold');
        doc.text('Description', options.margin.left, y);
        doc.text('Amount', options.margin.left + colWidth, y);
        doc.text('Type', options.margin.left + (colWidth * 2), y);
        y += 8;
        
        doc.setFontSize(options.fontSizes.body);
        doc.setFont('helvetica', 'normal');
      }
      
      // Format amount as currency
      const formattedAmount = `£${debt.amount.toLocaleString()}`;
      totalDebts += debt.amount;
      
      // Add debt item
      doc.text(debt.text, options.margin.left, y);
      doc.text(formattedAmount, options.margin.left + colWidth, y);
      doc.text(debt.type || 'Other', options.margin.left + (colWidth * 2), y);
      y += 6;
    });
    
    // Add divider
    y += 2;
    this.addDivider(doc, y, options);
    y += 8;
    
    // Add total
    doc.setFont('helvetica', 'bold');
    doc.text('Total Debts:', options.margin.left, y);
    doc.text(`£${totalDebts.toLocaleString()}`, options.margin.left + colWidth, y);
    y += 15;
    
    return y;
  }

  /**
   * Add risk tolerance section to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {Object} riskData - Risk tolerance data
   * @param {number} y - Y position
   * @param {Object} options - Options
   * @returns {number} New Y position after adding section
   */
  addRiskToleranceSection(doc, riskData, y, options) {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = options.margin.top;
    }
    
    // Add section title
    this.addSubtitle(doc, 'Risk Profile', y, options);
    y += 10;
    
    // Add divider
    this.addDivider(doc, y, options);
    y += 10;
    
    // Add risk profile description
    doc.setFontSize(options.fontSizes.body);
    doc.setFont('helvetica', 'normal');
    
    doc.text(`Risk Tolerance: ${riskData.text}`, options.margin.left, y);
    y += 8;
    
    // Add risk level visualization
    const pageWidth = doc.internal.pageSize.getWidth();
    const barWidth = pageWidth - options.margin.left - options.margin.right;
    const barHeight = 10;
    
    // Draw risk level bar background
    doc.setFillColor(240, 240, 240); // Light gray
    doc.rect(
      options.margin.left, 
      y, 
      barWidth, 
      barHeight, 
      'F'
    );
    
    // Determine fill width based on risk level
    let fillWidth = 0;
    let fillColor = [0, 0, 0]; // RGB
    
    switch (riskData.level) {
      case 'low':
        fillWidth = barWidth * 0.25;
        fillColor = [0, 150, 0]; // Green
        break;
      case 'medium':
        fillWidth = barWidth * 0.5;
        fillColor = [255, 165, 0]; // Orange
        break;
      case 'high':
        fillWidth = barWidth * 0.75;
        fillColor = [255, 0, 0]; // Red
        break;
      default:
        fillWidth = barWidth * 0.5;
        fillColor = [100, 100, 100]; // Gray
    }
    
    // Draw risk level indicator
    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
    doc.rect(
      options.margin.left, 
      y, 
      fillWidth, 
      barHeight, 
      'F'
    );
    
    y += barHeight + 8;
    
    // Add risk level labels
    doc.setFontSize(options.fontSizes.body - 2);
    doc.text('Low Risk', options.margin.left, y);
    doc.text('Medium Risk', options.margin.left + (barWidth / 2) - 15, y);
    doc.text('High Risk', options.margin.left + barWidth - 20, y);
    
    y += 15;
    
    // Add risk profile explanation
    let riskExplanation = '';
    
    switch (riskData.level) {
      case 'low':
        riskExplanation = 'A low risk tolerance suggests a preference for stable, secure investments with lower potential returns. This approach prioritizes capital preservation over growth.';
        break;
      case 'medium':
        riskExplanation = 'A medium risk tolerance indicates a balanced approach, accepting moderate market fluctuations for the potential of higher returns over time.';
        break;
      case 'high':
        riskExplanation = 'A high risk tolerance suggests comfort with significant market volatility in pursuit of higher potential returns. This approach prioritizes growth over capital preservation.';
        break;
      default:
        riskExplanation = 'Your risk profile helps determine appropriate investment strategies aligned with your comfort level for market fluctuations and potential losses.';
    }
    
    y = this.addParagraph(doc, riskExplanation, y, options);
    y += 10;
    
    return y;
  }

  /**
   * Add insights section to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {Array} insights - Financial insights
   * @param {number} y - Y position
   * @param {Object} options - Options
   * @returns {number} New Y position after adding section
   */
  addInsightsSection(doc, insights, y, options) {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = options.margin.top;
    }
    
    // Add section title
    this.addSubtitle(doc, 'Financial Insights', y, options);
    y += 10;
    
    // Add divider
    this.addDivider(doc, y, options);
    y += 10;
    
    // Add insights
    doc.setFontSize(options.fontSizes.body);
    
    insights.forEach((insight, index) => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage();
        y = options.margin.top;
      }
      
      // Add insight with bullet point
      doc.setFont('helvetica', 'bold');
      doc.text(`• Insight ${index + 1}:`, options.margin.left, y);
      doc.setFont('helvetica', 'normal');
      
      // Handle insight message (might be long)
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - options.margin.left - options.margin.right - 25; // Subtract some space for the bullet point
      const insightText = doc.splitTextToSize(insight.message, maxWidth);
      
      doc.text(insightText, options.margin.left + 25, y);
      y += (insightText.length * 6) + 5; // Add some space between insights
    });
    
    y += 5; // Add some extra space after the insights section
    
    return y;
  }

  /**
   * Add next steps section to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {Object} financialData - Financial data
   * @param {number} y - Y position
   * @param {Object} options - Options
   * @returns {number} New Y position after adding section
   */
  addNextStepsSection(doc, financialData, y, options) {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = options.margin.top;
    }
    
    // Add section title
    this.addSubtitle(doc, 'Recommended Next Steps', y, options);
    y += 10;
    
    // Add divider
    this.addDivider(doc, y, options);
    y += 10;
    
    // Generate next steps based on financial data
    const nextSteps = this.generateNextSteps(financialData);
    
    // Add next steps
    doc.setFontSize(options.fontSizes.body);
    
    nextSteps.forEach((step, index) => {
      // Check if we need a new page
      if (y > 270) {
        doc.addPage();
        y = options.margin.top;
      }
      
      // Add step with number
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}.`, options.margin.left, y);
      doc.setFont('helvetica', 'normal');
      
      // Handle step text (might be long)
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - options.margin.left - options.margin.right - 10; // Subtract some space for the number
      const stepText = doc.splitTextToSize(step, maxWidth);
      
      doc.text(stepText, options.margin.left + 10, y);
      y += (stepText.length * 6) + 5; // Add some space between steps
    });
    
    y += 5; // Add some extra space after the next steps section
    
    return y;
  }

  /**
   * Add footer to the PDF
   * @param {jsPDF} doc - PDF document
   * @param {Object} options - Options
   */
  addFooter(doc, options) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Add page number
    const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
    const totalPages = doc.internal.getNumberOfPages();
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text(
      `Page ${pageNumber} of ${totalPages}`, 
      pageWidth / 2, 
      pageHeight - 10, 
      { align: 'center' }
    );
    
    // Add disclaimer
    doc.setFontSize(6);
    doc.text(
      'This financial plan is for informational purposes only and does not constitute financial advice. Please consult with a qualified financial advisor before making any financial decisions.', 
      pageWidth / 2, 
      pageHeight - 5, 
      { align: 'center' }
    );
    
    doc.setTextColor(0); // Reset to black
  }

  /**
   * Generate summary text based on financial data
   * @param {Object} financialData - Financial data
   * @returns {string} Summary text
   */
  generateSummaryText(financialData) {
    let summary = 'This financial plan provides an overview of your current financial situation and recommendations for achieving your financial goals. ';
    
    // Add income summary
    if (financialData.income && financialData.income.length > 0) {
      const totalAnnual = financialData.income.reduce((total, income) => {
        let amount = income.amount || 0;
        if (income.frequency === 'monthly') {
          amount *= 12;
        } else if (income.frequency === 'weekly') {
          amount *= 52;
        }
        return total + amount;
      }, 0);
      
      summary += `Your current annual income is approximately £${totalAnnual.toLocaleString()}. `;
    }
    
    // Add expense summary
    if (financialData.expenses && financialData.expenses.length > 0) {
      const totalMonthly = financialData.expenses.reduce((total, expense) => {
        let amount = expense.amount || 0;
        if (expense.frequency === 'yearly') {
          amount /= 12;
        } else if (expense.frequency === 'weekly') {
          amount *= 4.33; // Average weeks per month
        }
        return total + amount;
      }, 0);
      
      summary += `Your monthly expenses total approximately £${totalMonthly.toLocaleString()}. `;
    }
    
    // Add assets and debts summary
    if (financialData.assets && financialData.assets.length > 0) {
      const totalAssets = financialData.assets.reduce((total, asset) => {
        return total + (asset.amount || 0);
      }, 0);
      
      summary += `You have total assets of £${totalAssets.toLocaleString()}. `;
    }
    
    if (financialData.debts && financialData.debts.length > 0) {
      const totalDebts = financialData.debts.reduce((total, debt) => {
        return total + (debt.amount || 0);
      }, 0);
      
      summary += `Your total debt is £${totalDebts.toLocaleString()}. `;
    }
    
    // Add net worth if both assets and debts are available
    if (financialData.assets && financialData.assets.length > 0 && 
        financialData.debts && financialData.debts.length > 0) {
      const totalAssets = financialData.assets.reduce((total, asset) => {
        return total + (asset.amount || 0);
      }, 0);
      
      const totalDebts = financialData.debts.reduce((total, debt) => {
        return total + (debt.amount || 0);
      }, 0);
      
      const netWorth = totalAssets - totalDebts;
      
      summary += `This gives you a net worth of £${netWorth.toLocaleString()}. `;
    }
    
    // Add goals summary
    if (financialData.goals && financialData.goals.length > 0) {
      summary += `You have identified ${financialData.goals.length} financial goal${financialData.goals.length !== 1 ? 's' : ''} which this plan will help you work towards. `;
    }
    
    // Add risk profile summary
    if (financialData.riskTolerance) {
      summary += `Your risk tolerance is ${financialData.riskTolerance.level}, which has been considered in the recommendations provided. `;
    }
    
    return summary;
  }

  /**
   * Generate next steps based on financial data
   * @param {Object} financialData - Financial data
   * @returns {Array<string>} Next steps
   */
  generateNextSteps(financialData) {
    const nextSteps = [];
    
    // Check for emergency fund
    const hasEmergencyFund = financialData.assets && 
                             financialData.assets.some(asset => 
                               asset.type === 'savings' || 
                               asset.text.toLowerCase().includes('emergency') || 
                               asset.text.toLowerCase().includes('saving')
                             );
    
    if (!hasEmergencyFund) {
      nextSteps.push('Build an emergency fund of 3-6 months of essential expenses in an easy-access savings account.');
    }
    
    // Check for high-interest debt
    const hasHighInterestDebt = financialData.debts && 
                               financialData.debts.some(debt => 
                                 debt.type === 'credit_card' || 
                                 debt.text.toLowerCase().includes('credit card') ||
                                 debt.text.toLowerCase().includes('store card')
                               );
    
    if (hasHighInterestDebt) {
      nextSteps.push('Prioritize paying off high-interest debt (credit cards, store cards) to reduce interest payments.');
    }
    
    // Check for pension contributions
    const hasPension = financialData.assets && 
                      financialData.assets.some(asset => 
                        asset.type === 'pension' || 
                        asset.text.toLowerCase().includes('pension')
                      );
    
    if (!hasPension) {
      nextSteps.push('Review your workplace pension and consider increasing contributions to benefit from tax relief and employer matching.');
    }
    
    // Check for tax-efficient savings
    const hasISA = financialData.assets && 
                  financialData.assets.some(asset => 
                    asset.text.toLowerCase().includes('isa')
                  );
    
    if (!hasISA) {
      nextSteps.push('Consider opening a Stocks & Shares ISA for tax-efficient long-term investing (up to £20,000 annual allowance).');
    }
    
    // Check for protection needs
    nextSteps.push('Review your protection needs (life insurance, income protection, critical illness cover) to ensure your financial security.');
    
    // Check for will and estate planning
    nextSteps.push('Ensure you have an up-to-date will and consider inheritance tax planning if your estate exceeds the nil-rate band.');
    
    // Add regular review recommendation
    nextSteps.push('Schedule a review of your financial plan every 6-12 months or after significant life changes.');
    
    return nextSteps;
  }
}

export default new PDFGeneratorService();
