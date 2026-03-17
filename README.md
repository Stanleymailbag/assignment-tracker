Student Assignment Tracker API - Documentation

This is a backend RESTful API built with Node.js and Express that allows students to create, retrieve, update, filter, and delete academic assignments. It demonstrates core backend development principles, including file-based data storage, asynchronous operations, and email notifications.


Table of Contents
1. [Project Overview](project-overview)  
2. [Technologies Used](technologies-used)  
3. [Folder Structure](folder-structure)  
4. [Getting Started](getting-started)  
5. [Environment Variables](environment-variables)  
6. [API Endpoints](api-endpoints)  
7. [Testing](testing)  
8. [Features](features)  
9. [Notes](notes)  


Project Overview
This API allows students to manage their assignments. Each assignment includes:

- id – Unique identifier  
- title – Assignment title  
- subject – Subject of the assignment  
- deadline – Due date  
- status – "pending" or "completed" 
- email – Student’s email (used for notifications)  

The API supports CRUD operations and automated deadline reminder emails.


Technologies Used
- Node.js (v24+)  
- Express  
- Nodemailer (for email notifications)  
- dotenv (for environment variable management)  
- File-based JSON storage (`assignments.json`)  


Folder Structure
    assignment-tracker/
    │
    ├── server.js
    ├── assignments.json
    ├── routes/
    │ └── assignments.js
    ├── services/
    │ └── emailService.js
    ├── utils/
    │ └── fileHandler.js
    ├── .env
    ├── README.md


Getting Started
1. Clone the repository:

        git clone <repository-url>
        cd assignment-tracker

2.	Install dependencies:
        npm install

3.	Create a .env file (see below for variables).

4.	Start the server:
        node server.js
    The API will run on: http://localhost:3000/


Environment Variables
Create a .env file in the root folder with:
    EMAIL_USER=yourgmail@gmail.com
    EMAIL_PASS=your_gmail_app_password
Important: Use a Gmail App Password, not your real Gmail password.


API Endpoints
1. Create Assignment
    URL: /api/assignments
    Method: POST
    Body (JSON):
        {
        "title": "Math Homework",
        "subject": "Mathematics",
        "deadline": "2026-03-20",
        "email": "student@example.com"
        }
	Response:
        {
        "message": "Assignment created successfully",
        "assignment": {
            "id": 1773700643657,
            "title": "Math Homework",
            "subject": "Mathematics",
            "deadline": "2026-03-20",
            "status": "pending",
            "email": "student@example.com"
        }
        }


2. Get All Assignments (Optional Filtering)
	URL: /api/assignments
	Method: GET
	Query Parameters (Optional):
        status – "pending" or "completed"
        subject – Filter by subject
	Response:
        {
        "total": 2,
        "assignments": [
            { "id": 1, "title": "...", ... },
            { "id": 2, "title": "...", ... }
        ]
        }


3. Mark Assignment as Completed
	URL: /api/assignments/:id
	Method: PUT
	Response:
        {
        "message": "Assignment marked as completed",
        "assignment": {
            "id": 1,
            "title": "Math Homework",
            "status": "completed",
            ...
        }
        }


4. Delete Assignment
	URL: /api/assignments/:id
	Method: DELETE
	Response:
        {
        "message": "Assignment deleted successfully"
        }


5. Check Deadlines and Send Reminders
	URL: /api/assignments/check-deadlines
	Method: GET
	Response (When reminders sent):
        {
        "remindersSent": 1,
        "message": "Reminder emails sent successfully."
        }
	Response (When none qualify):
        {
        "remindersSent": 0,
        "message": "No pending assignments due within the next 24 hours."
        }
    Testing
        Use Postman or browser for GET requests.
        Test POST, PUT, DELETE, and reminders endpoints.
        Verify emails are sent to the address in the assignment.


Features
	CRUD operations for assignments
	Filtering by status and subject
	Automated email notifications on creation and before deadline
	File-based JSON storage (no database required)
	Proper error handling
	Professional console logging (optional)


Notes
	No frontend included — focus is on backend fundamentals
	No authentication or user roles implemented
	Assignments are persisted in assignments.json
	Deadline reminder only considers "pending" assignments

