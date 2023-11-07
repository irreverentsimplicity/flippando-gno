import Link from 'next/link';
import styles from "../styles/Home.module.css";

export default function Footer() {

    return (
        <footer className={styles.footer}>
          <div>made with &#x2764;&#xFE0F; by <Link href="https://github.com/irreverentsimplicity">@irreverentsimplicity</Link></div>
          <div>powered by <Link href="https://gno.land">Gno.land</Link></div>
        </footer>
    );
}
