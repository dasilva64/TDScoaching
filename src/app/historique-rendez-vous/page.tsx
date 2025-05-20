import NoScript from "../components/noscript/NoScript";
import AllMeetings from "./components/AllMeetings";
import styles from './page.module.scss'

export const metadata = {
    title: "Historique de mes rendez-vous - tdscoaching",
    description: "Historique de mes rendez-vous sur le site tdscoaching.fr",
    icons: {
      icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
    },
    author: "Thierry Da Silva",
    robots: "noindex, nofollow",
    other: {
      "google-site-verification": "F921bU_1dl5iiaUL_B8FTJjSxG5GYYTBOyaGEHp964Q",
    },
  };

const Page = () => {
    return (
        <>
        <NoScript />
        <main className={styles.allMeetings}>
        <h1 className={`${styles.allMeetings__h1}`}>Historique de mes rendez-vous</h1>
        <div className={styles.allMeetings__container}>
          <div className={styles.allMeetings__article}>
            <div>
                <AllMeetings />
            </div>
          </div>
        </div>
      </main>
         </>
    )
}
export default Page;