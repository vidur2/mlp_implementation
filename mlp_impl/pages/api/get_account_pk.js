import { parseSeedPhrase } from "near-seed-phrase";

const PRIVATE_KEY = parseSeedPhrase("job topic jump eight unaware cabbage average vague artefact again history success")
const { keyStores, connect, KeyPair, Contract } = require("near-api-js")

async function get_key_pair(account_id, config){
    const keyPair = KeyPair.fromString(PRIVATE_KEY.secretKey)
    await config.keyStore.setKey("testnet", "perceptron.testnet", keyPair);
    const near = await connect(config);
    const account = await near.account("perceptron.testnet");
    const contractOptions = {
        changeMethods: ["add_account", "view_account_pk"]
    }
    const contract = new Contract(
        account,
        "account_manager.perceptron.testnet",
        contractOptions
    )
    const resp = await contract.view_account_pk(
        {
            username: account_id
        }
    );
    console.log(resp)
    return resp
}


export default function handler(req, res){
    if (req.method == "POST"){
        const config = {
            networkId: "testnet",
            keyStore: new keyStores.InMemoryKeyStore(),
            nodeUrl: "https://rpc.testnet.near.org",
            walletUrl: "https://wallet.testnet.near.org",
            helperUrl: "https://helper.testnet.near.org",
            explorerUrl: "https://explorer.testnet.near.org",
        }
        const account_id = JSON.parse(req.body).account_id
        get_key_pair(account_id, config).then((private_key) => {
            res.status(200).json({"private_key": private_key})
        })
    }
}