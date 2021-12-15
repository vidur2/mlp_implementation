import { connect, keyStores, WalletConnection } from "near-api-js"

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
                contractId: "perceptron.testnet"
            })
        })
    }
    return(
        <h1>Loading</h1>
    )
}