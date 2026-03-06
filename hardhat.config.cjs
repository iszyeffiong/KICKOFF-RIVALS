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
        fuji: {
            url: "https://api.avax-test.network/ext/bc/C/rpc",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },
};
