import { useContext, useEffect, useState } from "react";
import "./user.css";
import { BsBriefcase } from "react-icons/bs";
import { TfiLocationPin } from "react-icons/tfi";
import { useParams } from "react-router-dom";
import { createContractInstance } from "../../creators";
import { parseOfferData, parseStringData, shortenAddy } from "../../utils";
import { AppContext } from "../../context";
import { LoadingSpinner } from "../../components/loading";
import LoadingDiv from "../../components/loadingDiv";
import ErrorDiv from "../../components/errorDiv";
import NoData from "../../components/noData";

const HirerProfile = () => {

    const [loading, setLoading] = useState(true);
    const [offers, setOffers] = useState({ data: [], loaded: false });
    const [offersLoading, setOffersLoading] = useState(true);
    const [offersError, setOffersError] = useState(false);
    const [userData, setUserData] = useState({});
    const { user, contract } = useContext(AppContext);
    const { hirer_address } = useParams();

    const fetchUserData = async () => {
        setLoading(true);
        try {
            console.log(user, hirer_address === contract.address, hirer_address, contract.address)
            if(hirer_address === contract.address) {
                console.log(hirer_address)
                setUserData(user);
                setLoading(false);
                return;
            }
            const contractInstance = await createContractInstance(contract.signer);
            const userRes = await contractInstance.getHirer(hirer_address);
            console.log(userRes)
            setUserData(parseStringData(userRes));
            setLoading(false);
        } catch(err) {
            console.log(err);
            setLoading(false);
        } 
    };

    const fetchOffers_ = async (_id, contractInstance) => {
        const offer = parseOfferData(await contractInstance.getOffer(_id));
        return { ...offer, offer_id: String(_id) };
    };


    const fetchOffers= async () => {
        setOffersLoading(true);
        setOffersError(false);
        try {
            const contractInstance = await createContractInstance(contract.signer);
            const hirerOffers = Array.from(await contractInstance.getHirersOffers(hirer_address));
            const res = await Promise.all(
                hirerOffers.map((offer_id) => fetchOffers_(offer_id, contractInstance).then(res => res))
            );
            setOffers({ data: res, loaded: true });
            setOffersLoading(false);
        } catch(err) {
            console.log(err);
            setOffersError(true);
            setOffersLoading(false);
        } 
    };

    const fetchData = async () => {
        if(!userData.name) fetchUserData();
        if(!offers.loaded) fetchOffers();
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <>
            {
                loading ?
                <div className="Account-Page Loading">
                    <LoadingSpinner width={"50px"} height={"50px"} />
                    <p>Loading...</p>
                </div>
                :
            <div className="Account-Page">
                <header className="app-header">
                    <div className="logo"><strong>Crypto Freelance</strong></div>
                    <div className="search-bar">
                        <input type="text" placeholder="Search for jobs..." />
                    </div>
                    <button className="connect-wallet">{shortenAddy(contract.address||"")}</button>
                </header>
                <div className="profile-container">
                    <div className="profile-header">
                        <img src={userData.img} alt="Profile Picture" />
                        <div className="profile-info">
                            <h2>{userData.name}</h2>
                            <div className="profile-location">
                                <TfiLocationPin className="pl-icon" />
                                <span>{userData.location}</span>
                            </div>
                            <div className="profile-role">
                                <BsBriefcase className="pr-icon" />
                                <span>{userData.specialization} : {userData.years} years experience</span>
                            </div>
                        </div>
                    </div>
                    <div className="profile-main">
                        <div className="pm-section-1">
                            <div className="pms1">
                                <div className="pms-jobs">
                                    <span className="pmsj-value">{offersLoading ? "Loading..." : offers.data.length}</span>
                                    <span className="pmsj-name">Total Offers</span>
                                </div>
                            </div>
                            <div className="pms2">
                                <div className="pms2-">
                                    <span className="pms2-name">Company Name</span>
                                    <span className="pms2-value">{userData.company}</span>
                                </div>
                                <div className="pms2-">
                                    <span className="pms2-name">Language</span>
                                    <span className="pms2-value">{userData.language || "English"}</span>
                                </div>
                                {userData.description && <div className="pms2-">
                                    <span className="pms2-name">Description</span>
                                    <span className="pms2-value">
                                        {userData.description}
                                    </span>
                                </div>}
                            </div>
                        </div>

                        <div className="pm-section-2">
                            <div className="section-h2">
                                <h2>Created Offers</h2>
                            </div>

                            {
                                offersError ?
                                <ErrorDiv retry={fetchOffers} />
                                :
                                (
                                    offersLoading ?
                                    <LoadingDiv width={"50px"} height={"50px"} />
                                    :
                                    (
                                        (offers.loaded && offers.data.length === 0) ?
                                        <NoData text={'No Offers made yet'} />
                                        :
                                        offers.data.map((val, idx) => (
                                            <div className="section" key={`pm-${idx}`}>
                                                <div className="sect-top">
                                                    <h3>{val.name}</h3>
                                                    <span>{val.pay_amount}</span>
                                                </div>
                                                <div className="sect-main">
                                                    <span className="sm-desc">
                                                        {val.description}
                                                    </span>
                                                    <span className="job-status">Job Status - <span>{val.status||"Ongoing"}</span></span>
                                                </div>
                                            </div>
                                        ))
                                    )
                                )
                            }


                            {/* <div className="section">
                                <h3>Reviews & Ratings</h3>
                                <ul className="reviews">
                                    <li>⭐⭐⭐⭐⭐ - "John is an amazing developer! Delivered top quality work."</li>
                                    <li>⭐⭐⭐⭐ - "Great work, but took slightly longer than expected."</li>
                                </ul>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            }
        </>
    );
};

export default HirerProfile;