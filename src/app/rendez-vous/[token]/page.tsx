import React from "react";
import Content from "./components/Content";

export const metadata = {
  title: "Votre rendez-vous - tdscoaching",
  description: "Votre rendez-vous.",
  icons: {
    icon: "https://www.tdscoaching.fr/assets/logo/logo3.webp",
  },
  author: "Thierry Da Silva",
  robots: "noindex, nofollow",
  other: {
    "google-site-verification": "F921bU_1dl5iiaUL_B8FTJjSxG5GYYTBOyaGEHp964Q",
  },
};

const page = () => {
  return (
    <>
    <Content />
      
    </>
  );
};

export default page;
