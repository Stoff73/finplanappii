# MVP Implementation Plan for FinPlanAppII

This document outlines the plan to develop the Minimum Viable Product (MVP) for the FinPlanAppII application. It is based on an analysis of the existing codebase and aims to deliver core functionality for financial planning.

## 1. Current State Analysis

The application has a solid foundation:
*   **Frontend**: React-based SPA (`src/`) with component-based architecture, TailwindCSS for styling, and React Router for navigation. Key UI elements for chat, dashboard, and data management are present. State is managed via `AppContext.jsx`.
*   **Backend**: Node.js/Express server (`server/`) providing RESTful APIs for authentication, user data, financial data, goals, and messages.
*   **Database**: SQLite with Prisma ORM (`prisma/`) for data modeling and persistence. Migrations and a seed script are present.
*   **Core Logic**: Services for data extraction (`dataExtraction.js`), OpenAI interaction (`openai.js`), PDF generation (`pdfGenerator.js`), document processing (`documentProcessing.js`), and a planning engine (`planningEngine.js`) are in place.
*   **Environment**: Scripts for development (`npm run dev`), server management, and database operations are defined in `package.json`.

Initial setup encountered issues with dependencies, environment variables, and database migrations, which have been partially addressed.

## 2. MVP Feature Set

The MVP will focus on delivering the "MVP 1.0" features outlined in `src/pages/Home.jsx`, with an emphasis on ensuring backend integration and data persistence.

### Core MVP Features (to be fully functional and stable):
1.  **AI-Powered Financial Chat**:
    *   User interaction via `ChatInterface.jsx`.
    *   Natural language input for financial data (income, expenses, goals, assets, debts, risk tolerance).
    *   Basic AI responses and guidance (leveraging `openai.js` or fallbacks).
2.  **Goal Selection & Contextual Planning**:
    *   User selection of primary financial goals (e.g., Retirement, House Purchase) via UI in `ChatInterface.jsx`.
    *   Chat and data extraction adapt to the selected goal.
3.  **Data Extraction & Processing**:
    *   `dataExtraction.js` service to parse financial information from chat messages.
    *   Populate `extractedData` in `AppContext.jsx`.
4.  **Session & Data Persistence**:
    *   **Guest User Mode**: Automatic creation of a guest user session on app load.
    *   **Database Storage**: All user-specific data (messages, extracted financial data, goals, user profile) to be saved to the SQLite database via Prisma and backend APIs.
    *   Data should persist across browser sessions for the same guest user (if identifiable, or implement basic user login).
5.  **Financial Dashboard**:
    *   Display key financial summaries (`DataSummary.jsx`, `FinancialOverview.jsx`).
    *   Track progress towards selected financial goals (`GoalsTracker.jsx`).
    *   Basic charts to visualize financial data (`SimpleChart.jsx`).
    *   Profile completion score reflecting the amount of data provided (`ProfileCompletion.jsx`, `getCompletionScore` in `AppContext.jsx`).
6.  **PDF Export**:
    *   Generate an unformatted PDF of the user's financial plan (`PDFExport.jsx`, `pdfGenerator.js`).
    *   PDF generation gated by a profile completion threshold (e.g., 70%).
7.  **Basic Document Upload**:
    *   Allow users to upload documents via `ChatInterface.jsx`.
    *   Basic processing by `documentProcessing.js` (e.g., acknowledge upload, attempt text extraction if feasible for MVP).

### Deferred/Simplified for MVP:
*   Full user registration/authentication (guest mode is primary for MVP, basic login if time permits).
*   Advanced AI/multi-agent setup (focus on robust single AI interaction).
*   Fully formatted PDF plan (unformatted is acceptable for MVP).
*   Intelligent fact-find modal (data input primarily via chat).
*   Advanced financial insights (focus on accurate data display and basic insights).
*   Risk profile specialty agent & asset allocation engine (basic risk level capture is sufficient).
*   TTS/voice integration.

## 3. Identified Issues & Areas for Improvement

*   **Backend Stability & API Robustness**: Ensure all API endpoints are thoroughly tested and handle errors gracefully.
*   **Frontend-Backend Integration**: Verify seamless data flow between React components, `AppContext`, `api.js` service, and backend APIs.
*   **Data Extraction Accuracy**: Improve the reliability of `dataExtraction.js` to correctly parse various user inputs.
*   **State Management**: Ensure `AppContext.jsx` correctly manages and synchronizes state, especially `extractedData`, `user`, and `isAuthenticated`.
*   **Error Handling**: Implement comprehensive error handling on both frontend and backend.
*   **User Experience**: Ensure a smooth and intuitive user flow for the core MVP features.
*   **Code Quality**: Address critical ESLint warnings/errors that might affect functionality.

## 4. Step-by-Step Implementation Plan

### Phase 1: Environment, Backend Stabilization & Core APIs (1-2 days)
1.  **Verify Development Environment**:
    *   Ensure `npm install` completes successfully.
    *   Confirm `.env` (for backend) and `.env.local` (for frontend) are correctly configured with `DATABASE_URL`, `JWT_SECRET`, `PORT`, `REACT_APP_API_URL`.
    *   Ensure `npx prisma migrate dev --name init` (or subsequent migrations) runs successfully, and the database schema is current.
    *   Confirm `npm run dev` (or separate `npm run server:dev` and `npm start`) launches both backend and frontend without port conflicts or critical errors.
2.  **Backend Server & API Health**:
    *   Start the backend server (`npm run server:dev`).
    *   Verify connection to SQLite database is logged.
    *   Test `/api/health` endpoint.
3.  **Authentication API**:
    *   Test `POST /api/auth/guest`: Ensure successful guest user creation and JWT token return.
    *   *(Stretch Goal for MVP)* Test `POST /api/auth/register` and `POST /api/auth/login` if implementing basic user accounts.
4.  **Core Data APIs (Manual Testing - e.g., Postman)**:
    *   `POST /api/messages` (as guest/user): Save a message.
    *   `GET /api/messages` (as guest/user): Retrieve messages.
    *   `POST /api/financial-data` (as guest/user): Save extracted financial data.
    *   `GET /api/financial-data` (as guest/user): Retrieve financial data.
    *   `POST /api/goals` & `GET /api/goals` (as guest/user): Manage user goals.
    *   Ensure `authMiddleware` correctly protects routes.

### Phase 2: Frontend Core & Backend Integration (2-3 days)
1.  **Frontend Application Startup**:
    *   Start the frontend (`npm start`).
    *   Resolve any critical console errors preventing app load or core functionality.
2.  **Guest User Authentication Flow (Frontend)**:
    *   Verify `AppContext.jsx`'s `initializeApp` function:
        *   Calls `apiService.createGuestUser()`.
        *   Sets `user`, `isAuthenticated`, and token in `apiService` correctly.
        *   Handles errors if guest user creation fails (e.g., falls back to local storage mode if necessary, though DB persistence is preferred).
3.  **Chat Interface - Basic Interaction & Data Flow**:
    *   Send messages via `ChatInterface.jsx`.
    *   Confirm `addMessage` in `AppContext.jsx`:
        *   Updates local `messages` state.
        *   Calls `apiService.addMessage` to persist the message to the backend.
    *   Confirm `openAIService.sendMessage` is invoked. For MVP, ensure it handles offline/fallback responses gracefully if no API key is provided.
    *   Verify `dataExtractionService.extractFinancialData` is triggered after new user messages.
4.  **Data Persistence & Retrieval**:
    *   After chat interactions, verify in the SQLite database (e.g., using `npx prisma studio`) that:
        *   `User` record for guest is created.
        *   `Message` records are linked to the user.
        *   `Income`, `Expense`, `Goal`, `Asset`, `Debt`, `RiskProfile` tables are populated if `extractedData` contains relevant info and `saveFinancialData` in `AppContext.jsx` is working.
    *   On app reload, verify `loadUserData` in `AppContext.jsx` fetches persisted messages and financial data from the backend.

### Phase 3: MVP Feature Implementation & Verification (3-5 days)
1.  **Goal Selection & Contextual Data Handling**:
    *   In `ChatInterface.jsx`, test selecting different financial goals.
    *   Verify `selectedGoal` state in `AppContext.jsx` is updated.
    *   Ensure `dataExtractionService` and `openAIService` use `selectedGoal` to tailor processing and responses.
    *   Verify `goalProgress` in `AppContext.jsx` is calculated based on `extractedData` and `selectedGoal`.
2.  **Dashboard Functionality**:
    *   Navigate to `/dashboard`.
    *   Ensure `DataSummary.jsx`, `FinancialOverview.jsx`, `GoalsTracker.jsx`, and `SimpleChart.jsx` dynamically display data from `AppContext.jsx` (`extractedData`, `goalProgress`, `insights`).
    *   Verify `getCompletionScore()` accurately reflects the completeness of the user's financial profile.
3.  **PDF Export**:
    *   Input sufficient data via chat to meet the completion threshold (e.g., 70%).
    *   Navigate to `/export`.
    *   Click "Generate Financial Plan PDF".
    *   Verify `pdfGenerator.js` is called with correct data.
    *   Ensure a PDF is downloaded and contains a basic, unformatted summary of the user's financial data and goals.
4.  **Document Upload (Basic)**:
    *   Use the file upload feature in `ChatInterface.jsx`.
    *   Confirm `documentProcessingService.processDocument` is called.
    *   MVP: Ensure the uploaded file is acknowledged in the chat. Basic text extraction and adding to `extractedData` is a plus if straightforward.
5.  **Data Management & Settings (Minimal)**:
    *   Ensure `DataManager.jsx` (if used for MVP) allows basic viewing or clearing of data.
    *   `/settings` page: For MVP, this can be a placeholder or offer a "Clear All Data" option that works with `AppContext.jsx` and backend.

### Phase 4: Testing, Refinement & Bug Fixing (2-3 days)
1.  **End-to-End Testing**:
    *   Complete user flow: App load (guest user) -> Select Goal -> Chat to input diverse financial data -> View Dashboard updates -> Export PDF.
    *   Test edge cases (e.g., incorrect input, API errors).
2.  **Bug Fixing**: Address critical bugs identified during development and testing.
3.  **Code Cleanup**:
    *   Review and fix major ESLint warnings (especially `react-hooks/exhaustive-deps` if causing issues).
    *   Remove unused code, console logs.
4.  **Basic Responsive Checks**: Ensure usability on common screen sizes (desktop, tablet, mobile).
5.  **Final MVP Review**: Ensure all defined MVP 1.0 features are working as expected.

## 5. Key Technologies & Services Involved
*   **Frontend**: React, React Router, TailwindCSS, Lucide Icons, Recharts
*   **Backend**: Node.js, Express.js
*   **Database**: SQLite, Prisma
*   **State Management**: React Context API (`AppContext.jsx`)
*   **Core Logic Services**:
    *   `api.js` (frontend API client)
    *   `dataExtraction.js`
    *   `openai.js`
    *   `pdfGenerator.js` (using `jspdf`, `html2canvas`)
    *   `documentProcessing.js`
    *   `planningEngine.js`

## 6. Success Criteria for MVP
*   Users can complete the primary financial planning flow via chat.
*   Financial data is correctly extracted, persisted to the database, and reflected in the dashboard.
*   A basic PDF financial plan can be exported.
*   The application is stable and handles common errors gracefully.
*   The core architecture supports future feature enhancements (MVP 1.1).

This plan provides a roadmap. Flexibility will be required as development progresses and new insights are gained.
