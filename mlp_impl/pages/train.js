import styles from "../styles/Home.module.css"
import Head from "next/head"
import { WalletConnection, connect, keyStores } from "near-api-js"
import { useRouter } from "next/router"
import nearSeedPhrase from "near-seed-phrase";

async function getMetadataStore(file){
    const res = await fetch('https://api.nft.storage/upload',{
          body: file,
          headers: {
            "Authorization": "Bearer " + process.env.nft_store_api_key
          },
          method: 'POST',
        })
    return res.json()
}

async function check_initialized(account_id, wallet_account){
    const perceptron_account_id = `mlp1.perceptron.${account_id}`;
    const account = wallet_account.account();
    try {
        console.log("shit")
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

export default function Train(){
    const router = useRouter();
    if (typeof window !== "undefined") {
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
            const account = wallet.account()
            const trainPage = document.getElementById("trainPage");
            check_initialized(account.accountId, wallet).then((is_initialized) => {
                if (!wallet.isSignedIn && !is_initialized){
                    trainPage.innerHTML = "Redirecting..."
                    wallet.requestSignIn({
                        contractId: "perceptron.testnet",
                        successUrl: `https://${window.location.host}/profile`,
                        failuireUrl: `https://${window.location.host}`
                    })
                } 
                else if (!is_initialized) {
                    trainPage.innerHTML = "Redirecting..."
                    router.push("/profile") 
                }
            })
    
        })
    }
    const parse_csv = async(event) => {
        const config = {
            networkId: "testnet",
            keyStore: new keyStores.BrowserLocalStorageKeyStore(),
            nodeUrl: "https://rpc.testnet.near.org",
            walletUrl: "https://wallet.testnet.near.org",
            helperUrl: "https://helper.testnet.near.org",
            explorerUrl: "https://explorer.testnet.near.org",
        };
        const near = await connect(config)
        const wallet = new WalletConnection(near)
        const account = wallet.account();
        if (window.localStorage.getItem("private_key") == null){
            const resp = await fetch(`https://${window.location.host}/api/get_account_pk`, {
                method: "POST",
                body: JSON.stringify({
                    account_id: account.accountId
                })
            })
            const json = resp.json();
            window.localStorage.setItem("private_key", json.private_key)
        }
        event.preventDefault();
        const file = event.target.file_input.files[0];
        const formBody = new URLSearchParams;
        getMetadataStore(file).then((value) => {
            console.log('https://ipfs.io/ipfs/' + value.value.cid)
            formBody.append("metadata_url", value.value.cid)
            formBody.append("master_account_id", account.accountId);
            formBody.append("init_layer_amt", parseInt(window.sessionStorage.getItem("num_neurons")))
            formBody.append("perceptron_key_pair", window.localStorage.getItem("private_key"))
            fetch ("https://mlp-api.app.vtxhub.com/", {
                method: "POST",
                body: formBody
            })
            const body = document.getElementById("body");
            body.innerHTML = `<a href=https://explorer.testnet.near.org/accounts/perceptron.${account.accountId}>Click Here to view the progress of your training</a>`
        })
    }

    const scoreModel = async(event) =>{
        const config = {
            networkId: "testnet",
            keyStore: new keyStores.BrowserLocalStorageKeyStore(),
            nodeUrl: "https://rpc.testnet.near.org",
            walletUrl: "https://wallet.testnet.near.org",
            helperUrl: "https://helper.testnet.near.org",
            explorerUrl: "https://explorer.testnet.near.org",
        };
        connect(config).then((near) => {
            const wallet = new WalletConnection(near)
            const account = wallet.account();
            event.preventDefault();
            const file = event.target.score_csv.files[0];
            const formBody = new URLSearchParams;
            const pk = nearSeedPhrase.parseSeedPhrase("job topic jump eight unaware cabbage average vague artefact again history success")
            const final_pk = pk.secretKey.split(":");
            console.log(final_pk[1])
            getMetadataStore(file).then((value) => {
                console.log('https://ipfs.io/ipfs/' + value.value.cid)
                formBody.append("metadata_url", value.value.cid)
                formBody.append("contract_id", account.accountId);
                formBody.append("init_layer_amt", parseInt(window.sessionStorage.getItem("num_neurons")))
                formBody.append("private_key", final_pk)
                fetch ("https://mlp-api.app.vtxhub.com/score", {
                    method: "POST",
                    body: formBody
                })
                const body = document.getElementById("body");
                body.innerHTML = `<a href=https://explorer.testnet.near.org/accounts/mlp1.perceptron.${account.accountId}>Click Here to view the progress of your testing</a>`
            })
        })
    }

    return(
        <div className={styles.container} id = "trainPage">
            <Head>
                <title>Training Page</title>
                <link rel="icon" href="/logo.svg" />
            </Head>
            <main className = {styles.main} id = "body">
                <form onSubmit={parse_csv}>
                    <input type="file" name="file_input"></input>
                    <button type="submit">Submit Train CSV</button>
                </form>
                <form onSubmit={scoreModel}>
                    <input type="file" name="score_csv"></input>
                    <button type="submit">Submit Test CSV</button>
                </form>
            </main>
        </div>
    )
}