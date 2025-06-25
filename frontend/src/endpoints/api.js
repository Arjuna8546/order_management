import axios from 'axios'

export const addOrder= (values) =>axios.post('https://order-management-snowy.vercel.app/api/addOrder/',values)