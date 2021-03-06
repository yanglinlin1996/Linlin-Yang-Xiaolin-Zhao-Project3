import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';
import '../styles/ResultCards.css';
import '../index.css';

const SearchResults = () => {
    const { searchWord } = useParams();
    const [jobResults, setJobResults] = useState([]);
    const navigate = useNavigate();
    const [onSearchPage, setOnSearchPage] = useState(false);
    
    function findSearchResults() {
      if (searchWord) {
        axios.get(`/api/job/jobSearchByTitle/${searchWord}` )
          .then(response => {
            setJobResults(response.data);
            setOnSearchPage(true);
          })
          .catch(error => console.log(error));
      }
    }

    const [favorites, setFavorites] = useState([]);
    const findAllFavorites = () => {
      axios.get("/api/user/getFavoriteJobsByUser").then(response => {setFavorites(response.data)}).catch(error => console.log(error));
    };
  
    useEffect(findAllFavorites, []);

    useEffect(findSearchResults, [searchWord, onSearchPage]);
    
    const jobCardsComponent = [];      

    if (jobResults) {
      for (let i = 0; i < jobResults.length; i++) {
        let isFavorite = 0;
        const job = jobResults[i];
        for (let fav of favorites) {
          if (job.id === fav.id) {
            isFavorite = 1;
            break;
          }
        }
        jobCardsComponent.push(
          <Link to={`/jobDetails/${job.id}/${isFavorite}`}>
            <Card sx={{ maxWidth: 345 }} className="card">
              <CardHeader 
                title={job.title}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {job.companyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job.location}
                </Typography>
              </CardContent>
            </Card>
          </Link>
        )
      }
    } 

    if (onSearchPage && jobResults.length === 0) {
      return (
        <div class="content">
          <div>
            <h2>"No Job Found"</h2>
          </div>
          <button class="button" onClick={() => navigate(-1)}>Back</button>
        </div>
      )
    }

    return (
      <div class="content">
        {jobCardsComponent}
        {jobResults.length ? <button class="button" onClick={() => navigate(-1)}>Back</button> : null}
      </div>
    )
}

export default SearchResults;