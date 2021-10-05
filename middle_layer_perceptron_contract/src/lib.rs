/*
Testing of a multi-layer perceptron contract
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use std::f64::consts::{E};

// Constants region for calling new Contracts
// Higher Level Nueron Contract id
const HIGHER_LEVEL_NUERON_ID: &str = "mlp5.perceptron.testnet";

// Lower Level Nueron Id
const LOWER_LEVEL_NUERON_ID: &str = "mlp3.perceptron.testnet";

// General Constants
const NO_DEPOSIT: Balance = 0;
const BASE_GAS: u64 = 0;

// Defining the next nueron's scope and methods in terms of this nueron
#[ext_contract(higher_level_nueron)]
pub trait HigherLevelNueron{
    // The only method we need from the next nueron is the predict method
    fn predict(&self, input1: f32, input2: f32, mut outputs: Vec<f32>, mut input_vector: Vec<Vec<f32>>, expected_ouput: f32);
}

// Defining the previous nueron's scope and methods in terms of this nueron
#[ext_contract(lower_level_nueron)]
pub trait LowerLevelNueron{
    // The only method we need from the previous nueron is the adjust method to change 
    fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input_vector: Vec<Vec<f32>>);
}

// Weights of the perceptron stored on the blockchain in default Struct
#[near_bindgen]
#[derive(BorshDeserialize , BorshSerialize, Default)]
pub struct PerceptronWeights {
    weight1: f32,
    weight2: f32,
    bias: f32,
}

// Associated functions with the weights
#[near_bindgen]
impl PerceptronWeights{
    // Init Function
    #[init]
    pub fn new() -> Self {
        // Initializes struct with rng values
        Self {
            weight1: -4f32,
            weight2: 2f32,
            bias: 0f32,
        }
    }

    // ViewMethod predict, takes in the inputs as the previous layer's outputs, and collects outputs in a vector
    pub fn predict(&self, input1: f32, input2: f32, mut outputs: Vec<f32>, input_vector: Vec<Vec<f32>>, expected_ouput: f32){
        // Calculates weighted sum with matrix multiplication of the input vector and the weight vector
        let weighted_sum: f32 = input1 * self.weight1 + input2 * self.weight2;

        // Adds weighted_sum to the output vector
        outputs.push(self.sigmoid(weighted_sum));

        // Casts environment constants to required type before passing them as the default parameters in a cross-contract call
        let higher_level_nueron_account_id: AccountId = HIGHER_LEVEL_NUERON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS);

        // Cross-Contract call
        higher_level_nueron::predict(input1, input2, outputs, input_vector, expected_ouput, higher_level_nueron_account_id, NO_DEPOSIT, gas_count);
    }

    // ChangeMethod adjust for training the nueral net
    pub fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input_vector: Vec<Vec<f32>>){
        // Parses the id of the caller of the contract
        let pred_id: String = env::predecessor_account_id().to_string();
        let split_pred_id: Vec<&str> = pred_id.split(".").collect();

        // If the id is the account I own, then run the code
        if split_pred_id[split_pred_id.len()-2] == String::from("perceptron"){
            // Changes the weights
            self.weight1 = self.weight1 + offset * input1;
            self.weight2 = self.weight2 + offset * input2;
            self.bias = self.bias + offset;

            // Same deal as with the predict method, just with the nueron before it in the nueral net
            let lower_level_nueron_id: AccountId = LOWER_LEVEL_NUERON_ID.trim().parse().expect("Invalid user id");
            let gas_count = Gas::from(BASE_GAS);
            lower_level_nueron::adjust(offset, input1, input2, input_vector, lower_level_nueron_id, NO_DEPOSIT, gas_count);
        }
    }

    // Ouput function
    fn sigmoid(&self, input_sum: f32) -> f32{
        1f32/(E.powf(input_sum as f64) as f32)
    }
}
