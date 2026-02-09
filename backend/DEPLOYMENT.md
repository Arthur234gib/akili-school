# Akili School - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Development Setup](#development-setup)
3. [Production Deployment](#production-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Database Management](#database-management)
6. [Environment Configuration](#environment-configuration)
7. [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

### Required Software
- Node.js 18+ (LTS recommended)
- PostgreSQL 12+
- npm or yarn
- Git

### Optional
- Docker & Docker Compose (for containerized deployment)
- nginx (for reverse proxy)
- PM2 (for process management)

## Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/Arthur234gib/akili-school.git
cd akili-school/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your settings
```

### 4. Setup Database
```bash
# Method 1: Using the setup script
chmod +x scripts/setup-db.sh
./scripts/setup-db.sh

# Method 2: Manual setup
createdb akili_db
psql -U postgres -d akili_db -f db/schema.sql
```

### 5. Start Development Server
```bash
npm run dev
```

Server will be available at `http://localhost:3000`

## Production Deployment

### Option 1: Traditional Deployment

#### 1. Prepare Server
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Install PM2
sudo npm install -g pm2
```

#### 2. Clone and Build
```bash
git clone https://github.com/Arthur234gib/akili-school.git
cd akili-school/backend
npm ci --only=production
npm run build
```

#### 3. Configure Environment
```bash
cp .env.example .env
nano .env  # Edit with production settings
```

Important production settings:
```env
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=akili_db
DB_USER=akili_user
DB_PASSWORD=STRONG_PASSWORD_HERE
JWT_SECRET=RANDOM_SECRET_KEY_HERE
```

#### 4. Setup Database
```bash
sudo -u postgres createuser akili_user
sudo -u postgres createdb akili_db -O akili_user
sudo -u postgres psql -c "ALTER USER akili_user WITH PASSWORD 'STRONG_PASSWORD_HERE';"
psql -U akili_user -d akili_db -f db/schema.sql
```

#### 5. Start with PM2
```bash
pm2 start dist/index.js --name akili-backend
pm2 save
pm2 startup
```

#### 6. Setup Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name api.akili.school;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 7. SSL Certificate (Let's Encrypt)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d api.akili.school
```

### Option 2: Docker Deployment

#### 1. Install Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### 2. Deploy with Docker Compose
```bash
cd akili-school/backend
docker-compose up -d
```

#### 3. View Logs
```bash
docker-compose logs -f backend
```

#### 4. Stop Services
```bash
docker-compose down
```

## Database Management

### Backup Database
```bash
# Docker
docker-compose exec postgres pg_dump -U postgres akili_db > backup_$(date +%Y%m%d).sql

# Traditional
pg_dump -U akili_user akili_db > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
# Docker
cat backup.sql | docker-compose exec -T postgres psql -U postgres akili_db

# Traditional
psql -U akili_user akili_db < backup.sql
```

### Database Migrations
```bash
# Apply schema updates
psql -U akili_user -d akili_db -f db/schema.sql
```

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | `production` |
| `PORT` | Server port | `3000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `akili_db` |
| `DB_USER` | Database user | `akili_user` |
| `DB_PASSWORD` | Database password | `strong_password` |
| `JWT_SECRET` | JWT signing secret | `random_secret_key` |
| `UPLOAD_DIR` | Upload directory | `/tmp/uploads` |
| `MAX_FILE_SIZE` | Max upload size in bytes | `10485760` |
| `CORS_ORIGIN` | CORS allowed origins | `https://akili.school` |

### Generate Secure Secrets

```bash
# Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate password
openssl rand -base64 32
```

## Monitoring & Maintenance

### PM2 Monitoring
```bash
# View running processes
pm2 list

# Monitor logs
pm2 logs akili-backend

# Monitor metrics
pm2 monit

# Restart
pm2 restart akili-backend

# Stop
pm2 stop akili-backend

# Delete
pm2 delete akili-backend
```

### Docker Monitoring
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# View resource usage
docker stats

# Restart services
docker-compose restart backend
```

### Health Checks
```bash
# Check API health
curl http://localhost:3000/health

# Expected response
{"status":"ok","env":"production"}
```

### Database Optimization
```sql
-- Vacuum and analyze tables
VACUUM ANALYZE;

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

### Log Rotation
```bash
# Configure PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Configure firewall rules
- [ ] Set up database user with minimal privileges
- [ ] Enable database connection encryption
- [ ] Regular security updates
- [ ] Regular backups
- [ ] Monitor access logs
- [ ] Implement rate limiting

## Performance Tuning

### PostgreSQL Configuration
Edit `/etc/postgresql/*/main/postgresql.conf`:
```conf
# Memory
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 16MB

# Connections
max_connections = 100

# Logging
log_statement = 'mod'
log_duration = on
log_min_duration_statement = 1000
```

### Node.js Performance
```bash
# Increase memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm start
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check database exists
psql -U postgres -l | grep akili_db

# Test connection
psql -U akili_user -d akili_db -c "SELECT 1"
```

### Application Issues
```bash
# Check logs
pm2 logs akili-backend --lines 100

# Check process status
pm2 status

# Check port availability
sudo netstat -tlnp | grep 3000
```

### Docker Issues
```bash
# Check container logs
docker-compose logs backend

# Check container status
docker-compose ps

# Rebuild containers
docker-compose build --no-cache
docker-compose up -d
```

## Support

For issues or questions:
- Email: admin@akili.school
- GitHub Issues: https://github.com/Arthur234gib/akili-school/issues

## License

Copyright © 2026 Akili School. All rights reserved.
