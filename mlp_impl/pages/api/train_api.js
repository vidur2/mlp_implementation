import { connect, Contract, keyStores, KeyPair, transactions } from "near-api-js"


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
    const contract = new Contract(
        account,
        "mlp1.perceptron.testnet",
        {
            changeMethods: [
            "predict",
            "predict_raw"
            ],
            sender: account,
        }
    )
    let args;
    let splitter;
    for (let i = 0; i < csv_string.length; i++){
        splitter = csv_string[i].split(",")
        args = {
            input1: splitter[0],
            input2: splitter[1],
            input3: splitter[2],
            input4: splitter[3],
            input5: splitter[4],
            input6: splitter[5],
            input7: splitter[6],
            input8: splitter[7],
            input9: splitter[8],
            input10: splitter[9],
            input11: splitter[10],
            input12: splitter[11],
            input13: splitter[12],
            input14: splitter[13],
            input15: splitter[14],
            input16: splitter[15],
            input17: splitter[16],
            input18: splitter[23],
            input19: splitter[18],
            input20: splitter[19],
            input21: splitter[20],
            input22: splitter[21],
            input23: splitter[22],
            expected_output: splitter[17],
        }
        actions.push(transactions.functionCall(
            "predict",
            JSON.stringify(args),
            115_000_000_000_000,
            "0"
        ))
    }
    console.log(actions)
    account.signAndSendTransaction({
        receiverId: "mlp1.perceptron.testnet",
        actions: actions
    })
    return await resp
}

export default function handler(req, res){
    console.log(req.method)
    const reqBody = JSON.parse(req.body);
    if (req.method == 'PUT'){
        stored_data.push(reqBody.csv_string.split("\n"));
        res.status(200).json({
            status: "Success"
        })
        stored_data = Array.prototype.concat.apply([], stored_data)
    }
    else if (req.method == 'POST'){
        if (stored_data.length != 0){
            call_contract(stored_data, parseInt(reqBody.counter)).then(async(value) => {
                console.log(value)
                res.status(200).json({
                    status: "Succesful",
                    nearApi: value
                })
            })
        }
        }
}