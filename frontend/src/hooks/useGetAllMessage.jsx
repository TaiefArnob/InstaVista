import { setMessages } from '@/redux/chatSlice';
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllMessage = (id) => {
  const {selectedUser}=useSelector(store=>store.auth)
  const API_URL = import.meta.env.VITE_API_BASE_URL;

  const dispatch=useDispatch()
  useEffect(()=>{
    const fetchAllMessage=async()=>{
      try{
        const res=await axios.get(`${API_URL}/message/all/${selectedUser?._id}`,{withCredentials:true})

        if(res.data.success){
         dispatch(setMessages(res.data.messages)) 
        }
      }catch(error){
        console.log(error);
      }
    }
    fetchAllMessage()
  },[selectedUser])
}

export default useGetAllMessage
