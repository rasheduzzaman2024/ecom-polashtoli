#!/bin/bash

#####################################################################
# Polashtoli Store - Master Deployment Script
# Complete deployment automation for all environments
#####################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"

#####################################################################
# Helper Functions
#####################################################################

print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

check_command() {
    if command -v $1 &> /dev/null; then
        print_success "$1 is installed"
        return 0
    else
        print_error "$1 is not installed"
        return 1
    fi
}

#####################################################################
# Pre-flight Checks
#####################################################################

preflight_checks() {
    print_header "Running Pre-flight Checks"
    
    local all_good=true
    
    # Check required commands
    check_command "docker" || all_good=false
    check_command "docker-compose" || all_good=false
    check_command "java" || all_good=false
    check_command "mvn" || all_good=false
    check_command "python3" || all_good=false
    check_command "psql" || all_good=false
    check_command "git" || all_good=false
    
    if [ "$all_good" = false ]; then
        print_error "Some required tools are missing. Please install them first."
        exit 1
    fi
    
    # Check Java version
    java_version=$(java -version 2>&1 | grep version | awk -F '"' '{print $2}' | awk -F '.' '{print $1}')
    if [ "$java_version" -ge 17 ]; then
        print_success "Java version $java_version (>= 17 required)"
    else
        print_error "Java 17 or higher required, found version $java_version"
        exit 1
    fi
    
    # Check Python version
    python_version=$(python3 --version | awk '{print $2}' | awk -F '.' '{print $1"."$2}')
    if (( $(echo "$python_version >= 3.11" | bc -l) )); then
        print_success "Python version $python_version (>= 3.11 required)"
    else
        print_error "Python 3.11 or higher required, found version $python_version"
        exit 1
    fi
    
    print_success "All pre-flight checks passed!"
    echo ""
}

#####################################################################
# Environment Selection
#####################################################################

select_environment() {
    print_header "Select Deployment Environment"
    echo ""
    echo "1) Development (Local machine with Docker)"
    echo "2) Development (Local machine without Docker)"
    echo "3) Production (Docker Compose)"
    echo "4) Production (Manual setup)"
    echo "5) Cloud (AWS/GCP/Azure)"
    echo "6) Exit"
    echo ""
    read -p "Enter your choice [1-6]: " choice
    
    case $choice in
        1) deploy_docker_dev ;;
        2) deploy_local_dev ;;
        3) deploy_docker_prod ;;
        4) deploy_manual_prod ;;
        5) deploy_cloud ;;
        6) exit 0 ;;
        *) print_error "Invalid choice"; select_environment ;;
    esac
}

#####################################################################
# Development Deployment (Docker)
#####################################################################

deploy_docker_dev() {
    print_header "Deploying to Development Environment (Docker)"
    
    cd "$PROJECT_ROOT"
    
    # Check if .env file exists
    if [ ! -f "docker/.env" ]; then
        print_info "Creating .env file for development..."
        cat > docker/.env << 'EOF'
# Database
POSTGRES_DB=polashtoli_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Backend
SPRING_PROFILES_ACTIVE=dev
JWT_SECRET=dev-secret-key-change-in-production-please-make-it-long

# Chatbot
CHATBOT_API_URL=http://chatbot:5000

# Ports
FRONTEND_PORT=80
BACKEND_PORT=8080
CHATBOT_PORT=5000
DB_PORT=5432
EOF
        print_success "Created .env file"
    fi
    
    # Start services
    print_info "Starting Docker services..."
    cd docker
    
    # Stop any existing containers
    docker-compose down 2>/dev/null || true
    
    # Build and start
    docker-compose up -d --build
    
    # Wait for services to start
    print_info "Waiting for services to start..."
    sleep 10
    
    # Check service health
    print_info "Checking service health..."
    
    if docker-compose ps | grep -q "Up"; then
        print_success "Services are running!"
        echo ""
        print_info "Access your application:"
        echo "  Frontend:  http://localhost"
        echo "  Backend:   http://localhost:8080"
        echo "  API Docs:  http://localhost:8080/swagger-ui.html"
        echo "  Chatbot:   http://localhost:5000"
        echo "  Database:  localhost:5432"
        echo ""
        print_info "View logs: docker-compose logs -f"
        print_info "Stop services: docker-compose down"
    else
        print_error "Some services failed to start"
        docker-compose logs
        exit 1
    fi
}

#####################################################################
# Local Development Deployment (Without Docker)
#####################################################################

deploy_local_dev() {
    print_header "Deploying to Local Development Environment"
    
    cd "$PROJECT_ROOT"
    
    # 1. Setup Database
    print_info "Setting up PostgreSQL database..."
    
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Create database
    sudo -u postgres psql -c "CREATE DATABASE polashtoli_db;" 2>/dev/null || print_warning "Database already exists"
    
    # Load schema
    sudo -u postgres psql -d polashtoli_db -f database/schema.sql
    print_success "Database setup complete"
    
    # 2. Backend Setup
    print_info "Setting up backend..."
    cd backend
    
    # Update application.properties for local dev
    cat > src/main/resources/application-dev.properties << 'EOF'
spring.datasource.url=jdbc:postgresql://localhost:5432/polashtoli_db
spring.datasource.username=postgres
spring.datasource.password=postgres
server.port=8080
jwt.secret=dev-secret-key-change-in-production
spring.profiles.active=dev
EOF
    
    # Build
    mvn clean install -DskipTests
    print_success "Backend build complete"
    
    # 3. Chatbot Setup
    print_info "Setting up chatbot..."
    cd "$PROJECT_ROOT/chatbot"
    
    # Create virtual environment if not exists
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    pip install -r requirements.txt
    deactivate
    print_success "Chatbot setup complete"
    
    # 4. Create startup scripts
    print_info "Creating startup scripts..."
    
    # Backend startup script
    cat > "$PROJECT_ROOT/start-backend.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/backend"
mvn spring-boot:run
EOF
    chmod +x "$PROJECT_ROOT/start-backend.sh"
    
    # Chatbot startup script
    cat > "$PROJECT_ROOT/start-chatbot.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/chatbot"
source venv/bin/activate
python -m app.main
EOF
    chmod +x "$PROJECT_ROOT/start-chatbot.sh"
    
    # Frontend startup script
    cat > "$PROJECT_ROOT/start-frontend.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/frontend"
python3 -m http.server 8081
EOF
    chmod +x "$PROJECT_ROOT/start-frontend.sh"
    
    # Master startup script
    cat > "$PROJECT_ROOT/start-all.sh" << 'EOF'
#!/bin/bash
echo "Starting Polashtoli Store..."
echo "Opening terminals for each service..."

# Start backend in new terminal
gnome-terminal --tab --title="Backend" -- bash -c "$(dirname "$0")/start-backend.sh; exec bash"

# Wait a bit
sleep 3

# Start chatbot in new terminal
gnome-terminal --tab --title="Chatbot" -- bash -c "$(dirname "$0")/start-chatbot.sh; exec bash"

# Start frontend in new terminal
gnome-terminal --tab --title="Frontend" -- bash -c "$(dirname "$0")/start-frontend.sh; exec bash"

echo ""
echo "Services starting in separate terminals!"
echo ""
echo "Access your application:"
echo "  Frontend:  http://localhost:8081"
echo "  Backend:   http://localhost:8080"
echo "  API Docs:  http://localhost:8080/swagger-ui.html"
echo "  Chatbot:   http://localhost:5000"
echo ""
EOF
    chmod +x "$PROJECT_ROOT/start-all.sh"
    
    print_success "Startup scripts created!"
    echo ""
    print_info "To start all services, run: ./start-all.sh"
    print_info "Or start services individually:"
    echo "  Backend:  ./start-backend.sh"
    echo "  Chatbot:  ./start-chatbot.sh"
    echo "  Frontend: ./start-frontend.sh"
    echo ""
    
    # Ask if user wants to start now
    read -p "Start services now? (y/n): " start_now
    if [ "$start_now" = "y" ] || [ "$start_now" = "Y" ]; then
        "$PROJECT_ROOT/start-all.sh"
    fi
}

#####################################################################
# Production Deployment (Docker)
#####################################################################

deploy_docker_prod() {
    print_header "Deploying to Production Environment (Docker)"
    
    cd "$PROJECT_ROOT"
    
    # Check if production config exists
    if [ ! -f "docker/.env.production" ]; then
        print_warning "Production .env file not found. Creating template..."
        cat > docker/.env.production << 'EOF'
# IMPORTANT: Update these values for production!

# Database
POSTGRES_DB=polashtoli_db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=CHANGE_THIS_STRONG_PASSWORD

# Backend
SPRING_PROFILES_ACTIVE=prod
JWT_SECRET=CHANGE_THIS_TO_A_VERY_LONG_RANDOM_STRING_AT_LEAST_256_BITS

# Chatbot
CHATBOT_API_URL=http://chatbot:5000

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Payment Gateway (bKash example)
BKASH_APP_KEY=your-bkash-app-key
BKASH_APP_SECRET=your-bkash-app-secret
BKASH_USERNAME=your-bkash-username
BKASH_PASSWORD=your-bkash-password

# Ports
FRONTEND_PORT=80
BACKEND_PORT=8080
CHATBOT_PORT=5000
DB_PORT=5432
EOF
        print_error "Please edit docker/.env.production and update all CHANGE_THIS values!"
        print_info "After updating, run this script again."
        exit 1
    fi
    
    # Validate production config
    if grep -q "CHANGE_THIS" docker/.env.production; then
        print_error "Production .env file contains default values!"
        print_error "Please update docker/.env.production with production values."
        exit 1
    fi
    
    print_warning "This will deploy to PRODUCTION. Are you sure?"
    read -p "Type 'DEPLOY' to continue: " confirm
    
    if [ "$confirm" != "DEPLOY" ]; then
        print_info "Deployment cancelled"
        exit 0
    fi
    
    # Backup existing deployment
    if docker-compose -f docker/docker-compose.yml ps | grep -q "Up"; then
        print_info "Creating backup of current deployment..."
        docker-compose -f docker/docker-compose.yml exec postgres pg_dump -U postgres polashtoli_db > "backup_$(date +%Y%m%d_%H%M%S).sql"
        print_success "Backup created"
    fi
    
    # Deploy
    print_info "Starting production deployment..."
    cd docker
    
    # Use production env file
    cp .env.production .env
    
    # Pull latest images
    docker-compose pull
    
    # Build and start
    docker-compose up -d --build
    
    # Wait for services
    print_info "Waiting for services to stabilize..."
    sleep 15
    
    # Health check
    print_info "Running health checks..."
    
    backend_health=$(curl -s http://localhost:8080/actuator/health | grep -o "UP" || echo "DOWN")
    chatbot_health=$(curl -s http://localhost:5000/api/health | grep -o "healthy" || echo "DOWN")
    
    if [ "$backend_health" = "UP" ] && [ "$chatbot_health" = "healthy" ]; then
        print_success "All services are healthy!"
        echo ""
        print_info "Production deployment complete!"
        print_info "Your store is now live at http://your-domain.com"
        echo ""
        print_warning "Important next steps:"
        echo "1. Configure DNS to point to this server"
        echo "2. Setup SSL certificate (use Let's Encrypt)"
        echo "3. Configure firewall rules"
        echo "4. Setup monitoring and backups"
    else
        print_error "Health check failed!"
        docker-compose logs
        exit 1
    fi
}

#####################################################################
# Manual Production Deployment
#####################################################################

deploy_manual_prod() {
    print_header "Manual Production Deployment"
    
    print_warning "This will guide you through manual production setup"
    print_info "This is recommended for production environments"
    echo ""
    
    # 1. Database Setup
    print_header "Step 1: Database Setup"
    echo "1. Install PostgreSQL 15+"
    echo "2. Create production database"
    echo "3. Create secure user with password"
    echo "4. Load schema from database/schema.sql"
    echo "5. Configure pg_hba.conf for security"
    read -p "Press Enter when database is ready..."
    
    # 2. Backend Setup
    print_header "Step 2: Backend Setup"
    echo "1. Install Java 17+"
    echo "2. Install Maven 3.9+"
    echo "3. Update backend/src/main/resources/application-prod.properties"
    echo "4. Build: mvn clean install"
    echo "5. Run: mvn spring-boot:run -Dspring.profiles.active=prod"
    echo "   Or create systemd service (recommended)"
    read -p "Press Enter when backend is configured..."
    
    # Create systemd service template
    print_info "Creating systemd service template..."
    cat > "$PROJECT_ROOT/polashtoli-backend.service" << 'EOF'
[Unit]
Description=Polashtoli Store Backend
After=postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/polashtoli-store/backend
ExecStart=/usr/bin/java -jar target/polashtoli-store-1.0.0.jar
Restart=always
Environment="SPRING_PROFILES_ACTIVE=prod"

[Install]
WantedBy=multi-user.target
EOF
    print_success "Backend service template created: polashtoli-backend.service"
    
    # 3. Chatbot Setup
    print_header "Step 3: Chatbot Setup"
    echo "1. Install Python 3.11+"
    echo "2. Create virtual environment"
    echo "3. Install dependencies: pip install -r requirements.txt"
    echo "4. Configure environment variables"
    echo "5. Run: python -m app.main"
    echo "   Or create systemd service (recommended)"
    read -p "Press Enter when chatbot is configured..."
    
    # Create chatbot systemd service
    cat > "$PROJECT_ROOT/polashtoli-chatbot.service" << 'EOF'
[Unit]
Description=Polashtoli Store Chatbot
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/polashtoli-store/chatbot
ExecStart=/opt/polashtoli-store/chatbot/venv/bin/python -m app.main
Restart=always

[Install]
WantedBy=multi-user.target
EOF
    print_success "Chatbot service template created: polashtoli-chatbot.service"
    
    # 4. Frontend Setup
    print_header "Step 4: Frontend & Nginx Setup"
    echo "1. Install Nginx"
    echo "2. Copy frontend files to /var/www/polashtoli"
    echo "3. Configure Nginx (see nginx.conf template)"
    echo "4. Setup SSL with Let's Encrypt"
    read -p "Press Enter when frontend is configured..."
    
    # Create Nginx config
    cat > "$PROJECT_ROOT/nginx-production.conf" << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL Configuration (update paths)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Frontend
    location / {
        root /var/www/polashtoli;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8080/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Chatbot API
    location /chatbot/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
EOF
    print_success "Nginx config template created: nginx-production.conf"
    
    # 5. Security Setup
    print_header "Step 5: Security Configuration"
    echo "1. Configure firewall (UFW recommended)"
    echo "2. Setup fail2ban"
    echo "3. Configure SSL/TLS"
    echo "4. Setup automated backups"
    echo "5. Configure monitoring"
    read -p "Press Enter when security is configured..."
    
    print_success "Manual production setup guide complete!"
    echo ""
    print_info "Service files created:"
    echo "  - polashtoli-backend.service"
    echo "  - polashtoli-chatbot.service"
    echo "  - nginx-production.conf"
    echo ""
    print_info "To install services:"
    echo "  sudo cp *.service /etc/systemd/system/"
    echo "  sudo systemctl daemon-reload"
    echo "  sudo systemctl enable polashtoli-backend"
    echo "  sudo systemctl enable polashtoli-chatbot"
    echo "  sudo systemctl start polashtoli-backend"
    echo "  sudo systemctl start polashtoli-chatbot"
}

#####################################################################
# Cloud Deployment
#####################################################################

deploy_cloud() {
    print_header "Cloud Deployment"
    
    echo "Select cloud provider:"
    echo "1) AWS (Elastic Beanstalk / ECS)"
    echo "2) Google Cloud Platform (Cloud Run)"
    echo "3) Azure (App Service)"
    echo "4) DigitalOcean (Droplets / App Platform)"
    echo "5) Heroku"
    echo "6) Back to main menu"
    echo ""
    read -p "Enter your choice [1-6]: " cloud_choice
    
    case $cloud_choice in
        1) deploy_aws ;;
        2) deploy_gcp ;;
        3) deploy_azure ;;
        4) deploy_digitalocean ;;
        5) deploy_heroku ;;
        6) select_environment ;;
        *) print_error "Invalid choice"; deploy_cloud ;;
    esac
}

deploy_aws() {
    print_header "AWS Deployment Guide"
    echo ""
    print_info "Recommended AWS Architecture:"
    echo "1. Frontend: S3 + CloudFront"
    echo "2. Backend: Elastic Beanstalk or ECS"
    echo "3. Database: RDS PostgreSQL"
    echo "4. Cache: ElastiCache Redis"
    echo ""
    print_info "Deployment steps:"
    echo "1. Create RDS PostgreSQL instance"
    echo "2. Create S3 bucket for frontend"
    echo "3. Setup CloudFront distribution"
    echo "4. Deploy backend to Elastic Beanstalk"
    echo "5. Configure security groups and VPC"
    echo ""
    print_info "AWS CLI commands will be saved to: aws-deploy-commands.sh"
    
    cat > "$PROJECT_ROOT/aws-deploy-commands.sh" << 'EOF'
#!/bin/bash
# AWS Deployment Commands

# 1. Create RDS instance
aws rds create-db-instance \
    --db-instance-identifier polashtoli-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username admin \
    --master-user-password YOUR_PASSWORD \
    --allocated-storage 20

# 2. Create S3 bucket
aws s3 mb s3://polashtoli-frontend
aws s3 sync frontend/ s3://polashtoli-frontend --delete

# 3. Create Elastic Beanstalk application
aws elasticbeanstalk create-application --application-name polashtoli-store

# 4. Deploy backend
cd backend
mvn clean package
eb init -p java-17 polashtoli-store --region us-east-1
eb create polashtoli-prod
EOF
    chmod +x "$PROJECT_ROOT/aws-deploy-commands.sh"
    print_success "AWS deployment script created!"
}

deploy_gcp() {
    print_header "Google Cloud Platform Deployment"
    print_info "GCP deployment guide saved to: gcp-deploy.sh"
    
    cat > "$PROJECT_ROOT/gcp-deploy.sh" << 'EOF'
#!/bin/bash
# GCP Deployment Commands

# 1. Create Cloud SQL instance
gcloud sql instances create polashtoli-db \
    --database-version=POSTGRES_15 \
    --tier=db-f1-micro \
    --region=us-central1

# 2. Deploy backend to Cloud Run
cd backend
mvn clean package
gcloud run deploy polashtoli-backend \
    --source . \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated

# 3. Deploy frontend to Cloud Storage + CDN
gsutil mb gs://polashtoli-frontend
gsutil -m cp -r frontend/* gs://polashtoli-frontend
gsutil web set -m index.html -e 404.html gs://polashtoli-frontend
EOF
    chmod +x "$PROJECT_ROOT/gcp-deploy.sh"
    print_success "GCP deployment script created!"
}

deploy_azure() {
    print_header "Azure Deployment"
    print_info "Azure deployment guide saved to: azure-deploy.sh"
    
    cat > "$PROJECT_ROOT/azure-deploy.sh" << 'EOF'
#!/bin/bash
# Azure Deployment Commands

# 1. Create resource group
az group create --name polashtoli-rg --location eastus

# 2. Create PostgreSQL
az postgres server create \
    --resource-group polashtoli-rg \
    --name polashtoli-db \
    --location eastus \
    --admin-user admin \
    --admin-password YOUR_PASSWORD \
    --sku-name B_Gen5_1

# 3. Deploy backend to App Service
cd backend
mvn clean package
az webapp up --name polashtoli-backend \
    --resource-group polashtoli-rg \
    --runtime "JAVA:17-java17"

# 4. Deploy frontend to Azure Storage
az storage account create \
    --name polashtolifrontend \
    --resource-group polashtoli-rg \
    --location eastus \
    --sku Standard_LRS

az storage blob upload-batch \
    --source frontend \
    --destination '$web' \
    --account-name polashtolifrontend
EOF
    chmod +x "$PROJECT_ROOT/azure-deploy.sh"
    print_success "Azure deployment script created!"
}

deploy_digitalocean() {
    print_header "DigitalOcean Deployment"
    print_info "DigitalOcean deployment using Docker"
    
    cat > "$PROJECT_ROOT/digitalocean-deploy.sh" << 'EOF'
#!/bin/bash
# DigitalOcean Deployment

# 1. Create Droplet (run on local machine)
doctl compute droplet create polashtoli \
    --size s-2vcpu-4gb \
    --image ubuntu-22-04-x64 \
    --region nyc1

# 2. SSH into droplet and run:
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone your repository
git clone YOUR_REPO_URL /opt/polashtoli-store
cd /opt/polashtoli-store/docker

# Deploy
docker-compose up -d
EOF
    chmod +x "$PROJECT_ROOT/digitalocean-deploy.sh"
    print_success "DigitalOcean deployment script created!"
}

deploy_heroku() {
    print_header "Heroku Deployment"
    print_info "Heroku deployment guide saved to: heroku-deploy.sh"
    
    cat > "$PROJECT_ROOT/heroku-deploy.sh" << 'EOF'
#!/bin/bash
# Heroku Deployment

# 1. Install Heroku CLI
# curl https://cli-assets.heroku.com/install.sh | sh

# 2. Login
heroku login

# 3. Create app
heroku create polashtoli-store

# 4. Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# 5. Deploy
git push heroku main

# 6. Open
heroku open
EOF
    chmod +x "$PROJECT_ROOT/heroku-deploy.sh"
    print_success "Heroku deployment script created!"
}

#####################################################################
# Main Execution
#####################################################################

main() {
    clear
    echo ""
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                                                           ║"
    echo "║           POLASHTOLI STORE DEPLOYMENT SCRIPT            ║"
    echo "║                                                           ║"
    echo "║            Complete E-Commerce Platform                  ║"
    echo "║                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    
    # Run preflight checks
    preflight_checks
    
    # Select environment
    select_environment
    
    echo ""
    print_success "Deployment process complete!"
    echo ""
}

# Run main function
main
