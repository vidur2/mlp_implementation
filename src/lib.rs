/*
Testing of a multi-layer perceptron contract
*/

use near_sdk::{near_bindgen, env};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use std::f64::consts::E;

#[near_bindgen]
#[derive(BorshDeserialize , BorshSerialize)]
pub struct PerceptronWeights {
    weight1: f32,
    weight2: f32,
    weight3: f32,
    weight4: f32,
    weight5: f32,
    bias: f32,
}

#[near_bindgen]
impl PerceptronWeights{
    #[init]
    pub fn new() -> Self {
        Self {
            weight1: -4f32,
            weight2: 2f32,
            weight3: -7f32,
            weight4: 9f32,
            weight5: -10f32,
            bias: 0f32,
        }
    }
    pub fn predict(&self, input1: &f32, input2: &f32, input3: &f32, input4: &f32, input5: &f32) -> f32{
        let weighted_sum: f32 = input1 * &self.weight1 + input2 * &self.weight2 + input3 * &self.weight3 + input4 * &self.weight4 + input5 * &self.weight5;
        self.sigmoid(weighted_sum) as f32
        // Call next Contract here
    }
    pub fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32){
        self.weight1 = self.weight1 + offset * input1;
        self.weight2 = self.weight2 + offset * input2;
        self.weight3 = self.weight3 + offset * input3;
        self.weight4 = self.weight4 + offset * input4;
        self.weight5 = self.weight5 + offset * input5;
        self.bias = self.bias + offset;
        // Call previous perceptron here
    }
    fn sigmoid(&self, input_sum: f32) -> f64{
        1f64/(E.powf(input_sum as f64))
    }
}
