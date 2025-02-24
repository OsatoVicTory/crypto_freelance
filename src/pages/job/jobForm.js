import { AiOutlineClose } from "react-icons/ai";
import "./styles.css";
import { useCallback, useContext, useState } from "react";
import { createContractInstance } from "../../creators";
import { AppContext } from "../../context";

const JobForm = ({ closeModal, offer_data }) => {

    const { contract } = useContext(AppContext);
    const [data, setData] = useState({});  
    const [loading, setLoading] = useState(false);
    console.log(offer_data)
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            // %+%
            const new_data = { ...offer_data };
            if(new_data.users.includes(contract.address)) {
                console.log("already applied");
                setLoading(false);
                return;
            };
            new_data.users.push(contract.address);
            new_data.users = new_data.users.join("%+%");
            const new_offer_data = Object.keys(new_data).map(key => `${key}=${new_data[key]}`).join("%x2");

            const contractInstance = await createContractInstance(contract.signer);
            const tx = await contractInstance.submitApplicationOrUpdateOffer(
                offer_data.hirer, parseInt(offer_data.offer_id), new_offer_data
            );
            await tx.wait();
            setLoading(false);
            closeModal();
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    }, []);

    return (
        <div className="__Modal__Overlay__ __SuccessModal__">
            <div className="__Modal__Container__">
                <div className="Job_Form_Modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            {/* <span className="txt-white">Create Gallery</span> */}
                            <button className="modal-close-btn pointer" onClick={closeModal}>
                                <AiOutlineClose className="mcb-icon txt-white" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <h3 className="txt-white">Apply for Job</h3>
                            {/* <p className="txt-white">
                                Apply for a Job
                            </p> */}
                            <form id="applicationForm" onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <input type="text" name="name" required 
                                    placeholder="Enter your name" onChange={handleChange} />
                                </div>
                                <div className="input-group">
                                    <label>Email address</label>
                                    <input type="email" name="email" required 
                                    placeholder="Enter email" onChange={handleChange} />
                                </div>
                                {/* <div className="input-group">
                                    <label for="resume">Recent Resume</label>
                                    <input type="file" id="resume" required />
                                </div> */}
                                <button type="submit" className="submit-btn">
                                    {loading ? "Submiting..." : "Submit Application"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default JobForm;
