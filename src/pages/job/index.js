import { AiOutlineClose } from "react-icons/ai";
import "./styles.css";
import { useMemo, useContext } from "react";
import { getDate, shortenAddy } from "../../utils";
import { Link } from "react-router-dom";
import { AppContext } from "../../context";

const Job = ({ closeModal, setForm, data }) => {

    const { contract } = useContext(AppContext); 
    console.log(data) 

    const getDataDates = useMemo(() => {
        if(data.job_start) return `${getDate(data.job_start)} - ${getDate(data.job_end)}`;
        else return "";
    }, [data.job_start]);

    return (
        <div className="__Modal__Overlay__ __SuccessModal__">
            <div className="__Modal__Container__">
                <div className="Job_Details_Modal">
                    <div className="modal-content">
                        <div className="modal-top">
                            <div className="m-top">
                                <h2>{data.name}</h2>
                                <button className="modal-close-btn pointer" onClick={closeModal}>
                                    <AiOutlineClose className="mcb-icon txt-white" />
                                </button>
                            </div>
                            <div className="m-base">
                                <span className="mb-timeline">{getDataDates}</span>
                                <Link to={`/user-h/${data.hirer}`}>{shortenAddy(data.hirer)}</Link>
                            </div>
                        </div>
                        <div className="modal-body">
                            <div className="m-body">
                                <span className="mb-desc-name">Job Description</span>
                                <span className="mb-desc-value">
                                    {data.description}
                                </span>
                            </div>
                            <div className="m-pay">
                                <span className="mp-name">Job Pay Offer</span>
                                <span className="mp-value">{data.pay_amount}</span>
                            </div>

                            {contract.address !== data.hirer && <button className="submit-btn" 
                            onClick={setForm}>Submit an Application</button>}

                            {contract.address === data.hirer && <span className="padd">{" "}</span>}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Job;
