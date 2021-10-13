/*
Testing of a multi-layer perceptron contract
Middle neuron 3
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use std::f64::consts::{E};

// Contract Account of the higher level neuron
const HIGHER_LEVEL_NEURON_ID: &str = "mlp6.perceptron.testnet";

// Contract account of lower leve neuron
const LOWER_LEVEL_NEURON_ID: &str = "mlp4.perceptron.testnet";

// General Constants
const NO_DEPOSIT: Balance = 0;
const BASE_GAS: u64 = 100000000;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct MiddleNeuron3 {
    weight1: f32,
    weight2: f32,
    bias: f32,
}

#[ext_contract(lower_level_neuron)]
pub trait PerceptronWeights{
    fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input_vector: Vec<Vec<f32>>);
}

#[ext_contract(higher_level_neuron)]
pub trait OutputNeuron{
    fn predict(&mut self, input1: f32, input2: f32, input3: f32, mut input_vector: Vec<Vec<f32>>, expected_output: f32);
}

#[near_bindgen]
impl MiddleNeuron3{
    #[init]
    pub fn new() -> Self{
        Self{
            weight1: 4f32,
            weight2: 5f32,
            bias: 0f32,
        }
    }
    pub fn predict(&self, input1: f32, input2: f32, mut outputs: Vec<f32>, mut input_vector: Vec<Vec<f32>>, expected_ouput: f32){
        let weighted_sum = self.bias + input1 * self.weight1 + input2 * self.weight2;
        outputs.push(self.sigmoid(weighted_sum));
        input_vector.push(outputs);
        // Casts environment constants to required type before passing them as the default parameters in a cross-contract call
        let higher_level_neuron_account_id: AccountId = HIGHER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS);
        higher_level_neuron::predict(input_vector[2][0], input_vector[2][1], input_vector[2][2], input_vector, expected_ouput, higher_level_neuron_account_id, NO_DEPOSIT, gas_count);
    }
    pub fn adjust(&mut self, offset: f32, mut input_vector: Vec<Vec<f32>>){
        let input1 = input_vector[1][0];
        let input2 = input_vector[1][1];
        self.weight1 = self.weight1 + offset * input1;
        self.weight2 = self.weight2 + offset * input2;
        self.bias = self.bias + offset;
        let lower_level_neuron_account_id: AccountId = LOWER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS);
        lower_level_neuron::adjust(offset, input1, input2, input_vector, lower_level_neuron_account_id, NO_DEPOSIT, gas_count);
    }
    fn sigmoid(&self, input_sum: f32) -> f32{
        1f32/(1f32 + E.powf(-input_sum as f64) as f32)
    }
}