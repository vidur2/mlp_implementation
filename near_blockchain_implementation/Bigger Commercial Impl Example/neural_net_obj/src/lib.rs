use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};

#[derive(Default, BorshDeserialize, BorshSerialize, Clone)]
pub struct NeuralNetStructure{
    pub layer_structure: Vec<u64>,
    pub pos_x: usize,
    pub pos_y: usize
}

#[repr(u8)]
#[derive(BorshDeserialize, BorshSerialize, Clone)]
pub enum ActivationFunction{
    HyperTan,
    Logistic,
    Linear,
    Step
}

impl Default for ActivationFunction{
    fn default() -> ActivationFunction{
        ActivationFunction::Linear
    }
}