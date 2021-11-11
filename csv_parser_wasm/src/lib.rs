use wasm_bindgen::prelude::*;
use reqwest;

#[wasm_bindgen]
pub async fn parse_csv(csv_string: String){
    let parsed_string_1: Vec<&str> = csv_string.split("\n").collect();
    let client = reqwest::Client::new();


    for row in parsed_string_1.iter(){
        client.post("http://localhost:3000/api/wallet_endpoint")
            .body(String::from(*row))
            .send()
            .await;
    }   
}
