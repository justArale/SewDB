import React from "react";
import { GitHub, LinkedIn } from "@just1arale/icons";
import "../components/AboutPage.css";

const AboutPage: React.FC = () => {
  return (
    <div className="aboutPage">
      <div className="about-content">
        <h3>Hey there, I'm Arale – welcome to SewDB! 🧵✨</h3>
        <p className="mainFont">
          This little corner of the internet is where I collect all my sewing
          patterns. Think of it as my personal sewing database, where patterns
          can be browsed, filtered, and liked. SewDB is mainly for my friends—so
          when they ask me to sew something, we can easily find the perfect
          pattern together. But honestly? This is more than just a collection.
          It's where my past career, my love for sewing, and my dream of working
          in tech come together. A little bit of code, a little bit of
          creativity, and a whole lot of passion stitched into one. To respect
          copyright rules, SewDB is a private space. You'll need to log in to
          access everything, but once you're in, feel free to explore and get
          inspired!
        </p>
      </div>
      <div className="social-pages">
        <button className=" noUnderline socialButton github">
          <a target="_blank" href="https://github.com/justArale">
            <GitHub width="32" height="32" color="#000" />
          </a>
        </button>

        <button className=" noUnderline socialButton linkedIn">
          <a
            target="_blank"
            href="https://www.linkedin.com/in/s-kuechler-jr-fullstack-dev"
          >
            <LinkedIn width="32" height="32" color="#000" />
          </a>
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
