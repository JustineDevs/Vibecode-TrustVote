require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const multer = require('multer');
const path = require('path');
const winston = require('winston');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Configure logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Initialize Ethereum provider
const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = require('../contracts/Voting.json').abi;
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Routes
app.post('/api/register', upload.single('faceImage'), async (req, res) => {
    try {
        const { address, voterId } = req.body;
        const faceImage = req.file;

        // TODO: Call biometric service to process face image
        const hashedBiometric = "0x" + "1".repeat(64); // Placeholder

        const tx = await contract.registerVoter(address, hashedBiometric);
        await tx.wait();

        logger.info(`Voter registered: ${address}`);
        res.json({ success: true, message: 'Voter registered successfully' });
    } catch (error) {
        logger.error('Registration error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/vote', upload.single('faceImage'), async (req, res) => {
    try {
        const { candidateId } = req.body;
        const faceImage = req.file;

        // TODO: Call biometric service to verify face
        const hashedBiometric = "0x" + "1".repeat(64); // Placeholder

        const tx = await contract.vote(candidateId, hashedBiometric);
        await tx.wait();

        logger.info(`Vote cast for candidate ${candidateId}`);
        res.json({ success: true, message: 'Vote cast successfully' });
    } catch (error) {
        logger.error('Voting error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/candidates', async (req, res) => {
    try {
        const count = await contract.getCandidateCount();
        const candidates = [];

        for (let i = 0; i < count; i++) {
            const candidate = await contract.candidates(i);
            candidates.push({
                id: i,
                name: candidate.name,
                voteCount: candidate.voteCount.toString()
            });
        }

        res.json({ success: true, candidates });
    } catch (error) {
        logger.error('Get candidates error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/voting-status', async (req, res) => {
    try {
        const [active, endTime, timeLeft] = await contract.getVotingStatus();
        res.json({
            success: true,
            active,
            endTime: endTime.toString(),
            timeLeft: timeLeft.toString()
        });
    } catch (error) {
        logger.error('Get voting status error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ success: false, error: 'Something broke!' });
});

// Start server
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
}); 