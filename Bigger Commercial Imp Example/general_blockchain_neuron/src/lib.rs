use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, env, ext_contract, Gas, Balance, AccountId, Promise};
use std::f64::consts::{E};

const BASE_GAS: u64 = 5_000_000_000_000u64;

#[derive(BorshDeserialize, BorshSerialize)]
pub enum ActivationFunction{
    HyperTan,
    Logistic,
    Linear,
    Step
}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Neuron{
    weights: Vec<f32>,
    inputs: Vec<f32>,
    activation_function: ActivationFunction,
    bias: f32,
    previous_input: AccountId,
    next_input: AccountId,
}

#[ext_contract(higher_level_neuron)]
pub trait Neuron{
    fn predict(outputs: Vec<f32>);
}

#[near_bindgen]
impl Neuron{
    #[init]
    pub fn new(inputs: Vec<f32>, function_type: &str, layer: f32, previous_input: &str, next_input: &str) -> Self{
        let activation_function = match function_type {
            "tanh" | "Hyperbolic Tangent" => ActivationFunction::HyperTan,
            "logistic" | "Logistic" => ActivationFunction::Logistic,
            "linear" | "Linear" | _ => ActivationFunction::Linear,
            "step" | "Step" => ActivationFunction::Step,
        };
        Self {
            weights: inputs,
            inputs: Vec::new(),
            activation_function: activation_function,
            bias: layer - 1f32,
            previous_input: previous_input.trim().parse().expect("Invalid account id"),
            next_input: next_input.trim().parse().expect("Invalid account id")
        }
    }
    pub fn predict(self, inputs: Vec<f32>){
        let mut weighted_sum: f32 = self.bias;
        let mut i = 0;
        if inputs.len() == self.weights.len(){
            for input in inputs.iter(){
                weighted_sum += input * self.weights[i];
                i += 1;
            }
        }

        let outputs = vec![self.activate(weighted_sum)];
    }

    fn activate(self, sum: f32) -> f32{
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
