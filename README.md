# dev.playcv.ng

This repository contains the source code and assets for the **Play CV** platform, a video CV portal designed to connect candidates with employers through interactive video profiles. The platform includes features for candidates, employers, and administrators, ensuring a seamless experience for all users.

---

## Table of Contents

- [Features](#features)
  - [General Video Look & Feel](#general-video-look--feel)
  - [Candidate Side](#candidate-side)
  - [Employer Side](#employer-side)
  - [Admin Side](#admin-side)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### General Video Look & Feel
- **Interactive Video Catalogue**:
  - Video template for the homepage.
  - Categorized video display.
  - Dynamic search bar for video search.
  - Job board showing all jobs and active jobs.
  - Integration of job posts with video pages.
- **Homepage Features**:
  - Single dynamic search bar functionality.
  - Homepage displaying videos in various categories.
  - Job board showcasing all jobs and active jobs.

### Candidate Side
- **Login & Authentication**:
  - Two login options: NYSCJobs.ng account or email/Facebook login.
  - Video details visible only after login.
- **Candidate Dashboard**:
  - VideoCV guide on the dashboard.
  - Summaries and FAQ links.
  - "Get Started" link leading to signup/login.
- **Video Upload & Consent**:
  - Consent box for employer view.
  - User details form (name, phone, course, etc.).
  - Purchase process, cart, and Paystack integration.
  - Upload page closing after 2 days.
- **Video Management**:
  - Ability to replace an existing videoCV.
  - Payment process for video replacement.
  - Admin approval required for video display.
- **Social Sharing & Views**:
  - VideoCV views count.
  - Share video via LinkedIn & email.

### Employer Side
- **Video Viewing & Payment**:
  - View candidate details link.
  - Payment process for viewing details.
  - Download link and VideoCV details post-payment.
- **Video Management**:
  - Collation of videos to watch/pay later.
  - Dynamic search bar for video search.
  - Pinned video feature for advantage.
- **Advertisement**:
  - Video and image ads over videoCV.
  - Option to skip ads.

### Admin Side
- **User Management**:
  - Creation of sub-admin accounts.
  - Granting admin access to others.
- **Content Management**:
  - Creation of video categories.
  - Posting job vacancies.
  - Management of site content (FAQ, Video guidelines, Pricing, etc.).
- **Advertisement Management**:
  - Addition of ads to videos (video and image).
- **Purchase & Order Management**:
  - View purchases/orders.
  - Details of payments (name, phone number).
- **Communication**:
  - WhatsApp chat integration on the homepage.

---

## Technologies Used

- **Frontend**: React (Next.js)
- **Backend**: .NET Core
- **Database**: MSSQL and MongoDB
- **Hosting**:
  - Frontend: Netlify
  - Backend: Azure
- **Other Tools**:
  - Payment Integration: Paystack
  - Shopping Cart
  - Video Hosting via CDN
  - WhatsApp Chat Integration

---

## Setup and Installation

Follow these steps to set up the project locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/dev.playcv.ng.git
   cd dev.playcv.ng

**   Install dependencies:
**

**Frontend:
**
bash
cd frontend
npm install

**Backend:
**Copy
cd backend
dotnet restore
Set up environment variables:

Create a .env file in the frontend and backend directories with the necessary variables:

env
Copy
# Frontend
API_URL=http://localhost:5000
PAYSTACK_PUBLIC_KEY=your_paystack_key

# Backend
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret

Run the development servers:

Frontend:

bash
Copy
cd frontend
npm run dev
Backend:

bash
Copy
cd backend
dotnet run
Open the website:
Visit http://localhost:3000 in your browser.

Development
Branching Strategy: Use feature branches for new developments. Create a branch with the format feature/your-feature-name.

Code Style: Follow the style guide for consistent coding practices.

Testing: Run tests using npm test (frontend) and dotnet test (backend) before submitting a pull request.

**Contributing
**
We welcome contributions! Please follow these steps:

Fork the repository.

Create a new branch for your feature or bugfix.

Commit your changes with clear and descriptive messages.

Submit a pull request to the main branch.

For major changes, please open an issue first to discuss the proposed changes.

**License
**This project is licensed under the MIT License. Feel free to use, modify, and distribute the code as per the license terms.

For any questions or support, please contact david@fasdavtek.com or open an issue in this repository.


### Key Notes:
- Replace placeholders like `your-username`, `your_paystack_key`, and `your-email@example.com` with actual values.
- Add links to your style guide or other documentation if available.
- Ensure the `.env` file is added to `.gitignore` to avoid exposing sensitive information.
