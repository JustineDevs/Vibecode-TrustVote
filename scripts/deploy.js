const hre = require("hardhat");

async function main() {
    const contract = await hre.ethers.deployContract("Voting");
    await contract.waitForDeployment();
    console.log(`Deployed contract to: ${contract.target}`);
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});