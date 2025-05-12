#!/bin/bash

# Create necessary directories
mkdir -p backend/uploads
mkdir -p biometrics/uploads

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install biometric service dependencies
cd biometrics
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

# Create .env files if they don't exist
if [ ! -f backend/.env ]; then
    echo "Creating backend/.env..."
    cat > backend/.env << EOL
PORT=3000
ETHEREUM_RPC_URL=https://goerli.base.org
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=your_deployed_contract_address
BIOMETRIC_SERVICE_URL=http://localhost:5000
EOL
fi

if [ ! -f frontend/.env ]; then
    echo "Creating frontend/.env..."
    cat > frontend/.env << EOL
REACT_APP_API_URL=http://localhost:3000
REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address
REACT_APP_BIOMETRIC_SERVICE_URL=http://localhost:5000
EOL
fi

echo "Setup complete! Please update the .env files with your actual values." 