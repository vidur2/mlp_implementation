const CryptoJs = require("crypto-js");
const WebSocket = require("ws");
const express = require("express");
const bodyParser = require("body-parser");
const res = require("express/lib/response");

const http_port = 3001;
const p2p_port = 6001;

const sockets = new Array;

class Block {
    constructor(index, previous_hash, timestamp, data, hash) {
        this.index = index,
        this.previous_hash = previous_hash,
        this.timestamp = timestamp,
        this.data = data,
        this.hash = hash
    }
}

class Account {
    constructor(account_name, block_index, smart_contract_data){
        this.account_name = account_name,
        this.block_index = block_index, 
        this.smart_contract_data = smart_contract_data
    }
}

const MessageType = {
    QUERY_LATEST: 0,
    QUERY_ALL: 1,
    RESPONSE_BLOCKCHAIN: 2
}

const genesis_time = Date.now()/1000;

function get_genesis_block() {
    return new Block(0, "0", genesis_time, "created by vidur2", "816534932c2b7154836da6afc367695e6337db8a921823784c14378abed4f7d7")
}

const blockchain = [get_genesis_block];
const accounts = new Array


function initHttpServer(){
    const app = express();

    app.use(bodyParser.json());
    app.get("/blocks", (req, res) => {
        res.send(JSON.stringify(blockchain))
    })
    app.post("/mine_block", (req, res) => {
        const newBlock = generateNextBlock(req.body.data);
        addBlock(newBlock);
        broadcast(responseLatestMsg());
        res.send()
    })
    app.post("/init_account", (req, res) => {
        const account_info = req.body.data;
        const account = new Account(account_info.name, getLatestBlock().index, null);
        const data = JSON.parse(getLatestBlock().data);
        if (data.accounts == undefined){
            data.accounts = [data]
        } else {
            data.accounts.push(account)
        }
        blockchain[account.index].data = data;
        accounts.push(account)

        res.send({"Status": "Initialized Accounts"})
    })
    app.post("/init_contract", (req, res) => {
        const smart_contract = req.body.smart_contract;
        const name = req.body.account_name
    })
}

function getLatestBlock(){
    return blockchain[blockchain.length - 1]
}

function generateNextBlock(data){
    const timestamp = Date.now()/1000
    const nextHash = CryptoJs.SHA256(blockchain.length + getLatestBlock().hash + timestamp + data).toString()
    return new Block(blockchain.length, getLatestBlock().hash, timestamp, data, nextHash)
}

function addBlock(block){
    blockchain.push(block)
}