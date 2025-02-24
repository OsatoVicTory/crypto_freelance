// Conditionally compile the program without a main function, unless "export-abi" feature is enabled.
#![cfg_attr(not(feature = "export-abi"), no_main)]

// Set up a global memory allocator using MiniAlloc for efficient memory management in the smart contract.
// commented
// #[global_allocator]
// static ALLOC: mini_alloc::MiniAlloc = mini_alloc::MiniAlloc::INIT;

// Import the alloc crate to enable heap allocations in a no-std environment.
extern crate alloc;


// Import necessary types and functions from the Stylus SDK and Alloy Primitives crates.
// These include U256 for large integers, Address for user addresses, and various
// storage types for managing data on the blockchain.
#[allow(unused_imports)]
use stylus_sdk::{alloy_primitives::U256, prelude::*};
use alloy_primitives::{Address, Uint};
// use stylus_sdk::{block, console};
use stylus_sdk::storage::{StorageString, StorageVec};



// Define the storage structure for the Blog smart contract using the sol_storage! macro.
// This structure contains mappings to store information such as the number of posts,
// post content, user token balances, referrals, and more.

sol_storage! {
    #[entrypoint]
    pub struct Hire {
        mapping(address => string) users; // Track the number of points per user
        mapping(address => string) hirers; // Track the number of points per user
        mapping(address => string[]) offers; // Stores tasks completed by user
        mapping(address => uint64[]) user_hires; // Stores tasks completed by user
        mapping(address => string[]) entries; 
    }
}

// Declare that `Blog` is a contract with the following external methods.
#[public]
impl Hire {

    // Implement the Blog smart contract.
    // This function allows users to purchase tokens by adding the specified amount to their balance.

    pub fn create_offer(&mut self, hirer_address: Address, offer: String, offer_type: String) {
        let mut offers_accessor = self.offers.setter(hirer_address);
        let mut new_offer_slot = offers_accessor.grow();
        new_offer_slot.set_str(&offer);
    }

    pub fn create_user(&mut self, user_address: Address, user_data: String) {
        let mut user_accessor = self.users.setter(user_address);
        user_accessor.set_str(user_data);
    }

    pub fn create_hirer(&mut self, hirer_address: Address, hirer_data: String) {
        let mut hirer_accessor = self.hirers.setter(hirer_address);
        hirer_accessor.set_str(hirer_data);
    }
 

    // data should have previous data and "%+%" new data
    pub fn submit_entry(&mut self, user_address: Address, hirer: Address, id: u64, data: String) {
        let mut entries_accessor = self.entries.setter(hirer);
        if let Some(mut element) = entries_accessor.get_mut(id) {
            element.set_str(&data);
        }
    }
    

    pub fn update_or_accept_offer(&mut self, user_address: Address, hirer: Address, offer_id: u64, new_data: String, is_accept: String) {
        let mut offers_accessor = self.offers.setter(hirer);
        if let Some(mut element) = offers_accessor.get_mut(offer_id as usize) {
            element.set_str(&new_data);
            if !is_accept.is_empty() {
                let mut user_hire_accessor = self.user_hires.setter(user_address);
                let mut new_user_hire_slot = user_hire_accessor.grow();
                new_user_hire_slot.set(offer_id);
            }
        }
    }

    pub fn get_user(&self, user_address: Address) -> String {
        let user = self.users.getter(user_address);
        return user.get_string();
    }

    pub fn get_hirer(&self, hirer_address: Address) -> String {
        let user = self.hirers.getter(hirer_address);
        return user.get_string();
    }

    pub fn get_offers(&self, user_address: Address) -> Vec<String> {
        let offers_accessor = self.offers.get(user_address);
        let mut offers_vec = Vec::new();
        for i in 0..offers_accessor.len() {
            if let Some(offers_guard) = offers_accessor.get(i) {
                offers_vec.push(offers_guard.get_string());
            }
        }
        offers_vec
    }

    pub fn get_user_hires(&self, user_address: Address) -> Vec<u64> {
        let offers_accessor = self.user_hires.get(user_address);
        let mut offers_vec = Vec::new();
        for i in 0..offers_accessor.len() {
            if let Some(offers_guard) = offers_accessor.get(i) {
                offers_vec.push(offers_guard.get());
            }
        }
        offers_vec
    }

    pub fn get_entries(&self, user_address: Address, id: u64) -> Vec<String> {
        let entries_accessor = self.entries.getter(user_address);
        let _y = entries_accessor.get(id as usize).unwrap();
        _y.get_string()
    }
    
    pub fn get_offer(&self, user_address: Address, offer_id: u64) -> String {
        let offers_accessor = self.offers.getter(user_address);
        let _y = offers_accessor.get(offer_id as usize).unwrap();
        _y.get_string()

    }
}