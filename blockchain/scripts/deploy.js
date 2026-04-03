const hre = require("hardhat");

async function main() {
  console.log("Deploying contracts...");

  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.deploy();
  await userRegistry.deployed();

  console.log("UserRegistry deployed to:", userRegistry.address);

  const FreelanceEscrow = await hre.ethers.getContractFactory("FreelanceEscrow");
  const freelanceEscrow = await FreelanceEscrow.deploy(userRegistry.address);
  await freelanceEscrow.deployed();

  console.log("FreelanceEscrow deployed to:", freelanceEscrow.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });