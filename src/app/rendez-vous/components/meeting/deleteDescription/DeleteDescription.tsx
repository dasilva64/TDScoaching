import React, { useEffect } from 'react'
import styles from "../../../page.module.scss";
import fetchDeleteDescription from '@/app/components/hook/meeting/useDeleteDescription';
import { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import useUser from '@/app/components/hook/useUser';
import { RootState } from '@/app/redux/store';
import { useSelector } from 'react-redux';

const DeleteDescription = () => {
    const { isLog } = useSelector((state: RootState) => state.auth);

    const { user, isLoading, isError, mutate }: any = useUser();

    const { trigger: triggerDeleteDescription, data: dataDeleteDescription } =
        useSWRMutation(
            `http://localhost:8080/meeting/${user ? user.body.meetingId : null}`,
            fetchDeleteDescription, { revalidate: false }
        );



    useEffect(() => {
        if (dataDeleteDescription) {
            if (dataDeleteDescription.status === 200) {
                console.log(dataDeleteDescription);
                const mutateUser = async () => {
                    try {
                        await mutate({
                            ...user,
                            body: {
                                ...user.body,
                                meeting: { ...user.body.meeting, description: null },
                            },
                        });
                    } catch (error) {
                        console.log(error);
                    }
                };
                if (user.body.meeting.description !== null) {
                    mutateUser();
                }
            }
        }
    }, [dataDeleteDescription, mutate, user]);
    const handlerClickDeleteDescription = () => {
        const fetchDeleteMeeting = async () => {
            console.log("ttt");
            triggerDeleteDescription();
        };
        fetchDeleteMeeting();
    };
    return (
        <>
            <div>
                <button
                    className={styles.meet__meet__div__btn}
                    onClick={() => {
                        handlerClickDeleteDescription();
                    }}
                >
                    Supprimer la description
                </button>
            </div>
        </>
    )
}

export default DeleteDescription