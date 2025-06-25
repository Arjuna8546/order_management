import axios from 'axios'

export const addOrder= (values) =>axios.post('https://ordermanagement.urbanaegis.shop/api/addOrder/',values)