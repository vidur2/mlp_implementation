import { WalletConnection, keyStores, connect, KeyPair, utils, transactions } from "near-api-js";
import styles from "../styles/Home.module.css"
import Head from "next/head"
import ProfileLoader from "./profile.js"

async function get_contract(){
    const resp = await fetch("http://localhost:3000/general_blockchain_master_account.wasm");
    const ab = await resp.arrayBuffer();
    const uint8arrray = new Uint8Array(ab)
    return uint8arrray
}

export default function Profile(){
    let counter = 1;
    const ids = new Array;
    ids.push("input1")
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
            const accountId = account.accountId;
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
                        account: `mlp${j + offset + 1}.${accountId}`,
                        act_func: act_func,
                        pos_x: j + 1,
                        pos_y: i + 1
                    }
                    layerInformation.push(JSON.stringify(information))
                }
                offset += layer_length;
            }
            console.log(wasm)
            window.sessionStorage.setItem("nn_information", layerInformation.toString())
            const txns = new Array;
            const keyPair = KeyPair.fromRandom("ed25519");
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
        form_element.innerHTML = form_element.innerHTML + `<p></p><span id=layer${counter}>Layer ${counter} Information: <input id=input${counter} type="text" placeholder="Amt of Neurons"></input><select id="act_func_${counter}"><option>Act Func</option><option>tanh</option><option>logistic</option><option>step</option><option>linear</option></select></span>`.toString();

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

    return(
        <div className={styles.container}>
            <Head>
                <title>Deploy your Model</title>
                <link rel="icon" href="/logo.svg" />
            </Head>
            <div className={styles.predict_head} id="title" style={{background: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/nn_wasm.png')"}}>
                <h1 className={styles.title} style={{textDecoration: "none", fontSize: "50px", color: "white"}}>Deploy Your MLP</h1>
            </div>
            <ProfileLoader />
        </div>
    )
}