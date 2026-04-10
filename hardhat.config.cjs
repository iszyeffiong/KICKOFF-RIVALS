require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");

/**
 * @type {import('hardhat/config').HardhatUserConfig}
 */
module.exports = {
    solidity: "0.8.24",
    paths: {
        sources: "./contracts/contracts",
        scripts: "./contracts/scripts",
        cache: "./contracts/cache",
        artifacts: "./contracts/artifacts",
    },
    networks: {
        base: {
            url: "https://mainnet.base.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
        "base-sepolia": {
            url: "https://sepolia.base.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },
};
