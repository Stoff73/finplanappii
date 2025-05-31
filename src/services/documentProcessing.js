// src/services/documentProcessing.js
import dataExtractionService from './dataExtraction';

class DocumentProcessingService {
    constructor() {
        this.supportedFileTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        
        // Common financial document types for better context
        this.documentTypes = {
            BANK_STATEMENT: 'bank_statement',
            PAYSLIP: 'payslip',
            PENSION_STATEMENT: 'pension_statement',
            INVESTMENT_STATEMENT: 'investment_statement',
            MORTGAGE_STATEMENT: 'mortgage_statement',
            TAX_DOCUMENT: 'tax_document',
            INSURANCE_DOCUMENT: 'insurance_document',
            UNKNOWN: 'unknown'
        };
    }

    /**
     * Process an uploaded document
     * @param {File} file - The uploaded file
     * @param {string} goalContext - Optional goal context for better extraction
     * @returns {Promise<Object>} Processing result with extracted data
     */
    async processDocument(file, goalContext = null) {
        try {
            console.log(`📄 Processing document: ${file.name} (${file.type})`);
            
            // Validate file type
            if (!this.isSupportedFileType(file.type)) {
                return {
                    success: false,
                    error: `Unsupported file type: ${file.type}. Please upload PDF, Word, Excel, CSV, or text files.`
                };
            }

            // For MVP, we'll simulate text extraction
            // In a production app, we would use proper document parsing libraries
            const extractedText = await this.extractTextFromDocument(file);
            
            if (!extractedText) {
                return {
                    success: false,
                    error: 'Could not extract text from document'
                };
            }

            // Detect document type for better context
            const documentType = this.detectDocumentType(extractedText);
            console.log(`📑 Detected document type: ${documentType}`);

            // Extract financial data using the existing extraction service
            const extractedData = this.extractFinancialData(extractedText, documentType, goalContext);
            
            return {
                success: true,
                fileName: file.name,
                fileType: file.type,
                documentType: documentType,
                textLength: extractedText.length,
                extractedText: extractedText.substring(0, 500) + (extractedText.length > 500 ? '...' : ''),
                extractedData: extractedData,
                processingDate: new Date().toISOString()
            };
        } catch (error) {
            console.error('Document processing error:', error);
            return {
                success: false,
                error: `Error processing document: ${error.message}`
            };
        }
    }

    /**
     * Check if file type is supported
     * @param {string} fileType - MIME type of the file
     * @returns {boolean} Whether the file type is supported
     */
    isSupportedFileType(fileType) {
        return this.supportedFileTypes.includes(fileType);
    }

    /**
     * Extract text from document (simulated for MVP)
     * @param {File} file - The document file
     * @returns {Promise<string>} Extracted text
     */
    async extractTextFromDocument(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    let text = '';
                    
                    // For MVP, we'll do basic text extraction based on file type
                    if (file.type === 'text/plain' || file.type === 'text/csv') {
                        // For text files, we can use the content directly
                        text = event.target.result;
                    } else if (file.type.includes('pdf')) {
                        // For PDF, we'd normally use a PDF parsing library
                        // For MVP, we'll simulate extraction with a message
                        text = `[PDF CONTENT EXTRACTED FROM: ${file.name}]\n\n` + 
                               this.generateSimulatedContent(file.name);
                    } else if (file.type.includes('word') || file.type.includes('office')) {
                        // For Word/Office docs, we'd normally use a document parsing library
                        // For MVP, we'll simulate extraction
                        text = `[DOCUMENT CONTENT EXTRACTED FROM: ${file.name}]\n\n` + 
                               this.generateSimulatedContent(file.name);
                    } else {
                        // For other supported types, simulate basic extraction
                        text = `[CONTENT EXTRACTED FROM: ${file.name}]\n\n` + 
                               this.generateSimulatedContent(file.name);
                    }
                    
                    resolve(text);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = (error) => {
                reject(error);
            };
            
            // Read as text if it's a text file, otherwise as binary string
            if (file.type === 'text/plain' || file.type === 'text/csv') {
                reader.readAsText(file);
            } else {
                reader.readAsBinaryString(file);
            }
        });
    }

    /**
     * Generate simulated content based on filename for MVP
     * @param {string} filename - Name of the file
     * @returns {string} Simulated content
     */
    generateSimulatedContent(filename) {
        const lowerFilename = filename.toLowerCase();
        
        if (lowerFilename.includes('bank') || lowerFilename.includes('statement')) {
            return this.generateBankStatementContent();
        } else if (lowerFilename.includes('pay') || lowerFilename.includes('salary') || lowerFilename.includes('slip')) {
            return this.generatePayslipContent();
        } else if (lowerFilename.includes('pension')) {
            return this.generatePensionContent();
        } else if (lowerFilename.includes('invest')) {
            return this.generateInvestmentContent();
        } else if (lowerFilename.includes('mortgage')) {
            return this.generateMortgageContent();
        } else if (lowerFilename.includes('tax')) {
            return this.generateTaxContent();
        } else {
            return this.generateGenericFinancialContent();
        }
    }

    /**
     * Extract financial data from document text
     * @param {string} text - Extracted document text
     * @param {string} documentType - Type of document
     * @param {string} goalContext - Goal context for better extraction
     * @returns {Object} Extracted financial data
     */
    extractFinancialData(text, documentType, goalContext) {
        // Create a message object to simulate user input
        const message = {
            type: 'user',
            content: text,
            documentType: documentType
        };
        
        // Use the existing data extraction service
        const extractedData = dataExtractionService.extractFinancialData([message], goalContext);
        
        // Enhance with document-specific metadata
        return {
            ...extractedData,
            documentMetadata: {
                documentType: documentType,
                extractionConfidence: this.calculateExtractionConfidence(extractedData),
                goalContext: goalContext
            }
        };
    }

    /**
     * Detect document type from content
     * @param {string} text - Document text content
     * @returns {string} Document type
     */
    detectDocumentType(text) {
        const lowerText = text.toLowerCase();
        
        if (this.containsKeywords(lowerText, ['bank', 'statement', 'account', 'balance', 'transaction'])) {
            return this.documentTypes.BANK_STATEMENT;
        } else if (this.containsKeywords(lowerText, ['salary', 'pay', 'payslip', 'wage', 'earnings', 'gross', 'net'])) {
            return this.documentTypes.PAYSLIP;
        } else if (this.containsKeywords(lowerText, ['pension', 'retirement', 'annuity'])) {
            return this.documentTypes.PENSION_STATEMENT;
        } else if (this.containsKeywords(lowerText, ['investment', 'portfolio', 'stock', 'share', 'fund', 'isa'])) {
            return this.documentTypes.INVESTMENT_STATEMENT;
        } else if (this.containsKeywords(lowerText, ['mortgage', 'loan', 'property', 'interest rate', 'repayment'])) {
            return this.documentTypes.MORTGAGE_STATEMENT;
        } else if (this.containsKeywords(lowerText, ['tax', 'hmrc', 'return', 'self assessment', 'p60', 'p45'])) {
            return this.documentTypes.TAX_DOCUMENT;
        } else if (this.containsKeywords(lowerText, ['insurance', 'policy', 'premium', 'cover', 'claim'])) {
            return this.documentTypes.INSURANCE_DOCUMENT;
        } else {
            return this.documentTypes.UNKNOWN;
        }
    }

    /**
     * Check if text contains any of the keywords
     * @param {string} text - Text to check
     * @param {Array<string>} keywords - Keywords to look for
     * @returns {boolean} Whether any keywords were found
     */
    containsKeywords(text, keywords) {
        return keywords.some(keyword => text.includes(keyword));
    }

    /**
     * Calculate confidence score for extraction
     * @param {Object} extractedData - Extracted financial data
     * @returns {number} Confidence score (0-100)
     */
    calculateExtractionConfidence(extractedData) {
        let score = 0;
        let totalFields = 0;
        
        // Check each data category
        for (const category of ['income', 'expenses', 'goals', 'assets', 'debts']) {
            if (Array.isArray(extractedData[category]) && extractedData[category].length > 0) {
                score += 20; // 20 points per category with data
            }
            totalFields++;
        }
        
        // Check risk tolerance
        if (extractedData.riskTolerance) {
            score += 20;
        }
        totalFields++;
        
        return Math.min(Math.round((score / (totalFields * 20)) * 100), 100);
    }

    /**
     * Generate a summary of the processing results
     * @param {Object} result - Processing result
     * @returns {string} Summary text
     */
    generateProcessingSummary(result) {
        if (!result.success) {
            return `I had trouble processing your document: ${result.error}`;
        }

        let summary = `I've processed your ${result.documentType || 'document'}: ${result.fileName}.\n\n`;

        // Add information about extracted data
        const extractedData = result.extractedData;
        const dataPoints = [];

        if (extractedData.income && extractedData.income.length > 0) {
            dataPoints.push(`${extractedData.income.length} income item(s)`);
        }
        
        if (extractedData.expenses && extractedData.expenses.length > 0) {
            dataPoints.push(`${extractedData.expenses.length} expense item(s)`);
        }
        
        if (extractedData.assets && extractedData.assets.length > 0) {
            dataPoints.push(`${extractedData.assets.length} asset(s)`);
        }
        
        if (extractedData.debts && extractedData.debts.length > 0) {
            dataPoints.push(`${extractedData.debts.length} debt item(s)`);
        }
        
        if (extractedData.goals && extractedData.goals.length > 0) {
            dataPoints.push(`${extractedData.goals.length} goal(s)`);
        }
        
        if (extractedData.riskTolerance) {
            dataPoints.push(`risk profile information`);
        }

        if (dataPoints.length > 0) {
            summary += `I found: ${dataPoints.join(', ')}.\n\n`;
            
            // Add specific details for each category
            if (extractedData.income && extractedData.income.length > 0) {
                summary += `Income: ${extractedData.income.map(item => item.text).join(', ')}\n\n`;
            }
            
            if (extractedData.expenses && extractedData.expenses.length > 0) {
                summary += `Expenses: ${extractedData.expenses.map(item => item.text).join(', ')}\n\n`;
            }
            
            if (extractedData.assets && extractedData.assets.length > 0) {
                summary += `Assets: ${extractedData.assets.map(item => item.text).join(', ')}\n\n`;
            }
            
            if (extractedData.debts && extractedData.debts.length > 0) {
                summary += `Debts: ${extractedData.debts.map(item => item.text).join(', ')}\n\n`;
            }
        } else {
            summary += `I couldn't find any specific financial information in this document. If there's particular data you'd like me to focus on, please let me know or try uploading a different document.`;
        }

        return summary;
    }

    // Simulated content generators for MVP
    generateBankStatementContent() {
        return `BANK STATEMENT
Account Number: XXXX XXXX XXXX 1234
Statement Period: 01/05/2025 - 31/05/2025

Opening Balance: £2,456.78
Closing Balance: £2,890.45

TRANSACTIONS:
01/05/2025 - SALARY PAYMENT - £2,500.00
03/05/2025 - GROCERY STORE - £85.60
05/05/2025 - MOBILE PHONE BILL - £45.00
10/05/2025 - ELECTRICITY BILL - £120.00
15/05/2025 - MORTGAGE PAYMENT - £950.00
18/05/2025 - RESTAURANT - £65.40
22/05/2025 - TRANSFER TO SAVINGS - £300.00
25/05/2025 - PETROL STATION - £60.00
28/05/2025 - ONLINE SHOPPING - £120.33
30/05/2025 - GYM MEMBERSHIP - £40.00

SUMMARY:
Total Credits: £2,500.00
Total Debits: £1,786.33
Net Change: £713.67`;
    }

    generatePayslipContent() {
        return `PAYSLIP
Employee: John Smith
Employee Number: 12345
Pay Period: May 2025

EARNINGS:
Basic Salary: £3,750.00
Overtime: £250.00
Bonus: £500.00
Gross Pay: £4,500.00

DEDUCTIONS:
Income Tax: £720.00
National Insurance: £420.00
Pension Contribution: £225.00
Student Loan: £180.00
Total Deductions: £1,545.00

NET PAY: £2,955.00

Year to Date:
Gross Pay: £22,500.00
Tax Paid: £3,600.00
NI Paid: £2,100.00`;
    }

    generatePensionContent() {
        return `PENSION STATEMENT
Member: John Smith
Pension Scheme: ABC Workplace Pension
Statement Date: 31/05/2025

CURRENT VALUES:
Current Fund Value: £85,450.00
Annual Contribution (You): £3,600.00 (5%)
Annual Contribution (Employer): £4,320.00 (6%)
Total Annual Contribution: £7,920.00

FUND BREAKDOWN:
Global Equity Fund (70%): £59,815.00
Corporate Bond Fund (20%): £17,090.00
Property Fund (10%): £8,545.00

RETIREMENT PROJECTION:
Target Retirement Age: 67
Estimated Fund at Retirement: £450,000 - £550,000
Estimated Annual Income: £18,000 - £22,000

Your pension is on track based on your current contributions and retirement age.`;
    }

    generateInvestmentContent() {
        return `INVESTMENT STATEMENT
Account: Stocks & Shares ISA
Account Number: ISA-12345678
Statement Period: 01/01/2025 - 31/03/2025

ACCOUNT SUMMARY:
Opening Value: £35,250.00
Closing Value: £38,750.00
Total Gain/Loss: £3,500.00 (9.93%)

HOLDINGS:
Global Index Tracker (FTSE Global All Cap)
Units: 125.45
Price: £180.50
Value: £22,643.73
Gain/Loss: £1,850.00 (8.9%)

UK Equity Fund
Units: 85.20
Price: £95.75
Value: £8,157.90
Gain/Loss: £750.00 (10.1%)

Corporate Bond Fund
Units: 150.00
Price: £53.00
Value: £7,950.00
Gain/Loss: £900.00 (12.8%)

TRANSACTIONS:
15/01/2025 - Monthly Investment - £500.00
15/02/2025 - Monthly Investment - £500.00
15/03/2025 - Monthly Investment - £500.00
31/03/2025 - Dividend Payment - £175.00`;
    }

    generateMortgageContent() {
        return `MORTGAGE STATEMENT
Account Number: MORT-12345678
Property Address: 123 Sample Street, London, UK
Statement Date: 31/05/2025

MORTGAGE DETAILS:
Original Loan Amount: £350,000.00
Current Balance: £320,450.00
Term Remaining: 22 years 5 months
Interest Rate: 4.25% (Fixed until 31/05/2027)
Monthly Payment: £1,750.00

PAYMENT SUMMARY (Last 12 months):
Total Paid: £21,000.00
Applied to Principal: £8,750.00
Applied to Interest: £12,250.00

EARLY REPAYMENT:
Early Repayment Charge: 3% until 31/05/2027
Overpayment Allowance: 10% of outstanding balance per year`;
    }

    generateTaxContent() {
        return `TAX SUMMARY
Tax Year: 2024/2025
Taxpayer: John Smith
National Insurance Number: AB123456C

INCOME:
Employment Income: £55,000.00
Savings Interest: £850.00
Dividend Income: £2,500.00
Total Income: £58,350.00

TAX CALCULATION:
Personal Allowance: £12,570.00
Basic Rate Tax (20%): £7,540.00
Higher Rate Tax (40%): £3,232.00
Dividend Tax: £437.50
Total Tax Due: £11,209.50

National Insurance Contributions: £4,521.60

TAX ALREADY PAID:
PAYE: £11,000.00
Tax on Savings Interest: £0.00 (within allowance)
Balance Due: £209.50`;
    }

    generateGenericFinancialContent() {
        return `FINANCIAL DOCUMENT
Date: 31/05/2025
Reference: FIN-12345

SUMMARY:
Income: £4,500.00 per month
Expenses: £3,200.00 per month
Savings: £1,300.00 per month

ASSETS:
Cash Savings: £15,000.00
Investments: £45,000.00
Property Equity: £120,000.00
Pension: £85,000.00
Total Assets: £265,000.00

LIABILITIES:
Mortgage: £320,000.00
Car Loan: £12,000.00
Credit Cards: £3,500.00
Total Liabilities: £335,500.00

Net Worth: -£70,500.00

GOALS:
Short-term: Build emergency fund of £15,000
Medium-term: Pay off credit card debt within 12 months
Long-term: Retirement at age 60 with pension pot of £500,000`;
    }
}

export default new DocumentProcessingService();
