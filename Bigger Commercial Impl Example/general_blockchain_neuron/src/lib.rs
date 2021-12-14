extern crate neural_net_obj;
use neural_net_obj::{ActivationFunction, NeuralNetStructure};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, ext_contract, Gas, Balance, AccountId, Promise};
use std::f64::consts::{E};

const BASE_GAS: u64 = 5_000_000_000_000u64;
const NO_DEPOSIT: Balance = 0;

#[derive(BorshDeserialize, BorshSerialize)]
enum PropagationState{
    Forward,
    Backward
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
#[derive(Clone)]
#[near_bindgen]
pub struct Neuron{
    weights: Vec<f32>,
    inputs: Vec<f32>,
    activation_function: ActivationFunction,
    bias: f32,
    mlp_structure: NeuralNetStructure,
    master_account: String,
}

#[ext_contract(higher_level_neuron)]
pub trait Neuron{
    fn enter_inputs(inputs: Vec<f32>);
}

#[ext_contract(lower_level_neuron)]
pub trait Neuron{
    fn adjust(offset: f32);
}

#[near_bindgen]
impl Neuron{
    #[init]
    pub fn new(num_weights: u32, function_type: String, layer: f32, layer_structure: Vec<u64>, pos_x: usize, pos_y: usize, master_account: String) -> Self{
        let mlp_structure = NeuralNetStructure {
            layer_structure: layer_structure,
            pos_x: pos_x,
            pos_y: pos_y
        };
        let rand = near_sdk::env::random_seed();
        let mut weights = Vec::new();
        for i in 0..(num_weights as usize) - (1 as usize) {
            weights.push((rand[i] - 128u8) as f32)
        }
        let activation_function = match function_type.as_str() {
            "tanh" | "Hyperbolic Tangent" => ActivationFunction::HyperTan,
            "logistic" | "Logistic" => ActivationFunction::Logistic,
            "step" | "Step" => ActivationFunction::Step,
            "linear" | "Linear" | _ => ActivationFunction::Linear,
        };
        Self {
            weights: weights,
            inputs: Vec::new(),
            activation_function: activation_function,
            bias: layer - 1f32,
            mlp_structure: mlp_structure,
            master_account: master_account,
        }
    }

    pub fn enter_inputs(&mut self, inputs: Vec<f32>) -> std::option::Option<f32>{
        self.inputs.append(&mut inputs.to_vec());
        if self.inputs.len() == self.weights.len(){
            return self.predict(&self.inputs);  
        }else{
            return std::option::Option::None;
        }
    }
    pub fn predict(&self, inputs: &Vec<f32>) -> Option<f32>{
        let mut weighted_sum: f32 = self.bias;
        if inputs.len() == self.weights.len(){
            let mut i = 0;
            for input in inputs.iter(){
                weighted_sum += input * self.weights[i];
                i += 1;
            }
        }
        let gas_fee = self.clone().calculate_gas(PropagationState::Forward);
        let account_ids = self.find_acct_ids(PropagationState::Forward);
        
        match account_ids{
            Some(account_ids) => {
                for account in account_ids.iter(){
                    higher_level_neuron::enter_inputs(vec![self.activate(weighted_sum)], account.clone(), NO_DEPOSIT, gas_fee);
                }
                return None
            }
            None => {
                // Call adjust function here
                let result = self.activate(weighted_sum);
                return Option::Some(result)
            }
        }
    }
    fn find_acct_ids(&self, state: PropagationState) -> Option<Vec<AccountId>>{
        let mut acct_ids: Vec<AccountId> = Vec::new(); 
        let index = self.mlp_structure.pos_y - 1usize;
        let mut sum = self.mlp_structure.layer_structure[index];
        match state{
            PropagationState::Forward => { 
                if index + 1usize < self.mlp_structure.layer_structure.len(){
                    for _ in 1..self.mlp_structure.layer_structure[index + 1usize]{
                        sum += 1;
                        let next_account_id: AccountId = format!("mlp{}.{}.testnet", sum, self.master_account).trim().parse().expect("Invalid Input");
                        acct_ids.push(next_account_id);
                    }
                    let return_value = std::option::Option::Some(acct_ids);
                    return return_value;
                }else{
                    return std::option::Option::None;
                }
            }
            PropagationState::Backward => {
                if index - 1usize > 0{
                    for _ in 1..self.mlp_structure.layer_structure[index - 1usize]{
                        sum += 1;
                        let next_account_id: AccountId = format!("mlp{}.{}.testnet", sum, self.master_account).trim().parse().expect("Invalid Input");
                        acct_ids.push(next_account_id);
                    }
                    let return_value = std::option::Option::Some(acct_ids);
                    return return_value;
                }
                else{
                    return std::option::Option::None;
                }
            }
        }
    }
    fn calculate_gas(self, state: PropagationState) -> Gas{
        let pos_y = self.mlp_structure.pos_y - 1usize;
        let pos_x = self.mlp_structure.pos_x;
        let mut neurons_remaining = 0u64;
        let mut neurons_passed: u64 = self.mlp_structure.layer_structure.iter().sum();
        for layer in pos_y..(self.mlp_structure.layer_structure.len() - 1usize){
            neurons_remaining += self.mlp_structure.layer_structure[layer] as u64;
            neurons_passed -= self.mlp_structure.layer_structure[layer] as u64;
            if layer == pos_y {
                neurons_remaining -= pos_x as u64;
                neurons_passed += pos_x as u64;
            }
        }
        match state{
            PropagationState::Forward => Gas::from((neurons_remaining as u64 - ((5/4) as u64) * neurons_passed) * (BASE_GAS as u64)),
            PropagationState::Backward => Gas::from((neurons_remaining as u64 - (((5/4) as u64) * neurons_passed) - (2usize * self.mlp_structure.layer_structure.len()) as u64) * (BASE_GAS as u64))
        }
    }
    fn activate(&self, sum: f32) -> f32{
        match self.activation_function {
            ActivationFunction::HyperTan => sum.tanh(),
            ActivationFunction::Logistic => 1f32/(1f32 + E.powf(-sum as f64) as f32),
            ActivationFunction::Linear => sum,
            ActivationFunction::Step => {
                if sum < 0.0{
                    0.0
                }else{
                    1.0
                }
            }
        }
    }
}
