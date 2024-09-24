import flagEnglish from "../images/flagEng.svg";
import flagVietNam from "../images/flagVietNam.svg";
import flagJapan from "../images/flagJapan.svg";

export const optionLanguage = [
  {
    value: "vietnamese",
    label: <span className="spanLabelLanguage">VN</span>,
    icon: <img className="imgIconLanguage" src={flagVietNam} alt="" />,
  },
  {
    value: "japanese",
    label: <span className="spanLabelLanguage">JP</span>,
    icon: <img className="imgIconLanguage" src={flagJapan} alt="" />,
  },
  {
    value: "english",
    label: <span className="spanLabelLanguage">ENG</span>,
    icon: <img className="imgIconLanguage" src={flagEnglish} alt="" />,
  },
];
