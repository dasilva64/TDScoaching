import Content from "./components/content/Content";

export const metadata = {
  title: "Mon profil - tdscoaching",
  description:
    "Mon profil sur le site tdscoaching.fr pour accéder à mes informations personnelles",
  icons: {
    icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
  },
  author: "Thierry Da Silva",
  robots: "noindex, nofollow",
  other: {
    "google-site-verification": "F921bU_1dl5iiaUL_B8FTJjSxG5GYYTBOyaGEHp964Q",
  },
};

const Profile = () => {
  return (
    <>
    <Content />
      
    </>
  );
};

export default Profile;
