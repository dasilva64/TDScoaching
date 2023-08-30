import WhileInView from "../components/framer/WhileInView";
import styles from "./page.module.scss";

const Code = () => {
  return (
    <>
      <noscript
        style={{
          width: "100%",
          padding: "20px 0",
          background: "red",
          position: "fixed",
          bottom: "0",
          left: "0",
          zIndex: "999",
          color: "white",
          textAlign: "center",
        }}
      >
        Veuillez activer JavaScript pour profiter pleinement de notre site.
      </noscript>
      <main className={styles.code}>
        <h1>Code de déontologie</h1>
        <div className={styles.code__container}>
          <div className={styles.code__article}>
            <WhileInView>
              <div className={styles.code__article__div}>
                <p>
                  Je m’engage à rester en conformité́ avec chacune des directives
                  auxquelles il est fait référence dans le présent Code de
                  déontologie.
                </p>
                <p>
                  Cette charte n’a qu’une valeur informative. Il s’agit de
                  principes généraux qu’il est important de respecter en tant
                  que coach professionnel en coaching conjugal.
                </p>
              </div>
            </WhileInView>
            <WhileInView>
              <h2 className={styles.code__article__h2}>
                De l’exercice de la profession : les obligations du coach
              </h2>
            </WhileInView>
            <WhileInView>
              <div className={styles.code__article__div}>
                <ul className={styles.code__article__div__ul}>
                  <li>
                    <strong>Respect et Droits des clients</strong>
                    <ul className={styles.code__article__div__ul__ul}>
                      <li>
                        Le coach se doit de respecter chaque client/couple sans
                        discrimination.
                      </li>
                      <li>
                        Le coach se doit de respecter les valeurs de chaque
                        client.
                      </li>
                      <li>
                        Le coach se doit de respecter les droits à la vie privée
                        de ses clients (interdiction de s’immiscer dans la vie
                        de celui-ci, de salir son honneur ou sa réputation).
                      </li>
                      <li>
                        Le coach se doit d’adapter son entretien et ses méthodes
                        de travail dans le plus grand respect des différentes
                        étapes d’évolution de chaque client ou couple.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Confidentialité & vie privée</strong>
                    <ul className={styles.code__article__div__ul__ul}>
                      <li>
                        Interdiction absolue pour le coach d’utiliser ce qu’il
                        sait sur son client à des fins personnelles. Le coach
                        reçoit, lors de ses entretiens, des confidences des
                        clients sur leur vie privée et également, dans certains
                        cas, sur leur vie intime. Le coach n’a pas le droit de
                        divulguer ce qui lui a été confié.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Secret professionnel</strong>
                    <ul className={styles.code__article__div__ul__ul}>
                      <li>
                        Le coach est tenu au secret professionnel. Cependant,
                        celui-ci peut être partagé avec d’autres professionnels,
                        si c’est capital pour la santé de votre client (médecin,
                        psychiatre, psychologue...). Notez que dans certains
                        cas, le secret professionnel{" "}
                        <strong>ne s’applique plus</strong> :
                        <ul>
                          <li>
                            dans le cas d’une personne ayant contracté une
                            maladie contagieuse
                          </li>
                          <li>
                            dans le cas de sévices sur des personnes mineures.
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Intégrité</strong>
                    <ul className={styles.code__article__div__ul__ul}>
                      <li>
                        Le coach se doit d’afficher ses qualifications et
                        titres.
                      </li>
                      <li>
                        Le coach se doit d’être transparent concernant le
                        montant de ses honoraires.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Responsabilités</strong>
                    <ul className={styles.code__article__div__ul__ul}>
                      <li>
                        Le coach a envers son client{" "}
                        <strong>une obligation de qualité de travail</strong>.
                        Il se doit de mettre en place tous les protocoles,
                        techniques et outils à disposition de son client /couple
                        afin d’obtenir le meilleur pour lui.
                      </li>
                      <li>
                        Le coach est responsable de son travail et il se doit de
                        rester constamment informé des nouveaux protocoles, de
                        nouvelles règles et autres grâce à la supervision.
                      </li>
                      <li>
                        L’obligation de souscrire une assurance professionnelle
                        en cas de dommages.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Liberté de consentement</strong>
                    <ul className={styles.code__article__div__ul__ul}>
                      <li>
                        Le coach a <strong>l’obligation d’informer</strong> son
                        client avec des explications claires et précises sur sa
                        méthode d’intervention et sur ses différentes
                        possibilités de travail avec celui-ci.
                      </li>
                      <li>
                        <strong>liberté́ de consentement du client</strong>. Le
                        client/couple peut mettre un terme à la mission du coach
                        quand il le souhaite. Il peut décider de choisir un
                        autre coach conjugal pour continuer le travail. Le coach
                        se doit d’accepter la décision du client/couple.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Savoir-faire du coach</strong>
                    <ul className={styles.code__article__div__ul__ul}>
                      <li>
                        Le coach se doit d’être <strong>totalement</strong>{" "}
                        conscient de ses <strong>compétences</strong> et de ses
                        <strong>limites</strong>.
                      </li>
                      <li>
                        Le coach doit veiller à rester toujours compétent dans
                        son travail et à rester en évolution constante pour
                        affirmer ses compétences professionnelles.
                      </li>
                      <li>
                        Le coach se <strong>doit</strong> d’être{" "}
                        <strong>supervisé</strong> afin d’être tenu informé
                        régulièrement de tout ce qui touche au domaine du
                        coaching conjugal (formations complémentaires,
                        conférences, mise en place de nouveau concept de
                        travail...).
                      </li>
                      <li>
                        Le coach se doit : si un problème personnel l’affecte d’
                        <strong>interrompre ses entretiens</strong> jusqu’à ce
                        qu’il retrouve tout son savoir-faire et savoir-être.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Ce qu’un coach ne doit pas faire</strong>
                    <ul className={styles.code__article__div__ul__ul}>
                      <li>
                        Le coach n’a pas le droit d’entretenir des
                        rapprochements ou relations sexuelles avec ses clients.{" "}
                        <strong>C’est formellement interdit</strong>.
                      </li>
                      <li>
                        Le coach n’a pas le droit de solliciter directement de
                        nouveaux clients pour les amener à travailler avec lui.
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </WhileInView>
            <WhileInView>
              <h2 className={styles.code__article__h2}>
                Principes fondamentaux
              </h2>
            </WhileInView>
            <WhileInView>
              <p className={styles.code__article__div}>
                Les coachs sont tenus de se conformer au Code de déontologie. Le
                respect de ses directives permet à chaque coach de pratiquer
                dans les meilleures conditions possibles pour lui. Chaque coach
                est individuellement responsable de la compréhension et de la
                connaissance de toute restriction locale liée à sa pratique,
                tout comme des exigences administratives et procédures pour
                exercer ce métier en conformité́ avec sa législation. Au travers
                cette présente charte, nous demandons à chaque coach conjugal de
                faire preuve de professionnalisme en accueillant les couples qui
                se confient à lui dans le plus grand respect dans un cadre de
                bienveillance et de confidentialité́.
              </p>
            </WhileInView>
          </div>
        </div>
      </main>
    </>
  );
};

export default Code;
