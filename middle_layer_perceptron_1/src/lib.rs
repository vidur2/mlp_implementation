/*
Testing of a multi-layer perceptron contract
3rd Nueron in the network
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use std::f64::consts::{E};

// Constants region for calling new Contracts
// Higher Level Nueron Contract id
const HIGHER_LEVEL_NUERON_ID: &str = "mlp2.perceptron.testnet";

// Lower Level Nueron Id
const LOWER_LEVEL_NUERON_ID: &str = "mlp4.perceptron.testnet";

// General Constants
const NO_DEPOSIT: Balance = 0;
const BASE_GAS: u64 = 0;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct MiddleNeuron{
    weight1: f32,
    weight2: f32,
    bias: f32,
}

#[ext_contract(higher_level_nueron)]
pub trait PerceptronWeights{
    fn predict(&self, input1: f32, input2: f32, mut outputs: Vec<f32>, mut input_vector: Vec<Vec<f32>>, expected_ouput: f32);
}


#[near_bindgen]
impl MiddleNeuron{
    #[init]
    pub fn new() -> Self {
        Self{
            weight1: -6f32,
            weight2: -10f32,
            bias: 0f32
        }
    }
    pub fn predict(&self, input1: f32, input2: f32, mut input_vector: Vec<Vec<f32>>, expected_ouput: f32){
        let weighted_sum = self.weight1 * input1 + self.weight2 + input2;
        let mut outputs = Vec::new();
        outputs.push(self.sigmoid(weighted_sum));
        let higher_level_nueron_account_id: AccountId = HIGHER_LEVEL_NUERON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS);
        higher_level_nueron::predict(input1, input2, outputs, input_vector, expected_ouput,higher_level_nueron_account_id, NO_DEPOSIT, gas_count);
    }
    fn sigmoid(&self, input_sum: f32) -> f32{
        1f32/(E.powf(input_sum as f64) as f32)
    }
}