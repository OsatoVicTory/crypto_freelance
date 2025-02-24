// interface IHire {
//     function createOffer(address hirer_address, string calldata offer, string calldata offer_type) external;

//     function createUser(address user_address, string calldata user_data) external;

//     function createHirer(address hirer_address, string calldata hirer_data) external;

//     function submitEntry(address user_address, address hirer, uint64 id, string calldata data) external;

//     function updateOrAcceptOffer(address user_address, address hirer, uint64 offer_id, string calldata new_data, string calldata is_accept) external;

//     function getUser(address user_address) external view returns (string memory);

//     function getHirer(address hirer_address) external view returns (string memory);

//     function getOffers(address user_address) external view returns (string[] memory);

//     function getUserHires(address user_address) external view returns (uint64[] memory);

//     function getEntries(address user_address, uint64 id) external view returns (string memory);

//     function getOffer(address user_address, uint64 offer_id) external view returns (string memory);
// }

// 0x03b65e23f61a62b47fe98b0779689b3a1dbeef5c // CA