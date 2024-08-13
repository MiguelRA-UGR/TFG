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
export const deleteUser = (id) => API.delete(`/api/users/${id}`);
export const makeAdmin = (id) => API.put(`/api/users/makeadmin/${id}`);
export const warnUser = (id) => API.put(`/api/users/warnuser/${id}`);

export const deleteReview = (id) => API.delete(`/api/reviews/${id}`);

export const uploadPhoto = (photoData) => API.post('/api/photos/photo', photoData);
export const deletePhoto = (id) => API.delete(`/api/photos/${id}`);
export const likePhoto = (likeData) => API.put(`/api/photos/like`, likeData);
export const dislikePhoto = (likeData) => API.put(`/api/photos/dislike`, likeData);

export const deleteRequest = (id) => API.delete(`/api/requests/${id}`);
export const approveRequest = (id) => API.delete(`/api/requests/${id}`);
export const createRequest = (requestData) => API.post('/api/requests/request', requestData);

export const deleteForum = (id) => API.delete(`/api/forums/${id}`);
export const createForum = (forumData) => API.post(`/api/forums`, forumData);
export const updateForum = (id, forumData) => API.put(`/api/forums/${id}`, forumData);

export const deleteDestination = (id) => API.delete(`/api/dests/${id}`);
export const createDestination = (destinationData) => API.post(`/api/dests`, destinationData);
export const updateDestination = (id, destinationData) => API.put(`/api/dests/${id}`, destinationData);

export const deleteThread = (id) => API.delete(`/api/threads/${id}`);
export const createThread = (threadData) => API.post(`/api/threads`, threadData);
export const updateThread = (id, threadData) => API.put(`/api/threads/${id}`, threadData);

export const deleteReply = (id) => API.delete(`/api/replies/${id}`);
export const createReply = (replyData) => API.post(`/api/replies`, replyData);
export const updateReply = (id, replyData) => API.put(`/api/replies/${id}`, replyData);

export const deleteNotification = (id) => API.delete(`/api/notifications/${id}`);
export const deleteNotificationsByUser = (userId) => API.delete(`/api/notifications/user/${userId}`);
export const deleteAllNotifications = () => API.delete('/api/notifications');

