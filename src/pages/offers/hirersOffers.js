import { useCallback, useContext, useEffect, useState } from "react";
import "./styles.css";
import JobForm from "../job/jobForm";
import Job from "../job";
import CreateOffer from "./createOffer";
import { LoadingSpinner } from "../../components/loading";
import { AppContext } from "../../context";
import { createContractInstance } from "../../creators";
import NoData from "../../components/noData";
import AcceptForm from "../job/accept";
import { useNavigate } from "react-router-dom";
import { parseOfferData, shortenAddy } from "../../utils";

const HirersOffersPage = () => {

    const { contract, user } = useContext(AppContext);
    const [offers, setOffers] = useState([]);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState("");
    const [dropdown, setDropdown] = useState("");
    const [search, setSearch] = useState("");
    const [checked, setChecked] = useState("");
    const [checker, setChecker] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const navigate = useNavigate();

    
    
    const fetchOffers_ = async (_id, contractInstance) => {
        const offer = parseOfferData(await contractInstance.getOffer(_id));
        return { ...offer, offer_id: String(_id) };
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const contractInstance = await createContractInstance(contract.signer);
            const lst = await contractInstance.getOffersLen();
            const hirerOffers = Array(String(lst) - 0).fill(0).map((v, id) => id);
            const res = await Promise.all(
                hirerOffers.map((offer_id) => fetchOffers_(offer_id, contractInstance).then(res => res))
            );
            setOffers(res);
            setDisplayData(res);
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClick = useCallback((e, val) => {
        setData(val);
        if(e.target.classList.value.includes('apply-btn')) {
            setModal("offer-form");
        } else {
            setModal("job");
        } 
    }, []);

    const handleChecked = useCallback((val) => {
        setChecked(val);
    }, []);

    const handleChange = useCallback((e) => {
        setChecker((prev) => {
            const arr = [];
            const val = e.target.name;
            for(let i = 0; i < prev.length; i++) {
                if(val !== prev[i]) arr.push(prev[i]);
            }
            // if len is equal then it is new
            if(arr.length === prev.length) arr.push(val);
            return arr;
        });
    }, []);

    const filterSearch = () => {
        const arr = [];
        for(const offer of offers) {
            if(checker.length === 0 || checker.includes(offer.skill)) arr.push(offer);
            else if(offer.name.toLowerCase().includes("developer") && checker.includes("Web Development")) arr.push(offer);
        }
        const disp = [];
        for(const ar of arr) {
            if(ar.name.toLowerCase().includes(search.toLowerCase())) disp.push(ar);
        }
        setDisplayData(disp);
    };

    useEffect(() => {
        if(search) filterSearch();
    }, [search, checker.join("")]);

    return (
        <>
            <div className="Offers h">
                <header className="app-header">
                    <div className="logo"><strong>Crypto Freelance</strong></div>
                    <div className="search-bar">
                        <input type="text" placeholder="Search for jobs..." onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <button className="connect-wallet" onClick={()=>navigate(`/app/user-h/${contract.address}`)}>
                        {shortenAddy(contract.address || "") || "Connect Wallet"}
                    </button>
                </header>

                {
                    loading ?
                    <div className="offers-loading">
                        <LoadingSpinner width={"50px"} height={"50px"} />
                        <p>Loading...</p>
                    </div>
                    :
                
                    <div className="container">
                        <section className="browse-talent">
                            <h2>Browse Talent by Category</h2>
                            <div className="categories">
                                {checker.map((val, idx) => (
                                    <div className="category" key={`cat-${idx}`}>{val}</div>
                                ))}
                            </div>
                        </section>
                        
                        <div className="content">
                            <aside className="sidebar">
                                <h3>Filters</h3>
                                <div className="filter-dropdown" onClick={() => {
                                    setDropdown("Category")
                                }}>🔍 Category</div>
                                <ul className={`filter-options ${dropdown === "Category"}`}>
                                    <li>
                                        <input type="checkbox" name="Web Development" onChange={handleChange} />
                                        <span>Web Development</span>
                                    </li>
                                    <li>
                                        <input type="checkbox" name="Graphic Design" onChange={handleChange} />
                                        <span>Graphic Design</span>
                                    </li>
                                    <li>
                                        <input type="checkbox" name="Writing" onChange={handleChange} />
                                        <span>Writing</span>
                                    </li>
                                    <li>
                                        <input type="checkbox" name="Marketing" onChange={handleChange} />
                                        <span>Marketing</span>
                                    </li>
                                </ul>
                                <div className="filter-dropdown" onClick={() => setDropdown("Budget")}>💰 Budget</div>
                                <ul className={`filter-options ${dropdown === "Budget"}`}>
                                    <li>
                                        <input type="checkbox" onChange={() => handleChecked("0-100")} checked={checked==="0-100"} />
                                        <span>$0 - $100</span>
                                    </li>
                                    <li>
                                        <input type="checkbox" onChange={() => handleChecked("100-500")} checked={checked==="100-500"} />
                                        <span>$100 - $500</span>
                                    </li>
                                    <li>
                                        <input type="checkbox" onChange={() => handleChecked("500-1000")} checked={checked==="500-1000"} />
                                        <span>$500 - $1000</span>
                                    </li>
                                    <li>
                                        <input type="checkbox" onChange={() => handleChecked("1000+")} checked={checked==="1000+"} />
                                        <span>$1000+</span>
                                    </li>
                                </ul>
                            </aside>
                            
                            <main className="job-listings">
                                <div className="jl-top">
                                    <h2>Available Jobs</h2>
                                    {user?.role === "hirer" && <button className="create-btn" 
                                    onClick={() => setModal("create")}>Create offer</button>}
                                </div>
                                <ul>
                                    {
                                        offers.length === 0 ?
                                        <NoData text={`No offers has bee created yet`} 
                                        btnFn={() => setModal("create")} btnTxt={`Create one`} />
                                        :
                                        (
                                            displayData.length === 0 ?
                                            <NoData text={`No offers for search among the categories selected`}  />
                                            :
                                            displayData.map((val, idx) => (
                                                <li className="jl-li" key={`jli-${idx}`}>
                                                    <div className="job-card" onClick={(e) => handleClick(e, val)}>
                                                        <div>
                                                            <h3>{val.name}</h3>
                                                            <p>{val.description}</p>
                                                            <strong>Budget: {val.pay_amount}</strong>
                                                        </div>
                                                        <button className="apply-btn">Applicants</button>
                                                    </div>
                                                </li>
                                            ))
                                        )
                                    }
                                </ul>
                            </main>
                        </div>
                    </div>
                }

                {modal === "create" && <CreateOffer closeModal={(data_) => {
                    setOffers((prev) => {
                        return [data_, ...prev];
                    });
                    setModal("");
                }} />}

                {modal === "job" && <Job closeModal={() => setModal("")} 
                data={data} setForm={() => setModal("offer-form")} />}

                {modal === "offer-form" && <AcceptForm offer_data={data} closeModal={() => setModal("")} />}

            </div>
        </>
    )
};

export default HirersOffersPage;
