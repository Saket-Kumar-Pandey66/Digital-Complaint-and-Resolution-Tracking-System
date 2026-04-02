# Digital Complaint and Resolution Tracking System

A full-stack web application that enables users to submit complaints, track their status, and receive resolution updates. Administrators can review, manage, and resolve complaints through a structured workflow.

## Key Features

*   **Complaint Submission System:** Allows users to easily create detailed tickets categorized by issue type.
*   **Admin Dashboard:** Dedicated interface for system administrators to view, manage, and process all submitted complaints.
*   **Status Tracking (Pending, In Progress, Resolved):** Provides transparency by showing real-time updates on ticket progress.
*   **Authentication and Role-Based Access:** Secure login system differentiating between standard users and administrators.
*   **Clean Dark-Themed UI:** A modern, product-grade dark interface designed for readability and professional aesthetics.

## Application Workflow

1.  **User Submission:** A user submits a complaint with necessary details.
2.  **Admin Review:** The administrator reviews the complaint and updates the status to "In Progress".
3.  **Admin Resolution:** Once the issue is addressed, the administrator marks the complaint as "Resolved".
4.  **User Confirmation:** The user verifies the resolution, archiving the complaint and concluding the lifecycle.

## Tech Stack

| Component      | Technology                                    |
| -------------- | --------------------------------------------- |
| **Frontend**   | React.js (Custom Components, Dark Theme UI)   |
| **Backend**    | Python (Flask)                                |
| **Database**   | SQLite                                        |
| **Architecture**| REST API-based                                |

## Installation and Setup

### Prerequisites

*   Python 3.x
*   Node.js (v18 or higher)
*   npm

### 1. Clone the Repository

```bash
git clone https://github.com/Saket-Kumar-Pandey66/Digital-Complaint-and-Resolution-Tracking-System.git
cd Digital-Complaint-and-Resolution-Tracking-System
```

### 2. Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows, use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python run.py
```

### 3. Frontend Setup

Open a new terminal window.

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

```text
Digital-Complaint-and-Resolution-Tracking-System/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── models.py
│   │   ├── __init__.py
│   ├── database/
│   │   └── complaints.db
│   ├── run.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API Overview

Below are sample analytical endpoints exposed by the REST API:

*   **Authentication Routes:** Handle user registration, login, and token issuance.
*   **`GET /complaints`**: Retrieve a list of complaints (filtered by user context or admin role).
*   **`POST /complaints`**: Submit a new complaint record to the system.
*   **`PUT /complaints/:id`**: Update the status or details of a specific complaint.

## UI/UX Highlights

The frontend has been built with a focus on modern user experience principles. Key highlights include:
*   **Dark Theme:** A deeply layered, low-contrast dark aesthetic that reduces eye strain and provides a premium feel.
*   **Modular Components:** Reusable, single-responsibility UI primitives (Buttons, Cards, Forms) built from scratch.
*   **Responsive Layout:** Flexible grids and fluid typography that adapt gracefully across desktop and mobile devices.

## Future Enhancements

*   **Notifications System:** Real-time push notifications for immediate status updates.
*   **Email Integration:** Automated email receipts when tickets change state.
*   **Advanced Analytics Dashboard:** Deeper metrics and exportable reports for administrative oversight.
*   **Deployment and Scalability Improvements:** Migration to containerized environments (Docker) and a robust production database (PostgreSQL/MySQL).

## Contributing

Contributions are welcome. To contribute, please follow these steps:
1.  Fork the repository.
2.  Create a new feature branch (`git checkout -b feature/your-feature-name`).
3.  Commit your changes (`git commit -m "Add your message"`).
4.  Push to the branch (`git push origin feature/your-feature-name`).
5.  Open a Pull Request describing your modifications.

## License

This project is licensed under the MIT License. See the LICENSE file for more information.

## Author

**Saket Kumar Pandey**
*   GitHub: [Saket-Kumar-Pandey66](https://github.com/Saket-Kumar-Pandey66)
