import { LoadingSpinner } from "./loading";
import "./styles.css";

const LoadingDiv = ({ width, height }) => {

    return (
        <div className="Loading-div">
            <LoadingSpinner width={width} height={height} />
        </div>
    )
};

export default LoadingDiv;
