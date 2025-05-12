@echo off
echo Starting TrustVote services...

REM Check if .env files exist and create them if they don't
if not exist backend\.env (
    echo Creating backend\.env...
    (
        echo PORT=3000
        echo ETHEREUM_RPC_URL=https://sepolia.base.org
        echo PRIVATE_KEY=ae1989ee1a50e83341314164907324e78db72015870b7e307bfc9bf0b86b10ed
        echo CONTRACT_ADDRESS=0xfA2C5d8B0F36944c16148b7dEB01B5C92aC72b7b
        echo BIOMETRIC_SERVICE_URL=http://localhost:5000
        echo JWT_SECRET=your_jwt_secret_here
    ) > backend\.env
)

if not exist frontend\.env (
    echo Creating frontend\.env...
    (
        echo REACT_APP_API_URL=http://localhost:3000
        echo REACT_APP_CONTRACT_ADDRESS=0xfA2C5d8B0F36944c16148b7dEB01B5C92aC72b7b
        echo REACT_APP_BIOMETRIC_SERVICE_URL=http://localhost:5000
        echo REACT_APP_RPC_URL=https://sepolia.base.org
    ) > frontend\.env
)

REM Create necessary directories
mkdir backend\uploads 2>nul
mkdir biometrics\uploads 2>nul

REM Start the biometric service
echo Starting biometric service...
start cmd /k "cd biometrics && venv\Scripts\activate && python app.py"

REM Start the backend service
echo Starting backend service...
start cmd /k "cd backend && npm start"

REM Start the frontend service
echo Starting frontend service...
start cmd /k "cd frontend && npm start"

echo.
echo All services are starting...
echo - Biometric service: http://localhost:5000
echo - Backend API: http://localhost:3000
echo - Frontend: http://localhost:3000
echo.
echo Please make sure to:
echo 1. Update the .env files with your actual values
echo 2. Deploy the smart contract to Base Sepolia
echo 3. Update the contract address in both backend and frontend .env files
echo.
pause 