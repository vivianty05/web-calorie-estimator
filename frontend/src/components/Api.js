import axios from 'axios';

// Create an instance of axios withe the base URL 
const api  = axios.create({
    baseURL: "https://localhost:8000"           // If the backend runs on another server, change to that IP address
});

