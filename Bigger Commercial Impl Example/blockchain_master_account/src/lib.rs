use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, env, AccountId, Promise, Balance};
use std::collections::HashMap;

const CODE &[u8] = include_bytes!("https://github.com/vidur2/mlp_implementation/blob/main/Bigger%20Commercial%20Impl%20Example/general_blockchain_neuron/general_blockchain_neuron.wasm?raw=true");

#[derive(BorshDeserialize, BorshSerialize, Default)]
#[near_bindgen]
pub struct NeuronGenerator{
    account_ids: HashMap<String, u64>
}

#[near_bindgen]
impl NeuronGenerator{
    #[payable]
    pub fn generate_mlp(&mut self, amt_neurons: u64, user_id: String){
        let required_deposit: Balance = (amt_neurons as u128) * 250_000_000_000_000_000_000_000_000u128;
        if env::attached_deposit() == required_deposit{
            self.account_ids.insert(user_id.clone(), amt_neurons);
            for account_num in 1..amt_neurons{
                let account_id: AccountId = format!("mlp{}.{}.testnet", account_num, user_id)
                    .parse()
                    .expect("Invalid account id");
                    
                Promise::new(account_id)
                    .create_account()
                    .add_full_access_key(env::signer_account_pk())
                    .transfer(250_000_000_000_000_000_000_000_000u128)
                    .code(CODE);
            }
        }
    }
}