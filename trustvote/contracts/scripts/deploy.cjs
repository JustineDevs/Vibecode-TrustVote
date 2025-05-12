const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Voting contract...");

  const Voting = await ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  await voting.waitForDeployment();

  const address = await voting.getAddress();
  console.log(`Voting contract deployed to: ${address}`);

  // Add some initial candidates
  console.log("Adding initial candidates...");
  const tx1 = await voting.addCandidate("Candidate 1");
  await tx1.wait();
  const tx2 = await voting.addCandidate("Candidate 2");
  await tx2.wait();
  const tx3 = await voting.addCandidate("Candidate 3");
  await tx3.wait();

  console.log("Deployment completed!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
}); 