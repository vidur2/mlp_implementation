/*
Testing of a multi-layer perceptron contract
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use std::f64::consts::{E};


// General Constants
const HIGHER_LEVEL_NUERON_ID: &str = "mlp2.perceptron.testnet";
const NO_DEPOSIT: Balance = 0;
const BASE_GAS: u64 = 0;

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

#[ext_contract(higher_level_nueron)]
pub trait HigherLevelNueron{
    fn predict(&self, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32, outputs: Vec<f32>, input_vector: Vec<Vec<f32>>, expected_ouput: f32);
}

#[near_bindgen]
impl InputNueron{
    pub fn predict(&self, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32, expected_ouput: f32){
        let weighted_sum: f32 = self.weight1 * input1 + self.weight2 * input2 + self.weight3 * input3 + self.weight4 * input4 + self.weight5 * input5;
        let mut outputs = Vec::new();
        let mut inputs: Vec<Vec<f32>> = Vec::new();
        inputs.push(vec![input1, input2, input3, input4, input5]);
        outputs.push(self.sigmoid(weighted_sum));
        let higher_level_nueron_account_id: AccountId = HIGHER_LEVEL_NUERON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS);
        higher_level_nueron::predict(input1, input2, input3, input4, input5, outputs, inputs, expected_ouput, higher_level_nueron_account_id, NO_DEPOSIT, gas_count);
    }
    pub fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32){
        self.weight1 = self.weight1 + offset * input1;
        self.weight2 = self.weight2 + offset * input2;
        self.weight3 = self.weight3 + offset * input3;
        self.weight4 = self.weight4 + offset * input4;
        self.weight5 = self.weight5 + offset * input5;
        self.bias = self.bias + offset;
    }
    fn sigmoid(&self, input_sum: f32) -> f32{
        1f32/(E.powf(input_sum as f64) as f32)
    }
}