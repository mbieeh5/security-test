"use client";

import { get, getDatabase, ref } from "firebase/database";
import React, { useEffect, useState } from "react";

interface DataUsers {
  email: string;
  nomorHp: string;
  username: string;
}

export default function DataUsers() {
  const [dataUsers, setDataUsers] = useState<DataUsers[]>([]);  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const DB = getDatabase();
        const userRef = ref(DB, 'users');
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const datas = snapshot.val() || {};
          const array: DataUsers[] = Object.values(datas);
          setDataUsers(array);
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {dataUsers.length === 0 ? (
        <p>No data available</p>
      ) : (
        dataUsers.map((user, index) => (
          <div key={index}>
            <p>{index+1}</p>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Nomor HP: {user.nomorHp}</p>
          <br/>
          </div>
        ))
      )}
    </div>
  );
}
