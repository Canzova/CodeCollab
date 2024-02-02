// Creating an instance of socket client

// ES module syntax
import {io} from 'socket.io-client';

export const initSocket = async ()=>{
    const options = {
        'force new connection': true,
        reconnectionAttempt: 'Infinity', // Corrected property name
        timeout: 10000,
        transports: ['websocket'], // Corrected property name
    };
    return io(process.env.REACT_APP_BACKEND_URL, options);
}
