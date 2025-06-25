import axios from 'axios'

export const addOrder= (values) =>axios.post('http://127.0.0.1:8000/api/addOrder/',values)