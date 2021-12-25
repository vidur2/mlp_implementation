use neural_net_obj::{ActivationFunction, NeuralNetStructure};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{near_bindgen, ext_contract, Gas, Balance, AccountId};
use std::f64::consts::{E};

const BASE_GAS: u64 = 8_000_000_000_000u64;
const NO_DEPOSIT: Balance = 0;

#[repr(u8)]
#[derive(BorshDeserialize, BorshSerialize)]
enum PropagationState{
    Forward,
    Backward
}

// mod tests{
//     use near_sdk::test_utils::VMContextBuilder;
//     use near_sdk::{testing_env, VMContext};
//     use std::convert::TryInto;
//     use crate::Neuron;

//     fn get_context() -> VMContext {
//         let account_id = String::from("perceptron.tester.testnet").trim().parse().expect("Invalid Account id");
//         VMContextBuilder::new()
//             .signer_account_id(account_id)
//             .is_view(false)
//             .build()
//     }

//     #[test]
//     fn test_for_loop() {
//         let context = get_context();
//         testing_env!(context);
//         let layer_structure: Vec<u64> = vec![2, 3, 1];
//         let mut neuron = Neuron::new(1u32, String::from("tanh"), layer_structure, 1usize, 1usize, String::from("tester.testnet"));
//         neuron.enter_inputs(vec![1.1], Some(1.0));
//     }
// }

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
    output: Option<u8>
}

#[ext_contract(higher_level_neuron)]
pub trait Neuron{
    fn enter_inputs(inputs: Vec<f32>);
}

#[ext_contract(lower_level_neuron)]
pub trait Neuron{
    fn adjust(offset: f32);
}

#[ext_contract(first_neuron)]
pub trait Neuron {
    fn set_output(output: f32);
}

#[near_bindgen]
impl Neuron{
    #[init]
    pub fn new(num_weights: u32, function_type: String, layer_structure: Vec<u64>, pos_x: usize, pos_y: usize, master_account: String) -> Self{
        let mlp_structure = NeuralNetStructure {
            layer_structure: layer_structure,
            pos_x: pos_x,
            pos_y: pos_y
        };
        let rand = near_sdk::env::random_seed();
        let mut weights = Vec::new();
        for i in 0..(num_weights as usize) {
            weights.push((rand[i] as f32 - 128f32) as f32)
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
            bias: (pos_y as f32) - 1f32,
            mlp_structure: mlp_structure,
            master_account: master_account,
            output: None
        }
    }
    pub fn get_weights(&self) -> &Vec<f32>{
        return &self.weights
    }
    pub fn enter_inputs(&mut self, inputs: Vec<f32>, expected_output: Option<f32>) -> Vec<f32>{
        self.inputs.append(&mut inputs.to_vec());
        if self.inputs.len() == self.weights.clone().len(){
            self.predict(&self.clone().inputs, expected_output); 
            match expected_output {
                Some(_thing) => {
                },
                None => {
                    self.inputs = Vec::new()
                }
            };
            self.weights.clone()
        } else {
            self.weights.clone()
        }
    }
    pub fn predict(&mut self, inputs: &Vec<f32>, expected_output: Option<f32>){
        let mut weighted_sum: f32 = self.bias;
        if inputs.len() == self.weights.len(){
            let mut i = 0;
            for input in inputs.iter(){
                weighted_sum += input * self.weights[i];
                i += 1;
            }
        }
        let account_ids = self.find_acct_ids(PropagationState::Forward);
        let action_potential = self.activate(weighted_sum);
        match account_ids {
            Some(account_ids) => {
                let gas_fee = self.clone().calculate_gas(PropagationState::Forward);
                for account in account_ids.iter(){
                    println!("{}", account);
                    higher_level_neuron::enter_inputs(vec![action_potential], account.clone(), NO_DEPOSIT, gas_fee);
                }
            }
            None => {
                match expected_output {
                    Some(expected_output) => {
                        let result = self.activate(weighted_sum);
                        let offset = expected_output - result;
                        self.adjust(offset);
                    }
                    None => {
                        let first_acct_id: AccountId = format!("mlp1.perceptron.{}", self.master_account)
                            .trim()
                            .parse()
                            .expect("Invalid Account id");
                        first_neuron::set_output(action_potential, first_acct_id, NO_DEPOSIT, Gas::from(BASE_GAS));
                    }
                }
            }
        }
    }

    pub fn adjust(&mut self, offset: f32){
        let account_ids = self.find_acct_ids(PropagationState::Backward);
        let mut counter = 0;
        for weight in self.weights.iter() {
            self.clone().weights[counter] = weight + offset * self.clone().inputs[counter];
            counter += 1;
        }
        self.inputs = Vec::new();
        match account_ids{
            Some(account_ids) => {
                for account in account_ids {
                    println!("{}", account);
                    lower_level_neuron::adjust(offset, account, NO_DEPOSIT, self.clone().calculate_gas(PropagationState::Backward));
                }
            }
            None => {
                self.inputs = Vec::new();
            }
        }
    }

    pub fn set_output(&mut self, output: f32){
        let casted_output = output as f32;
        self.output = std::option::Option::Some(casted_output as u8);
    }

    fn find_acct_ids(&self, state: PropagationState) -> Option<Vec<AccountId>>{
        let mut acct_ids: Vec<AccountId> = Vec::new(); 
        let index = self.mlp_structure.pos_y - 1usize;
        match state{
            PropagationState::Forward => { 
                let mut sum: u64 = self.mlp_structure.layer_structure[0..index + 1].iter().sum();
                if index + 1usize != self.mlp_structure.layer_structure.len(){
                    for _ in 1..=self.mlp_structure.layer_structure[index + 1usize]{
                        sum += 1;
                        let next_account_id: AccountId = format!("mlp{}.perceptron.{}", sum, self.master_account)
                            .trim()
                            .parse()
                            .expect("Invalid Input");
                        acct_ids.push(next_account_id);
                    }
                    let return_value = std::option::Option::Some(acct_ids);
                    return return_value;
                }else{
                    return std::option::Option::None;
                }
            }
            PropagationState::Backward => {
                let total_neuron_count: u64 = self.mlp_structure.layer_structure.iter().sum();
                let passed_neurons: u64 = self.mlp_structure.layer_structure[index..self.mlp_structure.layer_structure.len()].iter().sum();
                let mut sum: u64 = total_neuron_count - passed_neurons;
                if index - 1usize > 0 {
                    for _ in 1..=self.mlp_structure.layer_structure[index - 1usize]{
                        sum -= 1;
                        let next_account_id: AccountId = format!("mlp{}.perceptron.{}.testnet", sum + 1, self.master_account)
                            .trim()
                            .parse()
                            .expect("Invalid Input");
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
        let pos_y = self.mlp_structure.pos_y;
        let mut neurons_remaining = 0u64;
        let total_neuron_count: u64 = self.mlp_structure.layer_structure.iter().sum();
        for layer in pos_y..(self.mlp_structure.layer_structure.len()){
            neurons_remaining += self.mlp_structure.layer_structure[layer] as u64;
        }
        match state{
            PropagationState::Forward => {
                let current_required_gas = neurons_remaining + (self.mlp_structure.layer_structure.len() - pos_y) as u64;
                let next_neuron_required_gas = (current_required_gas - 1)/self.mlp_structure.layer_structure[pos_y];
                let gas_amt = Gas::from(BASE_GAS as u64 * (next_neuron_required_gas + total_neuron_count));
                gas_amt
            },
            PropagationState::Backward => {
                let current_required_gas = neurons_remaining + pos_y as u64;
                let next_neuron_required_gas = (current_required_gas - 1)/self.mlp_structure.layer_structure[pos_y - 2];
                let gas_amt = Gas::from(BASE_GAS as u64 * (next_neuron_required_gas + total_neuron_count));
                gas_amt
            }
        }
    }
    fn activate(&self, sum: f32) -> f32{
        match self.activation_function {
            ActivationFunction::HyperTan => {
                sum.tanh()
            },
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
