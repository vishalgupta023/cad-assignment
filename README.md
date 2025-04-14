# 🧱 CAD Block Viewer

This is a full-stack CAD Block Viewer web application that parses and displays DXF file block data. It includes:

- 🖥️ **Frontend**: Built with React + TypeScript using Vite.
- ⚙️ **Backend**: Built with Express.js, using PostgreSQL with Sequelize ORM.
- 📦 **Database**: PostgreSQL.
- 🧪 **Testing**: Uses Vitest for backend unit tests.
- 🤖 **AI tools used**: Claude & ChatGPT.

---


## 🚀 Setup Instructions

### 🔧 Backend (Server)

#### 📂 Navigate to server
```bash
cd server
📦 Install dependencies
bash
Copy
Edit
npm install
⚙️ Database Configuration
Database connection settings are configured in:

pgsql
Copy
Edit
server/src/config/database.ts
Environment variables used:

ts
Copy
Edit
database: process.env.DB_NAME     || 'cad_block_viewer',
username: process.env.DB_USER     || 'postgres',
password: process.env.DB_PASSWORD || 'vishal',
host:     process.env.DB_HOST     || 'localhost',
You can create a .env file in the server directory with:

env
Copy
Edit
DB_NAME=cad_block_viewer
DB_USER=postgres
DB_PASSWORD=vishal
DB_HOST=localhost
▶️ Development mode
Open two terminal windows:

In the first:

bash
Copy
Edit
tsc -w
In the second:

bash
Copy
Edit
npm run dev
🧪 Run tests
bash
Copy
Edit
npm run test
⚠️ Note: Currently facing a small bug with the test (will be fixed soon).

🎨 Frontend (Client)
📂 Navigate to client
bash
Copy
Edit
cd client
📦 Install dependencies
bash
Copy
Edit
npm install
▶️ Start in development
bash
Copy
Edit
npm run dev
🏗️ Build for production
bash
Copy
Edit
npm run build
🔍 Preview production
bash
Copy
Edit
npm run preview
🔗 Postman API Collection
You can find and test all backend API endpoints using this shared Postman collection:

👉 View Postman Collection :https://www.postman.com/jgswdhs/backend/request/v1x5rlu/get-all-files?action=share&source=copy-link&creator=43257483

📧 Submission
Please submit your GitHub repository link and video demonstration to [recruiting email] with the subject:

objectivec
Copy
Edit
CAD Block Viewer Assignment - Vishal Gupta
⏱️ Time Spent
Total time spent on the assignment: ~5 hours

yaml
Copy
Edit

---

Let me know if you want a downloadable file version of this too!
