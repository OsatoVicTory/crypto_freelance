import { useContext } from "react";
import { AppContext } from "../../context";
import HirersOffersPage from "./hirersOffers";
import UsersOffersPage from "./usersOffers";

const Offers = () => {

    const { user } = useContext(AppContext);

    return (
        <>
            {
                user.role === "hirer" ?
                <HirersOffersPage /> :
                <UsersOffersPage />
            }
        </>
    )
};

export default Offers;
