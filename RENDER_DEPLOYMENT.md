# Backend Deployment Guide (Render)

## Prerequisites
- GitHub repository pushed (✓ Already done)
- MongoDB Atlas account with connection string

## Step-by-Step Deployment on Render

### 1. Create MongoDB Atlas Database (Free Tier)
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user:
   - Database Access → Add New Database User
   - Username: `musicplayer`
   - Password: (generate a secure password)
5. Configure Network Access:
   - Network Access → Add IP Address
   - Add `0.0.0.0/0` (Allow access from anywhere)
6. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string: `mongodb+srv://musicplayer:<password>@cluster.mongodb.net/music-player?retryWrites=true&w=majority`
   - Replace `<password>` with your actual password

### 2. Deploy Backend on Render

1. **Go to Render**: https://render.com/
2. **Sign up/Login** with your GitHub account
3. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `Music-Mood-Player`
   
4. **Configure the Web Service**:
   ```
   Name: music-mood-player-api
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: server
   Runtime: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: Free
   ```

5. **Add Environment Variables**:
   Click "Advanced" → "Add Environment Variable" and add:
   
   ```
   PORT=5001
   MONGODB_URI=mongodb+srv://musicplayer:<password>@cluster.mongodb.net/music-player?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-characters
   JAMENDO_CLIENT_ID=a3e52d4b
   NODE_ENV=production
   ```
   
   **Important**: 
   - Replace `<password>` in MONGODB_URI with your actual MongoDB password
   - Generate a secure JWT_SECRET (at least 32 characters)

6. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your backend
   - Wait for the deployment to complete (5-10 minutes)

7. **Get Your Backend URL**:
   - After deployment, you'll see your service URL
   - It will look like: `https://music-mood-player-api.onrender.com`
   - Copy this URL - you'll need it for the frontend

### 3. Test Your Backend

Once deployed, test the following endpoints:

```bash
# Health check
curl https://your-backend-url.onrender.com/

# Test music endpoint
curl https://your-backend-url.onrender.com/api/music/tracks?mood=happy

# Test auth signup (replace with your URL)
curl -X POST https://your-backend-url.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
```

### 4. Common Issues & Solutions

**Issue: "Application failed to respond"**
- Check logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure PORT is set to 5001

**Issue: "Cannot connect to MongoDB"**
- Verify MongoDB connection string is correct
- Check MongoDB Atlas Network Access allows 0.0.0.0/0
- Ensure password doesn't contain special characters (URL encode if needed)

**Issue: "Build failed"**
- Check if all dependencies are in package.json
- Verify tsconfig.json exists in server folder
- Check build logs for specific error messages

### 5. Enable Auto-Deploy (Optional)

Render automatically redeploys when you push to GitHub:
- Settings → Build & Deploy → Auto-Deploy: Yes
- Any push to main branch will trigger a new deployment

### 6. Monitor Your Service

- **Logs**: Render Dashboard → Your Service → Logs
- **Metrics**: Dashboard shows CPU, Memory, and Request stats
- **Alerts**: Set up email alerts for service issues

### 7. Update Frontend Configuration

After backend is deployed, update your frontend to use the production API URL.

Create/update `client/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

## Free Tier Limitations

Render's free tier has some limitations:
- ⚠️ **Spins down after 15 minutes of inactivity**
- First request after spin-down takes 30-60 seconds (cold start)
- 750 hours/month of runtime
- Shared CPU/RAM

**Solution**: Use a service like [UptimeRobot](https://uptimerobot.com/) to ping your backend every 14 minutes to keep it active.

## Next Steps

1. ✓ Backend deployed on Render
2. → Deploy Frontend on Vercel (next step)
3. → Connect frontend to backend
4. → Test the complete application

## Support

If you encounter issues:
- Check Render logs: Dashboard → Logs
- MongoDB Atlas logs: Cluster → Metrics
- GitHub Issues: Report problems in your repository
