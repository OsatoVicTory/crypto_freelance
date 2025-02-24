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
use stylus_sdk::{ alloy_primitives::{ U256, U64 }, prelude::* };
use alloy_primitives::{ Address, Uint };
// use stylus_sdk::{block, console};
use stylus_sdk::storage::{ StorageString, StorageVec };

// Define the storage structure for the Blog smart contract using the sol_storage! macro.
// This structure contains mappings to store information such as the number of posts,
// post content, user token balances, referrals, and more.

sol_storage! {
    #[entrypoint]
    pub struct Hire {
        mapping(address => string) users; // metatdata of users (users are like freelancers who are seeking job offers)
        mapping(address => string) hirers; // metadata of hirers
        string[] offers; // all offers

        mapping(address => uint64[]) hirers_offers; // Stores ids of offers hirers made
        mapping(address => uint64[]) user_hires; // Stores ids of offers user(or freelancers) has taken
    }
}

#[public]
impl Hire {
    // Implement the Blog smart contract.
    // This function allows users to purchase tokens by adding the specified amount to their balance.

    pub fn create_user(&mut self, user_address: Address, user_data: String) {
        let mut user_accessor = self.users.setter(user_address);
        user_accessor.set_str(user_data);
    }

    pub fn create_hirer(&mut self, hirer_address: Address, hirer_data: String) {
        let mut hirer_accessor = self.hirers.setter(hirer_address);
        hirer_accessor.set_str(hirer_data);
    }

    pub fn create_offer(
        &mut self, 
        hirer_address: Address, 
        offer_id: u64, 
        offer: String
    ) {
        let mut f_ = self.offers.grow();
        f_.set_str(offer);
        
        // store id in hirers
        let mut hirer_offers_accessor = self.hirers_offers.setter(hirer_address);
        hirer_offers_accessor.push(U64::from(offer_id));
    }

    // this is to update an offer data (like name or time of offer) or to submit application to get offer
    // both involve updating string in offers only that in submission only applicants field is updated in the offer data
    // so string becomes (Eg "name=Frontend Job%x2description=Web Developer%x2applicants=0x3...987%+%0x2...968")
    pub fn submit_application_or_update_offer(
        &mut self, 
        hirer: Address, 
        offer_id: u64, 
        new_offer_data: String
    ) {
        let mut new_offer_mod = self.offers.get_mut(offer_id as usize).unwrap();
        new_offer_mod.set(new_offer_data);
    }

    pub fn accept_applicant(
        &mut self,
        user_address: Address,
        offer_id: u64,
        new_offer_data: String
    ) {
        // new_offer_data should have status: accepted or not looking for entries/applicants again
        // and you could now wipe out applicants field in new_offer_data string to optimize storage usage
        let mut new_offer_mod = self.offers.get_mut(offer_id as usize).unwrap();
        new_offer_mod.set_str(new_offer_data);

        // after updating, push id of offer to user
        let mut user_hire_accessor = self.user_hires.setter(user_address);
        user_hire_accessor.push(U64::from(offer_id));
    }

    pub fn get_user(&self, user_address: Address) -> String {
        let user = self.users.getter(user_address);
        return user.get_string();
    }

    pub fn get_hirer(&self, hirer_address: Address) -> String {
        let user = self.hirers.getter(hirer_address);
        return user.get_string();
    }

    pub fn get_user_hires(&self, user_address: Address) -> Vec<u64> {
        let offers_accessor = self.user_hires.getter(user_address);
        let mut offers_vec = Vec::new();
        for i in 0..offers_accessor.len() {
            let offers_guard = offers_accessor.get(i).unwrap();

            offers_vec.push(offers_guard.to::<u64>());
        }
        offers_vec
    }

    pub fn get_hirers_offers(&self, hirer_address: Address) -> Vec<u64> {
        let hirers_offers_accessor = self.hirers_offers.getter(hirer_address);
        let mut hirers_offers_vec = Vec::new();
        for i in 0..hirers_offers_accessor.len() {
            let hirers_offer_guard = hirers_offers_accessor.get(i).unwrap();

            hirers_offers_vec.push(hirers_offer_guard.to::<u64>());
        }
        hirers_offers_vec
    }

    pub fn get_offers_len(&self) -> u64 {
        return self.offers.len() as u64;
    }

    pub fn get_offer(&self, offer_id: u64) -> String {
        let t_ self.offers.get(offer_id as usize).unwrap();
        t_.get_string();
        return t_.get_string();
    }
}