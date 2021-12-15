/*
Vidur Modgil
Tech Fair
Backend
Middle neuron 2
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use std::f64::consts::{E};

// Constants region for calling new Contracts
// Higher Level neuron Contract id
const HIGHER_LEVEL_NEURON_ID: &str = "mlp5.perceptron.testnet";

// Lower Level neuron Id
const LOWER_LEVEL_NEURON_ID: &str = "mlp3.perceptron.testnet";

// General Constants
const NO_DEPOSIT: Balance = 0;
const BASE_GAS: u64 = 5_000_000_000_000;

// Defining the next neuron's scope and methods in terms of this neuron
#[ext_contract(higher_level_neuron)]
pub trait MiddleNeuron3{
    // The only method we need from the next neuron is the predict method
    fn predict(&self, input1: f32, input2: f32, mut outputs: Vec<f32>, mut input_vector: Vec<Vec<f32>>, expected_output: f32);
    fn predict_raw(&self, input1: f32, input2: f32, mut outputs: Vec<f32>);
}

// Defining the previous neuron's scope and methods in terms of this neuron
#[ext_contract(lower_level_neuron)]
pub trait MiddleNeuron{
    // The only method we need from the previous neuron is the adjust method to change 
    fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input_vector: Vec<Vec<f32>>);
}

// Weights of the perceptron stored on the blockchain in default Struct
#[near_bindgen]
#[derive(BorshDeserialize , BorshSerialize, Default)]
pub struct PerceptronWeights {
    weight1: f32,
    weight2: f32,
    bias: f32,
}

// Associated functions with the weights
#[near_bindgen]
impl PerceptronWeights{
    // Init Function
    #[init]
    pub fn new() -> Self {
        // Initializes struct with rng values
        Self {
            weight1: -4f32,
            weight2: 2f32,
            bias: 1f32,
        }
    }

    // ViewMethod predict, takes in the inputs as the previous layer's outputs, and collects outputs in a vector
    pub fn predict(&self, input1: f32, input2: f32, mut outputs: Vec<f32>, input_vector: Vec<Vec<f32>>, expected_output: f32){
        // Calculates weighted sum with matrix multiplication of the input vector and the weight vector
        let weighted_sum: f32 = self.bias + input1 * self.weight1 + input2 * self.weight2;

        // Adds weighted_sum to the output vector
        outputs.push(self.sigmoid(weighted_sum));

        // Casts environment constants to required type before passing them as the default parameters in a cross-contract call
        let higher_level_neuron_account_id: AccountId = HIGHER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS * 18u64 - BASE_GAS * 5*3/4);

        // Cross-Contract call
        higher_level_neuron::predict(input1, input2, outputs, input_vector, expected_output, higher_level_neuron_account_id, NO_DEPOSIT, gas_count);
    }

    // ChangeMethod adjust for training the nueral net
    pub fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input_vector: Vec<Vec<f32>>){
        // Changes the weights
        self.weight1 = self.weight1 + offset * input1;
        self.weight2 = self.weight2 + offset * input2;
        self.bias = self.bias + offset;

        // Same deal as with the predict method, just with the neuron before it in the nueral net
        let lower_level_neuron_id: AccountId = LOWER_LEVEL_NEURON_ID.trim().parse().expect("Invalid user id");
        let gas_count = Gas::from(BASE_GAS * 14u64 - BASE_GAS * 5*7/4);
        lower_level_neuron::adjust(offset, input1, input2, input_vector, lower_level_neuron_id, NO_DEPOSIT, gas_count);
    }

    // Same math as predict method, but tells neural net not to train
    pub fn predict_raw(&self, input1: f32, input2: f32, mut outputs: Vec<f32>) -> near_sdk::Promise{
        let weighted_sum = self.bias  + self.weight1 * input1 + self.weight2 + input2;
        outputs.push(self.sigmoid(weighted_sum));
        let higher_level_neuron_account_id: AccountId = HIGHER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS * 18u64 - BASE_GAS * 5*3/4);
        higher_level_neuron::predict_raw(input1, input2, outputs, higher_level_neuron_account_id, NO_DEPOSIT, gas_count)
    }

    // Ouput function
    fn sigmoid(&self, input_sum: f32) -> f32{
        1f32/(1f32 + E.powf(-input_sum as f64) as f32)
    }
}
