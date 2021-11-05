/*
Testing of a multi-layer perceptron contract
2nd neuron in the network
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId, Promise};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

// Constants region for calling new Contracts
// Higher Level neuron Contract id
const HIGHER_LEVEL_NEURON_ID: &str = "mlp3.perceptron.testnet";

// Lower Level neuron Id
const LOWER_LEVEL_NEURON_ID: &str = "mlp1.perceptron.testnet";

// General Constants
const NO_DEPOSIT: Balance = 0;
const BASE_GAS: u64 = 5_000_000_000_000;



#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct InputNeuron2{
    weight1: f32,
    weight2: f32,
    weight3: f32,
    weight4: f32, 
    weight5: f32,
    bias: f32,
}

#[ext_contract(higher_level_neuron)]
pub trait MiddleNeuron{
    fn predict(&self, input1: f32, input2: f32, mut input_vector: Vec<Vec<f32>>, expected_ouput: f32);
    fn predict_raw(&self, input1: f32, input2: f32);
}

#[ext_contract(lower_level_neuron)]
pub trait InputNeuron{
    fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32);
}

#[near_bindgen]
impl InputNeuron2{
    #[init]
    pub fn new() -> Self{
        Self {
            weight1: 6f32,
            weight2: 4f32,
            weight3: 7f32,
            weight4: 5f32,
            weight5: 10f32,
            bias: 0f32
        }
    }
    pub fn predict(&self, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32, mut outputs: Vec<f32>, mut input_vector: Vec<Vec<f32>>, expected_ouput: f32){
        let weighted_sum: f32 = self.bias + input1 * self.weight1 + input2 * self.weight2 + input3 * self.weight3 + input4 * self.weight4 + input5 * self.weight5;
        outputs.push(self.tanh(weighted_sum));
        input_vector.push(outputs);
        let higher_level_neuron_account_id: AccountId = HIGHER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS * 20u64 - BASE_GAS * 5/4);
        higher_level_neuron::predict(input_vector[1][0], input_vector[1][1], input_vector, expected_ouput, higher_level_neuron_account_id, NO_DEPOSIT, gas_count);
    }

    pub fn predict_raw(&self, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32, mut outputs: Vec<f32>) -> near_sdk::Promise{
        let weighted_sum: f32 = self.bias + input1 * self.weight1 + input2 * self.weight2 + input3 * self.weight3 + input4 * self.weight4 + input5 * self.weight5;
        outputs.push(self.tanh(weighted_sum));
        let higher_level_neuron_account_id: AccountId = HIGHER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = 0;
        higher_level_neuron::predict_raw(outputs[0], outputs[1], higher_level_neuron_account_id, NO_DEPOSIT, gas_count)
    }


    pub fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input3: f32, input4: f32, input5: f32){
        // Adjustment of neuron weights according to offset and input
        self.weight1 = self.weight1 + offset * input1;
        self.weight2 = self.weight2 + offset * input2;
        self.weight3 = self.weight3 + offset * input3;
        self.weight4 = self.weight4 + offset * input4;
        self.weight5 = self.weight5 + offset * input5;
        self.bias = self.bias + offset;
        let lower_level_neuron_account_id: AccountId = LOWER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS *12u64 - BASE_GAS * 5*9/4);
        lower_level_neuron::adjust(offset, input1, input2, input3, input4, input5, lower_level_neuron_account_id, NO_DEPOSIT, gas_count);
    }
    fn tanh(&self, input_sum: f32) -> f32{
        input_sum.tanh()
    }
}