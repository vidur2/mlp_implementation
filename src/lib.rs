/*
Testing of a multi-layer perceptron contract
*/

use near_sdk::{near_bindgen, env};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use std::f64::consts::E;

#[near_bindgen]
#[derive(BorshDeserialize , BorshSerialize)]
pub struct PerceptronWeights {
    weight1: i32,
    weight2: i32,
    weight3: i32,
    weight4: i32,
    weight5: i32,
}

#[near_bindgen]
impl PerceptronWeights{
    #[init]
    pub fn new() -> Self {
        Self {
            weight1: -4,
            weight2: 2,
            weight3: -7,
            weight4: 9,
            weight5: -10,
        }
    }
    pub fn predict(&self, input1: &i32, input2: &i32, input3: &i32, input4: &i32, input5: &i32) -> f64{
        let weighted_sum: i32 = input1 * &self.weight1 + input2 * &self.weight2 + input3 * &self.weight3 + input4 * &self.weight4 + input5 * &self.weight5;
        self.sigmoid(weighted_sum)
    }
    fn sigmoid(&self, input_sum: i32) -> f64{
        1f64/(E.powf(input_sum as f64))
    }
}