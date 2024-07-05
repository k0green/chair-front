import axios from 'axios';
import {toast} from "react-toastify";
import Cookies from "js-cookie";

export const BASE_URL = 'http://chairback.somee.com';
const token = Cookies.get('token');

export const getPopularServiceTypes = async (filterModel) => {
    try {
        const response = await axios.post(`${BASE_URL}/service-types/popular`, filterModel);
        const data = response.data.map(type => ({
            id: type.id,
            name: type.name,
            icon: type.icon
        }));
        return data;
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
        throw error; // Пробрасываете ошибку для дальнейшей обработки
    }
};

export const getAllServiceTypes = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/service-types/get-all`, {});
        return response.data;
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const getServiceTypeById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/service-types/get-by-id/${id}`);
        const data = {
            id: response.data.id,
            name: response.data.name,
            icon: response.data.icon
        };
        return data;
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const getServiceCardByTypeId = async (id, filter) => {
    try {
        const response = await axios.post(`${BASE_URL}/executor-service/type/${id}`, filter);

        const servicesData = response.data.values.map(serviceType => ({
            id: serviceType.id,
            name: serviceType.serviceTypeName,
            masters: serviceType.services.map(service => ({
                id: service.id,
                name: service.executorName,
                description: service.description,
                price: service.price,
                availableSlots: service.availableSlots,
                duration: formatTime(service.duration),
                rating: service.rating,
                address: service.place.address,
                place: {
                    address: service.place.address,
                    position: {
                        lat: service.place.position.lat,
                        lng: service.place.position.lng,
                    }
                },
                executorId: service.executorId,
                photos: service.photos.length > 0 ? service.photos.map(photo => ({
                    id: photo.id,
                    url: photo.url,
                })) : [{
                    id: 'default',
                    url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn',
                }],
            })),
        }));

        return {
            services: servicesData,
            totalCount: response.data.totalCount,
        };
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const getServiceCardsAll = async (requestBody) => {
    try {
        const response = await axios.post(`${BASE_URL}/executor-service/all`, requestBody);
        return response.data.map(serviceType => ({
            id: serviceType.id,
            name: serviceType.serviceTypeName,
            masters: serviceType.services.map(service => ({
                id: service.id,
                name: service.executorName,
                description: service.description,
                price: service.price,
                availableSlots: service.availableSlots,
                duration: formatTime(service.duration),
                rating: service.rating,
                place: {
                    address: service.place.address,
                    position: {
                        lat: service.place.position.lat,
                        lng: service.place.position.lng,
                    }
                },
                executorId: service.executorId,
                photos: service.photos.length > 0 ? service.photos.map(photo => ({
                    id: photo.id,
                    url: photo.url,
                })) : [{
                    id: 'default',
                    url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn', // Fallback URL
                }],
            })),
        }));
    } catch (error) {
        console.error('Error fetching service cards:', error);
        throw error;
    }
};

export const getOptimalServiceCard = async (requestBody) => {
    try {
        const response = await axios.post(`${BASE_URL}/executor-service/optimize-service`, requestBody);
        return {
            id: response.data.id,
            name: response.data.executorName,
            description: response.data.description,
            price: response.data.price,
            availableSlots: response.data.availableSlots,
            duration: formatTime(response.data.duration),
            rating: response.data.rating,
            address: response.data.place.address,
            place: {
                address: response.data.place.address,
                position: {
                    lat: response.data.place.position.lat,
                    lng: response.data.place.position.lng,
                }
            },
            executorId: response.data.executorId,
            photos: response.data.photos.length > 0 ? response.data.photos.map(photo => ({
                id: photo.id,
                url: photo.url,
            })) : [{
                id: 'default',
                url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn', // Здесь добавлен запасной URL
            }],
        };
    } catch (error) {
        console.error('Error fetching service cards:', error);
        throw error;
    }
};

export const getProfileById = async (id, navigate) => {
    try {
        const token = Cookies.get('token');
        if(!token)
            navigate("/login");
        else {
            console.log(id);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            if(!id)
            {
                const response = await axios.get(`${BASE_URL}/executor-profile/get`)
                    var userData= {
                            id: response.data.id,
                            name: response.data.name,
                            imageUrl: response.data.imageUrl,
                            description: response.data.description,
                            userId: response.data.userId,
                            contacts: response.data.contacts.map(contact => ({
                                id: contact.id,
                                name: contact.name,
                                type: contact.type,
                                executorProfileId: contact.executorProfileId,
                            })),
                            services: response.data.services.map(service => ({
                                id: service.id,
                                executorId: service.executorId,
                                name: service.executorName || 'Unknown Master',
                                description: service.description,
                                price: service.price,
                                availableSlots: service.availableSlots,
                                duration: formatTime(service.duration),
                                rating: service.rating,
                                address: service.place.address,
                                place: {
                                    address: service.place.address,
                                    position: {
                                        lat: service.place.position.lat,
                                        lng: service.place.position.lng,
                                    }
                                },
                                photos: service.photos.length > 0 ? service.photos.map(photo => ({
                                    id: photo.id,
                                    url: photo.url,
                                })) : [{
                                    id: 'default',
                                    url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn', // Здесь добавлен запасной URL
                                }],
                            })),
                        };
                return {
                    services: userData.services,
                    userData: userData,
                    contacts: userData.contacts
                }
            }
            else {
                const response = await axios.get(`${BASE_URL}/executor-profile/get-by-id/`+id)
                const userData= {
                            id: response.data.id,
                            name: response.data.name,
                            imageUrl: response.data.imageUrl,
                            description: response.data.description,
                            userId: response.data.userId,
                            contacts: response.data.contacts.map(contact => ({
                                id: contact.id,
                                name: contact.name,
                                type: contact.type,
                                executorProfileId: contact.executorProfileId,
                            })),
                            services: response.data.services.map(service => ({
                                id: service.id,
                                name: service.executorName || 'Unknown Master',
                                description: service.description,
                                price: service.price,
                                availableSlots: service.availableSlots,
                                duration: formatTime(service.duration),
                                rating: service.rating,
                                address: service.place.address,
                                place: {
                                    address: service.place.address,
                                    position: {
                                        lat: service.place.position.lat,
                                        lng: service.place.position.lng,
                                    }
                                },
                                executorId: service.executorId,
                            })),
                        };

                return {
                    services: userData.services,
                    userData: userData,
                    contacts: userData.contacts
                }
            }
        };
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        if (error.response) {
            if (error.response.status === 401) {
                navigate("/login");
            } else {
                console.error(`Ошибка от сервера: ${error.response.status}`);
            }
        } else if (error.request) {
            console.error('Ответ не был получен. Возможно, проблемы с сетью.');
        } else {
            console.error('Произошла ошибка при настройке запроса:', error.message);
        }
    }
};

export const getExecutorServiceById = async (id, navigate) => {
    try {
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${BASE_URL}/executor-service/get-by-id/${id}`);
            const formattedData = {
                id: response.data.id,
                name: response.data.executorName || 'Unknown Master',
                serviceTypeId: response.data.serviceTypeId,
                serviceTypeName: response.data.serviceTypeName,
                executorId: response.data.executorId,
                executorName: response.data.executorName,
                description: response.data.description,
                rating: response.data.rating,
                price: response.data.price,
                availableSlots: response.data.availableSlots,
                duration: response.data.duration,
                address: response.data.place.address,
                place: {
                    address: response.data.place.address,
                    position: {
                        lat: response.data.place.position.lat,
                        lng: response.data.place.position.lng,
                    }
                },
                photos: response.data.photos.length > 0 ? response.data.photos.map(photo => ({
                    id: photo.id,
                    url: photo.url,
                })) : [{
                    id: 'default',
                    url: 'https://th.bing.com/th/id/OIG3.CxBiSiz2vDBmebZOicmr?pid=ImgGn', // Здесь добавлен запасной URL
                }],
            };
            return formattedData;
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const updateProfile = async (editedUser, editedContacts, navigate) => {
    try {
        if(!token)
            navigate("/login");
        else {
            editedUser.contacts = editedContacts;
            editedUser.services = [];
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await axios.put(`${BASE_URL}/executor-profile/update`, editedUser, {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error:', error);
    }
};

export const updateServiceCard = async (updatedServiceData, navigate) => {
    try {
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await axios.put(`${BASE_URL}/executor-service/update`, updatedServiceData);
            navigate(`/profile`);
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error:', error);
    }
};

export const addServiceCard = async (updatedServiceData, navigate) => {
    try {
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await axios.post(`${BASE_URL}/executor-service/add`, updatedServiceData);
            navigate(`/profile`);
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error:', error);
    }
};

export const deleteServiceCard = async (id, navigate) => {
    try {
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await axios.post(`${BASE_URL}/executor-service/remove/${id}`);
            navigate(`/profile`);
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error:', error);
    }
};

export const accountExit = async (id, navigate) => {
    try {
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await axios.post(`${BASE_URL}//account/logout`);
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error:', error);
    }
};

export const getReviewsByServiceCardId = async (id, navigate) => {
    try {
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${BASE_URL}/review/${id}`);
            return response.data.map(review => ({
                id: review.id,
                executorServiceId: review.executorServiceId,
                userId: review.userId,
                userName: review.userName,
                text: review.text,
                stars: review.stars,
                createDate: review.createDate
            }));
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error:', error);
    }
};

export const updateReview = async (updatedReviewData, navigate) => {
    try {
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await axios.put(`${BASE_URL}/review/update`, updatedReviewData);
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error:', error);
    }
};

export const addReview = async (updatedReviewData, navigate) => {
    try {
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await axios.post(`${BASE_URL}/review/add`, updatedReviewData);
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error:', error);
    }
};

export const getAllChats = async (navigate, userId) => {
    try {
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${BASE_URL}/chat/all`)
            return  response.data.map(item => ({
                id: item.id,
                recipientName: item.recipientName,
                recipientProfileId: item.recipientProfileId,
                recipientProfileImg: item.recipientProfileImg,
                unreadMessagesAmount: item.unreadMessagesAmount,
                messages: item.messages.map(message => ({
                    text: message.text,
                    createdDate: message.createdDate,
                    isDeleted: message.isDeleted,
                    isEdited: message.isEdited,
                    isRead: message.isRead,
                    chatId: message.chatId,
                    replyId: message.replyId,
                    recipientId: message.recipientId,
                    senderId: message.senderId,
                    isMine: message.senderId === userId,
                })),
            }));
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const getUserInfoForEdit = async (navigate, userId) => {
    try {
        if(!token)
            navigate("/login");
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${BASE_URL}/account/user-info/edit/${userId}`);
            return  {
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
            };
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const getEditUserInfo = async (navigate, data) => {
    try {
        if(!token)
            navigate("/login");
        else {
            const result = await axios.post(`${BASE_URL}/account/user-info/edit`, data);
            Cookies.set('token', result.data, { expires: 1 });
            const response = await axios.get(`${BASE_URL}/account/user-info?email=`+data.Email);
            return {
                id: response.data.id,
                name: response.data.name,
                email: response.data.email,
                role: response.data.role
            };
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const login = async (navigate, data) => {
    try {
        const result = await axios.post(`${BASE_URL}/account/login`, data);
        Cookies.set('token', result.data, { expires: 1 });
        const response = await axios.get(`${BASE_URL}/account/user-info?email=`+data.Email);
        return {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role
        };
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const registerQuery = async (navigate, data) => {
    try {
        const result = await axios.post(`${BASE_URL}/account/register`, data);
        Cookies.set('token', result.data, { expires: 1 });
        const response = await axios.get(`${BASE_URL}/account/user-info?email=`+data.Email);
        return {
            id: response.data.id,
            name: response.data.name,
            email: response.data.email,
            role: response.data.role
        };
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const getOrders = async (navigate) => {
    try {
        if(!token)
            navigate("/login");
        else {
            const userRole = localStorage.getItem('userRole');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const fetchData = async (url) => {
                const response = await axios.get(url, { withCredentials: true });
                try{
                    const mapData = (data) => data.map(item => ({
                        executorServiceId: item.executorServiceId,
                        executorProfileName: item.executorProfileName,
                        executorName: item.executorName,
                        clientId: item.clientId,
                        clientName: item.clientName,
                        starDate: item.starDate,
                        day: item.day,
                        month: item.month,
                        duration: item.duration,
                        executorComment: item.executorComment,
                        clientComment: item.clientComment,
                        executorApprove: item.executorApprove,
                        clientApprove: item.clientApprove,
                        price: item.price,
                        serviceTypeName: item.serviceTypeName,
                        id: item.id
                    }));
                    return {
                        byMaster: mapData(userRole === "executor" ? response.data.byMaster : response.data.byClient),
                        byClient: mapData(userRole === "executor" ? response.data.byClient : response.data.byMaster),
                        forToday: mapData(response.data.forToday),
                        forWeek: mapData(response.data.forWeek)
                    };
                }
                catch (error){
                    if (!toast.isActive(error.message)) {
                        toast.error(error.message, {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            toastId: error.message,
                        });
                    }
                }
            }

            if (userRole === "executor") {
                return await fetchData(`${BASE_URL}/order/unconfirmed/executor`);
            } else {
                return await fetchData(`${BASE_URL}/order/unconfirmed/client`);
            }
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const approveOrder = async (navigate, id, isExecutor) => {
    try {
        if(!token)
            navigate("/login");
        else {
            const token = Cookies.get('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await axios.get(`${BASE_URL}/order/approve/${id}?isExecutor=${isExecutor}`);
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const uploadMinioPhoto = async (navigate, formData) => {
    try {
        if(!token)
            navigate("/login");
        else {
            const token = Cookies.get('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return await axios.post(`${BASE_URL}/minio/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const addMessage = async (navigate, messageData) => {
    try {
        if(!token)
            navigate("/login");
        else {
            const token = Cookies.get('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return await axios.post(`${BASE_URL}/message/add`, messageData)
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const markAsReadMessage = async (navigate, id) => {
    try {
        if(!token)
            navigate("/login");
        else {
            const token = Cookies.get('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return await axios.get(`${BASE_URL}/message/mark-as-read/`+id)
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const getChatById = async (navigate, id) => {
    try {
        if(!token)
            navigate("/login");
        else {
            const token = Cookies.get('token');
            const userId = localStorage.getItem('userId');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${BASE_URL}/chat/`+id)
            return {
                id: response.data.id,
                recipientId: response.data.recipientId,
                senderId: response.data.senderId,
                recipientName: response.data.recipientName,
                recipientProfileId: response.data.recipientProfileId,
                recipientProfileImg: response.data.recipientProfileImg,
                unreadMessagesAmount: response.data.unreadMessagesAmount,
                messages: response.data.messages.map(message => ({
                    text: message.text,
                    createdDate: message.createdDate,
                    isDeleted: message.isDeleted,
                    isEdited: message.isEdited,
                    isRead: message.isRead,
                    chatId: message.chatId,
                    replyId: message.replyId,
                    recipientId: message.recipientId,
                    senderId: message.senderId,
                    isMine: message.senderId === userId,
                    id: message.id,
                    type: message.type,
                })),
            };
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const deleteMessage = async (navigate, selectedMessageId) => {
    try {
        if(!token)
            navigate("/login");
        else {
            await axios.delete(`${BASE_URL}/message/remove/${selectedMessageId}`)
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const editMessageText = async (navigate, selectedMessageId, newMessage) => {
    try {
        if(!token)
            navigate("/login");
        else {
            await axios.post(`${BASE_URL}/message/edit-text`, { id: selectedMessageId, name: newMessage })
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const enrollCalendar = async (navigate, id) => {
    try {
        if(!token)
            navigate("/login");
        else {
            await axios.post(`${BASE_URL}/order/enroll/${id}`);
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const getOrdersByRole = async (navigate, full, currentMonth, id) => {
    try {
        if(!token)
            navigate("/login");
        else {
            const userRole = localStorage.getItem('userRole');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            const fetchData = async (url) => {
                const response = await axios.get(url, { withCredentials: true });
                try{
                    const serverData = response.data.map(item => ({
                        executorServiceId: item.executorServiceId,
                        executorProfileName: item.executorProfileName,
                        executorName: item.executorName,
                        clientId: item.clientId,
                        clientName: item.clientName,
                        starDate: item.starDate,
                        day: item.day,
                        month: item.month,
                        duration: item.duration,
                        executorComment: item.executorComment,
                        clientComment: item.clientComment,
                        executorApprove: item.executorApprove,
                        clientApprove: item.clientApprove,
                        price: item.price,
                        serviceTypeName: item.serviceTypeName,
                        id: item.id
                    }));
                    return serverData;
                }
                catch (error){
                    if (!toast.isActive(error.message)) {
                        toast.error(error.message, {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            toastId: error.message,
                        });
                    }
                }
            }

            if (full) {
                if(userRole === 'executor')
                    return await fetchData(`${BASE_URL}/order/executor?month=` + (currentMonth.getMonth() + 1) + '&year=' + currentMonth.getFullYear());
                else
                    return await fetchData(`${BASE_URL}/order/client?month=` + (currentMonth.getMonth() + 1) + '&year=' + currentMonth.getFullYear());
            } else {
                return await fetchData(`${BASE_URL}/order/` + id + '?month=' + (currentMonth.getMonth() + 1) + '&year=' + currentMonth.getFullYear());
            }
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const updateOrder = async (navigate, updatedAppointment) => {
    try {
        if(!token)
            navigate("/login");
        else {
            console.log(updatedAppointment.duration);
            await axios.put(`${BASE_URL}/order/update`, {
                id: updatedAppointment.id,
                executorServiceId: updatedAppointment.executorServiceId,
                clientId: updatedAppointment.clientId,
                starDate: updatedAppointment.starDate,
                duration: reverseFormatTime(updatedAppointment.duration, updatedAppointment.starDate),
                executorComment: updatedAppointment.executorComment,
                clientComment: updatedAppointment.clientComment,
                executorApprove: updatedAppointment.executorApprove,
                clientApprove: updatedAppointment.clientApprove,
                price: updatedAppointment.price
            });
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const deleteOrder = async (navigate, id) => {
    try {
        if(!token)
            navigate("/login");
        else {
            await axios.delete(`${BASE_URL}/order/remove/${id}`);
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const addOrder = async (navigate, newAppointments) => {
    try {
        if(!token)
            navigate("/login");
        else {
            await axios.post(`${BASE_URL}/order/add`, newAppointments);
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

export const getExecutorServicesLookup = async (navigate) => {
    try {
        if(!token)
            navigate("/login");
        else {
            const response = await axios.get(`${BASE_URL}/executor-service/executor-services/lookup`, { withCredentials: true });
            return response.data.map(item => ({
                id: item.id,
                name: item.name
            }));
        }
    } catch (error) {
        if (!toast.isActive(error.message)) {
            toast.error(error.message, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                toastId: error.message,
            });
        }
        console.error('Error fetching data:', error);
    }
};

const formatTime = (rawTime) => {
    const date = new Date(rawTime);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

const reverseFormatTime = (time, date) => {
    const [hours, minutes] = time.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours + 3, minutes, 0, 0);
    return newDate.toISOString();
};