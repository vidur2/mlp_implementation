import { connect, keyStores, WalletConnection } from "near-api-js"
import styles from "../styles/Home.module.css"
import { Spin } from "antd"

export default function Authentication(){
    if (typeof window !== "undefined"){
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
            wallet.requestSignIn({
                contractId: "perceptron.testnet",
                successUrl: `https://${window.location.host}/profile`,
                failuireUrl: `https://${window.location.host}`
            })
        })
    }
    return(
        <div className = {styles.container}>
            <Spin />
        </div>
    )
}