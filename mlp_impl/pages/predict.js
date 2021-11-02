import styles from "../styles/Home.module.css"
import Head from "next/head"
import { connect, Contract, keyStores, KeyPair } from "near-api-js"


export default function Predict(){
  const contract_call = async(event) => {
    const body = document.getElementById("body")
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

    const input1 = document.getElementById("input1");
    const input2 = document.getElementById("input2");
    const input3 = document.getElementById("input3");
    const input4 = document.getElementById("input4");
    const input5 = document.getElementById("input5");

    body.innerHTML = "<h1>Loading...</h1>"

    contract.predict_raw(
      {
        input1: parseFloat(input1.value),
        input2: parseFloat(input2.value),
        input3: parseFloat(input3.value),
        input4: parseFloat(input4.value),
        input5: parseFloat(input5.value)
      },
      115_000_000_000_000
    ).then((value) => {
      if(value === "1"){
        body.innerHTML = "<h1>Output is " + value + "</h1>"
      }else {
        body.innerHTML = "<h1>Output is 0" + value + "</h1>"
      }
  });
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Predict</title>
      </Head>
      <main id = "body">
        <form onSubmit={contract_call}>
          <input id="input1"></input>
          <p></p>
          <input id="input2"></input>
          <p></p>
          <input id="input3"></input>
          <p></p>
          <input id="input4"></input>
          <p></p>
          <input id="input5"></input>
          <p></p>
          <button type="submit">Submit</button>
        </form>
      </main>
    </div>
  )
}