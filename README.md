# Case Program

Case Program is a **Node.js & Express.js** application designed for managing **case and hearing records** with role-based authentication. It uses **MongoDB** as the database and includes **JWT-based authentication** with access and refresh tokens, a **token blacklist for security**, and **bcrypt for password hashing**.

The system follows a structured **MVC pattern** and includes middleware for logging, authentication, and request handling.

## 📌 Features

### **Authentication & Security**
- **JWT Authentication** (Access & Refresh Tokens)
- **Token Blacklist** to prevent reuse of invalid tokens
- **Bcrypt Password Hashing** for secure user credentials
- **Cookie Parser** for handling authentication tokens

### **Case & Hearing Management**
- CRUD operations for **case records** and **hearings**
- Role-based access control

### **Middleware & Logging**
- **Winston Logger** for request tracking and error handling
- **Custom Logger Middleware** logs request details, status, and user activity

### **Database**
- **MongoDB** with **Mongoose ODM**
- **Predefined Mongoose collections** for testing
- Sample **data included** for quick setup

---

## 📂 Project Structure

The project follows a **proper file structure** for maintainability and readability:

- **`config/`** – Configuration file for logging
- **`controllers/`** – Business logic for handling API requests  
- **`database/`** – MongoDB connection setup and sample data  
- **`middlewares/`** – Custom middleware for logging, authentication, and request handling  
- **`models/`** – Mongoose schemas for database entities  
- **`routes/`** – Express routes defining API endpoints  
- **`utils/`** – Utility functions for response handling and helpers  

---

## ⚠️ Disclaimer

This project is for **testing purposes in an actual project setup**. **It is intentional that the `.env` file and database files are exposed**, as this repository is meant for learning and demonstration. **Do not use this setup in production** without adding proper security measures, such as hiding secrets and restricting database access.
