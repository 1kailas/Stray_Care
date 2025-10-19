# ⚠️ Railway Deployment Configuration

**This project requires the Root Directory to be set in Railway settings.**

## Railway Settings Required:

### 1. Root Directory
Go to: **Settings → General → Root Directory**
```
backend
```

### 2. Environment Variables
Add these in the **Variables** tab:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_secret_key
SERVER_PORT=5000
SPRING_PROFILES_ACTIVE=prod
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend-url.vercel.app
```

### 3. Build Configuration
Railway will auto-detect from `backend/railway.toml`:
- **Builder:** Nixpacks
- **Build Command:** `mvn clean package -DskipTests`
- **Start Command:** `java -jar target/stray-dogcare-backend-1.0.0.jar`

---

## ⚙️ Without Root Directory Set:
- ❌ Railway will try to deploy the full-stack app
- ❌ Will fail with "start.sh not found" or similar errors
- ❌ Backend won't build correctly

## ✅ With Root Directory Set to `backend`:
- ✅ Railway deploys only the Spring Boot backend
- ✅ Nixpacks auto-detects Java/Maven project
- ✅ Builds and runs successfully

---

**IMPORTANT:** After setting Root Directory, redeploy or trigger a new deployment.
