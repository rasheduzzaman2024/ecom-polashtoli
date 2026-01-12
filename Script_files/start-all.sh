#!/bin/bash
gnome-terminal --tab --title="Backend" -- bash -c "cd backend && mvn spring-boot:run; exec bash"
sleep 3
gnome-terminal --tab --title="Chatbot" -- bash -c "cd chatbot && source venv/bin/activate && python -m app.main; exec bash"
gnome-terminal --tab --title="Frontend" -- bash -c "cd frontend && python3 -m http.server 8081; exec bash"
echo "Services started in separate terminals!"
