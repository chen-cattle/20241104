import Pdf from './_components/pdf';
import styles from "./page.module.css";




export default function Home() {

  return (
   <main className={styles.pdf}>
    <div className={styles.content}>
      <h1 className={styles.title}>Rotate PDF Pages</h1>
      <p>Simply click on a page to rotate it. You can then download your modified PDF.</p>
      <Pdf></Pdf>
    </div>
   </main>
  );
}