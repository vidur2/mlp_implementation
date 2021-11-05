/*
Testing of a multi-layer perceptron contract
Output Neuron
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};


// Contract account of lower leve neuron
const LOWER_LEVEL_NEURON_ID: &str = "mlp5.perceptron.testnet";

// General Constants
const NO_DEPOSIT: Balance = 0;
const BASE_GAS: u64 = 5_000_000_000_000;


#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct OutputNeuron{
    weight1: f32,
    weight2: f32,
    weight3: f32,
    bias: f32,
}

#[ext_contract(lower_level_neuron)]
pub trait MiddleNeuron3{
    fn adjust(&mut self, offset: f32, mut input_vector: Vec<Vec<f32>>);
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
        let returned_values = self.train(offset, input_vector);
        if offset != 0f32{
            let lower_level_neuron_account_id: AccountId = LOWER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
            let gas_count = Gas::from(BASE_GAS * 16u64 - BASE_GAS * 5*5/4);
            lower_level_neuron::adjust(returned_values.1, returned_values.0, lower_level_neuron_account_id, NO_DEPOSIT, gas_count);
        }
    }
    fn train(&mut self, offset: f32, input_vector: Vec<Vec<f32>>) -> (Vec<Vec<f32>>, f32){
        self.weight1 = self.weight1 + input_vector[2][0] * offset;
        self.weight2 = self.weight2 + input_vector[2][1] * offset;
        self.weight3 = self.weight3 + input_vector[2][2] * offset;
        (input_vector, offset)
    }

    pub fn predict_raw(&self, input1: f32, input2: f32, input3: f32) -> f32{
        let weighted_sum = self.weight1 * input1 + self.weight2 * input2 + self.weight3 * input3;
        self.step_function(weighted_sum)
    }

    fn step_function(&self, input_sum: f32) -> f32{
        if input_sum >= 0f32 {return 1f32}
        else{return 0f32}
    }
}