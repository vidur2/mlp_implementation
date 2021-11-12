import styles from "../styles/Home.module.css"
import Head from "next/head"
import { connect, Contract, keyStores, KeyPair } from "near-api-js"

export default function Train(){
    const parse_csv = async(event) =>{
      event.preventDefault();
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
      const file = event.target.file_input.files[0];
      const file_reader = new FileReader;
      file_reader.readAsText(file);
      file_reader.onload = async function(result) { 
          const string_result = result.target.result.toString();
          const split_result = string_result.split("\n")
          split_result.splice(0, 1);
          for (let i = 0; i < split_result.length; i++){
              const row = split_result[i];
              const inputs = row.split(",")
              contract.predict(
                  {
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
                    input18: parseFloat(inputs[17]),
                    input19: parseFloat(inputs[23]),
                    input20: parseFloat(inputs[19]),
                    input21: parseFloat(inputs[20]),
                    input22: parseFloat(inputs[21]),
                    input23: parseFloat(inputs[22]),
                    expected_output: parseFloat(inputs[18]),
                  },
                  115_000_000_000_000
              ).then((result) => {
                  console.log("shit")
                  console.log(result)
              })
          }
      }

    }
    return(
        <form onSubmit={parse_csv}>
            <input type="file" name="file_input"></input>
            <button type="submit">Submit</button>
        </form>
    )
}