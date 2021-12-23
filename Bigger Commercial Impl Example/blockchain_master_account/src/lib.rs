use near_sdk::borsh::{ self, BorshDeserialize, BorshSerialize };
use near_sdk::{ near_bindgen, env, AccountId, Promise, CryptoHash, ext_contract, Gas, Balance };
use near_sdk::collections::LookupMap;

const CODE: &[u8] = include_bytes!("../../general_blockchain_neuron.wasm");
const BASE_GAS: u64 = 5_000_000_000_000u64;
const NO_DEPOSIT: Balance = 0;

#[derive(BorshDeserialize, BorshSerialize)]
#[near_bindgen]
pub struct NeuronGenerator{
    account_ids: LookupMap<String, u64>
}

fn hash_acct_id(account_id: &AccountId) -> CryptoHash{
    let mut hash = CryptoHash::default();
    hash.copy_from_slice(&env::sha256(account_id.as_bytes()));
    hash
}

impl Default for NeuronGenerator {
    fn default() -> Self{
        Self {
            account_ids: LookupMap::new(hash_acct_id(&env::predecessor_account_id()).try_to_vec().unwrap())
        }
    }
}

#[ext_contract(sub_neuron)]
pub trait Neuron {
    fn new(num_weights: u32, function_type: String, layer_structure: Vec<u64>, pos_x: usize, pos_y: usize, master_account: String);
}

#[near_bindgen]
impl NeuronGenerator {
    pub fn generate_mlp(&mut self, amt_neurons: u64){
        let account: String = env::current_account_id().to_string();
        self.account_ids.insert(&account.clone(), &amt_neurons);
        for account_num in 1..amt_neurons + 1{
            let account_id: AccountId = format!("mlp{}.{}", account_num, account)
                .parse()
                .expect("Invalid account id");
                
            Promise::new(account_id)
                .create_account()
                .add_full_access_key(env::signer_account_pk())
                .transfer(25_000_000_000_000_000_000_000_000u128)
                .deploy_contract(CODE.to_vec());
        }
    }
    pub fn initialize_mlp(&mut self, input_amt: u32, layer_amt: Vec<u64>, activation_function: Vec<String>){
        let mut layer_start = 1usize;
        let mut num_weights;
        let mut counter = 0;
        let account: String = env::current_account_id().to_string();
        let master_account = account.replace("perceptron.", "");
        for layer in activation_function.iter(){
            let layer_num = layer_amt[counter as usize];
            for i in layer_start..layer_start + layer_num as usize{
                let account_id: AccountId = format!("mlp{}.{}", i, account).trim().parse().expect("Not an account id");
                if counter == 0 {
                    num_weights = input_amt
                } else {
                    num_weights = layer_amt[counter - 1] as u32
                }
                sub_neuron::new(num_weights, layer.to_string(), layer_amt.clone(), (i + 1) - layer_start, counter + 1, master_account.clone(), account_id, NO_DEPOSIT, Gas::from(BASE_GAS));
            }
            layer_start += layer_num as usize;
            counter += 1;
        }
    }
}