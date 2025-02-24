import { Route, Routes } from "react-router-dom"
import UserProfile from "./account/userProfile"
import Offers from "./offers"
import Job from "./job"
import HirerProfile from "./account/hirerProfile"

const Pages = () => {

    return (
        <Routes>
            <Route path="/" element={<Offers />} />
            <Route path="/job/:job_id" element={<Job />} />
            <Route path="/user/:user_address" element={<UserProfile />} />
            <Route path="/user-h/:hirer_address" element={<HirerProfile />} />
        </Routes>
    )
};

export default Pages;