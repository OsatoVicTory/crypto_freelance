import { BiSolidError } from "react-icons/bi";
import  "./styles.css";

const ErrorDiv = ({ retry }) => {

    return (
        <div className="Error-div">
            <div className='ed-iocn-div'>
                <BiSolidError className='ed-icon' />
            </div>
            <p className='ed-h3 txt-white'>
                Sorry an error occurred. Please retry.
            </p>
            <button className={`ep-btn txt-white ${'pointer'}`} onClick={retry}>
                Retry
            </button>
        </div>
    )
};

export default ErrorDiv;
