import { ethers } from 'ethers';
import VotingContract from '../../contracts/Voting.json';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
      VotingContract.abi,
      provider
    );

    const votingStatus = await contract.getVotingStatus();
    
    res.status(200).json({ active: votingStatus });
  } catch (error) {
    console.error('Error checking voting status:', error);
    res.status(500).json({ message: 'Error checking voting status' });
  }
} 