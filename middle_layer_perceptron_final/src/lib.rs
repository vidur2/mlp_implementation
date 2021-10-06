/*
Testing of a multi-layer perceptron contract
Middle neuron 3s
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use std::f64::consts::{E};

pub struct MiddleNeuron3 {
    weight1: f32,
    wieght2: f32,
    bias: f32,
}

#[ext_contract(lower_level_neuron)]
pub trait PerceptronWeights{
    fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input_vector: Vec<Vec<f32>>);
}

#[near_bindgen]
impl MiddleNeuron3{
    #[init]
    pub fn new() -> Self{}
    pub fn predict(&self, input1: f32, input2: f32, mut outputs: Vec<f32>, mut input_vector: Vec<Vec<f32>>, expected_ouput: f32){
        let weighted_sum = self.bias + input1 * self.weight1 + input2 * self.weight2;
        outputs.push(self.sigmoid(weighted_sum));
        input_vector.push(outputs);

        
    }
    pub fn adjust(){}
    fn sigmoid(&self, input_sum: f32) -> f32{
        1f32/(1f32 + E.powf(-input_sum as f64) as f32)
    }
}