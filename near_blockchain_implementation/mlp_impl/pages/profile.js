import { WalletConnection, keyStores, connect, KeyPair, utils } from "near-api-js";
import styles from "../styles/Home.module.css"
import Head from "next/head"
import { useRouter } from "next/router"

async function get_contract(){
    const resp = await fetch(`https://${window.location.host}/blockchain_master_account.wasm`);
    const ab = await resp.arrayBuffer();
    const uint8arrray = new Uint8Array(ab)
    return uint8arrray
}

function parse_nn(nn_information){
    for (let i = 0; i < nn_information.length; i++){
        if (nn_information[i][nn_information[i].length - 1] != "}"){
            nn_information[i] = nn_information[i] + '}'
        }
        nn_information[i] = JSON.parse(nn_information[i])
    }
    return nn_information;
}

async function check_initialized(account_id, wallet_account){
    const perceptron_account_id = `mlp1.perceptron.${account_id}`;
    const account = wallet_account.account();
    try {
        const resp = await account.viewFunction(
            perceptron_account_id,
            "get_weights",
            {}
        )
        console.log(resp)
        return true
    } catch (err){
        console.log(err)
        return false
    }
}

async function generate_mlp(nn_information, perceptron_account){
    const wasm = await get_contract()
    const contract_id = perceptron_account.accountId
    console.log(perceptron_account)
    await perceptron_account.deployContract(wasm)
    nn_information = nn_information.split("},")
    nn_information = parse_nn(nn_information)
    const amt_neurons = parseInt(window.sessionStorage.getItem("amt_neurons"))
    await perceptron_account.functionCall(
            contract_id,
            "generate_mlp",
            {
                amt_neurons: amt_neurons
            },
            "300000000000000"
        )
    let layer_amt = new Array;
    let activation_function = new Array;
    let current_iter;
    let prev_iter;
    for (let i = 0; i < nn_information.length; i++){
        current_iter = nn_information[i].pos_y
        if (i > 0){
            prev_iter = nn_information[i - 1].pos_y
        }
        if (current_iter != prev_iter){
            activation_function.push(nn_information[i].act_func);
            layer_amt.push(nn_information[i].amt_in_layer);
        }
    }
    let amt_inputs;
    if (window.sessionStorage.getItem("amt_inputs") != null){
        amt_inputs = parseInt(window.sessionStorage.getItem("amt_inputs"))
    }else {
        amt_inputs = parseInt(window.localStorage.getItem("amt_inputs"))
    }
    await perceptron_account.functionCall(
        contract_id,
        "initialize_mlp",
        {
            input_amt: amt_inputs,
            layer_amt: layer_amt,
            activation_function: activation_function,
        },
        "100000000000000"
    )
}

export default function Profile(){
    let counter = 1;
    const ids = new Array();
    ids.push("input1")
    const router = useRouter();
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

            try {
                let nn_information;
                const accountId = window.location.href.split("?")[1].split("=")[1].split("&")[0]
                check_initialized(accountId, wallet).then((is_initialized) => {
                    console.log(is_initialized)
                    if (is_initialized){
                        router.push("/train")
                    } else{
                        console.log(window.location.href.indexOf("error"))
                        if (window.location.href.indexOf("error") != -1 && window.localStorage.getItem("nn_information") == null){
                            window.localStorage.setItem("nn_information", window.sessionStorage.getItem("nn_information"))
                            window.localStorage.setItem("amt_inputs", window.sessionStorage.getItem("amt_inputs"))
                        }
                        nn_information = window.sessionStorage.getItem("nn_information");
                        if (nn_information == null){
                            nn_information = window.localStorage.getItem("nn_information")
                        }

                        if (nn_information === "null"){
                            breakThing
                        }
                        
                        nn_information.split("}")
                        console.log(nn_information)
                        if (wallet.isSignedIn()){
                            if (JSON.stringify(window.localStorage).indexOf(`perceptron.${accountId}`) == -1){
                                fetch(`https://${window.location.host}/api/get_account_pk`, {
                                    method: "POST",
                                    body: JSON.stringify({
                                        account_id: `perceptron.${accountId}`
                                    })
                                }).then((response) => {
                                    response.json().then((response_information) => {
                                        const keyPair = KeyPair.fromString(response_information.private_key)
                                        config.keyStore.setKey("testnet", `perceptron.${accountId}`, keyPair)
                                        console.log(config.keyStore)
                                        near.account(`perceptron.${accountId}`).then((account) => {
                                            try{
                                                generate_mlp(nn_information, account).then(() => {
                                                    router.push("/train")
                                                })
                                            } catch {
                                                window.location.reload()
                                            }
                                        })
                                    })
                                })
                            } else {
                                near.account(`perceptron.${accountId}`).then((account) => {
                                    try{
                                        generate_mlp(nn_information, account).then(() => {
                                            router.push("/train")
                                        })
                                    } catch {
                                        window.location.reload;
                                    }
                                })
                            }
                        }
                        body.innerHTML = "Loading...";
                    }
                })
            }catch (err){
                console.log(err)
                if (!wallet.isSignedIn()){
                    body.innerHTML = "";
                    wallet.requestSignIn({
                        contractId: "perceptron.testnet",
                        successUrl: `https://${window.location.host}/profile`,
                        failuireUrl: `https://${window.location.host}`
                    })
                }
            }
        })
    }


    // Handles form submission
    const handleTransaction = async(event) => {
        event.preventDefault();
        const accountId = window.location.href.split("?")[1].split("=")[1].split("&")[0]
        window.sessionStorage.setItem("amt_inputs", document.getElementById("inputAmount").value)
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
                        account: `mlp${j + offset + 1}.perceptron.${accountId}`,
                        act_func: act_func,
                        pos_x: j + 1,
                        pos_y: i + 1,
                        amt_in_layer: layer_length
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
                    account_id: `perceptron.${accountId}`,
                    private_key: keyPair.secretKey.toString()
                })
            })
            window.localStorage.setItem("private_key", keyPair.secretKey.toString())
            config.keyStore.setKey("testnet", `perceptron.${accountId}`, keyPair)
            let amt_neurons = 0;
            for (let i = 0; i < layerInformation.length; i++){
                const layer = layerInformation[i];
                let prev_layer;
                if (i > 0){
                    prev_layer = layerInformation[i - 1];
                } else{
                    prev_layer = layerInformation[layerInformation.length - 1]
                }
                console.log(layer)
                if (JSON.parse(prev_layer).pos_y != JSON.parse(layer).pos_y){
                    const neuron_amt_in_layer = parseInt(JSON.parse(layer).amt_in_layer);
                    amt_neurons = neuron_amt_in_layer + amt_neurons;  
                }
            }
            window.sessionStorage.setItem("amt_neurons", amt_neurons.toString())
            const deposit_calc = 45 + (25 * amt_neurons);
            account.createAccount(`perceptron.${accountId}`, keyPair.getPublicKey(), utils.format.parseNearAmount(deposit_calc.toString()))
        })
    }

    const addInput = async(event) => {
        event.preventDefault();
        const removeButton = document.getElementById("removal_button")
        const addButton = document.getElementById("add_button")
        if (removeButton.disabled){
            removeButton.disabled = false;
        }
        counter += 1;
        ids.push(`input${counter}`)
        const form_element = document.getElementById("form_ext");
        form_element.innerHTML = form_element.innerHTML + `<p></p><span id=layer${counter}>Layer ${counter} Information: <input id=input${counter} type="text" placeholder="Amt of Neurons"></input><select id="act_func_${counter}"><option>Act Func</option><option>tanh</option><option>logistic</option><option>step</option><option>linear</option></select></span>`;
        if (counter == 3){
            addButton.disabled = true;
        }

    }

    const removeInput = async(event) => {
        event.preventDefault();
        ids.pop();
        console.log(ids)
        const removeButton = document.getElementById("removal_button")
        const addButton = document.getElementById("add_button")
        const form_element = document.getElementById(`layer${counter}`);
        console.log(form_element)
        if (counter != 1){
            form_element.outerHTML = "";
            if (counter == 3){
                addButton.disabled = false;
            }
            counter -= 1
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
                        Amount of inputs: <input type="text" id="inputAmount"></input>
                        <p></p>
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
                        <button onClick={addInput} id = "add_button">Add Layer</button><button onClick={removeInput} id="removal_button">Remove Layer</button>
                        <p></p>
                        <button onSubmit={handleTransaction}>Submit</button>
                    </form>
                </main>
            </div>
    )
}