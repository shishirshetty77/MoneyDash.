# Personal Finance Tracker

A comprehensive personal finance management application built with Next.js, TypeScript, and Tailwind CSS. Track your income, expenses, savings goals, and visualize your financial data with interactive charts—all without requiring an account or backend integration.

## Features

### 📊 Transaction Management
- Add income and expense transactions with detailed categorization
- Automatic amount handling (positive for income, negative for expenses)
- Filter transactions by category and date range
- Delete transactions as needed
- Export all transaction data as CSV

### 📈 Visual Analytics
- Monthly summary showing total income, expenses, and net savings
- Interactive pie chart for expense breakdown by category
- Bar chart comparing monthly income vs expenses over time
- Dynamic charts that update as you add or filter transactions

### 🎯 Savings Goals
- Set multiple savings goals with target amounts and deadlines
- Track progress with visual progress bars
- Add or withdraw money from goals
- Automatic deadline tracking with overdue notifications
- Congratulatory messages for completed goals

### 🎨 User Experience
- Dark/Light mode toggle with persistent preference
- Fully responsive design for desktop and mobile
- Clean, intuitive interface
- Local data persistence using browser localStorage
- No account or signup required

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How to Use

### Adding Transactions
1. Click "Add Transaction" on the dashboard
2. Fill in the transaction details:
   - **Description**: What the transaction was for (e.g., "Groceries")
   - **Amount**: The monetary amount
   - **Type**: Select "Income" or "Expense"
   - **Category**: Choose from predefined categories (Food, Salary, Entertainment, etc.)
   - **Date**: When the transaction occurred
3. Click "Add Transaction" to save

### Viewing Your Data
- **Transaction List**: View all transactions with color-coded amounts (green for income, red for expenses)
- **Monthly Summary**: See your financial overview for any selected month
- **Charts**: Visualize spending patterns and income trends
- **Filters**: Use category and date filters to focus on specific data

### Managing Savings Goals
1. Navigate to the "Savings Goals" section
2. Click "Add New Goal"
3. Set your goal details:
   - **Goal Name**: What you're saving for
   - **Target Amount**: How much you want to save
   - **Deadline**: When you want to reach the goal
   - **Category**: Type of goal for organization
4. Add or withdraw money as you progress toward your goal

### Exporting Data
- Click the "Export CSV" button to download all your transaction data
- Use the CSV file with spreadsheet applications or other financial tools

## Data Storage

All your data is stored locally in your browser using `localStorage`. This means:
- ✅ No account required
- ✅ Data persists across browser sessions
- ✅ Complete privacy—your data never leaves your device
- ⚠️ Data is tied to your specific browser and device
- ⚠️ Clearing browser data will remove your financial records

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org) with App Router
- **Language**: TypeScript for type safety
- **Styling**: [Tailwind CSS](https://tailwindcss.com) for responsive design
- **Charts**: [Recharts](https://recharts.org) for data visualization
- **Icons**: Lucide React for consistent iconography
- **Storage**: Browser localStorage for data persistence

## Project Structure

```
finance-tracker/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main application page
├── components/
│   ├── AddTransaction.tsx   # Transaction input form
│   ├── TransactionList.tsx  # Transaction display and filtering
│   ├── MonthlySummary.tsx   # Financial summary component
│   ├── Charts.tsx           # Data visualization components
│   └── SavingsGoals.tsx     # Savings goal management
├── lib/
│   └── utils.ts            # Utility functions
└── types/
    └── finance.ts          # TypeScript type definitions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
