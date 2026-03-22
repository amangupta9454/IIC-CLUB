<h1 style="color:#d63384;">🚀 IIC — Innovation & Incubation Council Platform</h1>

<p>
A comprehensive full-stack web application designed to connect students, faculty administrators, and mentors in a seamless innovation ecosystem.
Built with <b>React</b> on the frontend and <b>Node.js</b> on the backend, it serves as a central hub for idea submission, hackathon management, event tracking, digital certificate generation, and mentorship coordination for aspiring student entrepreneurs.
</p>

<hr>

<h2 style="color:#6f42c1;">📑 Table of Contents</h2>

<ul>
<li>🔎 <a href="#what-is-iic-platform">What is the IIC Platform</a></li>
<li>👩🎓 <a href="#who-its-for">Who it's for</a></li>
<li>⚕️ <a href="#what-problems-it-solves">What problems it solves</a></li>
<li>✨ <a href="#features-by-module">Features by module</a></li>
<li>📂 <a href="#project-structure">Project structure</a></li>
<li>💻 <a href="#tech-stack">Tech stack</a></li>
<li>⚙️ <a href="#how-to-run-the-project-locally">How to run the project locally</a></li>
<li>🔑 <a href="#environment-variables">Environment variables</a></li>
<li>🌐 <a href="#all-api-routes-summary">All API routes (summary)</a></li>
<li>👥 <a href="#user-roles-and-permissions">User roles and permissions</a></li>
<li>🧠 <a href="#how-each-major-feature-works">How each major feature works</a></li>
<li>🚀 <a href="#deployment">Deployment</a></li>
<li>📦 <a href="#package-dependencies">Package dependencies</a></li>
<li>📜 <a href="#available-scripts">Available scripts</a></li>
<li>📬 <a href="#contact">Contact</a></li>
</ul>

<hr>

<h2 id="what-is-iic-platform" style="color:#198754;">💡 What is the IIC Platform</h2>

<p>
The Innovation & Incubation Council (IIC) Platform is a centralized web portal designed exclusively to foster entrepreneurship and innovation within academic institutions. 
The platform unites multiple stakeholders — students, faculty administrators, and industry mentors — into a cohesive, interactive system.
</p>

<p><b>A student can use the IIC Platform to:</b></p>
<ul>
<li>📅 Register for upcoming workshops and events</li>
<li>💡 Submit innovative startup and project ideas for incubation</li>
<li>🏆 Participate in hackathons and upload project presentations, GitHub links, and demo videos</li>
<li>🤝 Request 1-on-1 mentorship sessions with industry experts or faculty</li>
<li>📇 Upload and manage their digital achievement certificates in a centralized vault</li>
<li>📖 Access curated learning resources tailored for startups and innovation</li>
<li>📊 Track their progress on the internal innovator leaderboard</li>
</ul>

<hr>

<h2 id="who-its-for" style="color:#fd7e14;">👥 Who It's For</h2>

<table style="border-collapse: collapse; width:100%; text-align:left;">
<thead>
<tr style="background-color:#f8f9fa;">
<th style="border:1px solid #ddd; padding:10px;">Role</th>
<th style="border:1px solid #ddd; padding:10px;">What they use the IIC Platform for</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd; padding:10px;">👩🎓 Student / Innovator</td>
<td style="border:1px solid #ddd; padding:10px;">
Tracking events, submitting ideas, finding mentors, managing certificates, and competing in hackathons
</td>
</tr>

<tr>
<td style="border:1px solid #ddd; padding:10px;">🛠️ Faculty Admin</td>
<td style="border:1px solid #ddd; padding:10px;">
Reviewing ideas (Accept/Reject/Incubate), managing hackathon submissions, assigning mentors, tracking student profiles, and uploading resources
</td>
</tr>

</tbody>
</table>

<hr>

<h2 id="what-problems-it-solves" style="color:#dc3545;">⚠️ What Problems It Solves</h2>

<ol style="line-height:1.8;">
<li>🌾 Scattered Idea Submissions → solved by the <b>centralized Idea Submission and Tracking pipeline</b></li>
<li>📊 Difficulty tracking Hackathon projects → solved by the <b>Project/Hackathon Dashboard with direct file links</b></li>
<li>🛡️ Disconnected Mentorship networks → solved by the <b>Mentorship Request and Scheduling System</b></li>
<li>🪪 Scattered student achievements → solved by the natively integrated <b>Certificate Vault (Cloudinary backed)</b></li>
<li>📑 Poor visibility of campus events → solved by the <b>Dynamic Event Registration system with Apply Links</b></li>
</ol>

<hr>

<h2 id="features-by-module" style="color:#6f42c1;">✨ Features by Module</h2>

<h3 style="color:#0d6efd;">🔐 Module 1 — Authentication & Profiles</h3>
<ul>
<li>Secure User Registration and Login</li>
<li>Dedicated Admin authentication flow</li>
<li>JWT-based sessions (tokens stored securely)</li>
<li>Role-based access control protecting Student and Admin routes</li>
<li>Comprehensive User Profiles tracking branch, year, course, and contact info</li>
</ul>

<h3 style="color:#0d6efd;">💡 Module 2 — Idea & Innovation Pipeline</h3>
<ul>
<li>Students can submit detailed Ideas (Problem Statement, Solution, Target Audience)</li>
<li>Admins receive submissions in a Kanban-style pipeline</li>
<li>Admins can Approve, Reject, or Incubate ideas with personalized feedback</li>
</ul>

<h3 style="color:#0d6efd;">🏆 Module 3 — Hackathons & Projects</h3>
<ul>
<li>Students can submit complete project profiles including GitHub URLs, Presentation PDFs, and Demo Videos</li>
<li>Admins can evaluate project submissions through an Accept/Reject flow</li>
<li>Visual team member tracking and project repository management</li>
</ul>

<h3 style="color:#0d6efd;">🤝 Module 4 — Mentorship System</h3>
<ul>
<li>Students can request guidance on specific questions and optionally request a specific mentor</li>
<li>Admins can assign specific mentors with complete metadata (Name, Department, Specialization, Contact Info)</li>
<li>Integrated scheduling timestamps and closing remarks tracking</li>
</ul>

<h3 style="color:#0d6efd;">📅 Module 5 — Event Management</h3>
<ul>
<li>Admins can create rich Events with cover images, dates, and venues</li>
<li>Support for both native in-app registered user tracking and external Apply Links</li>
<li>Students can effortlessly browse and track their registered events</li>
</ul>

<h3 style="color:#0d6efd;">🎓 Module 6 — Certificates Vault</h3>
<ul>
<li>Students securely upload achievement certificates (Images/PDFs) via drag-and-drop</li>
<li>Cloudinary CDN integration guarantees fast and lossless certificate storage</li>
<li>Admins can instantly view a student's entire certificate portfolio during profile evaluations</li>
</ul>

<h3 style="color:#0d6efd;">📚 Module 7 — Learning Resources</h3>
<ul>
<li>Dynamic access to admin-uploaded resources including external links, video tutorials, and documents</li>
<li>Gamified points and leaderboard system tracking platform engagement</li>
</ul>

<hr>

<h2 id="project-structure" style="color:#198754;">📂 Project Structure</h2>

<pre>
IIC-BACKEND/
│
├── README.md                 ← This file
│
├── BACKEND/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   ├── fixAdminDb.js         ← Utility to safely migrate Admin credentials
│   │
│   ├── config/
│   │   └── db.js             ← Cached MongoDB connection config (Vercel Serverless Compatible)
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── studentController.js
│   │   ├── certificateController.js
│   │   └── resourceController.js
│   │
│   ├── models/    
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Idea.js
│   │   ├── Hackathon.js
│   │   ├── Mentorship.js
│   │   ├── Certificate.js
│   │   └── Resource.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── certificateRoutes.js
│   │   └── resourceRoutes.js
│   │
│   ├── middleware/             
│   │   ├── auth.js           ← JWT validation
│   │   └── adminAuth.js      ← Role checking
│   │
│   └── utils/
│       └── seedAdmin.js      ← Initial Admin Account creation
│
└── FRONTEND/
    ├── .env 
    ├── vite.config.js
    ├── package.json
    ├── index.html
    │
    └── src/
        ├── App.jsx    
        ├── index.css
        │
        ├── components/  
        │   ├── AdminDashboard.jsx / StudentDashboard.jsx
        │   ├── AdminSidebar.jsx / Sidebar.jsx
        │   ├── AdminLogin.jsx / Login.jsx / Signup.jsx
        │   ├── IdeaModeration.jsx / InnovationIdea.jsx
        │   ├── HackathonManagement.jsx / HackathonDetails.jsx
        │   ├── EventManagement.jsx / EventsWorkshops.jsx
        │   ├── MentorshipManagement.jsx / Mentorship.jsx
        │   ├── Certificates.jsx
        │   ├── LearningResources.jsx / LearningResourcesAdmin.jsx
        │   └── api.js        ← Axios instance configuration
        │
</pre>

---

<h2 id="tech-stack" style="color:#0d6efd;">💻 Tech Stack</h2>

<h3 style="color:#6f42c1;">⚙️ Backend</h3>

<table style="border-collapse:collapse;width:100%;text-align:left;">
<thead>
<tr style="background:#f8f9fa;">
<th style="border:1px solid #ddd;padding:10px;">Technology</th>
<th style="border:1px solid #ddd;padding:10px;">Why we use it</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🟢 Node.js</td>
<td style="border:1px solid #ddd;padding:10px;">JavaScript runtime for the server environment</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🚏 Express.js</td>
<td style="border:1px solid #ddd;padding:10px;">Robust HTTP server and REST API routing framework</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🍃 MongoDB & Mongoose</td>
<td style="border:1px solid #ddd;padding:10px;">NoSQL database for flexible document storage and complex schema relations</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🔑 JSON Web Tokens (JWT)</td>
<td style="border:1px solid #ddd;padding:10px;">Stateless session management and API endpoint securing</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🔒 bcryptjs</td>
<td style="border:1px solid #ddd;padding:10px;">Cryptographic hashing for database user passwords</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🔗 cors & dotenv</td>
<td style="border:1px solid #ddd;padding:10px;">Cross-Origin access control and secure environment variable injection</td>
</tr>

</tbody>
</table>

<br>

<h3 style="color:#6f42c1;">🎨 Frontend</h3>

<table style="border-collapse:collapse;width:100%;text-align:left;">
<thead>
<tr style="background:#f8f9fa;">
<th style="border:1px solid #ddd;padding:10px;">Technology</th>
<th style="border:1px solid #ddd;padding:10px;">Why we use it</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd;padding:10px;">⚛️ React.js</td>
<td style="border:1px solid #ddd;padding:10px;">Component-based UI framework for scalable dashboards</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">⚡ Vite</td>
<td style="border:1px solid #ddd;padding:10px;">Ultra-fast build tool and development server</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🎨 Tailwind CSS</td>
<td style="border:1px solid #ddd;padding:10px;">Utility-first CSS for constructing the dark-mode, glassy aesthetic</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🎞️ Framer Motion</td>
<td style="border:1px solid #ddd;padding:10px;">Declarative animations for modals, route transitions, and UI interactions</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🌐 Axios</td>
<td style="border:1px solid #ddd;padding:10px;">Promise-based HTTP client to interact with the Backend API</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🎯 Lucide React</td>
<td style="border:1px solid #ddd;padding:10px;">Clean, modern vector icons used extensively throughout the UI</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">☁️ Cloudinary (Direct)</td>
<td style="border:1px solid #ddd;padding:10px;">Direct unsigned browser-to-cloud uploads for Student Certificates</td>
</tr>

</tbody>
</table>

<hr>

<h2 id="how-to-run-the-project-locally" style="color:#198754;">🚀 How to Run the Project Locally</h2>

<p>You need to run two separate servers — one for the backend, one for the frontend.</p>

<h3 style="color:#fd7e14;">🧰 Step 1 — Prerequisites</h3>

<table style="border-collapse:collapse;width:100%;text-align:left;">
<thead>
<tr style="background:#f8f9fa;">
<th style="border:1px solid #ddd;padding:10px;">Requirement</th>
<th style="border:1px solid #ddd;padding:10px;">Purpose</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🟢 Node.js (v18+)</td>
<td style="border:1px solid #ddd;padding:10px;">JavaScript runtime to run backend and build frontend</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🍃 MongoDB Atlas</td>
<td style="border:1px solid #ddd;padding:10px;">Cloud database for storing application data</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">☁️ Cloudinary Account</td>
<td style="border:1px solid #ddd;padding:10px;">Stores uploaded certificates and event images</td>
</tr>

</tbody>
</table>

### Step 2 — Clone the repository

<code>
git clone https://github.com/amangupta9454/iic-platform.git
cd iic-platform
</code>

### Step 3 — Set up and start the Backend
<code>
cd BACKEND
npm install
</code>

Create a `.env` file inside `BACKEND/` with the following contents:

<code>
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/iic
PORT=5000
JWT_SECRET=any_long_random_secret_string_here
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=admin
</code>

```bash
npm run dev
```

The backend will start at **http://localhost:5000**

### Step 4 — Set up and start the Frontend

Open a new terminal window:

```bash
cd FRONTEND
npm install
```

Create a `.env` file inside `FRONTEND/` with:

```env
VITE_API_URL=http://localhost:5000
```

> **Note**: Ensure Cloudinary unsigned uploads are enabled in your Cloudinary Dashboard under *Settings > Upload > Upload presets*. Ensure you create a preset named `iic_assets` for direct frontend uploading.

```bash
npm run dev
```

The frontend will start at **http://localhost:5173**

### Step 5 — Apply Initial Admin Credentials (first time only)

```bash
cd BACKEND
node utils/seedAdmin.js
```

This securely creates the initial Admin user in your database using the parameters from your `.env`.

### Step 6 - Open the app

Go to **http://localhost:5173** in your browser. You can now register as a Student or sign in with the Admin account you just seeded.

<hr>


<h2 id="environment-variables" style="color:#0d6efd;">🔑 Environment Variables</h2>

<h3 style="color:#6f42c1;">⚙️ Backend (<code>BACKEND/.env</code>)</h3>

<table style="border-collapse:collapse;width:100%;text-align:left;">
<thead>
<tr style="background:#f8f9fa;">
<th style="border:1px solid #ddd;padding:10px;">Variable</th>
<th style="border:1px solid #ddd;padding:10px;">Required</th>
<th style="border:1px solid #ddd;padding:10px;">What it does</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>MONGO_URI</code></td>
<td style="border:1px solid #ddd;padding:10px;">✅ Yes</td>
<td style="border:1px solid #ddd;padding:10px;">MongoDB connection string</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>PORT</code></td>
<td style="border:1px solid #ddd;padding:10px;">❌ No</td>
<td style="border:1px solid #ddd;padding:10px;">Port the server runs on (default: 5000)</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>JWT_SECRET</code></td>
<td style="border:1px solid #ddd;padding:10px;">✅ Yes</td>
<td style="border:1px solid #ddd;padding:10px;">Cryptographic secret used to sign and verify JWT tokens</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>ADMIN_EMAIL</code></td>
<td style="border:1px solid #ddd;padding:10px;">✅ Yes</td>
<td style="border:1px solid #ddd;padding:10px;">Email for the master admin account (used by seedAdmin.js)</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>ADMIN_PASSWORD</code></td>
<td style="border:1px solid #ddd;padding:10px;">✅ Yes</td>
<td style="border:1px solid #ddd;padding:10px;">Password for the master admin account</td>
</tr>

</tbody>
</table>

<br>

<h3 style="color:#6f42c1;">🎨 Frontend (<code>FRONTEND/.env</code>)</h3>

<table style="border-collapse:collapse;width:100%;text-align:left;">
<thead>
<tr style="background:#f8f9fa;">
<th style="border:1px solid #ddd;padding:10px;">Variable</th>
<th style="border:1px solid #ddd;padding:10px;">Required</th>
<th style="border:1px solid #ddd;padding:10px;">What it does</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>VITE_API_URL</code></td>
<td style="border:1px solid #ddd;padding:10px;">✅ Yes</td>
<td style="border:1px solid #ddd;padding:10px;">
Base URL for all API calls pointing to your backend engine. Example: <code>http://localhost:5000</code> or your live Render url.
</td>
</tr>

</tbody>
</table>

<hr>
<h2 id="all-api-routes-summary" style="color:#0d6efd;">🌐 All API Routes (Summary)</h2>

<table style="border-collapse:collapse;width:100%;text-align:left;">
<thead>
<tr style="background:#f8f9fa;">
<th style="border:1px solid #ddd;padding:10px;">Route Prefix</th>
<th style="border:1px solid #ddd;padding:10px;">What it handles</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>/api/auth</code></td>
<td style="border:1px solid #ddd;padding:10px;">🔐 Registration, Login, and Profile Management</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>/api/admin</code></td>
<td style="border:1px solid #ddd;padding:10px;">🛠️ Secure endpoints for all Admin capabilities (Idea approval, Event creation, Mentorship assignment)</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>/api/events</code></td>
<td style="border:1px solid #ddd;padding:10px;">📅 Fetching active events and registering students</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>/api/ideas</code></td>
<td style="border:1px solid #ddd;padding:10px;">💡 Submitting new ideas to the innovation pipeline</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>/api/hackathons</code></td>
<td style="border:1px solid #ddd;padding:10px;">🏆 Submitting completed projects for evaluation</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>/api/certificates</code></td>
<td style="border:1px solid #ddd;padding:10px;">📇 Registering uploaded Cloudinary certificates to a student's profile</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>/api/mentorship</code></td>
<td style="border:1px solid #ddd;padding:10px;">🤝 Fetching the status and details of requested mentoring sessions</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>/api/resources</code></td>
<td style="border:1px solid #ddd;padding:10px;">📚 Fetching learning materials posted by faculty</td>
</tr>

</tbody>
</table>

<hr>

<h2 id="user-roles-and-permissions" style="color:#198754;">👥 User Roles and Permissions</h2>

<p>There are <b>2 roles</b> in the system. The admin role is hardcoded via MongoDB seeding to maximize backend security.</p>

<table style="border-collapse:collapse;width:100%;text-align:center;">
<thead>
<tr style="background:#f8f9fa;">
<th style="border:1px solid #ddd;padding:10px;">Feature</th>
<th style="border:1px solid #ddd;padding:10px;">👩🎓 Student</th>
<th style="border:1px solid #ddd;padding:10px;">🛠️ Admin</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd;padding:10px;">Register / Login</td>
<td style="border:1px solid #ddd;padding:10px;">✔️</td>
<td style="border:1px solid #ddd;padding:10px;">(Login Only)</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">Dashboard Access</td>
<td style="border:1px solid #ddd;padding:10px;">✔️</td>
<td style="border:1px solid #ddd;padding:10px;">✔️</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">Submit Ideas & Projects</td>
<td style="border:1px solid #ddd;padding:10px;">✔️</td>
<td style="border:1px solid #ddd;padding:10px;">❌</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">Accept/Reject Ideas</td>
<td style="border:1px solid #ddd;padding:10px;">❌</td>
<td style="border:1px solid #ddd;padding:10px;">✔️</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">Upload Certificates</td>
<td style="border:1px solid #ddd;padding:10px;">✔️</td>
<td style="border:1px solid #ddd;padding:10px;">❌</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">View Student Profile & Certificates</td>
<td style="border:1px solid #ddd;padding:10px;">Own Profile Only</td>
<td style="border:1px solid #ddd;padding:10px;">✔️</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">Assign Mentors</td>
<td style="border:1px solid #ddd;padding:10px;">❌</td>
<td style="border:1px solid #ddd;padding:10px;">✔️</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">Create Events</td>
<td style="border:1px solid #ddd;padding:10px;">❌</td>
<td style="border:1px solid #ddd;padding:10px;">✔️</td>
</tr>

</tbody>
</table>

<hr>

<h2 id="how-each-major-feature-works" style="color:#0d6efd;">🧠 How Each Major Feature Works</h2>

<h3 style="color:#6f42c1;">📇 Student Certificates Integration</h3>
<li>
When a student uploads an image, the frontend targets the public Cloudinary API unauthenticated endpoint using the <code>iic_assets</code> preset.
The resulting secure URL is then handed to the `POST /api/certificates` endpoint.
</li>
<li>
During Mentorship evaluation or Hackathons, Admins simply click on a student's profile to instantly generate a grid view of all certificates uploaded by that user.
</li>

<h3 style="color:#6f42c1;">🎯 Idea Moderation flow</h3>
<li>
When students build a startup idea proposal, it falls into a global Kanban-esque pipeline on the Admin Interface. Admin users have three dedicated actions: <b>Accept</b>, <b>Reject</b>, and <b>Incubate</b>. Appending feedback permanently updates the item dynamically in the student's dashboard logs.
</li>

<h3 style="color:#6f42c1;">🤝 Mentorship Architecture</h3>
<li>
A student specifies the domain they need help with (Marketing, Code, Prototype). The Admin assigns themselves or another faculty member by supplying Name, Department, Specialization, Contact Info, and a Scheduled meeting time. The student's dashboard updates in real time to display a glassy identification card containing contact links (mailto:, tel:).
</li>

<hr>

<h2 id="deployment" style="color:#198754;">🚀 Deployment</h2>

<p>
Our database connection logic inside <code>db.js</code> utilizes the <b>global connection caching pattern</b> which ensures 100% compatibility with Serverless providers like Vercel and AWS Lambda function endpoints.
</p>

<h3 style="color:#fd7e14;">🌐 Frontend — Netlify / Vercel</h3>

<table style="border-collapse:collapse;width:100%;text-align:left;">
<thead>
<tr style="background:#f8f9fa;">
<th style="border:1px solid #ddd;padding:10px;">Step</th>
<th style="border:1px solid #ddd;padding:10px;">Action</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd;padding:10px;">1</td>
<td style="border:1px solid #ddd;padding:10px;">Push code to GitHub</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">2</td>
<td style="border:1px solid #ddd;padding:10px;">Go to Vercel/Netlify Dashboard → Create New App → Connect Repo</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">3</td>
<td style="border:1px solid #ddd;padding:10px;">Set <b>Base/Root directory</b> to <code>FRONTEND</code></td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">4</td>
<td style="border:1px solid #ddd;padding:10px;">Set <b>Build command</b> to <code>npm run build</code></td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">5</td>
<td style="border:1px solid #ddd;padding:10px;">Add environment variable: <code>VITE_API_URL = https://your-backend.com</code></td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">6</td>
<td style="border:1px solid #ddd;padding:10px;">Deploy</td>
</tr>

</tbody>
</table>

<h3 style="color:#fd7e14;">🖥️ Backend — Vercel / Render </h3>

<table style="border-collapse:collapse;width:100%;text-align:left;">
<thead>
<tr style="background:#f8f9fa;">
<th style="border:1px solid #ddd;padding:10px;">Step</th>
<th style="border:1px solid #ddd;padding:10px;">Action</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd;padding:10px;">1</td>
<td style="border:1px solid #ddd;padding:10px;">Push code to GitHub</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">2</td>
<td style="border:1px solid #ddd;padding:10px;">Deploy using <code>vercel</code> command targeting the BACKEND folder, OR use Render Web Service.</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">3</td>
<td style="border:1px solid #ddd;padding:10px;">If using a standard node host (Render), set start command to <code>npm start</code> or <code>node index.js</code></td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">4</td>
<td style="border:1px solid #ddd;padding:10px;">Add all backend environment variables (<code>MONGO_URI</code>, <code>JWT_SECRET</code>, <code>ADMIN_EMAIL</code>)</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">5</td>
<td style="border:1px solid #ddd;padding:10px;">Copy the generated backend URL and set it as <code>VITE_API_URL</code> in Vercel/Netlify for the Frontend.</td>
</tr>

</tbody>
</table>
<hr>

<h2 id="package-dependencies" style="color:#0d6efd;">📦 Package Dependencies</h2>

<h3 style="color:#6f42c1;">⚙️ Backend — Key Packages</h3>

<table style="border-collapse:collapse;width:100%;text-align:left;">
<thead>
<tr style="background:#f8f9fa;">
<th style="border:1px solid #ddd;padding:10px;">Package</th>
<th style="border:1px solid #ddd;padding:10px;">Version</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🚏 express</td>
<td style="border:1px solid #ddd;padding:10px;">^4.21.2</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🍃 mongoose</td>
<td style="border:1px solid #ddd;padding:10px;">^8.8.4</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🔒 bcryptjs</td>
<td style="border:1px solid #ddd;padding:10px;">^2.4.3</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🔑 jsonwebtoken</td>
<td style="border:1px solid #ddd;padding:10px;">^9.0.2</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🔗 cors</td>
<td style="border:1px solid #ddd;padding:10px;">^2.8.5</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">⚙️ dotenv</td>
<td style="border:1px solid #ddd;padding:10px;">^16.4.7</td>
</tr>

</tbody>
</table>

<br>

<h3 style="color:#6f42c1;">🎨 Frontend — Key Packages</h3>

<table style="border-collapse:collapse;width:100%;text-align:left;">
<thead>
<tr style="background:#f8f9fa;">
<th style="border:1px solid #ddd;padding:10px;">Package</th>
<th style="border:1px solid #ddd;padding:10px;">Version</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd;padding:10px;">⚛️ react</td>
<td style="border:1px solid #ddd;padding:10px;">^18.3.1</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🧭 react-router-dom</td>
<td style="border:1px solid #ddd;padding:10px;">^7.0.2</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🌐 axios</td>
<td style="border:1px solid #ddd;padding:10px;">^1.7.9</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🎨 tailwindcss</td>
<td style="border:1px solid #ddd;padding:10px;">^3.4.16</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🎞️ framer-motion</td>
<td style="border:1px solid #ddd;padding:10px;">^11.13.1</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">🎯 lucide-react</td>
<td style="border:1px solid #ddd;padding:10px;">^0.468.0</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;">⚡ vite (dev)</td>
<td style="border:1px solid #ddd;padding:10px;">^6.0.1</td>
</tr>

</tbody>
</table>

<hr>

<h2 id="available-scripts" style="color:#198754;">📜 Available Scripts</h2>

<h3 style="color:#fd7e14;">🖥️ Backend (<code>cd BACKEND</code>)</h3>

<table style="border-collapse:collapse;width:100%;text-align:left;">
<thead>
<tr style="background:#f8f9fa;">
<th style="border:1px solid #ddd;padding:10px;">Command</th>
<th style="border:1px solid #ddd;padding:10px;">What it does</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>npm run dev</code></td>
<td style="border:1px solid #ddd;padding:10px;">🔄 Start with nodemon (auto-restarts on file changes)</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>npm start</code></td>
<td style="border:1px solid #ddd;padding:10px;">🚀 Start normally for production</td>
</tr>

</tbody>
</table>

<br>

<h3 style="color:#fd7e14;">🌐 Frontend (<code>cd FRONTEND</code>)</h3>

<table style="border-collapse:collapse;width:100%;text-align:left;">
<thead>
<tr style="background:#f8f9fa;">
<th style="border:1px solid #ddd;padding:10px;">Command</th>
<th style="border:1px solid #ddd;padding:10px;">What it does</th>
</tr>
</thead>

<tbody>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>npm run dev</code></td>
<td style="border:1px solid #ddd;padding:10px;">⚡ Start Vite dev server on <code>http://localhost:5173</code></td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>npm run build</code></td>
<td style="border:1px solid #ddd;padding:10px;">📦 Build for production (output goes to <code>dist/</code>)</td>
</tr>

<tr>
<td style="border:1px solid #ddd;padding:10px;"><code>npm run preview</code></td>
<td style="border:1px solid #ddd;padding:10px;">👀 Preview the production build locally</td>
</tr>

</tbody>
</table>
<hr>

<h2 id="contact" style="color:#0d6efd;">📬 Contact</h2>

<div style="border:1px solid #d0d7de;padding:25px;border-radius:12px;background-color:#f6f8fa;max-width:750px;">

<h3 style="margin-top:0;color:#6f42c1;">👨💻 Aman Gupta</h3>

<p style="font-size:15px;">
<b>Full-Stack Developer</b> | MERN Stack
</p>

<p>
Passionate about building scalable full-stack platforms and AI-powered applications that solve real-world problems.
</p>

<br>

<h4 style="color:#198754;">🌐 Connect With Me</h4>

<table style="border-collapse:collapse;width:100%;text-align:left;">
<tbody>

<tr>
<td style="padding:8px;font-weight:bold;">📧 Email</td>
<td style="padding:8px;">
<a href="mailto:ag0567688@gmail.com">ag0567688@gmail.com</a>
</td>
</tr>

<tr>
<td style="padding:8px;font-weight:bold;">💼 LinkedIn</td>
<td style="padding:8px;">
<a href="https://linkedin.com/in/amangupta9454">linkedin.com/in/amangupta9454</a>
</td>
</tr>

<tr>
<td style="padding:8px;font-weight:bold;">🐙 GitHub</td>
<td style="padding:8px;">
<a href="https://github.com/amangupta9454">github.com/amangupta9454</a>
</td>
</tr>

<tr>
<td style="padding:8px;font-weight:bold;">🌐 Portfolio</td>
<td style="padding:8px;">
<a href="http://gupta-aman-portfolio.netlify.app/">gupta-aman-portfolio.netlify.app</a>
</td>
</tr>

</tbody>
</table>

<br>

<h4 style="color:#fd7e14;">🚀 Open For</h4>

<ul>
<li>💡 Innovative healthcare and AI projects</li>
<li>🤝 Open-source collaborations</li>
<li>🧑💻 Full-stack development opportunities</li>
<li>📊 Hackathons and technical competitions</li>
</ul>

<p style="margin-top:15px;">
If you have questions, collaboration ideas, or feedback about the <b>IIC Platform</b>, feel free to reach out. Let's build impactful technology together! 🚀
</p>

</div>
