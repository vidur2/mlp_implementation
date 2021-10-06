/*
Testing of a multi-layer perceptron contract
2nd neuron in the network
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use std::f64::consts::{E};

// Constants region for calling new Contracts
// Higher Level neuron Contract id
const HIGHER_LEVEL_NEURON_ID: &str = "mlp3.perceptron.testnet";

// Lower Level neuron Id
const LOWER_LEVEL_NEURON_ID: &str = "mlp1.perceptron.testnet";

// General Constants
const NO_DEPOSIT: Balance = 0;
const BASE_GAS: u64 = 0;



#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct InputNeuron2{
    weight1: f32,
    weight2: f32,
    weight3: f32,
    weight4: f32, 
    weight5: f32,
    bias: f32,
}

#[ext_contract(higher_level_neuron)]
pub trait MiddleNeuron{
    fn predict(&self, input1: f32, input2: f32, mut input_vector: Vec<Vec<f32>>, expected_ouput: f32);
}

#[ext_contract(lower_level_neuron)]
pub trait InputNeuron{
    fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32);
}

#[near_bindgen]
impl InputNeuron2{
    #[init]
    pub fn new() -> Self{
        Self {
            weight1: 6f32,
            weight2: 4f32,
            weight3: 7f32,
            weight4: 5f32,
            weight5: 10f32,
            bias: 0f32
        }
    }
    pub fn predict(&self, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32, mut outputs: Vec<f32>, mut input_vector: Vec<Vec<f32>>, expected_ouput: f32){
        let weighted_sum: f32 = self.bias + input1 * self.weight1 + input2 * self.weight2 + input3 * self.weight3 + input4 * self.weight4 + input5 * self.weight5;
        outputs.push(self.sigmoid(weighted_sum));
        input_vector.push(outputs);
        let higher_level_neuron_account_id: AccountId = HIGHER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS);
        higher_level_neuron::predict(input_vector[1][0], input_vector[1][1], input_vector, expected_ouput, higher_level_neuron_account_id, NO_DEPOSIT, gas_count);
    }
    pub fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32){
        let pred_id: String = env::predecessor_account_id().to_string();
        let split_pred_id: Vec<&str> = pred_id.split(".").collect();
        if split_pred_id[split_pred_id.len() - 2] == String::from("perceptron"){
            // Adjustment of neuron weights according to offset and input
            self.weight1 = self.weight1 + offset * input1;
            self.weight2 = self.weight2 + offset * input2;
            self.weight3 = self.weight3 + offset * input3;
            self.weight4 = self.weight4 + offset * input4;
            self.weight5 = self.weight5 + offset * input5;
            self.bias = self.bias + offset;
            let lower_level_neuron_account_id: AccountId = LOWER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
            let gas_count = Gas::from(BASE_GAS);
            lower_level_neuron::adjust(offset, input1, input2, input3, input4, input5, lower_level_neuron_account_id, NO_DEPOSIT, gas_count);
        }
    }
    fn sigmoid(&self, input_sum: f32) -> f32{
        1f32/(1f32 + E.powf(-input_sum as f64) as f32)
    }
}