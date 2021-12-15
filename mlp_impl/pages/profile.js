import { stream } from "got"
import { WalletConnection, keyStores, connect, KeyPair } from "near-api-js";
import styles from "../styles/Home.module.css"
import Head from "next/head"

export default function Profile(){
    let counter = 1;
    const ids = new Array;
    ids.push("input1")
    const handleTransaction = async(event) => {
        event.preventDefault();
        let information = window.location.href;
        information = information.split("?")[1];
        information = information.split("&");
        const account = information[0].split("=")[1];
        const layerInformation = new Array;
        const layerStructure = new Array
        let offset = 0;
        for (let i = 0; i < ids.length; i++){
            const id = ids[i];
            const act_func = document.getElementById(`act_func${i}`)
            let layer_length = parseInt(document.getElementById(id).value)
            layerStructure.push(layer_length)
            for (let j = 0; j < layer_length; j++){
                const information = {
                    account: `mlp${j + offset + 1}.${account}`,
                    act_func: act_func,
                    pos_x: j + 1,
                    pos_y: i + 1
                }
                layerInformation.push(information)
            }
            offset += layer_length;
        }
        
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
            for (let i = 0; i < layerInformation.length; i++){
                const keyPair = KeyPair.fromRandom("ed25519");
            }
        })
    }

    const addInput = async(event) => {
        event.preventDefault();
        counter += 1;
        ids.push(`input${counter}`)
        console.log(ids)
        const form_element = document.getElementById("form_ext");
        form_element.innerHTML = form_element.innerHTML + `<p></p>Layer ${counter} Information: <input id=input${counter} type="text" placeholder="Amt of Neurons"></input><select id="act_func_${counter}"><option>Act Func</option><option>tanh</option><option>logistic</option><option>step</option><option>linear</option></select>`.toString();

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
            <main className={styles.main} style={{paddingTop: "3%"}}>
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
                    <button onClick={addInput}>Add Layer</button>
                    <p></p>
                    <button onSubmit={handleTransaction}>Submit</button>
                </form>
            </main>
        </div>
    )
}