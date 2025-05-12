@echo off

REM Start the biometric service
start cmd /k "cd biometrics && venv\Scripts\activate && python app.py"

REM Start the backend service
start cmd /k "cd backend && npm start"

REM Start the frontend service
start cmd /k "cd frontend && npm start"

echo All services are starting...
echo - Biometric service: http://localhost:5000
echo - Backend API: http://localhost:3000
echo - Frontend: http://localhost:3000 