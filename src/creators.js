import { Contract } from "ethers";
import axios from 'axios';
import abi from "./abi/abi.json";

const SERVER_URL = "https://stylus-web3-hackathon-backend.onrender.com";

export const CONTRACT_ADDRESS = "0x30e08848b7ef06e1fd10e246dd8442f25f48260c";


export const sendFile = (data) => {
    const url = `${SERVER_URL}/upload_contents_file`;
    return axios.post(url, data);
};

export const sendProfileFile = (data) => {
    const url = `${SERVER_URL}/upload_users_file`;
    return axios.post(url, data);
};

export const createContractInstance = async (signer) => {
    return await new Contract(CONTRACT_ADDRESS, abi, signer);
};
