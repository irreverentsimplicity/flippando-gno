import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Menu.module.css';

export default function Menu() {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={`${styles.menu} ${expanded ? styles.expanded : ''}`} onClick={() => setExpanded(!expanded)}>
            <Link href="/"><a className={styles.menuItem}><i className="icon1"></i> Home</a></Link>
            <Link href="/flip"><a className={styles.menuItem}><i className="icon2"></i> Flip</a></Link>
            <Link href="/my-flips"><a className={styles.menuItem}><i className="icon3"></i> My Flips</a></Link>
            <Link href="/playground"><a className={styles.menuItem}><i className="icon4"></i>  Playground</a></Link>
            <Link href="/my-art"><a className={styles.menuItem}><i className="icon4"></i> My Art</a></Link>
        </div>
    );
}
