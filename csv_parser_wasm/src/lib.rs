use wasm_bindgen::prelude::*;
use reqwest::{Client};

#[wasm_bindgen]
pub fn parse_csv(csv_string: &str){
    let mut final_vec: Vec<Vec<&str>> = Vec::new();
    let parsed_string_1: Vec<&str> = csv_string.split("\n").collect();
    let client = reqwest::Client::new();
    
    for row in parsed_string_1.iter(){
        client.post("http://localhost:3000/api/wallet_endpoint")
            .body(row);
    }

    
}
