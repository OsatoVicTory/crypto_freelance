import { useState } from "react";
import { FaUserTie, FaRegUser } from "react-icons/fa";
import "./styles.css";
import { useNavigate } from "react-router-dom";

const Registration = () => {

    const [checked, setChecked] = useState(10);
    const navigate = useNavigate();

    return (
        <div className="Registration-Home">
            <div className="container">
                <h2>Freelance Registration</h2>
                <div className="Register">
                    <div className="reg-card">
                        <div className="reg-card-top">
                            <FaUserTie className="rct-icon" />
                            <div className={`rounded-check ${checked === "hirer"}`}
                            onClick={() => setChecked("hirer")}>
                                <div></div>
                            </div>
                        </div>
                        <h3>I am a client hiring for a project</h3>
                    </div>
                    <div className="reg-card rc-2">
                        <div className="reg-card-top">
                            <FaRegUser className="rct-icon" />
                            <div className={`rounded-check ${checked === "user"}`}
                            onClick={() => setChecked("user")}>
                                <div></div>
                            </div>
                        </div>
                        <h3>I am a freelancer looking for work</h3>
                    </div>
                </div>
                
                <button className="btn" onClick={() => navigate(`/register-${checked}`)}>Continue</button>
            </div>
        </div>
    )
};

export default Registration;
