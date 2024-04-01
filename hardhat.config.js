require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

module.exports = {
    solidity: "0.8.4",
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    },
    networks: {
        hardhat: {},
        ganache: {
            url: process.env.JSON_RPC_PROVIDER,
            accounts: [process.env.PRIVATE_KEY_PLAYER1, process.env.PRIVATE_KEY_PLAYER2],
            gas: 6721975, // Optional: Ganache's gas limit
            gasPrice: 20000000000, // Optional: Ganache's gas price
        }
    },
};
