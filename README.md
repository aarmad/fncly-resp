# Personal Finance Manager

A full-stack application for managing personal finances.

## Stack
- **Backend**: Laravel 11 (API, Sanctum Auth, DomPDF)
- **Frontend**: Vue 3 (Vite, Pinia, Router, TailwindCSS)
- **Database**: MySQL

## Installation

### 1. Database
Create a MySQL database named `fncly_resp` (or match what is in `backend/.env`).

### 2. Backend Setup
1. Open a terminal in `backend/`.
2. Install dependencies (if not fully installed):
   ```sh
   composer install
   ```
3. Set up environment:
   ```sh
   cp .env.example .env
   php artisan key:generate
   ```
   *Edit `.env` to set your database credentials.*
4. Run migrations:
   ```sh
   php artisan migrate
   ```
5. Start the server:
   ```sh
   php artisan serve
   ```
   (Runs on http://localhost:8000)

### 3. Frontend Setup
1. Open a terminal in `frontend/`.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the dev server:
   ```sh
   npm run dev
   ```
   (Runs on http://localhost:5173 or similar)

## Features
- **Auth**: Register (seeds default categories) & Login.
- **Dashboard**: View Balance, Income, Expenses.
- **Charts**: Placeholder structure for charts.
- **Reports**: Export monthly report to PDF.
- **Transactions**: API endpoints ready for CRUD (Frontend UI focuses on Dashboard stats).
