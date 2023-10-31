"use client";

import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import Image from "next/image";
import "react-vertical-timeline-component/style.min.css";

const Timeline = () => {
  return (
    <>
      <VerticalTimeline lineColor="black">
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{
            background: "orange",
            color: "#fff",
          }}
          contentArrowStyle={{
            borderRight: "7px solid  orange",
          }}
          date="2023"
          iconStyle={{ background: "orange", color: "#fff" }}
        >
          <h3 className="vertical-timeline-element-title">
            MasterCoach professionnel certifié - Institut de Coaching
            International de Genève (ICI) - Accréditation ICF (International
            Coach Federation)
          </h3>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{
            background: "aqua",
            color: "#fff",
          }}
          contentArrowStyle={{
            borderRight: "7px solid  aqua",
          }}
          date="2022"
          iconStyle={{ background: "aqua", color: "#fff" }}
        >
          <h3 className="vertical-timeline-element-title">
            Certificat de formation en reconversion professionnelle - Formalis –
            Accréditation IPHM et Qualiopi
          </h3>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{
            background: "orange",
            color: "#fff",
          }}
          contentArrowStyle={{
            borderRight: "7px solid  orange",
          }}
          date="2022"
          iconStyle={{ background: "orange", color: "#fff" }}
        >
          <h3 className="vertical-timeline-element-title">
            Certificat de formation en coaching de vie - Formalis –
            Accréditation IPHM et Qualiopi
          </h3>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{
            background: "aqua",
            color: "#fff",
          }}
          contentArrowStyle={{
            borderRight: "7px solid  aqua",
          }}
          date="2022"
          iconStyle={{ background: "aqua", color: "#fff" }}
        >
          <h3 className="vertical-timeline-element-title">
            Certificat de formation en coaching parental - Formalis –
            Accréditation IPHM et Qualiopi
          </h3>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{
            background: "orange",
            color: "#fff",
          }}
          contentArrowStyle={{
            borderRight: "7px solid  orange",
          }}
          date="2022"
          iconStyle={{ background: "orange", color: "#fff" }}
        >
          <h3 className="vertical-timeline-element-title">
            Certificat de formation en coaching conjugal - Formalis –
            Accréditation IPHM et Qualiopi
          </h3>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{
            background: "aqua",
            color: "#fff",
          }}
          contentArrowStyle={{
            borderRight: "7px solid  aqua",
          }}
          iconStyle={{ background: "aqua", color: "#fff" }}
        >
          <h3 className="vertical-timeline-element-title">
            Certificat de formation en mémoire, concentration et créativité –
            Formalis – Accréditation IPHM et Qualiopi
          </h3>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{
            background: "orange",
            color: "#fff",
          }}
          contentArrowStyle={{
            borderRight: "7px solid  orange",
          }}
          date="2004"
          iconStyle={{ background: "orange", color: "#fff" }}
        >
          <h3 className="vertical-timeline-element-title">
            DESS Certificat d’aptitude à l’administration des entreprises –
            Université Paris 1- Panthéon Sorbonne
          </h3>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{
            background: "aqua",
            color: "#fff",
          }}
          contentArrowStyle={{
            borderRight: "7px solid  aqua",
          }}
          date="2004"
          iconStyle={{ background: "aqua", color: "#fff" }}
        >
          <h3 className="vertical-timeline-element-title">
            Master of Business Administration (MBA) – IAE Paris - Université
            Paris 1-Panthéon Sorbonne
          </h3>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </>
  );
};

export default Timeline;
