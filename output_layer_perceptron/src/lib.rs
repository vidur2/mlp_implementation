/*
Testing of a multi-layer perceptron contract
Output Neuron
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct OutputNeuron{
    weight1: f32,
    weight2: f32,
    weight3: f32,
    bias: f32,
}

#[near_bindgen]
impl OutputNeuron {
    #[init]
    pub fn new() -> Self {
        Self {
            weight1: -4f32,
            weight2: -10f32,
            weight3: 8f32,
            bias: 0f32,
        }
    }
    pub fn predict(&mut self, input1: f32, input2: f32, input3: f32, input_vector: Vec<Vec<f32>>, expected_output: f32){
        let weighted_sum: f32 = input1 * self.weight1 + input2 * self.weight2 + input3 * self.weight3 + self.bias;
        let offset = expected_output - self.step_function(weighted_sum);
        let input_vector = self.train(offset, input_vector);
    }
    fn train(&mut self, offset: f32, input_vector: Vec<Vec<f32>>) -> Vec<Vec<f32>>{
        self.weight1 = self.weight1 + input_vector[2][0] * offset;
        self.weight2 = self.weight2 + input_vector[2][1] * offset;
        self.weight3 = self.weight3 + input_vector[2][2] * offset;
        input_vector
    }
    fn step_function(&self, input_sum: f32) -> f32{
        if input_sum >= 0f32 {return 1f32}
        else{return 0f32}
    }
}