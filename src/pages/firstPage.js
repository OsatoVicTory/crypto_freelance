import { useContext, useState } from "react";
import "../pages/registration/styles.css";
import { AppContext } from "../context";
import { useNavigate } from "react-router-dom";
import { BrowserProvider } from "ethers";
import { parseStringData } from "../utils";
import { createContractInstance } from "../creators";

const LogIn = () => {

    const navigate = useNavigate();
    const { contract, setContract, setUser } = useContext(AppContext);
    const [loading, setLoading] = useState(false);


    async function getSignature(e) {
        e.preventDefault();
        try {

            if(!loading) setLoading(true);

            const provider = await new BrowserProvider(window.ethereum);
            const signer_val = await provider.getSigner();
            const signerAddress = await signer_val.getAddress();

            const contractInstance = await createContractInstance(signer_val);
            const userRes = await contractInstance.getUser(signerAddress);
            setContract({ address: signerAddress, signer: signer_val });
            if(!userRes) {
                const userRes_ = await contractInstance.getHirer(signerAddress);
                if(!userRes_) return navigate(`/register`);
                else {
                    const user = parseStringData(userRes_);
                    setUser(user);
                    setLoading(false);
                }
            } else {
                const user = parseStringData(userRes);
                setUser(user);
                setLoading(false);
            }
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    return (
        <div className="Registration LogIn">
            <div className="container">
                <form id="registrationForm" onSubmit={getSignature}>
                    <h2>Log In</h2>
                    <p>Not logged in. Connect wallet to log in and continue</p>
                    <button type="submit" className="btn">{loading ? "Connecting..." : "Connect"}</button>
                </form>
            </div>
        </div>
    )
};

export default LogIn;
