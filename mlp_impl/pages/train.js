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
          for (row in split_result){
              const inputs = row.split(",")
              contract.predict(
                  {
                    input1: inputs[0],
                    input2: inputs[1],
                    input3: inputs[2],
                    input4: inputs[3],
                    input5: inputs[4],
                    input6: inputs[5],
                    input7: inputs[6],
                    input8: inputs[7],
                    input9: inputs[8],
                    input10: inputs[9],
                    input11: inputs[10],
                    input12: inputs[11],
                    input13: inputs[12],
                    input14: inputs[13],
                    input15: inputs[14],
                    input16: inputs[15],
                    input17: inputs[16],
                    input18: inputs[17],
                    input19: inputs[18],
                    input20: inputs[19],
                    input21: inputs[20],
                    input22: inputs[21],
                    input23: inputs[22],
                    expected_output: inputs[24],
                  },
                  115_000_000_000_000
              )
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