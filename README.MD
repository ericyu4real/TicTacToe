npm install
npx hardhat compile
npx hardhat test


# Ganache Chain
install ganache-cli by npm: npm install -g ganache-cli
ganache-cli
You should probably run this with some info like this

Randomly choose 2 Private Keys to .env file like this:
PRIVATE_KEY_PLAYER1=0xca001f8a190d5da3c072637af4060ee3603f01413f64151a71a7916b232bd820
PRIVATE_KEY_PLAYER2=0xb779db5920e1400fcd71aaf9b59c693c57e76bf39f45d609601145672b022da8

You also need to gain the address of the contract to .env file like this:
npx hardhat run scripts/deploy.js --network ganache
"TicTacToe deployed to: 0x15C3DB0Cd96E82860E81f4E9F456E3ff5c03fD51"
Copy the address and paste it to .env file CONTRACT_ADDRESS

Ganache CLI v6.12.2 (ganache-core: 2.13.2)

Available Accounts
==================
(0) 0x7935c4d2aD2aD55cd6713E1D089035D1e11DdA15 (100 ETH)
(1) 0x23BA5a96914e2DB880b7499bD05D5972D3f5cc6f (100 ETH)
(2) 0xe62cb2117A270EC6BDf2cff697e3c9F7ee33068E (100 ETH)
(3) 0x290dbFCfF799A0618a63AD00FF916bc10CE4AfD0 (100 ETH)
(4) 0xeEeC0C7A854A171554A2A1aaE4c70624d1396704 (100 ETH)
(5) 0x7fc77BBe087079c95FB139A63d5BAE2413d8D39e (100 ETH)
(6) 0x0694A717c1bA1ba897e08Fea1f4c9f26c0A5fbC3 (100 ETH)
(7) 0xFE6F5DCfb88b0eA14E00761fa7306945CB5f47fc (100 ETH)
(8) 0xB149B0bD5F320975422F6ee5F1Ec8589c77b6161 (100 ETH)
(9) 0x1d1fb728837B40B36b4e13743e2d201B35881b69 (100 ETH)

Private Keys
==================
(0) 0xca001f8a190d5da3c072637af4060ee3603f01413f64151a71a7916b232bd820
(1) 0xb779db5920e1400fcd71aaf9b59c693c57e76bf39f45d609601145672b022da8
(2) 0x6d097a72008047a22232f2aa80b31037f4b5988406bf67fb5ab58bbcb4031004
(3) 0xc0b817bd18f65c62a293a354f7d9e6939a6342108b335f25598eb65cc7ed4cb4
(4) 0xb50358bc5194d965dd3f80a5dcb8aadd438ed88ca37a4fa5ef6a6a9d8d50180a
(5) 0x921c16e1fbd1580232a43cdf867fee772a758b5e2231d670786efa3ccbc31b07
(6) 0xe3c38b87e3da0fc52088643fdc739d54a36e0d37b51f6471e5c989eca56b3b60
(7) 0xd06593c4968614a2b271f832e47828f79ab0ec191489f1857f1c367d95aebf07
(8) 0x910b68123dd70cc9e85be65a43bc4214f45db9b4cf39c91a83ffea94b699c274
(9) 0x93b37babaf0b572c440ca508c3dced09acd21d6ca2ae43edc0fe6359edbace6d

HD Wallet
==================
Mnemonic:      maple sure inch talent cat angry enact frog gain stable case exist
Base HD Path:  m/44'/60'/0'/0/{account_index}

Gas Price
==================
20000000000

Gas Limit
==================
6721975

Call Gas Limit
==================
9007199254740991

Listening on 127.0.0.1:8545