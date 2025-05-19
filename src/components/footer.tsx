import x1 from "../assets/images/youtube_icon.png";
import x2 from "../assets/images/twitter_icon.png";
import x3 from "../assets/images/facebook_icon.png";
import x4 from "../assets/images/instagram_icon.png";
import logo from "../assets/images/Logo_Sistemas.png";

function Footer() {
  return (
    <div className="bg-[#BD0011] flex justify-center align-middle items-center space-x-24 py-4">
      <div>
        <img src={logo} width={"180px"}></img>
      </div>
      <div className="flex h-10 space-x-4">
        <a href="https://www.youtube.com/@ufpscucutatv">
          <img src={x1} width={"40px"}></img>
        </a>
        <a href="https://x.com/ufpscucuta">
          <img src={x2} width={"40px"}></img>
        </a>
        <a href="https://www.facebook.com/Ufps.edu.co/?locale=es_LA">
          <img src={x3} width={"40px"}></img>
        </a>
        <a href="https://www.instagram.com/ufpscucuta/?hl=es">
          <img src={x4} width={"40px"}></img>
        </a>
      </div>
    </div>
  );
}

export default Footer;
