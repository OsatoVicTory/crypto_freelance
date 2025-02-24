import { useCallback, useContext, useState } from 'react';
import './styles.css';
import { BiSolidError } from 'react-icons/bi';
import { AppContext } from '../context';
import { createContractInstance } from "../creators";
import { BrowserProvider } from "ethers";
import { useNavigate } from "react-router-dom";
import { parseStringData } from '../utils';


const NoWallet = () => {

    const [loading, setLoading] = useState(false);
    const { setContract, contract, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    async function getSignature() {
        try {

            if(!loading) setLoading(true);

            const provider = await new BrowserProvider(window.ethereum);
            const signer_val = await provider.getSigner();
            const signerAddress = await signer_val.getAddress();

            const contractInstance = await createContractInstance(signer_val);
            const userRes = await contractInstance.getUser(signerAddress);
            if(!userRes) {
                const userRes_ = await contractInstance.getHirer(signerAddress);
                if(!userRes_) return navigate(`/register`);
                else {
                    const user = parseStringData(userRes_);
                    setUser(user);
                    setContract({ address: signerAddress, signer: signer_val });
                    setLoading(false);
                }
            } else {
                const user = parseStringData(userRes);
                setUser(user);
                setContract({ address: signerAddress, signer: signer_val });
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };


    const openWallet = useCallback(() => {
        setLoading(true);
        if(!contract.address) getSignature();
    }, []);

    return (
        <div className="error-page">
            <div>
                <div className='ep-iocn-div'>
                    <BiSolidError className='ep-icon' />
                </div>
                <p className='ep-h3 txt-white'>
                    No wallet detected. Connect your wallet to continue.
                </p>
                <button className={`ep-btn txt-white ${!loading && 'pointer'}`} onClick={openWallet} disabled={loading}>
                    {loading ? 'Connecting...' : 'Connect wallet'}
                </button>
            </div>
        </div>
    );
};

export default NoWallet;