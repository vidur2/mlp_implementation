import styles from "../styles/Home.module.css"
import Head from "next/head"
import { WalletConnection, connect, keyStores } from "near-api-js"
import { useRouter } from "next/router"

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
    const parse_csv = async(event) =>{
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
            })
        })
    }

    return(
        <div className={styles.container} id = "trainPage">
            <Head>
                <title>Training Page</title>
                <link rel="icon" href="/logo.svg" />
            </Head>
            <main className = {styles.main}>
                <form onSubmit={parse_csv}>
                    <input type="file" name="file_input"></input>
                    <button type="submit">Submit</button>
                </form>
            </main>
        </div>
    )
}