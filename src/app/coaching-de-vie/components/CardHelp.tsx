import React from "react";
import styles from "./CardHelp.module.scss";
import Image from "@/app/components/image/Image";
import WhileInView from "@/app/components/framer/WhileInView";

const CardHelp = ({ title }: { title: string }) => {
  return (
    <WhileInView type="y" className={styles.card}>
      <h3 className={styles.card__h4}>
        <Image
          className={styles.card__h4__icone}
          width="20"
          height="20"
          priority={true}
          src={"/assets/icone/check-solid-green.svg"}
          alt="bousole"
        />
        {title}
      </h3>
    </WhileInView>
  );
};

export default CardHelp;
