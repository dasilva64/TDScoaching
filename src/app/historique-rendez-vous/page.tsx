import NoScript from "../components/noscript/NoScript";
import { ProviderHistoriqueRendezVous } from "../redux/provider/providerHistoriqueRendezVous";
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
        <ProviderHistoriqueRendezVous><AllMeetings /></ProviderHistoriqueRendezVous>
       
         </>
    )
}
export default Page;