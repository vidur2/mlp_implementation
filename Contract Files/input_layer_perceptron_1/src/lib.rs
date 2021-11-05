/*
Testing of a multi-layer perceptron contract
1st neuron in the network
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId, Promise};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

// General Constants
const HIGHER_LEVEL_NEURON_ID: &str = "mlp2.perceptron.testnet";
const NO_DEPOSIT: Balance = 0;
const BASE_GAS: u64 = 5_000_000_000_000;


// Input Neuron Weight Struct
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct InputNeuron {
    weight1: f32,
    weight2: f32,
    weight3: f32,
    weight4: f32, 
    weight5: f32,
    bias: f32,
}

// Defining next neuron's scope in terms of this neuron
#[ext_contract(higher_level_neuron)]
pub trait InputNeuron2{
    // Only need the next neuron's predict methods, not the adjust method
    fn predict(&self, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32, mut outputs: Vec<f32>, input_vector: Vec<Vec<f32>>, expected_ouput: f32);
    fn predict_raw(&self, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32, mut outputs: Vec<f32>);
}

// neuron functions
#[near_bindgen]
impl InputNeuron{
    // Runs on Deploy
    #[init]
    pub fn new() -> Self {
        Self {
            weight1: 8f32,
            weight2: -9f32,
            weight3: -8f32,
            weight4: 10f32,
            weight5: 1f32,
            bias: 0f32,
        }
    }
    // ViewMethod Predict burns no gas
    pub fn predict(&self, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32, expected_ouput: f32){
        let weighted_sum: f32 = self.bias + self.weight1 * input1 + self.weight2 * input2 + self.weight3 * input3 + self.weight4 * input4 + self.weight5 * input5;
        let mut outputs = Vec::new();
        let mut inputs: Vec<Vec<f32>> = Vec::new();
        inputs.push(vec![input1, input2, input3, input4, input5]);
        outputs.push(self.tanh(weighted_sum));
        
        // Casts environment variables to nessescary type in order to make a cross-contract call
        let higher_level_neuron_account_id: AccountId = HIGHER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS * 21u64);
        // Cross contract call to send infor to other neuron
        higher_level_neuron::predict(input1, input2, input3, input4, input5, outputs, inputs, expected_ouput, higher_level_neuron_account_id, NO_DEPOSIT, gas_count);
    }

    // ViewMethod Predict burns no gas
    pub fn predict_raw(&self, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32) -> near_sdk::Promise{
        let weighted_sum: f32 = self.bias + self.weight1 * input1 + self.weight2 * input2 + self.weight3 * input3 + self.weight4 * input4 + self.weight5 * input5;
        let mut outputs = Vec::new();
        outputs.push(self.tanh(weighted_sum));
        
        // Casts environment variables to nessescary type in order to make a cross-contract call
        let higher_level_neuron_account_id: AccountId = HIGHER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = 0;
        // Cross contract call to send infor to other neuron
        higher_level_neuron::predict_raw(input1, input2, input3, input4, input5, outputs, higher_level_neuron_account_id, NO_DEPOSIT, gas_count)
    }


    // adjust function which will be called by a higher level neuron for training
    pub fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32) -> f32{
        // Adjustment of neuron weights according to offset and input
        self.weight1 = self.weight1 + offset * input1;
        self.weight2 = self.weight2 + offset * input2;
        self.weight3 = self.weight3 + offset * input3;
        self.weight4 = self.weight4 + offset * input4;
        self.weight5 = self.weight5 + offset * input5;
        self.bias = self.bias + offset;
        // Returns a value to show the train data that is was successful
        offset
    }

    // Activation function
    fn tanh(&self, input_sum: f32) -> f32{
        input_sum.tanh()
    }
}