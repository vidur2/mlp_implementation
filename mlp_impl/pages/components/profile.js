import styles from "../../styles/Home.module.css"
import { WalletConnection, keyStores, connect, KeyPair, utils, transactions } from "near-api-js";

export default function ProfileLoader(){
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
        if (wallet.isSignedIn()) {
            return(
                <div>
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
                            <button onClick={addInput}>Add Layer</button><button onClick={removeInput} id="removal_button">Remove Layer</button>
                            <p></p>
                            <button onSubmit={handleTransaction}>Submit</button>
                        </form>
                    </main>
                </div>
            )
    }  
    })
}