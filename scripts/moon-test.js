const hre = require("hardhat");

// Returns the ETH balance of a given address.
async function getBalance(address) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance`, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from purchases.
// async function printMemos(memos) {
//   for (const memo of memos) {
//     const timestamp = memo.timestamp;
//     const tipper = memo.name;
//     const tipperAddress = memo.from;
//     const message = memo.message;
//     console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said:"${message}" `);
//   }
// }

async function main() {
  // Get example accounts.
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

  // GEt the contract to deploy
  const MoonMessage = await hre.ethers.getContractFactory("MoonMessage");
  const moonMessage = await MoonMessage.deploy();
  await moonMessage.deployed();
  console.log("MoonMessage deployed to ", moonMessage.address);

  // Check balances before the coffee purchase
  const addresses = [owner.address, tipper.address, moonMessage.address];
  console.log("== start ==");
  await printBalances(addresses);

  // Send memo with fund
  const tip = { value: hre.ethers.utils.parseEther("1") };
  await moonMessage.connect(tipper).sendToMoon("Ali", "Götür beni aya, aya, aya.", tip);
  await moonMessage.connect(tipper2).sendToMoon("Mehmet", "Mehmet Emlak", tip);
  await moonMessage.connect(tipper3).sendToMoon("Ayşe", "Merhaba Ay", tip);

  // Check balances after a coffee purchase
  console.log("== bought ==");
  await printBalances(addresses);

  // Withdraw funds 
  await moonMessage.connect(owner).withdrawTips();

  // Check balances after withdraw
  console.log("== withdraw ==");
  await printBalances(addresses);

  // Read all the memos left for the moon
  console.log("== withdraw ==");
  const memos = await moonMessage.getMemos();
  printMemos(memos);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });