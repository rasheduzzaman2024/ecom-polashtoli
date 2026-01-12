#!/bin/bash

################################################################
# Polashtoli Store - Quick Deploy Script
# Fast deployment for common scenarios
################################################################

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║    Polashtoli Store - Quick Deploy         ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════╝${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Quick Deploy Options:"
echo ""
echo "1) 🐳 Docker (Fastest - One command deployment)"
echo "2) 💻 Local Development (Manual setup)"
echo "3) 🚀 Production (Docker)"
echo ""
read -p "Choose option [1-3]: " option

case $option in
    1)
        echo -e "${GREEN}Starting Docker deployment...${NC}"
        cd docker
        docker-compose down 2>/dev/null
        docker-compose up -d --build
        echo ""
        echo -e "${GREEN}✓ Deployment complete!${NC}"
        echo ""
        echo "Access your store:"
        echo "  Frontend:  http://localhost"
        echo "  Backend:   http://localhost:8080"
        echo "  Chatbot:   http://localhost:5000"
        echo ""
        echo "View logs: cd docker && docker-compose logs -f"
        ;;
    2)
        echo -e "${GREEN}Starting local services...${NC}"
        
        # Start PostgreSQL
        sudo systemctl start postgresql
        
        # Check if database exists
        sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw polashtoli_db
        if [ $? -ne 0 ]; then
            echo "Creating database..."
            sudo -u postgres psql -c "CREATE DATABASE polashtoli_db;"
            sudo -u postgres psql -d polashtoli_db -f database/schema.sql
        fi
        
        # Create start script if not exists
        if [ ! -f "start-all.sh" ]; then
            cat > start-all.sh << 'EOF'
#!/bin/bash
gnome-terminal --tab --title="Backend" -- bash -c "cd backend && mvn spring-boot:run; exec bash"
sleep 3
gnome-terminal --tab --title="Chatbot" -- bash -c "cd chatbot && source venv/bin/activate && python -m app.main; exec bash"
gnome-terminal --tab --title="Frontend" -- bash -c "cd frontend && python3 -m http.server 8081; exec bash"
echo "Services started in separate terminals!"
EOF
            chmod +x start-all.sh
        fi
        
        ./start-all.sh
        ;;
    3)
        echo -e "${GREEN}Starting production deployment...${NC}"
        ./deploy.sh
        ;;
    *)
        echo "Invalid option"
        exit 1
        ;;
esac
