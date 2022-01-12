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