"use client";
import { useState, useEffect } from 'react';

export default function page(){
    const [data, setData] = useState(null);
    const fetchData = async () => {
        const response = await fetch('/api/ai_api/chatbot');
        const data = await response.json();
        console.log(data);
        setData(data);
      };
      useEffect(() => {
        fetchData();
      }, []);
    
    return(
        <div>
            Hi
        </div>
    );
}