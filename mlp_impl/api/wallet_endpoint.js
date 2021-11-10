import { connect, Contract, keyStores, KeyPair } from "near-api-js"

async function send_function_to_wallet(input){
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

    contract.predict(
        {
            input1: input[0], 
            input2: input[1], 
            input3: input[2], 
            input4: input[3], 
            input5: input[4], 
            input6: input[5], 
            input7: input[6],
            input8: input[7],
            input9: input[8],
            input10: input[9],
            input11: input[10],
            input12: input[11],
            input13: input[12],
            input14: input[13],
            input15: input[14],
            input16: input[15],
            input17: input[16],
            input18: input[17],
            input19: input[18],
            input20: input[19],
            input21: input[20],
            input22: input[21],
            input23: input[22],
            expected_ouput: input[23]
        },
        115_000_000_000_000
    )
}

export default function handler(req, res){
    if (req.method == "POST"){
        const reqBody = JSON.parse(req.body)
        send_function_to_wallet(reqBody.input)
        res.status(200).json({Success: "Request is being processed"})
    }else{
        res.status(400).json({Failuire: "Invalid Method"})
    }
}