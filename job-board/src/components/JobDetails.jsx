import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import faker from 'faker';
import Avatar from '@mui/material/Avatar';
import '../styles/JobDetails.css';
import '../index.css';

const JobDetails = (props) => {
    const { user } = props;
    const { jobId, isFavorite } = useParams();

    const [job, setJob] = useState({});

    let defaultColor = "grey";

    if (isFavorite === "1") {
        defaultColor = "pink";
    }

    const [favColor, setFavColor] = useState(defaultColor);

    function findJobDetails() {
        if (jobId) {
            axios.get(`/api/job/jobSearch/${jobId}`).then((response) => setJob(response.data[0])).catch((error) => console.log(error));
        }
    }

    useEffect(findJobDetails, [jobId]);
    
    const navigate = useNavigate();

    const handleDeleteOnClick = () => {

        const opt = {
            method: "DELETE",
            url: "/api/job/delete",
            params: {
                id: jobId
            },
            headers: { "content-type": "application/json" },
        };

        axios(opt)
            .then(response => { 
                if (response.status === 200) {
                    navigate(-1);
                }
            })
            .catch(error => console.log("Delete job failed: ", error.message));
    }

    const handleFavoriteOnClick = () => {
        if (!user) {
            navigate("/login");
        }

        const opt = {
            method: "PUT",
            url: "/api/user/addFavoriteJob",
            params: {
                id: jobId
            },
            headers: { "content-type": "application/json" },
        };

        axios(opt)
            .then(response => { 
                if (response.status === 200) {
                    if (response.data === "added") {
                        console.log("Successfully add to favorite: ", response);
                        setFavColor("pink");
                    } else if (response.data === "removed") {
                        console.log("Successfully deleted from favorite: ", response);
                        setFavColor("grey");
                    }
                }
            })
            .catch(error => console.log("Add to favorite failed: ", error.message));
    }

    const jobComponent = 
        job 
            ? 
        <div className='jobContainer'>
            <div className="titleBox">
                <div className="avatar">
                    <Avatar alt="avatar" src={faker.image.animals()} />
                </div>
                <h2 className="jobDetail">Job details</h2>
                <div className="favIcon" style={{color: favColor}}><FavoriteIcon onClick={handleFavoriteOnClick}/></div>
            </div>
            
            <div>
                <div className='jobDetail'>
                    <h3>{job.title}</h3>
                    Posted Date: {new Date(job.postingDate).toDateString()}
                </div>
                <div className='jobDetail'> 
                    <h4>{job.companyName}</h4>
                    {job.location}
                </div>
                <div className='jobDetail'>
                    <h4>Description: </h4>
                    {job.description}
                </div>
                <div className='jobDetail'>
                    <h4>Employer Email Contact: </h4>
                    <a href={`mailto:${job.employerEmailContact}`}>Contact Us</a>
                </div>
                <div className='jobDetail'>
                    {job.companyWebsite ? <h4>Company Website: </h4> : ""}
                    <div>{job.companyWebsite ? job.companyWebsite : ""}</div>
                </div>
                <div>
                        {
                            user === job.creator 
                                ?
                            <div className='iconBox'>
                                <div className='otherIcons'><Link to="/updateJob" state={job}><EditIcon/></Link></div>
                                <DeleteIcon className='otherIcons' onClick={handleDeleteOnClick}/>
                            </div>
                                :
                            null
                        }
                </div>
            </div>
            
        </div>
            :
        <div className='jobDetail'> No Job Found </div>;
    return (
        <div class="content">
            <div>{jobComponent}</div>
            <button class="button" onClick={() => navigate(-1)}>Back</button>
        </div>
        
    )
}

export default JobDetails;