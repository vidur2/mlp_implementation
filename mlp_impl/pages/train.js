import styles from "../styles/Home.module.css"
import Head from "next/head"
import { connect, Contract, keyStores, KeyPair } from "near-api-js"

export default function Train(){
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
    const parse_csv = async(event) =>{
        let input1;
        let input2;
        let input3;
        let input4;
        let input5;
        let input6;
        let input7;
        let input8;
        let input9;
        let input10;
        let input11;
        let input12;
        let input13;
        let input14;
        let input15;
        let input16;
        let input17;
        let input18;
        let input19;
        let input20;
        let input21;
        let input22;
        let input23;
        let input24;
        event.preventDefault();
        const file = event.target.file_input.files[0];
        const file_reader = new FileReader;
        file_reader.readAsText(file);
        file_reader.onload = async function(result) { 
            const string_result = result.target.result.toString();
            const parsed_rows = string_result.split("\n")
            for (row in parsed_rows){
                const elem_list = parsed_rows.split(",");
                input1 = elem_list[0];
                input2 = elem_list[1];
                input3 = elem_list[2];
                input4 = elem_list[3];
                input5 = elem_list[4];
                input6 = elem_list[5];
                input7 = elem_list[6];
                input8 = elem_list[8];
                input9 = elem_list[9];
                input10 = elem_list[10];
                input11 = elem_list[11];
                input12 = elem_list[12];
                input13 = elem_list[13];
                input14 = elem_list[14];
                input15 = elem_list[15];
                input16 = elem_list[16];
                input17 = elem_list[17];
                input18 = elem_list[18];
                input19 = elem_list[19];
                input20 = elem_list[20];
                input21 = elem_list[21];
                input22 = elem_list[22];
                input23 = elem_list[23];
                input24 = elem_list[24];
                contract.predict(
                    {
                        input1: input1,
                        input2: input2,
                        input3: input3,
                        input4: input4,
                        input5: input5,
                        input6: input6,
                        input7: input7,
                        input8: input8,
                        input9: input9,
                        input10: input10,
                        input11: input11,
                        input12: input12,
                        input13: input13,
                        input14: input14,
                        input15: input15,
                        input16: input16,
                        input17: input17,
                        input18: input18,
                        input19: input19,
                        input20: input20,
                        input21: input21,
                        input22: input22,
                        input23: input23,
                        expected_output: input24,
                    },
                    115_000_000_000_000
                )
            }
        }

    }
    return(
        <form onSubmit={parse_csv}>
            <input type="file" name="file_input"></input>
            <button type="submit"></button>
        </form>
    )
}