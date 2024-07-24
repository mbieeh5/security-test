import styles from "./page.module.css";
import InputData from "./component/input/inputData";
import { LoginProvider } from "./context/loginContext";



export default function Home() {


  return (
    <main className={styles.main}>
      <LoginProvider>
        <InputData />
      </LoginProvider>
    </main>
  );
}