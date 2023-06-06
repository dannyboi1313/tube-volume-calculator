import Head from "next/head";

import { Inter } from "next/font/google";

import "typeface-roboto";
import NavBar from "@/components/NavBar";
import RotatingImage from "@/components/RotatingImage";
import BulletList from "@/components/BulletLIst";
import { useState, useRef, useEffect } from "react";
import SimpleButton from "@/components/SimpleButton";
import SocialLinks from "@/components/SocialLinks";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [isVisible, setIsVisible] = useState([]);
  const [menuDisplayed, setMenuDisplayed] = useState(false);
  const targetRefs = useRef([]);

  const setHamburger = (open) => {
    setMenuDisplayed(open);
  };

  const handleClick = () => {
    // Call the function passed from the parent component

    location.href = "#app-display";
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5, // Change this threshold value as needed
    };

    const handleIntersection = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prevVisible) => ({
            ...prevVisible,
            [entry.target.id]: true,
          }));
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);

    targetRefs.current.forEach((target) => {
      if (target) {
        observer.observe(target);
      }
    });

    return () => {
      targetRefs.current.forEach((target) => {
        if (target) {
          observer.unobserve(target);
        }
      });
    };
  }, []);

  const addTargetRef = (ref) => {
    if (ref && !targetRefs.current.includes(ref)) {
      targetRefs.current.push(ref);
    }
  };

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@100&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="main-wrapper">
        <NavBar hamburgerFunction={setHamburger} />
        <div className={menuDisplayed ? "banner" : "banner menu-displayed"}>
          <div className="banner-content">
            <h1>
              Unlock the Hidden
              <br />
              World of Material.
            </h1>
            <h2 className="banner-content-item">
              Streamline your sample analysis with our
              <br />
              collection of metallography tools
            </h2>
            <div className="banner-button-wrapper">
              <div id="container">
                <button
                  onClick={handleClick}
                  className="banner-button learn-more"
                >
                  <span className="circle" aria-hidden="true">
                    <span className="icon arrow"></span>
                  </span>
                  <span className="button-text">Get Started</span>
                </button>
              </div>
            </div>
          </div>
          <div className="banner-image-wrapper">
            <RotatingImage
              imageUrl={"/green-puck.svg"}
              angleStart={30}
              angleEnd={30}
              speed={50}
            />
            <RotatingImage
              imageUrl={"/purple-puck.svg"}
              angleStart={30}
              angleEnd={30}
              speed={100}
            />
            <RotatingImage
              imageUrl={"/yellow-puck.svg"}
              angleStart={40}
              angleEnd={30}
              speed={70}
            />
            <RotatingImage
              imageUrl={"/red-puck.svg"}
              angleStart={20}
              angleEnd={10}
              speed={150}
            />
          </div>
        </div>
        <div className="mainpage-content">
          <div className="mainpage-content-words">
            <h1
              ref={addTargetRef}
              id="target-element-1"
              className={
                isVisible["target-element-1"]
                  ? "content-animation"
                  : "before-animation"
              }
            >
              Simplify your
              <br />
              sample analysis
            </h1>
            <div
              ref={addTargetRef}
              id="target-element-2"
              className={
                isVisible["target-element-2"]
                  ? "content-animation"
                  : "before-animation"
              }
            >
              <BulletList
                list={[
                  "Cut your analysis time in half",
                  "Easy to use applications",
                  "Accurate measurements ",
                ]}
              />
            </div>
          </div>
          <div
            ref={addTargetRef}
            id="target-element-3"
            className={
              isVisible["target-element-3"]
                ? "mainpage-content-image content-animation"
                : "mainpage-content-image before-animation"
            }
          >
            <img src="/screenshot.png" alt="screenshot" />
          </div>
        </div>

        <div className="mainpage-app-display" id="app-display">
          <div
            ref={addTargetRef}
            id="target-element-4"
            className={
              isVisible["target-element-4"]
                ? "app-container content-animation"
                : "app-container before-animation"
            }
          >
            <h1>Tube Volume Calculator</h1>
            <div className="app-image">
              <div className="app-image-overlay"></div>
              <img src="/screenshot.png" alt="" />
            </div>
            <p>
              This is a short description of the tube volume calculator. With
              even more description to fill up the majority of this empty space.
            </p>
            <div className="app-button-container">
              <div>
                <a href="calculator" className="app-button">
                  Try it out
                </a>
              </div>
            </div>
          </div>
          <div
            ref={addTargetRef}
            id="target-element-5"
            className={
              isVisible["target-element-5"]
                ? "app-container content-animation"
                : "app-container before-animation"
            }
          >
            <h1>Irregular Area Calculator</h1>
            <div className="app-image">
              <div className="app-image-overlay"></div>
              <img src="/screenshot-area.png" alt="" />
            </div>
            <p>
              This is a short description of the tube volume calculator. With
              even more description to fill up the majority of this empty space.
            </p>
            <div className="app-button-container">
              <div>
                <a href="calculator" className="app-button">
                  Try it out
                </a>
              </div>
            </div>
          </div>
          <div
            ref={addTargetRef}
            id="target-element-6"
            className={
              isVisible["target-element-6"]
                ? "app-container content-animation"
                : "app-container before-animation"
            }
          >
            <h1>Tube Volume Calculator</h1>
            <div className="app-image">
              <div className="app-image-overlay"></div>
              <img src="/under-construction.png" alt="" />
            </div>
            <p>
              This is a short description of the tube volume calculator. With
              even more description to fill up the majority of this empty space.
            </p>
            <div className="app-button-container">
              <div>
                <a href="calculator" className="app-button">
                  Try it out
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer">
          <img src="/logo.svg" alt="" />
          <SocialLinks />
          <SimpleButton content={"Get Started"} link="calculator" />
        </div>
      </div>
    </>
  );
}
