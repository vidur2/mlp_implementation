/*
Testing of a multi-layer perceptron contract
Output Neuron
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use std::f64::consts::{E};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct OutputNeuron{
    weight1: f32,
    weight2: f32,
    weight3: f32,
    bias: f32,
}

impl OutputNeuron {
    #[init]
    pub fn new() -> Self {
        Self {
            weight1: -4,
            weight2: -10,
            weight3: 8,
            bias: 0,
        }
    }
    pub fn predict(&self, input1: f32, input2: f32, input3: f32, mut input_vector: Vec<Vec<f32>>, expected_output: f32){
        
    }
}