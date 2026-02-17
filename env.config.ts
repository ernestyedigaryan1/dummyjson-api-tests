require('dotenv').config();

export const env = {
    BASE_URL: 'https://dummyjson.com',
    ...process.env,
};
