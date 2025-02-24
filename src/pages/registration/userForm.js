import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import "./styles.css";
import { MdEdit } from "react-icons/md";
import { createContractInstance, sendFile } from "../../creators";
import { AppContext } from "../../context";
import { useNavigate } from "react-router-dom";

const UserRegistration = () => {

    const navigate = useNavigate();
    const [pfpFile, setPfpFile] = useState({});
    const { contract } = useContext(AppContext);
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState({});

    const handlePfpFileChange = useCallback((e) => {
        if(pfpFile.name) URL.revokeObjectURL(pfpFile);
        const file = e.target.files[0];
        if(!file?.size) return;
        setPfpFile(file);
    }, [pfpFile.name]);

    const getPfpFileUrl = useMemo(() => {
        if(pfpFile.name) return URL.createObjectURL(pfpFile);
    }, [pfpFile.name]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            let [secure_url, public_id, filename, filesize, file_type] = ['', '', '', '', ''];
            let file_url = "", file_size = 0;
            if(pfpFile?.size) {
                const formData = new FormData();
                formData.append('file', pfpFile);
                formData.append('filename', pfpFile.name);
                formData.append('file_type', 'image');
        
                const { data } = await sendFile(formData);
                secure_url = data.data.secure_url;
                public_id = data.data.public_id;
                filename = pfpFile.name;
                filesize = data.data.filesize
                file_type = data.data.file_type;
            }

            if(file.size) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('filename', file.name);
                formData.append('file_type', 'doc');
        
                const { data } = await sendFile(formData);
                file_url = data.data.secure_url;
                file_size = data.data.filesize;
            }

            const d_ = Object.keys(data).map(key => `${key}=${data[key]}`).join("%x2");
            const data_ = d_ + `%x2img=${secure_url}%x2address=${contract.address}%x2role=user%x2cv=${file_url}%x2file_size=${file_size}`;
            const contractInstance = await createContractInstance(contract.signer);
            const tx = await contractInstance.createUser(contract.address, data_);
            await tx.wait();
            setLoading(false);
            navigate(`/app`);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="Registration">
            <div className="container">
                <h2>Client Registration</h2>
                <form id="registrationForm" onSubmit={handleSubmit}>
                    <div className="form-group pic">
                        <label for="name">Profile photo</label>
                        <div className="cdff-image">
                            {pfpFile.name && <img src={getPfpFileUrl} alt="" /> }
                            {!pfpFile.name && <div className="placeholder-img"></div> }
                            <label htmlFor="g-pfp-file" className={`cdfa-abs ${!pfpFile.name && "show"}`}>
                                <MdEdit className="cdfl-icon" />
                            </label>
                            <input type="file" id="g-pfp-file" onChange={handlePfpFileChange} accept="image/*" />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" placeholder="Enter your full name" name="name" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" placeholder="Enter valid email account" 
                        name="email" onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="developer-type">Choose Your Specialization</label>
                        <select id="developer-type" name="specialization" onChange={handleChange}>
                            <option>Frontend Developer</option>
                            <option>Backend Developer</option>
                            <option>Full Stack Developer</option>
                            <option>Mobile App Developer</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label for="developer-type">years of experience</label>
                        <select id="developer-type" name="years" onChange={handleChange}>
                            <option>{`< 1`}</option>
                            <option>1</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            <option>5+</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Recent Resume</label>
                        <input type="file" id="resume" required onChange={handleFileChange}/>
                    </div>
                    <div className="form-group">
                        <label>Language</label>
                        <input placeholder="E.g English: Fluent" name="language" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Working rate</label>
                        <input placeholder="E.g 10 Hours per week" name="workingRate" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Address location</label>
                        <input placeholder="Enter your location" name="location" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Socials</label>
                        <input placeholder="Enter one social media account link"
                         name="social" onChange={handleChange} />
                    </div>
                    
                    <button type="submit" className="btn">{loading ? "Registering..." : "Register"}</button>
                </form>
            </div>
        </div>
    )
};

export default UserRegistration;
