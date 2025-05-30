// src/services/documentProcessing.js
class DocumentProcessingService {
    constructor() {
        this.supportedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        // Financial document patterns for text extraction
        this.financialPatterns = {
            income: {
                salary: /(?:salary|annual\s+income|gross\s+pay|yearly\s+earnings?):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
                monthly: /(?:monthly\s+income|monthly\s+salary):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
                pension: /(?:pension|retirement\s+income):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
                benefits: /(?:benefits?|allowances?):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi
            },
            expenses: {
                rent: /(?:rent|rental\s+payment):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
                mortgage: /(?:mortgage\s+payment|mortgage):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
                utilities: /(?:utilities|gas\s+electric|energy\s+bills?):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
                insurance: /(?:insurance|life\s+insurance|car\s+insurance):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
                food: /(?:food|groceries|shopping):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
                transport: /(?:transport|car\s+costs|travel):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi
            },
            assets: {
                savings: /(?:savings|cash\s+savings|deposit):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
                investments: /(?:investments?|portfolio|shares|stocks):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
                pension: /(?:pension\s+pot|pension\s+value|retirement\s+savings):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
                property: /(?:property\s+value|house\s+value|real\s+estate):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi
            },
            debts: {
                creditCard: /(?:credit\s+card|card\s+debt|outstanding\s+balance):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
                loan: /(?:personal\s+loan|loan\s+balance|outstanding\s+loan):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi,
                mortgage: /(?:mortgage\s+balance|outstanding\s+mortgage):\s*[£$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/gi
            }
        };

        // UK-specific financial document types
        this.documentTypes = {
            payslip: {
                patterns: [/pay\s*slip/i, /salary\s*statement/i, /pay\s*statement/i],
                expectedData: ['salary', 'tax', 'ni', 'pension']
            },
            bankStatement: {
                patterns: [/bank\s*statement/i, /account\s*statement/i, /current\s*account/i],
                expectedData: ['balance', 'income', 'expenses', 'transactions']
            },
            pensionStatement: {
                patterns: [/pension\s*statement/i, /retirement\s*savings/i, /pension\s*pot/i],
                expectedData: ['pensionValue', 'contributions', 'growth']
            },
            mortgageStatement: {
                patterns: [/mortgage\s*statement/i, /home\s*loan/i, /property\s*loan/i],
                expectedData: ['balance', 'monthlyPayment', 'rate', 'term']
            },
            investmentStatement: {
                patterns: [/investment\s*statement/i, /portfolio\s*statement/i, /isa\s*statement/i],
                expectedData: ['value', 'growth', 'dividends', 'fees']
            },
            creditStatement: {
                patterns: [/credit\s*card/i, /loan\s*statement/i, /debt\s*statement/i],
                expectedData: ['balance', 'minimumPayment', 'rate', 'limit']
            }
        };
    }

    async processDocument(file, goalContext = null) {
        try {
            console.log('📄 Processing document:', file.name, 'Size:', file.size);

            // Validate file type
            if (!this.supportedTypes.includes(file.type)) {
                throw new Error(`Unsupported file type: ${file.type}`);
            }

            // Validate file size (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error('File size too large. Maximum 10MB allowed.');
            }

            let extractedText = '';
            let documentType = this.identifyDocumentType(file.name);

            // Extract text based on file type
            switch (file.type) {
                case 'text/plain':
                    extractedText = await this.extractTextFromTxt(file);
                    break;
                case 'text/csv':
                    return await this.processCSV(file, goalContext);
                case 'application/vnd.ms-excel':
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                    return await this.processExcel(file, goalContext);
                case 'application/pdf':
                    extractedText = await this.extractTextFromPDF(file);
                    break;
                case 'application/msword':
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    extractedText = await this.extractTextFromWord(file);
                    break;
                default:
                    throw new Error('Unsupported document type for processing');
            }

            // Extract financial data from text
            const extractedData = this.extractFinancialDataFromText(extractedText, documentType);

            // Add goal context if provided
            if (goalContext) {
                extractedData.goalContext = goalContext;
                extractedData.relevanceScore = this.calculateRelevanceScore(extractedData, goalContext);
            }

            return {
                success: true,
                fileName: file.name,
                fileType: file.type,
                documentType: documentType,
                extractedData: extractedData,
                rawText: extractedText.substring(0, 1000), // First 1000 chars for reference
                processingDate: new Date().toISOString()
            };

        } catch (error) {
            console.error('Document processing error:', error);
            return {
                success: false,
                error: error.message,
                fileName: file.name,
                fileType: file.type
            };
        }
    }

    identifyDocumentType(filename) {
        const lowerName = filename.toLowerCase();

        for (const [type, config] of Object.entries(this.documentTypes)) {
            if (config.patterns.some(pattern => pattern.test(lowerName))) {
                return type;
            }
        }

        // Default classification based on common keywords
        if (/pay|salary|wage/.test(lowerName)) return 'payslip';
        if (/bank|account|statement/.test(lowerName)) return 'bankStatement';
        if (/pension|retirement/.test(lowerName)) return 'pensionStatement';
        if (/mortgage|loan/.test(lowerName)) return 'mortgageStatement';
        if (/investment|portfolio|isa/.test(lowerName)) return 'investmentStatement';
        if (/credit|debt/.test(lowerName)) return 'creditStatement';

        return 'general';
    }

    async extractTextFromTxt(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(new Error('Failed to read text file'));
            reader.readAsText(file);
        });
    }

    async extractTextFromPDF(file) {
        // Note: This would require pdf.js library in a full implementation
        // For now, return a placeholder that suggests manual input
        return `PDF document detected: ${file.name}. 
        
PDF text extraction would require additional libraries. For now, please manually share the key financial information from this document.

Common information to look for:
- Income amounts and frequency
- Monthly expenses and categories  
- Account balances and values
- Loan balances and payment amounts
- Interest rates and terms`;
    }

    async extractTextFromWord(file) {
        // Note: This would require mammoth.js or similar library
        // For now, return a placeholder
        return `Word document detected: ${file.name}.
        
Word document processing would require additional libraries. Please manually share the key financial figures from this document.`;
    }

    async processCSV(file, goalContext) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const csvData = this.parseCSV(e.target.result);
                    const financialData = this.extractFinancialDataFromCSV(csvData, goalContext);
                    resolve({
                        success: true,
                        fileName: file.name,
                        documentType: 'csv',
                        extractedData: financialData,
                        rowCount: csvData.length
                    });
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Failed to read CSV file'));
            reader.readAsText(file);
        });
    }

    async processExcel(file, goalContext) {
        // Placeholder for Excel processing
        return {
            success: true,
            fileName: file.name,
            documentType: 'excel',
            extractedData: {
                message: 'Excel processing would require SheetJS library. Please manually enter the financial data from your spreadsheet.'
            },
            note: 'Excel processing not fully implemented in this version'
        };
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }

        return data;
    }

    extractFinancialDataFromText(text, documentType) {
        const extractedData = {
            income: [],
            expenses: [],
            assets: [],
            debts: [],
            documentType: documentType,
            confidence: 'medium'
        };

        // Extract income data
        Object.entries(this.financialPatterns.income).forEach(([type, pattern]) => {
            const matches = [...text.matchAll(pattern)];
            matches.forEach(match => {
                const amount = this.parseAmount(match[1]);
                if (amount > 0) {
                    extractedData.income.push({
                        type: type,
                        amount: amount,
                        text: match[0],
                        source: 'document'
                    });
                }
            });
        });

        // Extract expense data
        Object.entries(this.financialPatterns.expenses).forEach(([type, pattern]) => {
            const matches = [...text.matchAll(pattern)];
            matches.forEach(match => {
                const amount = this.parseAmount(match[1]);
                if (amount > 0) {
                    extractedData.expenses.push({
                        type: type,
                        amount: amount,
                        text: match[0],
                        source: 'document'
                    });
                }
            });
        });

        // Extract asset data
        Object.entries(this.financialPatterns.assets).forEach(([type, pattern]) => {
            const matches = [...text.matchAll(pattern)];
            matches.forEach(match => {
                const amount = this.parseAmount(match[1]);
                if (amount > 0) {
                    extractedData.assets.push({
                        type: type,
                        amount: amount,
                        text: match[0],
                        source: 'document'
                    });
                }
            });
        });

        // Extract debt data
        Object.entries(this.financialPatterns.debts).forEach(([type, pattern]) => {
            const matches = [...text.matchAll(pattern)];
            matches.forEach(match => {
                const amount = this.parseAmount(match[1]);
                if (amount > 0) {
                    extractedData.debts.push({
                        type: type,
                        amount: amount,
                        text: match[0],
                        source: 'document'
                    });
                }
            });
        });

        // Set confidence based on amount of data extracted
        const totalExtractions = extractedData.income.length + extractedData.expenses.length +
            extractedData.assets.length + extractedData.debts.length;

        if (totalExtractions >= 5) {
            extractedData.confidence = 'high';
        } else if (totalExtractions >= 2) {
            extractedData.confidence = 'medium';
        } else {
            extractedData.confidence = 'low';
        }

        return extractedData;
    }

    extractFinancialDataFromCSV(csvData, goalContext) {
        const extractedData = {
            income: [],
            expenses: [],
            assets: [],
            debts: [],
            transactions: [],
            documentType: 'csv',
            confidence: 'high'
        };

        // Common CSV column patterns
        const columnPatterns = {
            date: /date|transaction\s*date|posting\s*date/i,
            description: /description|memo|detail|transaction\s*type/i,
            amount: /amount|value|debit|credit|balance/i,
            category: /category|type|classification/i
        };

        // Identify columns
        const headers = Object.keys(csvData[0] || {});
        const columnMap = {};

        Object.entries(columnPatterns).forEach(([key, pattern]) => {
            const matchingHeader = headers.find(header => pattern.test(header));
            if (matchingHeader) {
                columnMap[key] = matchingHeader;
            }
        });

        // Process rows if we have basic structure
        if (columnMap.description && columnMap.amount) {
            csvData.forEach((row, index) => {
                const description = row[columnMap.description] || '';
                const amountStr = row[columnMap.amount] || '0';
                const amount = Math.abs(this.parseAmount(amountStr));
                const category = row[columnMap.category] || '';

                if (amount > 0 && description) {
                    // Categorize based on description
                    const transactionType = this.categorizeTransaction(description, category);

                    const transactionData = {
                        description: description,
                        amount: amount,
                        category: transactionType.category,
                        type: transactionType.type,
                        source: 'csv',
                        rowNumber: index + 1
                    };

                    if (transactionType.type === 'income') {
                        extractedData.income.push(transactionData);
                    } else if (transactionType.type === 'expense') {
                        extractedData.expenses.push(transactionData);
                    }

                    extractedData.transactions.push(transactionData);
                }
            });
        }

        return extractedData;
    }

    categorizeTransaction(description, category) {
        const desc = description.toLowerCase();
        const cat = category.toLowerCase();

        // Income patterns
        if (/salary|wage|pay|income|deposit|transfer\s*in/i.test(desc) ||
            /income|salary|wage/i.test(cat)) {
            return { type: 'income', category: 'salary' };
        }

        // Expense patterns
        const expensePatterns = {
            housing: /rent|mortgage|utilities|council\s*tax|insurance/i,
            food: /supermarket|grocery|food|restaurant|takeaway|tesco|sainsbury|asda/i,
            transport: /fuel|petrol|parking|train|bus|uber|taxi|car/i,
            entertainment: /cinema|netflix|spotify|entertainment|pub|bar/i,
            shopping: /amazon|shopping|retail|clothes|argos/i,
            utilities: /electric|gas|water|internet|phone|mobile/i
        };

        for (const [expenseType, pattern] of Object.entries(expensePatterns)) {
            if (pattern.test(desc) || pattern.test(cat)) {
                return { type: 'expense', category: expenseType };
            }
        }

        // Default to expense for most transactions
        return { type: 'expense', category: 'other' };
    }

    parseAmount(amountStr) {
        if (!amountStr) return 0;

        // Remove currency symbols and spaces
        const cleaned = amountStr.toString()
            .replace(/[£$€,\s]/g, '')
            .replace(/[()]/g, ''); // Remove parentheses for negative amounts

        const amount = parseFloat(cleaned);
        return isNaN(amount) ? 0 : amount;
    }

    calculateRelevanceScore(extractedData, goalContext) {
        if (!goalContext) return 50;

        const goalRelevance = {
            retirement: {
                income: 30,
                expenses: 20,
                assets: 25,
                debts: 10,
                pension: 35
            },
            house: {
                income: 35,
                expenses: 25,
                assets: 20,
                debts: 15,
                mortgage: 25
            },
            emergency: {
                expenses: 40,
                assets: 30,
                income: 20,
                debts: 10
            },
            investment: {
                assets: 35,
                income: 25,
                expenses: 15,
                debts: 10,
                portfolio: 30
            },
            debt: {
                debts: 40,
                income: 25,
                expenses: 20,
                assets: 15
            }
        };

        const weights = goalRelevance[goalContext] || {};
        let relevanceScore = 0;
        let totalWeight = 0;

        Object.entries(weights).forEach(([category, weight]) => {
            if (extractedData[category] && extractedData[category].length > 0) {
                relevanceScore += weight;
            }
            totalWeight += weight;
        });

        return totalWeight > 0 ? Math.round((relevanceScore / totalWeight) * 100) : 50;
    }

    generateProcessingSummary(result) {
        if (!result.success) {
            return `❌ Failed to process ${result.fileName}: ${result.error}`;
        }

        const data = result.extractedData;
        const counts = {
            income: data.income?.length || 0,
            expenses: data.expenses?.length || 0,
            assets: data.assets?.length || 0,
            debts: data.debts?.length || 0
        };

        const totalItems = Object.values(counts).reduce((sum, count) => sum + count, 0);

        if (totalItems === 0) {
            return `📄 Processed ${result.fileName} but couldn't extract financial data automatically. Please manually share the key figures from this document.`;
        }

        let summary = `✅ Successfully processed ${result.fileName}\n\nExtracted:\n`;

        if (counts.income > 0) summary += `• ${counts.income} income items\n`;
        if (counts.expenses > 0) summary += `• ${counts.expenses} expense items\n`;
        if (counts.assets > 0) summary += `• ${counts.assets} asset items\n`;
        if (counts.debts > 0) summary += `• ${counts.debts} debt items\n`;

        if (data.confidence) {
            summary += `\nConfidence: ${data.confidence}`;
        }

        if (data.relevanceScore) {
            summary += `\nRelevance to your goal: ${data.relevanceScore}%`;
        }

        return summary;
    }
}

export default new DocumentProcessingService();