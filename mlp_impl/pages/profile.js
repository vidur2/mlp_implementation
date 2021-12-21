import { WalletConnection, keyStores, connect, KeyPair, utils, transactions, Contract } from "near-api-js";
import styles from "../styles/Home.module.css"
import router from "next/router"
import Head from "next/head"

async function get_contract(){
    const resp = await fetch(`https://${window.location.host}/blockchain_master_account.wasm`);
    const ab = await resp.arrayBuffer();
    const uint8arrray = new Uint8Array(ab)
    return uint8arrray
}

export default function Profile(){
    let counter = 1;
    const ids = new Array;
    if (typeof window !== "undefined"){
        const body = document.getElementById("body")
        const config = {
            networkId: "testnet",
            keyStore: new keyStores.BrowserLocalStorageKeyStore(),
            nodeUrl: "https://rpc.testnet.near.org",
            walletUrl: "https://wallet.testnet.near.org",
            helperUrl: "https://helper.testnet.near.org",
            explorerUrl: "https://explorer.testnet.near.org",
        };
        connect(config).then((near) => {
            const wallet = new WalletConnection(near);
            const account = wallet.account();
            try {
                let nn_information;
                console.log(window.location.href.indexOf("error"))
                if (window.location.href.indexOf("error") != -1 && window.localStorage.getItem("nn_information") == null){
                    window.localStorage.setItem("nn_information", window.sessionStorage.getItem("nn_information"))
                }
                nn_information = window.sessionStorage.getItem("nn_information");
                if (nn_information == null){
                    nn_information = window.localStorage.getItem("nn_information")
                }
                if (wallet.isSignedIn()){
                    const contract_id = `perceptron.${account.accountId}`
                    nn_information = nn_information.split("},")
                    console.log(nn_information)
                    for (let i = 0; i < nn_information.length; i++){
                        if (nn_information[i][nn_information[i].length - 1] != "}"){
                            nn_information[i] = nn_information[i] + '}'
                        }
                        nn_information[i] = JSON.parse(nn_information[i])
                    }
                    const amt_neurons = parseInt((nn_information[nn_information.length-1]).account.split("p")[1].split(".")[0]);
                    let gas_amt = utils.format.parseNearAmount("0") * amt_neurons;
                    account.functionCall(
                        contract_id,
                        "generate_mlp",
                        {
                            amt_neurons: amt_neurons
                        },
                        gas_amt,
                        utils.format.parseNearAmount("20")
                    )
                }
                body.innerHTML = "";
            }catch (err){
                console.log(err)
                if (!wallet.isSignedIn()){
                    body.innerHTML = "";
                }
            }
        })
    }
    const handleTransaction = async(event) => {
        event.preventDefault();
        const wasm = await get_contract()
        
        const config = {
            networkId: "testnet",
            keyStore: new keyStores.BrowserLocalStorageKeyStore(),
            nodeUrl: "https://rpc.testnet.near.org",
            walletUrl: "https://wallet.testnet.near.org",
            helperUrl: "https://helper.testnet.near.org",
            explorerUrl: "https://explorer.testnet.near.org",
        };
        connect(config).then((near) => {
            const wallet = new WalletConnection(near);
            const account = wallet.account();
            const layerInformation = new Array;
            const layerStructure = new Array
            let offset = 0;
            for (let i = 0; i < ids.length; i++){
                const id = ids[i];
                const act_func = document.getElementById(`act_func_${i + 1}`.toString()).value
                let layer_length = parseInt(document.getElementById(id).value)
                layerStructure.push(layer_length)
                for (let j = 0; j < layer_length; j++){
                    const information = {
                        account: `mlp${j + offset + 1}.perceptron.${account.accountId}`,
                        act_func: act_func,
                        pos_x: j + 1,
                        pos_y: i + 1
                    }
                    layerInformation.push(JSON.stringify(information))
                }
                offset += layer_length;
            }
            window.sessionStorage.setItem("nn_information", layerInformation.toString())
            const keyPair = KeyPair.fromRandom("ed25519");
            fetch(`https://${window.location.host}/api/contract_inter`, {
                method: "POST",
                body: JSON.stringify({
                    account_id: `perceptron.${account.accountId}`,
                    private_key: keyPair.secretKey.toString()
                })
            })
            account.createAndDeployContract(`perceptron.${account.accountId}`, keyPair.getPublicKey(), wasm, utils.format.parseNearAmount("45"))
        })
    }

    const addInput = async(event) => {
        event.preventDefault();
        const removeButton = document.getElementById("removal_button")
        if (removeButton.disabled){
            removeButton.disabled = false;
        }
        counter += 1;
        ids.push(`input${counter}`)
        const form_element = document.getElementById("form_ext");
        form_element.innerHTML = form_element.innerHTML + `<p></p><span id=layer${counter}>Layer ${counter} Information: <input id=input${counter} type="text" placeholder="Amt of Neurons"></input><select id="act_func_${counter}"><option>Act Func</option><option>tanh</option><option>logistic</option><option>step</option><option>linear</option></select></span>`;

    }

    const removeInput = async(event) => {
        event.preventDefault();
        ids.pop();
        console.log(ids)
        const removeButton = document.getElementById("removal_button")
        const form_element = document.getElementById(`layer${counter}`);
        console.log(form_element)
        if (counter != 1){
            form_element.outerHTML = "";
            counter -= 1;
        } else {
            removeButton.disabled = true;
        }
    }
    return (
            <div className={styles.container}>
                <Head>
                    <title>Deploy your Model</title>
                    <link rel="icon" href="/logo.svg" />
                </Head>
                <div className={styles.predict_head} id="title" style={{background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/nn_wasm.png')"}}>
                    <h1 className={styles.title} style={{textDecoration: "none", fontSize: "50px", color: "white"}}>Deploy Your MLP</h1>
                </div>
                <main className={styles.main} style={{paddingTop: "3%"}} id="body">
                    <form onSubmit={handleTransaction}>
                        Layer 1 Information: <input id="input1" placeholder="Amount of Neurons"></input>
                        <select id="act_func_1">
                            <option>Act Func</option>
                            <option>tanh</option>
                            <option>logistic</option>
                            <option>step</option>
                            <option>linear</option>
                        </select>
                        <div id="form_ext"></div>
                        <p style={{paddingBottom: "0.1%"}}></p>
                        <button onClick={addInput}>Add Layer</button><button onClick={removeInput} id="removal_button">Remove Layer</button>
                        <p></p>
                        <button onSubmit={handleTransaction}>Submit</button>
                    </form>
                </main>
            </div>
    )
}