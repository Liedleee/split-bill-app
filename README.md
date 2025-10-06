FINANCIA - A Financial Tracker for University Students
<p align="center">
<img src="public/log.png" alt="Financia Logo" width="150"/>
</p>

<p align="center">
A modern full-stack web application designed to help university students manage their personal finances with ease and efficiency. Track expenses, manage debts and IOUs, and split bills with friends—all in one intuitive, real-time platform.
</p>

<p align="center">
<a href="[INSERT_YOUR_VERCEL_DEPLOYMENT_LINK_HERE]"><strong>View Live Demo »</strong></a>
</p>

Background
As a university student, managing a limited budget is often a challenge. Disorganized notes, forgetting to collect debts from friends, and the complicated process of splitting costs are common problems I faced myself. The FINANCIA project was born out of a personal need to create a tool that not only records transactions but also provides insights and makes it easy to take control of one's personal finances.

This application was built from scratch as a practical solution to these problems, featuring a clean, modern interface focused on the most relevant features for student life.

Key Features
Secure User Authentication: A safe registration and login system using email/password, powered by Supabase Auth with email verification.

Interactive Expense Dashboard:

Quick Summary: Informative cards displaying today's and this month's total expenses.

Data Visualization: A line chart showing the spending trend over the last 7 days to help identify spending patterns.

Real-Time Logging: Add and delete expense records with instant UI updates without needing to refresh the page.

Debt & IOU Management:

Log debts (you owe someone) and IOUs (someone owes you) with contact details and descriptions.

Mark entries as "Paid" or "Unpaid" with real-time status updates.

Delete paid-off entries to keep the list clean.

Bill Splitting Calculator: A practical utility to calculate how to split a bill fairly and quickly, complete with an option to include tax (VAT).

Responsive Design & Dark Mode: A layout that adapts seamlessly across various devices (desktop and mobile) and supports the user's operating system preference for light or dark themes.

Smooth Animations: Page transitions and UI element animations built with Framer Motion to provide a more premium user experience.

Tech Stack
This application is built using a modern tech stack focused on developer experience and performance.

Category

Technology

Description

Frontend

React.js (Vite)

The main UI library for building a reactive, component-based user interface.

Styling

Tailwind CSS

A utility-first CSS framework for rapid, consistent, and responsive design.

Animation

Framer Motion

An animation library for creating smooth transitions and dynamic interactions.

Charts

Chart.js

A library for creating interactive and informative charts.

Backend

Supabase

A Backend as a Service (BaaS) platform that provides all backend functionalities.

Database

PostgreSQL

A powerful relational database for storing all application data.

API & Realtime

Supabase API

An API to interact with the database and subscribe to data changes in real-time.

Authentication

Supabase Auth

A service to manage user registration, login, and data security.

Deployment

Vercel

A platform for automatically deploying the application from a GitHub repository (CI/CD).

Running the Project Locally
To run this project on your computer, follow these steps:

Clone this repository:

git clone [https://github.com/Liedleee/split-bill-app.git](https://github.com/Liedleee/split-bill-app.git)
cd financia-app

Install all dependencies:

npm install

Set up the .env.local file:
Create a file named .env.local in the project's root folder and fill it with your Supabase credentials:

VITE_SUPABASE_URL="YOUR_SUPABASE_PROJECT_URL"
VITE_SUPABASE_ANON_KEY="YOUR_SUPABASE_ANON_KEY"

Run the development server:

npm run dev
