"use client";

import { getDatabase, ref, push } from "firebase/database";
import { app, auth } from "../../../../firebase";
import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import styles from './inputData.module.css';
import { useLogin } from "@/app/context/loginContext";
import DataUsers from "../mapData/dataUsers";

export default function InputData() {
  const DB = getDatabase(app);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const {isLogin, login, logout} = useLogin();
  const [isVisible, setIsVisible] = useState<Boolean>(false);
  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const token = await recaptchaRef.current?.executeAsync();
    recaptchaRef.current?.reset();

    if (!token) {
      console.error("reCAPTCHA token is null.");
      return;
    }

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const nomorHp = formData.get("npHp") as string;
    const dataForPush = {
        username,
        email,
        nomorHp,
    };

    const verifyResponse = await fetch("/api/verify-recaptcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const verificationResult = await verifyResponse.json();

    if (verificationResult.success) {
      const dbRef = ref(DB, 'users');
      push(dbRef, dataForPush)
        .then(() => {
          console.log("Data successfully pushed to Firebase!");
          alert('data Berhasil di upload');
          form.reset();
        })
        .catch((error) => {
          console.error("Error pushing data to Firebase: ", error);
        });
      } else {
        console.error("reCAPTCHA verification failed.");
      }
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
  
    login({email, password});
  }


  return (
    <>
    {isLogin ? (
      <>
      {(auth.currentUser?.email)?.split('@')[0]}
      <div className={styles.wrapper}>
        <div className={styles.card}>
            <form onSubmit={handleOnSubmit} className={styles.form}>
              <label className={styles.label}>
                UserName:<input placeholder="masukan username" name="username" type="text" className={styles.input} required />
              </label>
              <label className={styles.label}>
                Email:<input placeholder="masukan email" name="email" type="email" className={styles.input} required />
              </label>
              <label className={styles.label}>
                Nomor HP:<input placeholder="masukan no hp" name="npHp" type="phonenumber" className={styles.input} required />
              </label>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                size="invisible"
                />
              <button type="submit" className={styles.button}>Submit</button>
              <button className={styles.button} onClick={() => logout()}>Logout</button>
            </form>
        </div>
      </div>
        <div className={styles.form}>
          <button className={styles.button} onClick={() => setIsVisible(true)}>Tampilkan Data</button>
          <button className={styles.button} onClick={() => setIsVisible(false)}>Sembunyikan Data</button>
          <div className={styles.wrapper}>
            {isVisible && <DataUsers />}
          </div>
        </div>
        
      </>
    ) : (
      <>
          <form onSubmit={handleLogin} className={styles.form}>
              <label className={styles.label}>
                Email:<input placeholder="masukan email" name="email" type="email" className={styles.input} required />
              </label>
              <label className={styles.label}>
                UserName:<input placeholder="masukan password" name="password" type="password" className={styles.input} required />
              </label>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                size="invisible"
                />
              <button type="submit" className={styles.button}>Submit</button>
            </form>
      </>
    )}
    </>
  );
}
