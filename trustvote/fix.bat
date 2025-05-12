@echo off
echo Fixing TrustVote setup...

REM Create necessary directories
mkdir frontend\public 2>nul
mkdir backend\src\contracts 2>nul
mkdir backend\uploads 2>nul
mkdir biometrics\uploads 2>nul

REM Install biometric service dependencies
echo Installing biometric service dependencies...
cd biometrics
python -m venv venv
call venv\Scripts\activate
pip install cmake
pip install dlib
pip install face_recognition
pip install -r requirements.txt
cd ..

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
npm install
cd ..

REM Install frontend dependencies
echo Installing frontend dependencies...
cd frontend
npm install
cd ..

echo.
echo Setup complete! You can now run start.bat to start all services.
pause 