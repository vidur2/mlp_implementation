use near_sdk::{ near_bindgen, env, CryptoHash, AccountId };
use near_sdk::borsh::{self, BorshSerialize, BorshDeserialize};
use near_sdk::collections::{LookupMap};

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Accounts {
    accessor_account_id: String,
    account_info: LookupMap<String, String>
}

fn hash_acct_id(account_id: &AccountId) -> CryptoHash{
    let mut hash = CryptoHash::default();
    hash.copy_from_slice(&env::sha256(account_id.as_bytes()));
    hash
}

impl Default for Accounts {
    fn default() -> Self{
        Self {
            accessor_account_id: String::new(),
            account_info: LookupMap::new(hash_acct_id(&env::predecessor_account_id()).try_to_vec().unwrap())
        }
    }
}

#[near_bindgen]
impl Accounts{
    #[init]
    pub fn new(accessor_account_id: String) -> Self{
        Self {
            accessor_account_id: accessor_account_id,
            account_info: LookupMap::new(hash_acct_id(&env::predecessor_account_id()).try_to_vec().unwrap())
        }
    }

    pub fn add_account(&mut self, username: String, password: String){
        let caller_id: String = env::signer_account_id().to_string();
        if caller_id == self.accessor_account_id {
            self.account_info.insert(&username, &password);
        }
    }
    pub fn view_account_pk(self, username: String) -> Option<String>{
        let caller_id: String = env::signer_account_id().to_string();
        if caller_id == self.accessor_account_id || caller_id == username{
            return self.account_info.get(&username);
        }else{
            return None;
        }
    }
}
