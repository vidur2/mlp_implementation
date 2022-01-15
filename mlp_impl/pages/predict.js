import styles from "../styles/Home.module.css"
import Head from "next/head"
import { connect, Contract, keyStores, KeyPair, WalletAccount, WalletConnection } from "near-api-js"


async function check_initialized(account_id, wallet_account){
  const perceptron_account_id = `mlp1.perceptron.${account_id}`;
  const account = wallet_account.account();
  try {
      const resp = await account.viewFunction(
          perceptron_account_id,
          "get_structure",
          {}
      )
      window.sessionStorage.setItem("num_neurons", await resp[0].toString())
      return true
  } catch (err){
      console.log(err)
      return false
  }
}

async function get_prediction_info(account_id){
    const contract_id = `mlp1.perceptron.${account_id}`;
    const config = {
      networkId: "testnet",
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    }
    const near = await connect(config)
    const account = await near.account("perceptron.testnet");
    const weights = await account.viewFunction(contract_id, "get_weights", {})
    const structure = await account.viewFunction(contract_id, "get_structure", {})
    return {
      num_inputs: weights.length,
      num_contracts: structure[0]
    }
  }

export default function Predict(){
  let contract_info;
  // Event handler for form submit
  const contract_call = async(event) => {
    // Disables button onSubmit
    const button = document.getElementById("submit_button");
    button.disabled = true;

    // Prevents page from reloading
    event.preventDefault();

    // Connection to smart contract
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
    
    // Brings body of html into scope of javascript
    const title = document.getElementById("title")
    const body = document.getElementById("formBody");
    const entryText = document.getElementById("entryText")

    // Gets inputs from forms
    let input1 = document.getElementById("input1");
    let input2 = document.getElementById("input2");
    let input3 = document.getElementById("input3");
    let input5 = document.getElementById("input5");
    let input6 = document.getElementById("input6");
    let input7 = document.getElementById("input7");
    let input8 = document.getElementById("input8");
    let input9 = document.getElementById("input9");
    let input10 = document.getElementById("input10");
    let input13 = document.getElementById("input14");
    let input14 = document.getElementById("input15");
    let input15 = document.getElementById("input15");
    let input16 = document.getElementById("input16");
    const input17Raw = document.getElementById("input17");
    const windGustDir = document.getElementById("input18");
    const windDir9am = document.getElementById("input19");
    const windDir3pm = document.getElementById("input20");

    // Gets error message area in case form data is invalid
    const errorArea = document.getElementById("Error Message")

    // Parses input form into numbers
    let input17;
    if (input17Raw.value === "Yes"){
      input17 = 1.0
    }else{
      input17 = 0.0
    }
    // Casts user input into nessescary types for the model to read
    const windGustDirX = Math.cos(map.get(windGustDir.value));
    const windGustDirY = Math.sin(map.get(windGustDir.value));
    const windDir9amX = Math.cos(map.get(windDir9am.value));
    const windDir9amY = Math.sin(map.get(windDir9am.value));
    const windDir3pmX = Math.cos(map.get(windDir3pm.value));
    const windDir3pmY = Math.sin(map.get(windDir3pm.value))

    // Sends data to smart contracts for prediction
    input1 = (parseFloat(input1.value) - 32) * (5/9)
    input2 = (parseFloat(input2.value) - 32) * (5/9) 
    input3 = parseFloat(input3.value) * 0.0393701
    const input4 = 5.420289231739922
    input5 = parseFloat(input5.value)
    input6 = parseFloat(input6.value) * 1.6
    input7 = parseFloat(input7.value) * 1.6
    input8 = parseFloat(input8.value) * 1.6
    input9 = parseFloat(input9.value)
    input10 = parseFloat(input10.value)
    const input11 = 1017.4989079446112
    const input12 = 1015.1470960505009
    input13 = (parseFloat(input13.value) * 8)/100
    input14 = (parseFloat(input14.value) * 8)/100
    input15 = (parseFloat(input15.value) - 32) * (5/9)
    input16 = (parseFloat(input16.value) - 32) * (5/9)

    // Contract call to view output
    contract.predict_raw(
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
        input18: windGustDirX,
        input19: windGustDirY,
        input20: windDir9amX,
        input21: windDir9amY,
        input22: windDir3pmX,
        input23: windDir3pmY,
      },
      115_000_000_000_000
    ).then((value) => {

      // Mutating frontend based on output
      if(value === "1"){
        title.style.paddingLeft = "10%"
        title.style.fontSize = "30px"
        title.innerHTML = "<h1>Models Prediction: It will rain tomorrow</h1>"
        body.innerHTML = ""
      }else {
        title.style.paddingLeft = "10%"
        title.style.fontSize = "30px"
        title.innerHTML = "<h1>Model's Prediction: It will not rain tomorrow</h1>"
        body.innerHTML = ""
      }
  }).catch(() => {

    // Displays error text if one or more feilds are invalid
    errorArea.textContent = 'Entered data is invalid'
    button.disabled = false;
  });
  }

  if (typeof window !== "undefined"){
    const config = {
      networkId: "testnet",
      keyStore: new keyStores.BrowserLocalStorageKeyStore,
      nodeUrl: "https://rpc.testnet.near.org",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    }
    connect(config).then((near) => {
      const wallet = new WalletConnection(near)
      if (wallet.isSignedIn()){
        const account = wallet.account();
        check_initialized(account.accountId, account).then((is_initialized) => {
          if (is_initialized){
            contract_info = get_prediction_info(account.accountId);

          } else {
            wallet.requestSignIn({
              contractId: "perceptron.testnet",
              successUrl: `https://${window.location.host}/profile`,
              failuireUrl: `https://${window.location.host}`
            })
          }
        })
      } else {
        wallet.requestSignIn({
          contractId: "perceptron.testnet",
          successUrl: `https://${window.location.host}/profile`,
          failuireUrl: `https://${window.location.host}`
        })
      }
    })
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Predict</title>
        <link rel="icon" href="/logo.svg" />
      </Head>
      <main id = "body" className={styles.body}>
      <div className={styles.predict_head} id="title">
          <h1 className={styles.title}>Predict</h1>
          <p className={styles.subtext}>Use this tool to forecast the rain tomorrow!</p>
          <p className={styles.subtext2}>Enter values from today's conditions</p>
        </div>
        <form onSubmit={contract_call} onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} className={styles.formBody} id="formBody">
            <div className = {styles.doubleInput}> <span className={styles.input_border}>Min Temp (-10 ºF to 120 ºF) </span><input id="input1" className={styles.input_field}></input></div>
            <span className={styles.input_border}>Max Temp (-10 ºF to 120 ºF) </span><input id="input2" className={styles.input_field}></input>
            <p></p>
            <div className={styles.doubleInput}><span className={styles.input_border}>Temp 9am (-10 ºF to 120 ºF) </span><input id="input15" className={styles.input_field}></input></div>
            <span className={styles.input_border}>Temp 3pm (-10 ºF to 120 ºF) </span><input id="input16" className={styles.input_field}></input>
            <p></p>
            <div className={styles.doubleInput}><span className={styles.input_border}>Humidity 9am (Enter a %) </span><input id="input9" className={styles.input_field}></input></div>
            <span className={styles.input_border}>Humidity 3pm (Enter a %) </span><input id="input10" className={styles.input_field}></input>
            <p></p>
            <span className={styles.input_border}>Rainfall (0 in to 8.52 in) </span><input id="input3" className={styles.input_field}></input>
            <p></p>
            <span className={styles.input_border}>Sunshine (0 hr to 14.5 hr) </span><input id="input5" className={styles.input_field}></input>
            <p></p>
            <span className={styles.input_border}>Wind Gust Speed Avg (5 mi/hr to 75 mi/hr) </span><input id="input6" className={styles.input_field}></input>
            <p></p>
            <span className={styles.input_border}>Wind Speed 9am (0 mph to 40 mph) </span><input id="input7" className={styles.input_field}></input>
            <p></p>
            <span className={styles.input_border}>Wind Speed 3pm (0 mph to 45 mph) </span><input id="input8" className={styles.input_field}></input>
            <p></p>
            <span className={styles.input_border}>Cloud 9am (% of sky that is covered by clouds) </span><input id="input13" className={styles.input_field}></input>
            <p></p>
            <span className={styles.input_border}>Cloud 3pm (Enter a %) </span><input id="input14" className={styles.input_field}></input>
            <p></p>
            <span className={styles.input_border}>Wind Direction Avg </span><select id="input18" className={styles.dropdown_field} style={{maxWidth: "200px", textAlign: "center"}} onChange={() => {const field = document.getElementById("input18"); field.style.maxWidth="50px"}}>
              <option>Choose a Direction</option>
              <option>N</option>
              <option>NNE</option>
              <option>ENE</option>
              <option>NE</option>
              <option>ESE</option>
              <option>SE</option>
              <option>SSE</option>
              <option>S</option>
              <option>SSW</option>
              <option>SW</option>
              <option>WSW</option>
              <option>W</option>
              <option>WNW</option>
              <option>NW</option>
              <option>NNW</option>
            </select>
            <p></p>
            <span className={styles.input_border}>Wind Direction 9am </span><select id="input19" className={styles.input_field} style={{height: "30px", top: "-2px", maxWidth: "200px"}} onChange={() => {const field = document.getElementById("input19"); field.style.maxWidth="50px"}}>
              <option>Choose a Direction</option>
              <option>N</option>
              <option>NNE</option>
              <option>ENE</option>
              <option>NE</option>
              <option>ESE</option>
              <option>SE</option>
              <option>SSE</option>
              <option>S</option>
              <option>SSW</option>
              <option>SW</option>
              <option>WSW</option>
              <option>W</option>
              <option>WNW</option>
              <option>NW</option>
              <option>NNW</option>
            </select>
            <p></p>
          <span className={styles.input_border}>Wind Direction 3pm </span><select id="input20" className={styles.input_field} style={{height: "30px", top: "-2px", maxWidth: "200px"}} onChange={() => {const field = document.getElementById("input20"); field.style.maxWidth="50px"}}>
            <option>Choose a Direction</option>
            <option>N</option>
            <option>NNE</option>
            <option>ENE</option>
            <option>NE</option>
            <option>ESE</option>
            <option>SE</option>
            <option>SSE</option>
            <option>S</option>
            <option>SSW</option>
            <option>SW</option>
            <option>WSW</option>
            <option>W</option>
            <option>WNW</option>
            <option>NW</option>
            <option>NNW</option>
          </select>
          <p></p>
          <span className={styles.input_border}>Rained Today </span><select id="input17" className={styles.input_field} style={{height: "30px", top: "-2px", maxWidth: "200px"}}>
            <option>No</option>
            <option>Yes</option>
          </select>
          <p></p>
        <button type="submit" id="submit_button" className={styles.button}>Submit</button>
        <div id = "Error Message" className={styles.error}></div>
        </form>
        <div id="entryText" className = {styles.inforPage}>
        </div>
      </main>
    </div>
  )
  }