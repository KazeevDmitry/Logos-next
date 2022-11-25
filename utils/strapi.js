import axios from 'axios';

export function createStrapiAxios(strapiToken) {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API,
    headers: strapiToken && {
      Authorization: `Bearer ${strapiToken}`,
    }
  })
}

