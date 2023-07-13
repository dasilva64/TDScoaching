import React, { useEffect, useState } from "react";
import styles from "../../page.module.scss";
import useUser from "../../../components/hook/useUserGetRole";
import { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import fetchAddDescription from "../../../components/hook/meeting/useAddDescription";
import useSWRMutation from "swr/mutation";
import fetchDeleteDescription from "../../../components/hook/meeting/useDeleteDescription";
import { useRouter } from "next/navigation";
import DeleteMeeting from "./deleteMeeting/DeleteMeeting";
import EditDescription from "./editDescription/EditDescription";
import DeleteDescription from "./deleteDescription/DeleteDescription";
import AddDescription from "./addDescription/AddDescription";

const DisplayMeeting = () => {
  const { isLog } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const { push } = useRouter();

  const { user, isLoading, isError, mutate }: any = useUser();
  const [displayEditMeeting, setDisplayEditMeeting] = useState<boolean>(false);

  const [description, setDescription] = useState<string>("");

  return (
    <>
      <div className={styles.meet__meet}>
        {(user && user.body.meeting && (
          <>
            <h3 className={styles.meet__meet__h3}>
              Voici votre prochain rendez-vous :{" "}
            </h3>
            <p className={styles.meet__meet__p__start}>
              Votre prochain rendez vous est le{" "}
              {new Date(user.body.meeting.startAt).toLocaleString("fr-FR", {
                timeZone: "UTC",
              })}
            </p>
            {(user.body.meeting.description && (
              <>
                <p className={styles.meet__meet__p__description}>
                  {user.body.meeting.description}
                </p>
                <div className={styles.meet__meet__div}>
                  <EditDescription />

                  <DeleteDescription />

                  <div className={styles.meet__meet__div}>
                    <DeleteMeeting />
                  </div>
                </div>
              </>
            )) ||
              (!user.body.meeting.description && (
                <>
                  <p className={styles.meet__meet__p}>
                    Vous pouvez ajouter une descriptio ici ajouter des
                    informations sur vous. Je prendrais alors vos remarque en
                    compte avant notre rendez-vous.
                  </p>
                  <AddDescription />
                  <div className={styles.meet__meet__div}>
                    <DeleteMeeting />
                  </div>
                </>
              ))}
          </>
        )) ||
          (user && !user.body.meeting && (
            <>
              <h3 className={styles.meet__meet__h3}>
                Vous n&apos;avez pas encore de rendez-vous de programmé
              </h3>
              <div className={styles.meet__meet__div}>
                <p className={styles.meet__meet__div__p}>
                  Vous pouvez sélectionner une date en cliquant sur le
                  calendrier. La durée standar d&apos;un rendez-vous est de 1
                  heure. Vous pouvez m&apos;envoyer un mail en cliquant sur le
                  bouton ce-dessous si vous voulez avoir d&apos;avantage de
                  renseignement ou pour prendre un rendez-vous personnalisé.
                </p>
                <div>
                  <button
                    className={styles.meet__meet__div__btn}
                    onClick={() => {
                      push("/contact");
                    }}
                  >
                    bouton
                  </button>
                </div>
                <p className={styles.meet__meet__div__p__marge}>
                  Avant de prendre un rendez-vous vous devez autoriser un
                  paiement.
                </p>
              </div>
            </>
          ))}
      </div>
    </>
  );
};

export default DisplayMeeting;
