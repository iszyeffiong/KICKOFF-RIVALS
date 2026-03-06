require("dotenv").config({ path: "../.env" });
require("@nomicfoundation/hardhat-toolbox");

/**
 * @type {import('hardhat/config').HardhatUserConfig}
 */
module.exports = {
    solidity: "0.8.24",
    networks: {
        fuji: {
            url: "https://api.avax-test.network/ext/bc/C/rpc",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },
};
