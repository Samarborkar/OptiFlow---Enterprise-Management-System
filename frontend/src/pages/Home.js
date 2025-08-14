import React from "react";
import Typewriter from "typewriter-effect";
import "../index.css";
import Navbar from "../components/Navbar";
import TaskList from "../components/Task";
import Image from "../images/Home_Image.png";

const Home = () => {
  const projectName = "OptiFlow";

  return (
    <div className="home">
      <Navbar />
      <div className="spacer3"></div>

      <div className="content">
        <div className="text">
          <h1>
            <span style={{ color: "skyblue" }}>Opti</span>mize your work
            <span style={{ color: "skyblue" }}>flow</span> with <br />
            <strong
              style={{
                fontSize: "80px",
                display: "inline-block",
                color: "#00bfff",
              }}
            >
              {projectName.split("").map((letter, index) => (
                <span
                  key={index}
                  style={{
                    opacity: 0,
                    animation: `fadeIn 0.5s forwards`,
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {letter}
                </span>
              ))}
            </strong>
          </h1>
          <div className="typewriter-wrapper">
            <Typewriter
              options={{
                strings: [
                  "Project Management",
                  "Team Collaboration",
                  "Employee Recommendation",
                ],
                autoStart: true,
                loop: true,
                delay: 75,
              }}
            />
          </div>
        </div>
        <div className="image">
          <img src={Image} alt="Workflow optimization" />
        </div>
      </div>

      <div className="Task">
        <TaskList />
      </div>
    </div>

  );
};

export default Home;
