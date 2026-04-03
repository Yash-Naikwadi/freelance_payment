require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: "0.8.0",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: [
        "0x93e749d896681c96f69c411b98617c3939c76bcd7062691272b3f22898d2749c",
      ],
    },
  },
};