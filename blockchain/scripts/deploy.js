const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  // Deploy UserRegistry
  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.deploy();
  await userRegistry.deployed();
  console.log("UserRegistry deployed to:", userRegistry.address);

  // Deploy FreelanceEscrow
  const FreelanceEscrow = await hre.ethers.getContractFactory("FreelanceEscrow");
  const freelanceEscrow = await FreelanceEscrow.deploy(userRegistry.address);
  await freelanceEscrow.deployed();
  console.log("FreelanceEscrow deployed to:", freelanceEscrow.address);

  // Save addresses
  const addresses = {
    userRegistry: userRegistry.address,
    freelanceEscrow: freelanceEscrow.address,
  };
  console.log("\n=== Deployment Addresses ===");
  console.log(JSON.stringify(addresses, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });