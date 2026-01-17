# Medical Inventory System - Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] MongoDB connection tested
- [ ] Build passes without errors: `npm run build`
- [ ] All tests passing (if applicable)
- [ ] Seed data loaded successfully
- [ ] Admin credentials verified
- [ ] SSL certificates configured
- [ ] Backup strategy in place

## Environment Variables (Production)

```env
# MongoDB
MONGODB_URI=mongodb+srv://prod_user:secure_password@prod-cluster.mongodb.net/medical-inventory-prod

# Security
JWT_SECRET=your-super-secure-random-string-min-32-chars
NODE_ENV=production

# Optional: API Keys and external services
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

## Deploy to Vercel

### 1. Connect Repository
```bash
vercel login
vercel link
```

### 2. Set Environment Variables
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
```

### 3. Deploy
```bash
npm run build
vercel deploy --prod
```

## Deploy to Self-Hosted Server

### 1. Setup Node.js & PM2
```bash
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
nvm install 18
npm install -g pm2
```

### 2. Clone Repository
```bash
git clone <your-repo-url>
cd medical-inventory-system
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env.local
# Edit .env.local with production values
```

### 4. Build & Start
```bash
npm run build
pm2 start npm --name "mis" -- start
pm2 save
pm2 startup
```

### 5. Setup Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. Enable HTTPS (Let's Encrypt)
```bash
sudo certbot certonly --nginx -d yourdomain.com
# Update nginx config with SSL certificates
```

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Build & Run
```bash
docker build -t medical-inventory:latest .
docker run -e MONGODB_URI=<uri> -e JWT_SECRET=<secret> -p 3000:3000 medical-inventory:latest
```

## Monitoring & Maintenance

### Logs
```bash
# Vercel
vercel logs

# Self-hosted
pm2 logs mis

# Docker
docker logs <container-id>
```

### Backup Strategy
- **Database**: Enable MongoDB Atlas automated backups
- **Code**: Git repository backup
- **Files**: Regular snapshot backups of server

### Security Hardening
1. Keep dependencies updated: `npm audit fix`
2. Use strong JWT_SECRET (minimum 32 characters)
3. Enable CORS properly in production
4. Implement rate limiting on API endpoints
5. Monitor for suspicious activities
6. Regular security audits

## Rollback Procedure

### Vercel
```bash
vercel rollback
```

### Self-hosted
```bash
git revert <commit-hash>
npm run build
pm2 restart mis
```

## Performance Optimization

- Enable gzip compression in Nginx
- Use CDN for static assets
- Enable Next.js Image Optimization
- Database query indexing
- Connection pooling for MongoDB
- Implement caching strategies

---

**Document Version**: 1.0  
**Last Updated**: January 2026
