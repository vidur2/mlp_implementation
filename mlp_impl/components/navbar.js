import styles from "../styles/Home.module.css"

export default function Navbar(){
    return(
        <div className={styles.navbar}>
          <a href="/predict">Predict</a>
          <a href="/">Home</a>
          <a href="/about">About</a>
        </div>
    )
}