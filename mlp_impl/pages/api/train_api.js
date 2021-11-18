import { connect, Contract, keyStores, KeyPair } from "near-api-js"


let stored_data = new Array;
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '5mb'
        }
    }
}

async function call_contract(csv_string, counter){
    console.log(counter)
    const row = csv_string[counter];
    console.log(row)
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
    const resp = await contract.predict({
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
    })
    fetch("http://localhost:3000/api/train_api", {
        method: 'POST',
        body: JSON.stringify({
            counter: counter + 1
        })
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