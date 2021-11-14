/*
Testing of a multi-layer perceptron contract
3rd neuron in the network
*/

use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId, Promise};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use std::f64::consts::{E};

// Constants region for calling new Contracts
// Higher Level neuron Contract id
const HIGHER_LEVEL_NEURON_ID: &str = "mlp4.perceptron.testnet";

// Lower Level neuron Id
const LOWER_LEVEL_NEURON_ID: &str = "mlp2.perceptron.testnet";

// General Constants
const NO_DEPOSIT: Balance = 0;
const BASE_GAS: u64 = 5_000_000_000_000;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, Default)]
pub struct MiddleNeuron{
    weight1: f32,
    weight2: f32,
    bias: f32,
}

#[ext_contract(higher_level_neuron)]
pub trait PerceptronWeights{
    fn predict(&self, input1: f32, input2: f32, mut outputs: Vec<f32>, mut input_vector: Vec<Vec<f32>>, expected_output: f32);
    fn predict_raw(&self, input1: f32, input2: f32, mut outputs: Vec<f32>);
}

#[ext_contract(lower_level_neuron)]
pub trait InputNeuron2{
    fn adjust(
        &mut self,
        offset: f32,
        input1: f32, 
        input2: f32, 
        input3: f32, 
        input4: f32, 
        input5: f32, 
        input6: f32, 
        input7: f32,
        input8: f32,
        input9: f32,
        input10: f32,
        input11: f32,
        input12: f32,
        input13: f32,
        input14: f32,
        input15: f32,
        input16: f32,
        input17: f32,
        input18: f32,
        input19: f32,
        input20: f32,
        input21: f32,
        input22: f32,
        input23: f32
    );
}

#[near_bindgen]
impl MiddleNeuron{
    #[init]
    pub fn new() -> Self {
        Self{
            weight1: -6f32,
            weight2: -10f32,
            bias: 1f32
        }
    }
    pub fn predict(&self, input1: f32, input2: f32, mut input_vector: Vec<Vec<f32>>, expected_output: f32){
        let weighted_sum = self.bias  + self.weight1 * input1 + self.weight2 + input2;
        let mut outputs = Vec::new();
        outputs.push(self.sigmoid(weighted_sum));
        let higher_level_neuron_account_id: AccountId = HIGHER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS * 19u64 - BASE_GAS * 5*2/4);
        higher_level_neuron::predict(input1, input2, outputs, input_vector, expected_output, higher_level_neuron_account_id, NO_DEPOSIT, gas_count);
    }
    pub fn adjust(&mut self, offset: f32, input1: f32, input2: f32, input_vector: Vec<Vec<f32>>){
        self.weight1 = self.weight1 + offset * input1;
        self.weight2 = self.weight2 + offset * input2;
        self.bias = self.bias + offset;
        let lower_level_neuron_account_id: AccountId = LOWER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS * 13u64 - BASE_GAS * 5*8/4);
        lower_level_neuron::adjust(offset, input_vector[0][0], input_vector[0][1], input_vector[0][2], input_vector[0][3], input_vector[0][4], input_vector[0][5], input_vector[0][6], input_vector[0][7], input_vector[0][8], input_vector[0][9], input_vector[0][10], input_vector[0][11], input_vector[0][12], input_vector[0][13], input_vector[0][14],input_vector[0][15], input_vector[0][16], input_vector[0][17], input_vector[0][18], input_vector[0][19], input_vector[0][20], input_vector[0][21], input_vector[0][22], lower_level_neuron_account_id, NO_DEPOSIT, gas_count);

    }
    pub fn predict_raw(&self, input1: f32, input2: f32) -> near_sdk::Promise{
        let weighted_sum: f32 = self.weight1 * input1 + self.weight2 + self.bias;
        let mut outputs = Vec::new();
        outputs.push(self.sigmoid(weighted_sum));
        let higher_level_neuron_account_id: AccountId = HIGHER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS * 19u64 - BASE_GAS * 5*2/4);
        higher_level_neuron::predict_raw(input1, input2, outputs, higher_level_neuron_account_id, NO_DEPOSIT, gas_count)
    }
    fn sigmoid(&self, input_sum: f32) -> f32{
        1f32/(1f32 + E.powf(-input_sum as f64) as f32)
    }
}