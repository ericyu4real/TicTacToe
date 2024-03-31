require("@nomiclabs/hardhat-waffle");

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
        // 配置其他网络如需要
    },
};
