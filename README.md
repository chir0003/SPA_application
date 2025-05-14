## Google Cloud Service Account Setup

1. Copy `SPA/backend/serviceAccountKey.example.json` to `SPA/backend/serviceAccountKey.json`
2. Replace the placeholder values in `serviceAccountKey.json` with your actual Google Cloud service account credentials
3. Never commit `serviceAccountKey.json` to version control
4. Keep your service account credentials secure and never share them publicly

## Running the Application

### Frontend (Angular)
1. Navigate to the frontend directory:
   ```bash
   cd SPA
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install --force
   ```
3. Start the development server:
   ```bash
   ng serve
   ```
   The application will be available at `http://localhost:4200`

### Backend (Node.js)
1. Navigate to the backend directory:
   ```bash
   cd SPA/backend
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   node app.js
   ```
   The server will be available at `http://localhost:3000`

Note: Make sure both frontend and backend servers are running simultaneously for the application to work properly.
