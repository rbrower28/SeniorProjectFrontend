const prod = {
	backendUrl: 'https://seniorprojectbackend.onrender.com/',
};

const dev = {
	backendUrl: 'http://localhost:8080/',
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;