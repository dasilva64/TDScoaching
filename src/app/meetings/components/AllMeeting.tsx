"use client";

import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import frLocale from "@fullcalendar/core/locales/fr";
import useGet from "@/app/components/hook/useGet";
import { mutate } from "swr";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

const AllMeeting = () => {
  const calendarRef: any = useRef(null);
  const dispatch = useDispatch()
  const router = useRouter()
  const [allData, setAllData] = useState<any>(null);
  const {
    data: userData,
    isLoading,
    isError,
    mutate,
  } = useGet("/meetings/components/api");
  useEffect(() => {
    if (userData) {
      if (userData.status === 200) {
        let array = [];
        for (let i = 0; i < userData.body.meetings.length; i++) {
          if (
            userData.body.meetings[i].User_meeting_test_userMailToUser === null
          ) {
            array.push({
              title:
                userData.body.meetings[i].firstnameUser +
                " " +
                userData.body.meetings[i].lastnameUser,
              start: userData.body.meetings[i].startAt,
              editable: false,
              backgroundColor: "green",
              textColor: "white",
            });
          } else {
            array.push({
              title:
                userData.body.meetings[i].User_meeting_test_userMailToUser
                  .firstname +
                " " +
                userData.body.meetings[i].User_meeting_test_userMailToUser
                  .lastname,
              start: userData.body.meetings[i].startAt,
              editable: false,
              backgroundColor: "green",
              textColor: "white",
              url:
                "http://localhost:3000/utilisateur/" +
                userData.body.meetings[i].User_meeting_test_userMailToUser.id,
            });
          }
        }
        setAllData(array);
      } else if (userData.status === 401) {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: userData.message },
        });
        mutate("/components/header/api");
        mutate("/components/header/ui/api");
        router.push(`/acces-refuse?destination=meetings`);
      } else {
        dispatch({
          type: "flash/storeFlashMessage",
          payload: { type: "error", flashMessage: userData.message },
        });
      }
    }
  }, [isLoading, userData, dispatch, mutate, router]);
  const [isMobile, setIsMobile] = useState<null | boolean>(null);
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      {isMobile === false && (
        <>
          <FullCalendar
            ref={calendarRef}
            locale={frLocale}
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: "09:00",
              endTime: "18:00",
            }}
            customButtons={{
              myCustomButton: {
                text: "Aujourd'hui",
                click: function () {
                  if (calendarRef.current === null) return;
                  const calendarApi = calendarRef.current.getApi();
                  let currentDate = new Date();
                  calendarApi.gotoDate(
                    currentDate.setDate(currentDate.getDate())
                  );
                },
              },
            }}
            headerToolbar={{
              left: "title",
              center: "",
              right: "myCustomButton prev next",
            }}
            titleFormat={{
              year: "numeric",
              month: "long",
              day: "numeric",
            }}
            events={allData}
            weekends={false}
            slotMinTime={"09:00:00"}
            slotMaxTime={"18:00:00"}
            allDaySlot={false}
            editable={true}
            selectable={true}
            height={"auto"}
            slotDuration={"01:00:00"}
          />
        </>
      )}
      {isMobile === true && (
        <>
          <FullCalendar
            ref={calendarRef}
            locale={frLocale}
            plugins={[interactionPlugin, timeGridPlugin]}
            initialView="timeGridDay"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: "09:00",
              endTime: "18:00",
            }}
            customButtons={{
              myCustomButton: {
                text: "Aujourd'hui",
                click: function () {
                  if (calendarRef.current === null) return;
                  const calendarApi = calendarRef.current.getApi();
                  let currentDate = new Date();
                  calendarApi.gotoDate(
                    currentDate.setDate(currentDate.getDate())
                  );
                },
              },
            }}
            headerToolbar={{
              left: "title",
              center: "",
              right: "myCustomButton prev next",
            }}
            titleFormat={{
              year: "numeric",
              month: "long",
              day: "numeric",
            }}
            events={allData}
            weekends={false}
            slotMinTime={"09:00:00"}
            slotMaxTime={"18:00:00"}
            allDaySlot={false}
            editable={true}
            selectable={true}
            height={"auto"}
            slotDuration={"01:00:00"}
          />
        </>
      )}
    </>
  );
};

export default AllMeeting;
