import styles from "../styles/Home.module.css"
import Head from "next/head"
import { connect, Contract, keyStores, KeyPair } from "near-api-js"


export default function Predict(){
  const map = new Map
  map.set("N", 0);
  map.set("NNE", 1 * (45/2));
  map.set("NE", 2 * (45/2));
  map.set("ENE", 3 * (45/2));
  map.set("E", 4 * (45/2));
  map.set("ESE", 5 * (45/2));
  map.set("SE", 6 * (45/2));
  map.set("SSE", 7 * (45/2));
  map.set("S", 8 * (45/2));
  map.set("SSW", 9 * (45/2));
  map.set("SW", 10 * (45/2));
  map.set("WSW", 11 * (45/2));
  map.set("W", 12 * (45/2));
  map.set("WNW", 13 * (45/2));
  map.set("NW", 14 * (45/2));
  map.set("NNW", 15 * (45/2));


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
    const input6 = document.getElementById("input6");
    const input7 = document.getElementById("input7");
    const input8 = document.getElementById("input8");
    const input9 = document.getElementById("input9");
    const input10 = document.getElementById("input10");
    const input11 = document.getElementById("input11");
    const input12 = document.getElementById("input12");
    const input13 = document.getElementById("input14");
    const input14 = document.getElementById("input15");
    const input15 = document.getElementById("input15");
    const input16 = document.getElementById("input16");
    const input17 = document.getElementById("input17");
    const windGustDir = document.getElementById("input18");
    const windDir9am = document.getElementById("input19");
    const windDir3pm = document.getElementById("input20");

    const windGustDirX = Math.cos(map.get(windGustDir));
    const windGustDirY = Math.sin(map.get(windGustDir));
    const windDir9amX = Math.cos(map.get(windGustDir));
    const windDir9amY = Math.sin(map.get(windGustDir));
    const windDir3pmX = Math.cos(map.get(windGustDir));
    const windDir3pmY = Math.sin(map.get(windGustDir))

    body.innerHTML = "<h1>Loading...</h1>"

    contract.predict_raw(
      {
        input1: parseFloat(input1.value),
        input2: parseFloat(input2.value),
        input3: parseFloat(input3.value),
        input4: parseFloat(input4.value),
        input5: parseFloat(input5.value),
        input6: parseFloat(input6.value),
        input7: parseFloat(input7.value),
        input8: parseFloat(input8.value),
        input9: parseFloat(input9.value),
        input10: parseFloat(input10.value),
        input11: parseFloat(input11.value),
        input12: parseFloat(input12.value),
        input13: parseFloat(input13.value),
        input14: parseFloat(input14.value),
        input15: parseFloat(input15.value),
        input16: parseFloat(input16.value),
        input17: parseFloat(input17.value),
        input18: windGustDirX,
        input19: windGustDirY,
        input20: windDir9amX,
        input21: windDir9amY,
        input22: windDir3pmX,
        input23: windDir3pmY,
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
          Min Temp: <input id="input1"></input>
          <p></p>
          Max Temp: <input id="input2"></input>
          <p></p>
          Rainfall: <input id="input3"></input>
          <p></p>
          Evaporation: <input id="input4"></input>
          <p></p>
          Sunshine: <input id="input5"></input>
          <p></p>
          Wind Gust Speed: <input id="input6"></input>
          <p></p>
          Wind Speed 9am: <input id="input7"></input>
          <p></p>
          Wind Speed 3pm: <input id="input8"></input>
          <p></p>
          Humidity 9am: <input id="input9"></input>
          <p></p>
          Humidity 3pm: <input id="input10"></input>
          <p></p>
          Pressure 9am: <input id="input11"></input>
          <p></p>
          Pressure 3pm: <input id="input12"></input>
          <p></p>
          Cloud 9am: <input id="input13"></input>
          <p></p>
          Cloud 3pm: <input id="input14"></input>
          <p></p>
          Temp 9am: <input id="input15"></input>
          <p></p>
          Temp 3pm: <input id="input16"></input>
          <p></p>
          Rain Today: <input id="input17"></input>
          <p></p>
          Wind Gust Direction: <input id="input18"></input>
          <p></p>
          Wind Direction 9am: <input id="input19"></input>
          <p></p>
          Wind Direction 3pm: <input id="input20"></input>
          <p></p>
          <button type="submit">Submit</button>
        </form>
      </main>
    </div>
  )
}