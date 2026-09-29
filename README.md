# Charmz.ai 💜

> AI-powered financial intelligence for small businesses, freelancers, and side hustlers.

Charmz.ai is a financial intelligence platform designed to help people understand their money beyond simply checking their bank balance.

Instead of acting as traditional accounting software, Charmz.ai turns financial data into practical insights around cash flow, spending, financial risk, upcoming obligations, and business health.

The project is being developed with **Investec Programmable Banking** to explore how real banking data can power a more intelligent financial experience.

---

## 🚀 Why Charmz.ai?

Many small business owners, freelancers, and side hustlers can see how much money is currently in their account—but that doesn't necessarily tell them:

- How much money is actually safe to spend
- Whether upcoming expenses can be covered
- How much should be reserved for tax
- Whether cash flow is improving or deteriorating
- Which spending patterns are creating risk
- How long their current cash position can support the business
- What financial actions they should consider next

Charmz.ai aims to bridge that gap.

### From:

**"How much money do I have?"**

### To:

**"What does my financial position actually mean, and what should I pay attention to?"**

---

## 🎯 Problem

Financial information is often fragmented across:

- Bank accounts
- Transaction histories
- Spreadsheets
- Accounting software
- Invoices
- Receipts
- Personal calculations

This can make it difficult for small businesses and independent workers to develop a clear picture of their financial health.

Charmz.ai explores how banking data and AI can be combined to provide a simpler financial intelligence layer.

---

## 💡 Solution

Charmz.ai connects financial data with an intelligence layer that can help users understand:

### 💰 Cash Flow

Understand money coming in and going out over time.

### 📊 Spending Intelligence

Identify important spending patterns and changes.

### 🧾 Financial Reserves

Help users think about money that may need to be set aside for upcoming obligations.

### ⚠️ Risk Signals

Highlight financial patterns that may require attention.

### 📈 Financial Forecasting

Use historical financial activity to provide an indication of possible future cash-flow conditions.

### 🤖 AI Financial Intelligence

Allow users to ask questions about their financial data and receive contextual insights.

---

# 🏗️ Product Architecture

Charmz.ai is built around the following flow:

```text
                    ┌─────────────────────┐
                    │       User          │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Charmz.ai      │
                    │     Application     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Financial Data Layer│
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 │                           │
                 ▼                           ▼
       ┌──────────────────┐       ┌──────────────────┐
       │ Investec         │       │ Other supported  │
       │ Programmable     │       │ data sources     │
       │ Banking          │       │ / imports        │
       └────────┬─────────┘       └────────┬─────────┘
                │                          │
                └────────────┬─────────────┘
                             ▼
                  ┌─────────────────────┐
                  │ Data Processing &   │
                  │ Financial Analysis  │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ AI Intelligence     │
                  │ Layer               │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Insights & Actions  │
                  └─────────────────────┘



Core Features
1. Financial Dashboard
A central view of the user's financial position.
Planned/implemented information includes:
Current balance
Income
Expenses
Cash-flow trends
Financial alerts
Key financial indicators
2. Transaction Intelligence
Charmz.ai processes transaction information to help users understand their financial activity.
Examples include:
Income identification
Expense categorisation
Recurring transactions
Spending patterns
Cash-flow trends
3. AI Financial Insights
Charmz.ai uses AI to turn financial information into understandable insights.
Example questions:
"How much did I spend this month?"

"Why has my cash flow decreased?"

"What are my biggest expense categories?"

"How much money should I be careful about spending?"

"What financial patterns changed this month?"
AI responses should be grounded in the user's available financial data rather than generating unsupported financial claims.
🔐 Security Principles
Charmz.ai is designed with security and privacy in mind.
The application follows principles including:
Server-side handling of sensitive credentials
Environment variables for secrets
Authentication
Authorisation
Least-privilege access
Database access controls
Row-level security where applicable
Input validation
Rate limiting where implemented
Audit logging where implemented
Security features listed above should only be marked as implemented when they are actually implemented in the current codebase.




