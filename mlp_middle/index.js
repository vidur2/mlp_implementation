import got from "got"
import express from "express";
import bodyParser from "body-parser"
import { connect, keyStores, KeyPair, Contract } from 'near-api-js';
const app = express();
const port = 8080

app.use(bodyParser.urlencoded({
   extended: true,
}))

function sleep(time){
   const stop = new Date().getTime();
   while (stop < stop + time){
	;
   }
}

let data_store = new Array

async function call_contract(csv_string, master_account_id, perceptron_key_pair, input_layer_length){
   const keyStore = new keyStores.InMemoryKeyStore();
   const keyPair = KeyPair.fromString(perceptron_key_pair)
   await keyStore.setKey("testnet", `perceptron.${master_account_id}`, keyPair)
   const config = {
       networkId: "testnet",
       keyStore,
       nodeUrl: "https://rpc.testnet.near.org",
       walletUrl: "https://wallet.testnet.near.org",
       helperUrl: "https://helper.testnet.near.org",
       explorerUrl: "https://explorer.testnet.near.org",
   }
   const near = await connect(config)
   const account = await near.account(`perceptron.${master_account_id}`)
   const contracts = new Array;

   for (let i = 0; i < input_layer_length; i++) {
      const contract = new Contract(
         account,
         `mlp${i + 1}.perceptron.${master_account_id}`,
         {
             changeMethods: [
             "predict",
             "predict_raw"
             ],
             sender: account,
         }
      )
      contracts.push(contract);
   }
   let args;
   let splitter;
   for (let i = 0; i < csv_string.length; i++){
      splitter = csv_string[i].split(",");
	   console.log(splitter);
      const expected_output = splitter[j - 1];
      const inputs = splitter.splice(j - 1, 0);
      for (let j = 0; j < inputs.length; j++){
         inputs[j] = parseFloat(inputs[j])
      }
      args = {
         inputs: inputs,
         expected_output: expected_output
      }
	   try{
         for (let i = 0; i < contracts.length; i++){
            await contracts[i].predict({
               args: args,
               gas: 155000000000000
            })
         }
      } catch{
         sleep(3000);
         i -= 1
      }
      }
}

async function full_call(req){
    got('https://ipfs.io/ipfs/' + req.body.metadata_url).then((value) => {
        const middle_csv_string = value[Object.keys(value)[Object.keys(value).length-1]]
        data_store = middle_csv_string.split('\n');
        const master_account_id = req.body.master_account_id;
        const perceptron_key_pair = req.body.perceptron_key_pair;
        const init_layer_amt = req.body.init_layer_amt;
        data_store.splice(0, 1);
        console.log(data_store)
        call_contract(data_store, master_account_id, perceptron_key_pair, init_layer_amt);
   })
}

app.put("/", function (req, res) {
   console.log(req.body.csv_string);
   data_store.push(req.body.csv_string.split("\n"));
   data_store = Array.prototype.concat.apply([], data_store)
   console.log(data_store.length)
   res.send("Success")
})

app.post("/", (req, res) => {
   data_store = new Array;
   console.log(req.body.metadata_url);
   full_call(req);
   res.send("Success")
})

app.listen(port, () => {
   console.log("MLP Middleware is listening on http://localhost:8080")
})