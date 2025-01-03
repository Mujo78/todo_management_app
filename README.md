# Todo Management App

Todo Management App is an intuitive and efficient application designed for managing tasks (todos) and user profiles. It provides users with an easy way to add, edit, delete, and organize tasks, helping them stay productive and organized. The app also offers options for customizing user profiles, including managing user data and preferences.

## Overview
### Login Page
![Screenshot 2024-09-02 125617](https://github.com/user-attachments/assets/925c3947-181a-4439-90bd-09d06cd806c6)

### Profile Page
![Screenshot 2024-09-02 124947](https://github.com/user-attachments/assets/808a5889-3cde-4c99-9057-67bc4be13cb5)

### Home Page
![Screenshot 2024-09-02 125445](https://github.com/user-attachments/assets/499ee5bb-ad90-4ed5-8793-9d25c3c1ec16)

## Table of Contents
- [Todo Management App](#todo-management-app)
- [Project Overview](#project-overview)
- [Schema Diagram](#schema-diagram)
- [Technologies](#technologies)
- [Features](#features)
- [Getting Started](#getting-started)

# Project Overview

# Schema Diagram
![Screenshot 2024-09-05 114334](https://github.com/user-attachments/assets/db8a24ec-1381-4f14-a744-5deb52eeabb1)

# Technologies
- MSSQL
- ASP.NET Core Web API
- React.js + TypeScript
- Material UI
- Zustand
- React-query
- JWT
- i18Next
- MSW
- Vitest
- xUnit
- Moq
- Cypress

# Features

## Profile Features
- [x] Registration
- [x] Forgot Password
- [x] Email Verification
- [x] JWT Authorization
- [x] Profile Overview
- [x] Delete Account
- [x] Edit Profile
- [x] Change Password

## Tasks Features
- [x] Tasks Overview
- [x] Add a new Task
- [x] Edit Task
- [x] Delete Task
- [x] Delete All Tasks
- [x] Delete Selected Tasks
- [x] Make Selected Tasks Completed

# Getting Started

## Prerequisites
Before running the application and start using (development), makse sure you have following installed:
+ Node.js
+ npm
+ .NET 8 SDK
+ Running SQL Server instance

## Step-by-Step Guide
1. Clone the Repository
```
git clone https://github.com/Mujo78/todo_management_app.git
```
2. Go to the project directory

### Server
1. Go to the project directory `server`
```
cd server
```
2. Start the `server`
```
dotnet run --launch-profile "https"
```
3. `server` is ready

### Client
1. Go to the project directory `client`
```
cd client
```
2. Install dependencies
```
npm install
```
3. Create a `.env` file in the root of the `client` directory, and add the environment variables as specified in the `.env.example` file
4. Start the `client`
```
npm run dev
```
5. `client` is ready, open [http://localhost:5173/](http://localhost:5173/) with your browser to see the application in action
