import { connect, keyStores, KeyPair, transactions } from "near-api-js"
import { TransactionManager } from "near-transaction-manager"


let stored_data = new Array;
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '5mb'
        }
    }
}

async function call_contract(csv_string){
    let actions = new Array
    const keyStore = new keyStores.InMemoryKeyStore();
    const keyPair = KeyPair.fromString(process.env.private_key)
    await keyStore.setKey("testnet", "perceptron.testnet", keyPair) 
    const config = {
        networkId: "testnet",
        keyStore,
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    }
    const near = await connect(config)
    const account = await near.account("perceptron.testnet")
    const transactionManager = new TransactionManager.fromAccount(account)
    let args;
    let splitter;
    for (let i = 0; i < csv_string.length; i++){
        splitter = csv_string[i].split(",")
        args = {
            input1: parseFloat(splitter[0]),
            input2: parseFloat(splitter[1]),
            input3: parseFloat(splitter[2]),
            input4: parseFloat(splitter[3]),
            input5: parseFloat(splitter[4]),
            input6: parseFloat(splitter[5]),
            input7: parseFloat(splitter[6]),
            input8: parseFloat(splitter[7]),
            input9: parseFloat(splitter[8]),
            input10: parseFloat(splitter[9]),
            input11: parseFloat(splitter[10]),
            input12: parseFloat(splitter[11]),
            input13: parseFloat(splitter[12]),
            input14: parseFloat(splitter[13]),
            input15: parseFloat(splitter[14]),
            input16: parseFloat(splitter[15]),
            input17: parseFloat(splitter[16]),
            input18: parseFloat(splitter[23]),
            input19: parseFloat(splitter[18]),
            input20: parseFloat(splitter[19]),
            input21: parseFloat(splitter[20]),
            input22: parseFloat(splitter[21]),
            input23: parseFloat(splitter[22]),
            expected_output: parseFloat(splitter[17]),
        }
        actions.push({
            receiverId: "mlp1.perceptron.testnet",
            actions: [
                transactions.functionCall(
                    "predict",
                    args,
                    '115000000000000'
                )
            ]
        })
    }
    console.log(actions)
    const resp = await transactionManager.bundleCreateSignAndSendTransactions(actions)
    console.log(resp)
}

export default function handler(req, res){
    console.log(req.method)
    if (req.method == 'PUT'){
        const reqBody = JSON.parse(req.body);
        stored_data.push(reqBody.csv_string.split("\n"));
        res.status(200).json({
            status: "Success"
        })
        stored_data = Array.prototype.concat.apply([], stored_data)
    }
    else if (req.method == 'GET' && stored_data.length != 0){
        call_contract(stored_data)
        res.status(200).json({  status: "Success" })
    }
}