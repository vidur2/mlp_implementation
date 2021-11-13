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
    weight6: f32,
    weight7: f32,
    weight8: f32,
    weight9: f32,
    weight10: f32,
    weight11: f32,
    weight12: f32,
    weight13: f32,
    weight14: f32,
    weight15: f32,
    weight16: f32,
    weight17: f32,
    weight18: f32,
    weight19: f32,
    weight20: f32,
    weight21: f32,
    weight22: f32,
    weight23: f32,
    bias: f32,
}

// Defining next neuron's scope in terms of this neuron
#[ext_contract(higher_level_neuron)]
pub trait InputNeuron2{
    // Only need the next neuron's predict methods, not the adjust method
    fn predict(
        &self,
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
        input23: f32,
        mut outputs: Vec<f32>, 
        mut input_vector: Vec<Vec<f32>>, 
        expected_output: f32
    );

    fn predict_raw(
        &self,
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
        input23: f32,
        mut outputs: Vec<f32>
    );
}

// neuron functions
#[near_bindgen]
impl InputNeuron{
    // Runs on Deploy
    #[init]
    pub fn new() -> Self {
        let rand = env::random_seed();
        Self {
            weight1: if rand[23] > 128u8 { rand[0] as f32 } else { -1f32 * (rand[0] as f32) },
            weight2: if rand[0] > 128u8 { rand[1] as f32 } else { -1f32 * (rand[1] as f32) },
            weight3: if rand[1] > 128u8 { rand[2] as f32 } else { -1f32 * (rand[2] as f32)},
            weight4: if rand[2] > 128u8 {rand[3] as f32} else {-1f32 * (rand[3] as f32)},
            weight5: if rand[3] > 128u8 {rand[4] as f32} else {-1f32 * (rand[4] as f32)},
            weight6: if rand[4] > 128u8 {rand[5] as f32} else {-1f32 * (rand[5] as f32)},
            weight7: if rand[5] > 128u8 {rand[6] as f32} else {-1f32 * (rand[6] as f32)},
            weight8: if rand[6] > 128u8 {rand[7] as f32} else {-1f32 * (rand[7] as f32)},
            weight9: if rand[7] > 128u8 {rand[8] as f32} else {-1f32 * (rand[8] as f32)},
            weight10: if rand[8] > 128u8 {rand[9] as f32} else {-1f32 * (rand[9] as f32)},
            weight11: if rand[9] > 128u8 {rand[10] as f32} else {-1f32 * (rand[10] as f32)},
            weight12: if rand[10] > 128u8 {rand[11] as f32} else {-1f32 * (rand[11] as f32)},
            weight13: if rand[11] > 128u8 {rand[12] as f32} else {-1f32 * (rand[12] as f32)},
            weight14: if rand[12] > 128u8 {rand[13] as f32} else {-1f32 * (rand[13] as f32)},
            weight15: if rand[13] > 128u8 {rand[14] as f32} else {-1f32 * (rand[14] as f32)},
            weight16: if rand[14] > 128u8 {rand[15] as f32} else {-1f32 * (rand[15] as f32)},
            weight17: if rand[15] > 128u8 {rand[16] as f32} else {-1f32 * (rand[16] as f32)},
            weight18: if rand[16] > 128u8 {rand[17] as f32} else {-1f32 * (rand[17] as f32)},
            weight19: if rand[17] > 128u8 {rand[18] as f32} else {-1f32 * (rand[18] as f32)},
            weight20: if rand[18] > 128u8 {rand[19] as f32} else {-1f32 * (rand[19] as f32)},
            weight21: if rand[19] > 128u8 {rand[20] as f32} else {-1f32 * (rand[20] as f32)},
            weight22: if rand[20] > 128u8 {rand[21] as f32} else {-1f32 * (rand[21] as f32)},
            weight23: if rand[21] > 128u8 {rand[22] as f32} else {-1f32 * (rand[22] as f32)},
            bias: 0f32,
        }
    }
    // ViewMethod Predict burns no gas
    pub fn predict(
        &self,
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
        input23: f32,
        expected_output: f32
    ){
        let weighted_sum: f32 = self.bias + self.weight1 * input1 + self.weight2 * input2 + self.weight3 * input3 + self.weight4 * input4 + self.weight5 * input5 + self.weight6 * input6 + self.weight7 * input7 + self.weight8 * input8 + self.weight9 * input9 + self.weight10 * input10 + self.weight11 * input11 + self.weight12 * input12 + self.weight13 * input13 + self.weight14 * input14 + self.weight15 * input15 + self.weight16 * input16 + self.weight17 * input17  + self.weight18 * input18 + self.weight19 * input19 + self.weight20 * input20 + self.weight21 * input21 + self.weight22 * input22 + self.weight23 * input23;
        let mut outputs = Vec::new();
        let mut inputs: Vec<Vec<f32>> = Vec::new();
        inputs.push(vec![input1, input2, input3, input4, input5, input6, input7, input8, input9, input10, input11, input12, input13, input14, input15, input16, input17, input18, input19, input20, input21, input22, input23]);
        outputs.push(self.tanh(weighted_sum));
        
        // Casts environment variables to nessescary type in order to make a cross-contract call
        let higher_level_neuron_account_id: AccountId = HIGHER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS * 21u64);
        // Cross contract call to send infor to other neuron
        higher_level_neuron::predict(
            input1, 
            input2, 
            input3, 
            input4, 
            input5 , 
            input6 , 
            input7 ,
            input8 ,
            input9 ,
            input10 ,
            input11 ,
            input12 ,
            input13 ,
            input14 ,
            input15 ,
            input16 ,
            input17 ,
            input18 ,
            input19 ,
            input20 ,
            input21 ,
            input22 ,
            input23 ,
            outputs, 
            inputs, 
            expected_output, 
            higher_level_neuron_account_id, 
            NO_DEPOSIT, 
            gas_count
        );
    }

    // ViewMethod Predict burns no gas
    pub fn predict_raw(
        &self,
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
        input23: f32,
    ) -> near_sdk::Promise{
        let weighted_sum: f32 = self.bias + self.weight1 * input1 + self.weight2 * input2 + self.weight3 * input3 + self.weight4 * input4 + self.weight5 * input5 + self.weight6 * input6 + self.weight7 * input7 + self.weight8 * input8 + self.weight9 * input9 + self.weight10 * input10 + self.weight11 * input11 + self.weight12 * input12 + self.weight13 * input13 + self.weight14 * input14 + self.weight15 * input15 + self.weight16 * input16 + self.weight17 * input17  + self.weight18 * input18 + self.weight19 * input19 + self.weight20 * input20 + self.weight21 * input21 + self.weight22 * input22 + self.weight23 * input23;
        let mut outputs = Vec::new();
        outputs.push(self.tanh(weighted_sum));
        
        // Casts environment variables to nessescary type in order to make a cross-contract call
        let higher_level_neuron_account_id: AccountId = HIGHER_LEVEL_NEURON_ID.to_string().trim().parse().expect("invalid");
        let gas_count = Gas::from(BASE_GAS * 21u64);
        // Cross contract call to send infor to other neuron
        higher_level_neuron::predict_raw( 
            input1  , 
            input2  , 
            input3  , 
            input4  , 
            input5  , 
            input6  , 
            input7  ,
            input8  ,
            input9  ,
            input10  ,
            input11  ,
            input12 ,
            input13  ,
            input14  ,
            input15  ,
            input16  ,
            input17  ,
            input18  ,
            input19  ,
            input20  ,
            input21  ,
            input22  ,
            input23  ,
            outputs, 
            higher_level_neuron_account_id, 
            NO_DEPOSIT, 
            gas_count
        )
    }


    // adjust function which will be called by a higher level neuron for training
    pub fn adjust(
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
        input23: f32,
    ) -> f32{
        // Adjustment of neuron weights according to offset and input
        self.weight1 = self.weight1 + offset * input1;
        self.weight2 = self.weight2 + offset * input2;
        self.weight3 = self.weight3 + offset * input3;
        self.weight4 = self.weight4 + offset * input4;
        self.weight5 = self.weight5 + offset * input5;
        self.weight6 = self.weight6 + offset * input6;
        self.weight7 = self.weight7 + offset * input7;
        self.weight8 = self.weight8 + offset * input8;
        self.weight9 = self.weight9 + offset * input9;
        self.weight10 = self.weight10 + offset * input10;
        self.weight11 = self.weight11 + offset * input11;
        self.weight12 = self.weight12 + offset * input12;
        self.weight13 = self.weight13 + offset * input13;
        self.weight14 = self.weight14 + offset * input14;
        self.weight15 = self.weight15 + offset * input15;
        self.weight16 = self.weight16 + offset * input16;
        self.weight17 = self.weight17 + offset * input17;
        self.weight18 = self.weight18 + offset * input18;
        self.weight19 = self.weight19 + offset * input19;
        self.weight20 = self.weight20 + offset * input20;
        self.weight21 = self.weight21 + offset * input21;
        self.weight22 = self.weight22 + offset * input22;
        self.weight23 = self.weight23 + offset * input23;
        self.bias = self.bias + offset;
        // Returns a value to show the train data that is was successful
        offset
    }

    // Activation function
    fn tanh(&self, input_sum: f32) -> f32{
        input_sum.tanh()
    }
}