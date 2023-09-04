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
          contentStyle={{ background: "#1dd6fc", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  #1dd6fc" }}
          date="2011 - present"
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={
            <Image
              width="0"
              sizes="100vw"
              height="0"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              src={"/assets/icone/goal.png"}
              alt=""
            />
          }
        >
          <h3 className="vertical-timeline-element-title">
            Certificat de coach professionnel – International NLP
          </h3>
          <h4 className="vertical-timeline-element-subtitle">Miami, FL</h4>
          <p>
            Creative Direction, User Experience, Visual Design, Project
            Management, Team Leading
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: "orange", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  orange" }}
          date="2010 - 2011"
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={
            <Image
              width="0"
              sizes="100vw"
              height="0"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              src={"/assets/icone/goal.png"}
              alt=""
            />
          }
        >
          <h3 className="vertical-timeline-element-title">
            Certificat de formation en mémoire, concentration et créativité –
            Formalis – Accréditation IPHM et Qualiopi
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            San Francisco, CA
          </h4>
          <p>
            Creative Direction, User Experience, Visual Design, SEO, Online
            Marketing
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: "#1dd6fc", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  #1dd6fc" }}
          date="2008 - 2010"
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={
            <Image
              width="0"
              sizes="100vw"
              height="0"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              src={"/assets/icone/goal.png"}
              alt=""
            />
          }
        >
          <h3 className="vertical-timeline-element-title">
            Certificat de formation en coaching de vie – Formalis –
            Accréditation IPHM et Qualiopi
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            Los Angeles, CA
          </h4>
          <p>User Experience, Visual Design</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: "orange", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  orange" }}
          date="2006 - 2008"
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
          icon={
            <Image
              width="0"
              sizes="100vw"
              height="0"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              src={"/assets/icone/goal.png"}
              alt=""
            />
          }
        >
          <h3 className="vertical-timeline-element-title">
            Certificat de formation en coaching parental – Formalis –
            Accréditation IPHM et Qualiopi
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            San Francisco, CA
          </h4>
          <p>User Experience, Visual Design</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          contentStyle={{ background: "#1dd6fc", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  #1dd6fc" }}
          date="April 2013"
          iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
          icon={
            <Image
              width="0"
              sizes="100vw"
              height="0"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              src={"/assets/icone/goal.png"}
              alt=""
            />
          }
        >
          <h3 className="vertical-timeline-element-title">
            Certificat de formation en coaching conjugal – Formalis –
            Accréditation IPHM et Qualiopi
          </h3>
          <h4 className="vertical-timeline-element-subtitle">Online Course</h4>
          <p>Strategy, Social Media</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          contentStyle={{ background: "orange", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  orange" }}
          date="November 2012"
          iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
          icon={
            <Image
              width="0"
              sizes="100vw"
              height="0"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              src={"/assets/icone/goal.png"}
              alt=""
            />
          }
        >
          <h3 className="vertical-timeline-element-title">
            DESS Certificat d’aptitude à l’administration des entreprises –
            Université Paris 1-Panthéon Sorbonne
          </h3>
          <h4 className="vertical-timeline-element-subtitle">Certification</h4>
          <p>Creative Direction, User Experience, Visual Design</p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--education"
          contentStyle={{ background: "#1dd6fc", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  #1dd6fc" }}
          date="2002 - 2006"
          iconStyle={{ background: "rgb(233, 30, 99)", color: "#fff" }}
          icon={
            <Image
              width="0"
              sizes="100vw"
              height="0"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              src={"/assets/icone/goal.png"}
              alt=""
            />
          }
        >
          <h3 className="vertical-timeline-element-title">
            Master of Business Administration (MBA) – IAE Paris – Université
            Paris 1-Panthéon Sorbonne
          </h3>
          <h4 className="vertical-timeline-element-subtitle">
            Bachelor Degree
          </h4>
          <p>Creative Direction, Visual Design</p>
        </VerticalTimelineElement>
      </VerticalTimeline>
    </>
  );
};

export default Timeline;
