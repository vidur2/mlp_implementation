use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

#[derive(BorshDeserialize, BorshSerialize, Clone)]
pub enum ActivationFunction{
    HyperTan,
    Logistic,
    Linear,
    Step
}

#[derive(Default, BorshDeserialize, BorshSerialize, Clone)]
pub struct NeuralNetStructure{
    pub layer_structure: Vec<u64>,
    pub pos_x: usize,
    pub pos_y: usize
}