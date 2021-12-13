use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, ext_contract, Gas, Balance, AccountId, Promise};
use std::f64::consts::{E};

#[derive(BorshDeserialize, BorshSerialize, Default)]
#[near_bindgen]
pub struct NeuronGenerator{
    account_ids: HashMap<String, ,
}

#[near_bindgen]
impl NeuronGenerator{
    pub fn generate_mlp(&mut self, account_ids: Vec<String>){
        for account in account_ids.iter(){
            let account_id: AccountId = format!("{}.perceptron.testnet", account).parse().expect("Invalid account id")
            Promise::new(account_id)
                .create_account()
                .add_full_access_key(env::signer_account_pk())
                .transfer(250_000_000_000_000_000_000_000_000);
            
        }
    }
}