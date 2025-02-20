import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { changeLanguage } from "../../store/configSlice";
import "./language.css";

export default function LanguageSwitcher() {
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const [activeLang, setActiveLang] = useState(i18n.language); // Ngôn ngữ hiện tại

  const handleChangeLang = (e, lang) => {
    e.preventDefault(); 
    if (activeLang !== lang) {
      i18n.changeLanguage(lang);
      dispatch(changeLanguage(lang));
      setActiveLang(lang);
    }
  };

  return (
    <div className="language-switcher">
      <ul className="language-list">
        <li>
          <a
            href="#"
            onClick={(e) => handleChangeLang(e, "vi")}
            className={`language-item ${activeLang === "vi" ? "active" : ""}`}
          >
            VI
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => handleChangeLang(e, "en")}
            className={`language-item ${activeLang === "en" ? "active" : ""}`}
          >
            EN
          </a>
        </li>
      </ul>
    </div>
  );
}
