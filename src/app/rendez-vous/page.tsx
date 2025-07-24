import Display from "./components/display/Display";

export const metadata = {
  title: "Mes rendez-vous à venir - tdscoaching",
  description: "Mes rendez-vous à venir sur le site tdscoaching.fr",
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
    <Display />
      
    </>
  );
};

export default Page;
