# 🔧 Quick Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Backend Issues

#### ❌ Port 5000 Already in Use
**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Option 1: Kill the process using port 5000
sudo lsof -i :5000
sudo kill -9 <PID>

# Option 2: Change the port in application.yml
# Edit backend/src/main/resources/application.yml
server:
  port: 8080
```

Then update frontend `.env`:
```
VITE_API_URL=http://localhost:8080/api
```

---

#### ❌ MongoDB Connection Failed
**Error:** `MongoSocketOpenException` or `Connection refused`

**Solution:**
```bash
# Check MongoDB status
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB on startup
sudo systemctl enable mongod

# Verify it's listening
sudo netstat -plntu | grep 27017
```

**Alternative:** Use MongoDB Atlas (cloud):
1. Create free cluster at https://www.mongodb.com/cloud/atlas
2. Update `application.yml`:
   ```yaml
   spring:
     data:
       mongodb:
         uri: mongodb+srv://username:password@cluster.mongodb.net/straydog
   ```

---

#### ❌ Backend Fails to Start
**Error:** Various startup errors

**Solutions:**

1. **Check Java version:**
   ```bash
   java -version  # Should be 17 or higher
   ```

2. **Clean and rebuild:**
   ```bash
   cd backend
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

3. **Check logs:**
   ```bash
   # Look for error messages in terminal output
   # Common issues: MongoDB, Port conflict, Missing dependencies
   ```

---

### 🔵 Frontend Issues

#### ❌ Cannot Connect to Backend
**Error:** `Network Error` or `Failed to fetch`

**Solutions:**

1. **Verify backend is running:**
   ```bash
   curl http://localhost:5000/actuator/health
   ```
   Should return: `{"status":"UP"}`

2. **Check .env file:**
   ```bash
   cat .env
   ```
   Should contain: `VITE_API_URL=http://localhost:5000/api`

3. **Restart frontend:**
   ```bash
   # Stop with Ctrl+C
   npm run dev
   ```

---

#### ❌ Login/Register Not Working
**Error:** `401 Unauthorized` or form submission fails

**Solutions:**

1. **Check browser console (F12):**
   - Look for network errors
   - Check the API response

2. **Verify backend is accepting requests:**
   ```bash
   # Test registration
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"test123","role":"USER"}'
   ```

3. **Check CORS settings:**
   In `backend/src/main/resources/application.yml`:
   ```yaml
   application:
     cors:
       allowed-origins: http://localhost:5173
   ```

---

#### ❌ White Screen / App Won't Load
**Error:** Blank page, no errors

**Solutions:**

1. **Check browser console (F12):**
   Look for JavaScript errors

2. **Clear cache and reload:**
   - Press Ctrl+Shift+R (Linux/Windows)
   - Press Cmd+Shift+R (Mac)

3. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

---

### 🔐 Authentication Issues

#### ❌ 401 Unauthorized After Some Time
**Error:** Token expired

**Solution:**
Just logout and login again. JWT tokens expire after 24 hours by default.

To change expiration time, edit `application.yml`:
```yaml
application:
  security:
    jwt:
      expiration: 86400000  # 24 hours in milliseconds
```

---

#### ❌ Can't Access Protected Routes
**Error:** Redirected to login immediately

**Solution:**

1. **Check token in browser:**
   - Open DevTools (F12)
   - Go to Application tab
   - Check localStorage for 'token'

2. **Clear and re-login:**
   ```javascript
   // In browser console
   localStorage.clear()
   // Then login again
   ```

---

### 💾 Data Issues

#### ❌ No Data Showing / Empty Lists
**Error:** Components show "No data found"

**Solutions:**

1. **Check if data exists in MongoDB:**
   ```bash
   mongosh
   use straydog
   db.dogReports.find().count()
   db.users.find().count()
   ```

2. **Create test data manually:**
   - Use the "Report Stray Dog" form
   - Register as volunteer
   - Submit adoption application

3. **Check API responses:**
   - Open DevTools (F12)
   - Go to Network tab
   - Look at API responses

---

#### ❌ Data Not Saving
**Error:** Form submits but data doesn't appear

**Solutions:**

1. **Check backend logs:**
   Look for validation errors or database issues

2. **Test API directly:**
   ```bash
   curl -X POST http://localhost:5000/api/dog-reports \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"description":"Test","condition":"HEALTHY","location":"Test Zone","status":"REPORTED","latitude":0,"longitude":0}'
   ```

3. **Verify MongoDB is writable:**
   ```bash
   mongosh
   use straydog
   db.test.insertOne({test: "data"})
   ```

---

### 🌐 CORS Errors

#### ❌ CORS Policy Error
**Error:** `blocked by CORS policy`

**Solution:**

Update `application.yml`:
```yaml
application:
  cors:
    allowed-origins: http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173
```

Restart backend after changes.

---

## 🧪 Testing Connectivity

### Test Backend Health
```bash
curl http://localhost:5000/actuator/health
# Expected: {"status":"UP"}
```

### Test Authentication
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"USER"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Test Dog Reports API
```bash
# Get all reports (requires authentication)
curl http://localhost:5000/api/dog-reports \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 📞 Still Having Issues?

### Debugging Checklist

- [ ] MongoDB is running (`sudo systemctl status mongod`)
- [ ] Backend is running (`curl http://localhost:5000/actuator/health`)
- [ ] Frontend is running (can access http://localhost:5173)
- [ ] .env file exists and has correct API URL
- [ ] Browser console (F12) checked for errors
- [ ] Backend terminal checked for errors
- [ ] Port 5000 is not blocked by firewall
- [ ] Port 5173 is not blocked by firewall

### Collect Debug Information

1. **Backend logs:**
   Copy the terminal output where backend is running

2. **Frontend console:**
   F12 → Console tab → Screenshot errors

3. **Network requests:**
   F12 → Network tab → Look at failed requests

4. **MongoDB status:**
   ```bash
   sudo systemctl status mongod
   mongosh --eval "db.runCommand({ ping: 1 })"
   ```

5. **Environment:**
   ```bash
   java -version
   node -v
   npm -v
   ```

---

## 🚀 Performance Tips

### Backend Optimization
- Use connection pooling (default in Spring Boot)
- Add indexes to MongoDB collections
- Enable caching for frequently accessed data

### Frontend Optimization
- Use React.memo for expensive components
- Implement pagination for large lists
- Lazy load heavy components
- Use production build for deployment

---

## 📝 Logs Location

- **Backend logs:** Terminal output where `mvnw spring-boot:run` is running
- **MongoDB logs:** `/var/log/mongodb/mongod.log`
- **Frontend logs:** Browser console (F12)

---

**Need more help?** Check:
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Complete setup instructions
- [INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md) - Integration details
- Backend README.md - Backend-specific documentation
