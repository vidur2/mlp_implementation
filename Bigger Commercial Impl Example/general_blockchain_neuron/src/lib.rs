use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, ext_contract, Gas, Balance, AccountId, Promise};
use std::f64::consts::{E};

const BASE_GAS: u64 = 5_000_000_000_000u64;
const NO_DEPOSIT: Balance = 0;

#[derive(BorshDeserialize, BorshSerialize, Clone)]
pub enum ActivationFunction{
    HyperTan,
    Logistic,
    Linear,
    Step
}

#[derive(BorshDeserialize, BorshSerialize)]
enum PropagationState{
    Forward,
    Backward
}

#[derive(Default, BorshDeserialize, BorshSerialize, Clone)]
pub struct NeuralNetStructure{
    layer_structure: Vec<u64>,
    pos_x: usize,
    pos_y: usize
}

impl Default for ActivationFunction{
    fn default() -> ActivationFunction{
        ActivationFunction::Linear
    }
}

#[derive(Default, BorshDeserialize, BorshSerialize)]
#[derive(Clone)]
#[near_bindgen]
pub struct Neuron{
    weights: Vec<f32>,
    inputs: Vec<f32>,
    activation_function: ActivationFunction,
    bias: f32,
    previous_input: String,
    next_input: String,
    mlp_structure: NeuralNetStructure,
}

#[ext_contract(higher_level_neuron)]
pub trait Neuron{
    fn enter_inputs(inputs: Vec<f32>);
}

#[near_bindgen]
impl Neuron{
    #[init]
    pub fn new(num_weights: u32, function_type: String, layer: f32, previous_input: String, next_input: String, layer_structure: Vec<u64>, pos_x: usize, pos_y: usize) -> Self{
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
            previous_input: previous_input.trim().parse().expect("Invalid account id"),
            next_input: next_input.trim().parse().expect("Invalid account id"),
            mlp_structure: mlp_structure
        }
    }

    pub fn enter_inputs(&mut self, inputs: Vec<f32>){
        self.inputs.append(&mut inputs.to_vec());
        if self.inputs.len() == self.weights.len(){
            self.predict(&self.inputs)    
        }
    }
    pub fn predict(&self, inputs: &Vec<f32>){
        let higher_level_neuron_account_id: AccountId = self.next_input.trim().parse().expect("Invalid Account Id");
        let mut weighted_sum: f32 = self.bias;
        if inputs.len() == self.weights.len(){
            let mut i = 0;
            for input in inputs.iter(){
                weighted_sum += input * self.weights[i];
                i += 1;
            }
        }
        let gas_fee =  self.clone().calculate_gas(PropagationState::Forward);
        higher_level_neuron::enter_inputs(vec![self.activate(weighted_sum)], higher_level_neuron_account_id, NO_DEPOSIT, gas_fee);
    }
    fn calculate_gas(self, state: PropagationState) -> Gas{
        let pos_y = self.mlp_structure.pos_y - 1usize;
        let pos_x = self.mlp_structure.pos_x;
        let mut neurons_remaining = 0u64;
        let mut neurons_passed: u64 = self.mlp_structure.layer_structure.iter().sum();
        for layer in pos_y..(self.mlp_structure.layer_structure.len() - 1usize){
            neurons_remaining += self.mlp_structure.layer_structure[layer] as u64;
            neurons_passed -= self.mlp_structure.layer_structure[layer] as u64;
            if (layer == pos_y){
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
