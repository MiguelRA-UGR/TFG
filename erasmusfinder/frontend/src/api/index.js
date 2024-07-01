import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

export const logIn = (formData) => API.post('/api/users/login', formData);
export const signUp = (formData) => API.post('/api/users/signup', formData);
export const contact = (formData) => API.post('/api/users/contact', formData);
export const breakContact = (dataContact) => API.post('/api/users/breakcontact', dataContact);
export const sendRequest = (dataContact) => API.post('/api/users/sendrequest', dataContact);
export const createReview = (reviewData) => API.post('/api/reviews/review', reviewData);
export const deleteReview = (reviewData) => API.post('/api/reviews/deletereview', reviewData);