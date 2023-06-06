import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faFacebook,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
const SocialLinks = () => {
  return (
    <div className="social-media-container">
      <a
        href="https://github.com/dannyboi1313/tube-volume-calculator.git"
        target="_blank"
      >
        <FontAwesomeIcon icon={faGithub} />
      </a>
      <a href="https://facebook.com">
        <FontAwesomeIcon icon={faFacebook} />
      </a>
      <a href="https://twitter.com">
        <FontAwesomeIcon icon={faTwitter} />
      </a>
    </div>
  );
};

export default SocialLinks;
