use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, env, AccountId, Promise, Balance};
use std::collections::HashMap;

const CODE: &[u8] = include_bytes!("../../general_blockchain_neuron.wasm");

#[derive(BorshDeserialize, BorshSerialize, Default)]
#[near_bindgen]
pub struct NeuronGenerator{
    account_ids: HashMap<String, u64>
}

#[near_bindgen]
impl NeuronGenerator{
    #[payable]
    pub fn generate_mlp(&mut self, amt_neurons: u64){
        let required_deposit: Balance = (amt_neurons as u128) * 250_000_000_000_000_000_000_000_000u128;
        if env::attached_deposit() == required_deposit {
            let account: String = env::signer_account_id().to_string();
            self.account_ids.insert(account.clone(), amt_neurons);
            for account_num in 1..amt_neurons{
                let account_id: AccountId = format!("mlp{}.perceptron.{}.testnet", account_num, account)
                    .parse()
                    .expect("Invalid account id");
                    
                Promise::new(account_id)
                    .create_account()
                    .add_full_access_key(env::signer_account_pk())
                    .transfer(250_000_000_000_000_000_000_000_000u128)
                    .deploy_contract(CODE.to_vec());
            }
        }
    }
}