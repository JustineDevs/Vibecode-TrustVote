# TrustVote - Decentralized Voting Platform

A secure and transparent blockchain-based voting system for the Philippines, featuring biometric verification and AI-powered security.

## Features

- Blockchain-based voting system
- Biometric voter verification
- AI-powered security
- Real-time results
- Transparent and immutable voting records

## Tech Stack

- Smart Contracts: Solidity
- Backend: Node.js, Express
- Frontend: React, Material-UI
- Biometric Service: Python, OpenCV, face_recognition
- Blockchain: Ethereum (Hardhat)

## Prerequisites

- Node.js (v14+)
- Python (v3.8+)
- MetaMask browser extension
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/JustineDevs/Vibecode-TrustVote.git
cd Vibecode-TrustVote
```

2. Install dependencies:
```bash
# Install biometric service dependencies
cd biometrics
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt

# Install backend dependencies
cd ../backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Configure environment variables:
- Copy `.env.example` to `.env` in backend and frontend directories
- Update the variables with your configuration

## Running the Application

1. Start the biometric service:
```bash
cd biometrics
.\venv\Scripts\activate
python app.py
```

2. Start the backend:
```bash
cd backend
npm start
```

3. Start the frontend:
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3000
- Biometric Service: http://localhost:5000

## Smart Contract Deployment

1. Configure Hardhat network in `hardhat.config.js`
2. Deploy the contract:
```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

```Push Github
git init
git add .
git remote add origin [url github]
git remote -v
git commit -am "initial commit" // Update
git push origin master


Base Mainnet:
https://mainnet.base.org', chainId: 8453

Base Sepolia:
https://sepolia.base.org', chainId: 84532