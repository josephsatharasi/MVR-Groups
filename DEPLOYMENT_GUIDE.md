# Backend Deployment Guide for Apache Server

## Prerequisites
- Apache server with mod_proxy and mod_proxy_http enabled
- Node.js installed on server
- PM2 installed globally: `npm install -g pm2`

## Deployment Steps

### 1. Upload Backend Files
Upload the entire `backend` folder to your Apache server (e.g., `/var/www/mvr-backend/`)

### 2. Install Dependencies
```bash
cd /var/www/mvr-backend/
npm install --production
```

### 3. Configure Environment Variables
Update `.env` file with production values if needed

### 4. Enable Apache Modules
```bash
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite
sudo systemctl restart apache2
```

### 5. Configure Apache Virtual Host
Add this to your Apache config (e.g., `/etc/apache2/sites-available/mvr-backend.conf`):

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    
    ProxyPreserveHost On
    ProxyPass / http://localhost:5000/
    ProxyPassReverse / http://localhost:5000/
    
    ErrorLog ${APACHE_LOG_DIR}/mvr-backend-error.log
    CustomLog ${APACHE_LOG_DIR}/mvr-backend-access.log combined
</VirtualHost>
```

Enable the site:
```bash
sudo a2ensite mvr-backend.conf
sudo systemctl reload apache2
```

### 6. Start Backend with PM2
```bash
cd /var/www/mvr-backend/
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 7. Update Frontend CORS
Update `server.js` CORS origin to include your production domain

## Useful PM2 Commands
- `pm2 status` - Check app status
- `pm2 logs mvr-backend` - View logs
- `pm2 restart mvr-backend` - Restart app
- `pm2 stop mvr-backend` - Stop app
- `pm2 delete mvr-backend` - Remove app

## Troubleshooting
- Check Apache logs: `tail -f /var/log/apache2/error.log`
- Check PM2 logs: `pm2 logs`
- Verify Node.js is running: `pm2 status`
