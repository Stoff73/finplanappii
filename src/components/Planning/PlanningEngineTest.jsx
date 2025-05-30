import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import planningEngine from '../../services/planningEngine';
import { Calculator, CheckCircle, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

const PlanningEngineTest = () => {
    const { extractedData, selectedGoal } = useApp();
    const [testResults, setTestResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const runPlanningEngineTest = async () => {
        setIsLoading(true);

        try {
            // Test data for planning engine
            const testFinancialData = {
                income: [
                    {
                        text: "£55,000 per year salary",
                        amounts: [55000],
                        frequency: "yearly",
                        category: "employment"
                    }
                ],
                expenses: [
                    {
                        text: "£1,200 per month rent",
                        amounts: [1200],
                        frequency: "monthly",
                        category: "housing"
                    },
                    {
                        text: "£800 per month other expenses",
                        amounts: [800],
                        frequency: "monthly",
                        category: "other"
                    }
                ],
                goals: [
                    {
                        text: "Retire at 65",
                        type: ["retirement"],
                        amounts: [],
                        timeframes: [{ value: 30, unit: "years" }]
                    }
                ],
                riskTolerance: {
                    text: "Medium risk investor",
                    level: "medium"
                },
                assets: [
                    {
                        text: "£25,000 pension savings",
                        amounts: [25000],
                        type: "pension"
                    }
                ]
            };

            // Test different goal types
            const goalTypes = ['retirement', 'saving', 'investment', 'protection', 'comprehensive'];
            const results = {};

            for (const goalType of goalTypes) {
                console.log(`🧪 Testing planning engine for goal: ${goalType}`);
                const result = planningEngine.generateFinancialPlan(goalType, testFinancialData);
                results[goalType] = result;
            }

            // Test individual components
            const incomeNormalization = planningEngine.normalizeIncome(testFinancialData.income);
            const expenseNormalization = planningEngine.normalizeExpenses(testFinancialData.expenses);
            const taxCalculation = planningEngine.calculateTaxAndNI(55000);

            setTestResults({
                goalResults: results,
                incomeTest: incomeNormalization,
                expenseTest: expenseNormalization,
                taxTest: taxCalculation,
                engineStatus: planningEngine.getEngineStatus()
            });

        } catch (error) {
            console.error('Planning engine test failed:', error);
            setTestResults({ error: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    const testWithCurrentData = () => {
        if (!extractedData || !selectedGoal) {
            alert('Please select a goal and enter some financial data first');
            return;
        }

        setIsLoading(true);
        try {
            const result = planningEngine.generateFinancialPlan(selectedGoal.id, extractedData);
            setTestResults({
                currentDataTest: result,
                engineStatus: planningEngine.getEngineStatus()
            });
        } catch (error) {
            console.error('Current data test failed:', error);
            setTestResults({ error: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Calculator className="w-6 h-6 text-blue-600" />
                <span>Planning Engine Test</span>
            </h3>

            <div className="space-y-4 mb-6">
                <button
                    onClick={runPlanningEngineTest}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
                >
                    {isLoading ? 'Running Tests...' : 'Run Full Planning Engine Test'}
                </button>

                <button
                    onClick={testWithCurrentData}
                    disabled={isLoading || !extractedData || !selectedGoal}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
                >
                    {isLoading ? 'Testing...' : 'Test with Current Data'}
                </button>
            </div>

            {testResults && (
                <div className="space-y-6">
                    {/* Engine Status */}
                    {testResults.engineStatus && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Engine Status</h4>
                            <div className="text-sm text-blue-800 space-y-1">
                                <div>Version: {testResults.engineStatus.version}</div>
                                <div>Tax Year: {testResults.engineStatus.taxYear}</div>
                                <div>Supported Goals: {testResults.engineStatus.supportedGoals.join(', ')}</div>
                            </div>
                        </div>
                    )}

                    {/* Error Display */}
                    {testResults.error && (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center space-x-2 mb-2">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                                <span className="font-semibold text-red-900">Test Failed</span>
                            </div>
                            <div className="text-sm text-red-800">{testResults.error}</div>
                        </div>
                    )}

                    {/* Tax Calculation Test */}
                    {testResults.taxTest && (
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                                <CheckCircle className="w-5 h-5" />
                                <span>UK Tax Calculation Test (£55,000 salary)</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm text-green-800">
                                <div>Income Tax: £{testResults.taxTest.incomeTax.toLocaleString()}</div>
                                <div>National Insurance: £{testResults.taxTest.nationalInsurance.toLocaleString()}</div>
                                <div>Total Deductions: £{testResults.taxTest.totalDeductions.toLocaleString()}</div>
                                <div>Effective Rate: {testResults.taxTest.effectiveRate}%</div>
                            </div>
                        </div>
                    )}

                    {/* Income Normalization Test */}
                    {testResults.incomeTest && (
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5" />
                                <span>Income Normalization Test</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm text-green-800">
                                <div>Monthly Gross: £{testResults.incomeTest.monthlyGross.toLocaleString()}</div>
                                <div>Monthly Net: £{testResults.incomeTest.monthlyNet.toLocaleString()}</div>
                                <div>Annual Gross: £{testResults.incomeTest.annualGross.toLocaleString()}</div>
                                <div>Annual Net: £{testResults.incomeTest.annualNet.toLocaleString()}</div>
                            </div>
                        </div>
                    )}

                    {/* Expense Normalization Test */}
                    {testResults.expenseTest && (
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2 flex items-center space-x-2">
                                <DollarSign className="w-5 h-5" />
                                <span>Expense Normalization Test</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-4 text-sm text-green-800">
                                <div>Monthly Total: £{testResults.expenseTest.monthlyTotal.toLocaleString()}</div>
                                <div>Annual Total: £{testResults.expenseTest.annualTotal.toLocaleString()}</div>
                                <div>Categories: {Object.keys(testResults.expenseTest.categories).length}</div>
                                <div>Items: {testResults.expenseTest.breakdown.length}</div>
                            </div>
                        </div>
                    )}

                    {/* Goal-Specific Test Results */}
                    {testResults.goalResults && (
                        <div className="space-y-4">
                            <h4 className="font-semibold text-gray-900">Goal-Specific Planning Tests</h4>
                            {Object.entries(testResults.goalResults).map(([goalType, result]) => (
                                <div key={goalType} className="p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-gray-900 capitalize">{goalType} Planning</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {result.success ? 'Success' : 'Failed'}
                                        </span>
                                    </div>
                                    {result.success ? (
                                        <div className="text-sm text-gray-700">
                                            <div>✓ Plan generated successfully</div>
                                            {result.plan.insights && <div>✓ {result.plan.insights.length} insights generated</div>}
                                            {result.plan.actionItems && <div>✓ {result.plan.actionItems.length} action items created</div>}
                                            {result.plan.financialHealth && <div>✓ Financial health score: {result.plan.financialHealth.score}/100</div>}
                                        </div>
                                    ) : (
                                        <div className="text-sm text-red-700">
                                            {result.errors?.map((error, idx) => (
                                                <div key={idx}>✗ {error}</div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Current Data Test Results */}
                    {testResults.currentDataTest && (
                        <div className="p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-semibold text-purple-900 mb-2">Current Data Test Results</h4>
                            {testResults.currentDataTest.success ? (
                                <div className="text-sm text-purple-800">
                                    <div>✓ Plan generated for {selectedGoal?.label}</div>
                                    {testResults.currentDataTest.plan.financialHealth && (
                                        <div>✓ Financial health score: {testResults.currentDataTest.plan.financialHealth.score}/100</div>
                                    )}
                                    {testResults.currentDataTest.plan.insights && (
                                        <div>✓ {testResults.currentDataTest.plan.insights.length} insights generated</div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-sm text-red-800">
                                    {testResults.currentDataTest.errors?.map((error, idx) => (
                                        <div key={idx}>✗ {error}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PlanningEngineTest;