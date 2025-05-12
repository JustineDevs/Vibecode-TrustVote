@echo off

REM Create necessary directories
mkdir backend\uploads
mkdir biometrics\uploads

REM Install backend dependencies
cd backend
call npm install
cd ..

REM Install frontend dependencies
cd frontend
call npm install
cd ..

REM Install biometric service dependencies
cd biometrics
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
cd ..

REM Create .env files if they don't exist
if not exist backend\.env (
    echo Creating backend\.env...
    (
        echo PORT=3000
        echo ETHEREUM_RPC_URL=https://goerli.base.org
        echo PRIVATE_KEY=ae1989ee1a50e83341314164907324e78db72015870b7e307bfc9bf0b86b10ed
        echo CONTRACT_ADDRESS=your_deployed_contract_address
        echo BIOMETRIC_SERVICE_URL=http://localhost:5000
    ) > backend\.env
)

if not exist frontend\.env (
    echo Creating frontend\.env...
    (
        echo REACT_APP_API_URL=http://localhost:3000
        echo REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address
        echo REACT_APP_BIOMETRIC_SERVICE_URL=http://localhost:5000
    ) > frontend\.env
)

echo Setup complete! Please update the .env files with your actual values.
pause 