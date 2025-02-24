import { AiOutlineClose } from "react-icons/ai";
import "./styles.css";
import { useCallback, useContext, useEffect, useState } from "react";
import { createContractInstance } from "../../creators";
import { AppContext } from "../../context";
import LoadingDiv from "../../components/loadingDiv";
import { parseStringData } from "../../utils";
import { useNavigate } from "react-router-dom";
import NoData from "../../components/noData";

const AcceptForm = ({ closeModal, offer_data }) => {

    const { contract } = useContext(AppContext);  
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const navigate = useNavigate();

    const fetchUser = async (address, contractInstance) => {
        const userRes = await contractInstance.getUser(address);
        return { ...parseStringData(userRes), address };
    };
    
    const fetchUsersData = async (user_address) => {
        try {
            console.log(offer_data);
            setLoadingData(true);
            const contractInstance = await createContractInstance(contract.signer);
            const users_ = await Promise.all(
                offer_data.users.map((address) => fetchUser(address, contractInstance).then(res => res))
            );
            console.log(users_);
            setUsers(users_);
            setLoadingData(false);
        } catch(err) {
            // 
        }
    };

    useEffect(() => {
        fetchUsersData();
    }, []);
    
    const handleAccept = async (user_address) => {
        try {
            if(loading) return;

            setLoading(user_address);
            const contractInstance = await createContractInstance(contract.signer);
            const new_data = { ...offer_data };
            new_data.users = `${user_address}`;
            const new_offer_data = Object.keys(new_data).map(key => `${key}=${new_data[key]}`).join("%x2") + "%x2found=true";
            const tx = await contractInstance.acceptApplicant(
                user_address, offer_data.offer_id, new_offer_data
            );        
            await tx.wait();
            setLoading(false);
            closeModal();
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const handleNav = useCallback((e, val) => {
        if(e.target.classList.value.includes('apply-btn')) {
            handleAccept(val.address);
        } else {
            navigate(`/app/user/${val.address}?id=${offer_data.offer_id}`, { state: offer_data });
        } 
    }, []);

    return (
        <div className="__Modal__Overlay__ __SuccessModal__">
            <div className="__Modal__Container__">
                <div className="Job_Form_Modal">
                    <div className="modal-content">
                        <div className="modal-header j-between">
                            <h2>Applicants</h2>
                            {/* <span className="txt-white">Create Gallery</span> */}
                            <button className="modal-close-btn pointer" onClick={closeModal}>
                                <AiOutlineClose className="mcb-icon txt-white" />
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* <h3 className="txt-white">Applicants</h3> */}
                            <div className="mb">
                                {
                                    loadingData ?
                                    <LoadingDiv width={"42px"} height={"42px"} />
                                    :
                                    (
                                    users.length === 0 ?
                                    <NoData text={`No user has applied for this role`} />
                                    :
                                    users.map((val, idx) => (
                                        <div key={`user-${idx}`} className="mb-user" onClick={(e) => handleNav(e, val)}>
                                            <img src={val.img} alt="" />
                                            <div className="mbu-txt">
                                                <span className="mbut-name">{val.name}</span>
                                                <span className="mbut-role">{val.specialization}</span>
                                            </div>
                                            <button className="apply-btn">
                                                {val.address === loading ? "Accepting..." : "Accept"}
                                            </button>
                                        </div>
                                    ))
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default AcceptForm;
