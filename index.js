const SHA256 = require("crypto-js/sha256");
const figlet = require("figlet");
const chalk = require("chalk");
const ora = require('ora');
const Database = require("@replit/database");

const db = new Database();

console.log(chalk.bold.green('npm start'));

console.log('\n\n\n---\n\n\n');

console.log(chalk.cyanBright('ThedispardCoin\n'));

console.log(chalk.cyanBright('License MIT - 2021'));

console.log('\n\n\n---\n\n\n');

class CryptoBlock {
  constructor(index, timestamp, data, precedingHash = " ") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.precedingHash = precedingHash;
    this.hash = this.computeHash();
    this.nonce = 0;
  }

  computeHash() {
    return SHA256(
      this.index +
        this.precedingHash +
        this.timestamp +
        JSON.stringify(this.data) +
        this.nonce
    ).toString();
  }

  proofOfWork(difficulty) {
    console.log(chalk.yellowBright('Mining Block ⛏ ...'));
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.computeHash();
    }
    console.log(chalk.cyanBright(`Solved: ${this.nonce}`));
    console.log(chalk.green(`Hash: ${this.hash}`))
  }
}

class CryptoBlockchain {
  constructor() {
    this.blockchain = [this.startGenesisBlock()];
    this.difficulty = 4;
  }
  startGenesisBlock() {
    return new CryptoBlock(0, "11/06/2021", "Initial Block in the Chain", "0");
  }

  obtainLatestBlock() {
    return this.blockchain[this.blockchain.length - 1];
  }
  addNewBlock(newBlock) {
    newBlock.precedingHash = this.obtainLatestBlock().hash;
    //newBlock.hash = newBlock.computeHash();
    newBlock.proofOfWork(this.difficulty);
    this.blockchain.push(newBlock);
    console.log(newBlock);
    console.log("\n");
  }

  checkChainValidity() {
    for (let i = 1; i < this.blockchain.length; i++) {
      const currentBlock = this.blockchain[i];
      const precedingBlock = this.blockchain[i - 1];

      if (currentBlock.hash !== currentBlock.computeHash()) {
        return false;
      }
      if (currentBlock.precedingHash !== precedingBlock.hash) return false;
    }
    return true;
  }
}

let thedispardCoin = new CryptoBlockchain();

let today = new Date();
let dd = today.getDate();

let mm = today.getMonth()+1; 
let yyyy = today.getFullYear();
if(dd<10) 
{
    dd="0"+dd;
};

if(mm<10) 
{
    mm="0"+mm;
} ;
today = mm+"/"+dd+"/"+yyyy;

thedispardCoin.addNewBlock(
  new CryptoBlock(1, today, {
    sender: "Adrien Dumont",
    recipient: "Gaspard Vandenbulcke",
    quantity: 50
  })
);

thedispardCoin.addNewBlock(
  new CryptoBlock(2, today, {
    sender: "Gaspard Vandenbulcke",
    recipient: "Théo Gravé",
    quantity: 100
  })
);

thedispardCoin.addNewBlock(
  new CryptoBlock(2, today, {
    sender: "Théo Gravé",
    recipient: "Adrien Dumont",
    quantity: 100
  })
);

let blockchain = JSON.stringify(thedispardCoin, null, 4);

console.log(`\n\n${chalk.cyanBright(JSON.stringify(thedispardCoin, null, 4))}\n\n`);

db.set("blockchain", blockchain).then(() => {});




figlet.text("ThedispardCoin", {
    font: "Big",
    horizontalLayout: "default",
    verticalLayout: "default",
    width: 55,
    whitespaceBreak: true
}, (err, data) => {
    if (err) {
        console.log(chalk.bold.red("Error"));
        console.dir(err);
        return;
    }
    console.log(chalk.yellowBright(data));
});