/*
Testing of a multi-layer perceptron contract
1st nueron in the network
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use std::f64::consts::{E};


// General Constants
const HIGHER_LEVEL_NUERON_ID: &str = "mlp2.perceptron.testnet";
const NO_DEPOSIT: Balance = 0;
const BASE_GAS: u64 = 0;


// Input Neuron Weight Struct
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct InputNueron {
    weight1: f32,
    weight2: f32,
    weight3: f32,
    weight4: f32, 
    weight5: f32,
    bias: f32,
}

// Defining next nueron's scope in terms of this nueron
#[ext_contract(higher_level_nueron)]
pub trait InputNueron2{
    // Only need the next nueron's predict method, not the adjust method
    fn predict(&self, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32, mut outputs: Vec<f32>, input_vector: Vec<Vec<f32>>, expected_ouput: f32);
}

// Nueron functions
#[near_bindgen]
impl InputNueron{
    // Runs on Deploy
    #[init]
    pub fn new() -> Self {
        Self {
            weight1: 8f32,
            weight2: -9f32,
            weight3: -8f32,
            weight4: 10f32,
            weight5: 1f32,
            bias: 0f32,
        }
    }
    // ViewMethod Predict burns no gas
    pub fn predict(&self, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32, expected_ouput: f32){
        let weighted_sum: f32 = self.bias + self.weight1 * input1 + self.weight2 * input2 + self.weight3 * input3 + self.weight4 * input4 + self.weight5 * input5;
        let mut outputs = Vec::new();
        let mut inputs: Vec<Vec<f32>> = Vec::new();
        inputs.push(vec![input1, input2, input3, input4, input5]);
        outputs.push(self.sigmoid(weighted_sum));
        
        // Casts environment variables to nessescary type in order to make a cross-contract call
        let higher_level_nueron_account_id: AccountId = HIGHER_LEVEL_NUERON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS);
        // Cross contract call to send infor to other nueron
        higher_level_nueron::predict(input1, input2, input3, input4, input5, outputs, inputs, expected_ouput, higher_level_nueron_account_id, NO_DEPOSIT, gas_count);
    }

    // adjust fucntion which will be called by a higher level nueron for training
    pub fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32){
        // Checks if contract adjustment happens from within the nueral net
        // Casting of predessescor id to Vector of strings
        let pred_id: String = env::predecessor_account_id().to_string();
        let split_pred_id: Vec<&str> = pred_id.split(".").collect();
        if split_pred_id[split_pred_id.len() - 2] == String::from("perceptron"){
            // Adjustment of nueron weights according to offset and input
            self.weight1 = self.weight1 + offset * input1;
            self.weight2 = self.weight2 + offset * input2;
            self.weight3 = self.weight3 + offset * input3;
            self.weight4 = self.weight4 + offset * input4;
            self.weight5 = self.weight5 + offset * input5;
            self.bias = self.bias + offset;
        }
    }

    // Activation function
    fn sigmoid(&self, input_sum: f32) -> f32{
        1f32/(1f32 + E.powf(-input_sum as f64) as f32)
    }
}