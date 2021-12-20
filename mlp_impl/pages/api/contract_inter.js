import { parseSeedPhrase } from "near-seed-phrase";

const PRIVATE_KEY = parseSeedPhrase("job topic jump eight unaware cabbage average vague artefact again history success")
const { keyStores, connect, KeyPair, Contract } = require("near-api-js")

async function update_contract(account_id, private_key, config){
    const keyPair = KeyPair.fromString(PRIVATE_KEY.secretKey)
    await config.keyStore.setKey("testnet", "perceptron.testnet", keyPair);
    const near = await connect(config);
    const account = await near.account("perceptron.testnet");
    const contractOptions = {
        viewMethods: ["view_acct_pk"],
        changeMethods: ["add_account"]
    }
    const contract = new Contract(
        account,
        "account_manager.perceptron.testnet",
        contractOptions
    )
    const resp = await contract.add_account({
        username: account_id, 
        password: private_key
        
    });
    console.log(resp)
}

export default function handler(req, res){
    if (req.method == "POST"){
        const reqBody = JSON.parse(req.body);
        const account_id = reqBody.account_id;
        const private_key = reqBody.private_key;
        const config = {
            networkId: "testnet",
            keyStore: new keyStores.InMemoryKeyStore(),
            nodeUrl: "https://rpc.testnet.near.org",
            walletUrl: "https://wallet.testnet.near.org",
            helperUrl: "https://helper.testnet.near.org",
            explorerUrl: "https://explorer.testnet.near.org",
        }

        update_contract(account_id, private_key.toString(), config)
        res.status(200).json({"Status": "Success"})
    }
}