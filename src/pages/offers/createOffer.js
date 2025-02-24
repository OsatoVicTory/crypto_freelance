import { useCallback, useContext, useMemo, useState } from "react";
import { AppContext } from "../../context";
import { AiOutlineClose } from "react-icons/ai";
import { createContractInstance } from "../../creators";

const CreateOffer = ({ closeModal }) => {
    
    const { contract, wallet } = useContext(AppContext);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    }, []);
    
    const handleCreate = async (e) => {
        e.preventDefault();
        // call successFn when successfully done
        try {
            setLoading(true);
            const contractInstance = await createContractInstance(contract.signer);
            const offer_id = parseInt(String(await contractInstance.getOffersLen()) - 0);

            // offer_id will be len of hirer offers + 1
            const data_ = Object.keys(data).map(key => {
                if(key === "job_start" || key === "job_end") return `${key}=${parseInt((new Date(data[key])).getTime())}`;
                else return `${key}=${data[key]}`;
            }).join("%x2") + `%x2hirer=${contract.address}%x2offer_id=${String(offer_id)}`;

            const tx = await contractInstance.createOffer(contract.address, offer_id, data_);
            await tx.wait();
            setLoading(false); 
            closeModal(data_);
        } catch(err) {
            console.log(err);
            // setError(true);
            setLoading(false);
        }
    };

    const minDate = useMemo(() => {
        const date = new Date();
        const Z = (x) => x > 9 ? x : "0"+x;
        return (`${date.getFullYear()}-${Z(date.getMonth() + 1)}-${Z(date.getDate())}`);
    }, []);

    return (
        <div className="__Modal__Overlay__ __SuccessModal__">
            <div className="__Modal__Container__">
                <div className="Create_Offer_Modal">
                    <div className="modal-content">
                        <div className="modal-header j-between">
                            <h2>Create a Job Offer</h2>
                            {/* <span className="txt-white">Create Gallery</span> */}
                            <button className="modal-close-btn pointer" onClick={closeModal}>
                                <AiOutlineClose className="mcb-icon txt-white" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="create-offer">
                                <div className="container_">
                                    <form id="createOfferForm" onSubmit={handleCreate}>
                                        <div>
                                            <div className="form-group">
                                                <label>Job Role</label>
                                                <input name="name" placeholder="Enter offer name" required onChange={handleChange} />
                                            </div>
                                            <div className="form-group">
                                                <label>Job Pay</label>
                                                <input name="pay_amount" placeholder="Enter an amount" required onChange={handleChange} />
                                            </div>
                                            
                                            <div className="form-group">
                                                <label>Choose Skills</label>
                                                <select id="developer-type" name="skill" onChange={handleChange} required>
                                                    <option>Web Development</option>
                                                    <option>Graphic Designs</option>
                                                    <option>Marketing</option>
                                                    <option>Writing</option>
                                                    <option>Other</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Job description</label>
                                                <textarea placeholder="Enter description" name="description" 
                                                onChange={handleChange} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Job Starts</label>
                                                <input placeholder="Enter Gallery name" type="date" name="job_start"
                                                className="txt-white" min={minDate} onChange={handleChange} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Job Ends</label>
                                                <input placeholder="Enter Gallery name" type="date" name="job_end"
                                                className="txt-white" min={minDate} onChange={handleChange} required />
                                            </div>
                                        </div>
                                        
                                        <button type="submit" className="btn">{loading ? "Creating..." : "Create"}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CreateOffer;