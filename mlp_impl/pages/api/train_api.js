import { connect, Contract, keyStores, KeyPair } from "near-api-js"

async function call_contract(row){
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
    const inputs = row.split(",")
    const result = contract.predict({
        args: {
            input1: parseFloat(inputs[0]),
            input2: parseFloat(inputs[1]),
            input3: parseFloat(inputs[2]),
            input4: parseFloat(inputs[3]),
            input5: parseFloat(inputs[4]),
            input6: parseFloat(inputs[5]),
            input7: parseFloat(inputs[6]),
            input8: parseFloat(inputs[7]),
            input9: parseFloat(inputs[8]),
            input10: parseFloat(inputs[9]),
            input11: parseFloat(inputs[10]),
            input12: parseFloat(inputs[11]),
            input13: parseFloat(inputs[12]),
            input14: parseFloat(inputs[13]),
            input15: parseFloat(inputs[14]),
            input16: parseFloat(inputs[15]),
            input17: parseFloat(inputs[16]),
            input18: parseFloat(inputs[23]),
            input19: parseFloat(inputs[18]),
            input20: parseFloat(inputs[19]),
            input21: parseFloat(inputs[20]),
            input22: parseFloat(inputs[21]),
            input23: parseFloat(inputs[22]),
            expected_output: parseFloat(inputs[17]),
        },
        gas: 115_000_000_000_000,
    }).then((value) => {
        console.log(value)
    })

    return result
}


export default function handler(req, res){
    if (req.method == 'POST'){
        const reqBody = JSON.parse(req.body);
        console.log(reqBody)
        const csv_string = reqBody.csv_string
        csv_string = csv_string.split("\n")
        csv_string.splice(0, 1);
        for (let i = 0; i < csv_string.length; i++){
            call_contract(csv_string[i])
            console.log(csv_string[i])
        }
        res.status(200).json({status: "Succesful"})
    }
}