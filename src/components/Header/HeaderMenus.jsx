import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchMenu } from "../../store/menuSlice";
import { userGetInfor, userLogout } from "../../store/userSlice";

import { useTranslation } from "react-i18next";
import { changeLanguage } from "../../store/configSlice";
import LanguageSwitcher from "../../pages/Language";
/*
function renderMenuLevel3(item) {
  // todo
}

function renderMenuLevel2(item) {
  let menuChild = <></>;

  if (item.childItems.length > 0) {
    const xhtmlChild = item.childItems.map(renderMenuLevel3);

    menuChild = <ul>{xhtmlChild}</ul>;
  }

  return (
    <li key={item.id}>
      <Link to="/">{item.title}</Link>
      {menuChild}
    </li>
  );
}

function renderMenuLevel1(item) {
  let menuChild = <></>;

  if (item.childItems.length > 0) {
    const xhtmlChild = item.childItems.map(renderMenuLevel2);

    menuChild = <ul>{xhtmlChild}</ul>;
  }

  return (
    <li key={item.id}>
      <Link to="/">{item.title}</Link>
      {menuChild}
    </li>
  );
}
*/

function renderMenus(item) {
  let menuChild = <></>;

  if (item.childItems.length > 0) {
    const xhtmlChild = item.childItems.map(renderMenus);
    menuChild = <ul>{xhtmlChild}</ul>;
  }

  let linkUrl = `/category/${item.title}`;

  // Kiểm tra tên để thay đổi link cho "Trang chủ" và "Front End"
  if (["trang chủ", "homepage"].includes(item.title.toLowerCase())) {
    linkUrl = "/";
  }
   else if (item.title.toLowerCase() === "front end") {
    linkUrl = "#";
  }

  return (
    <li key={item.id}>
      <Link to={linkUrl}>{item.title}</Link>
      {menuChild}

      {/* {item.childItems.length > 0 && (
        <ul>{item.childItems.map(renderMenus)}</ul>
      )} */}
    </li>
  );
}

function HeaderMenus() {
  // const { t } = useTranslation();
  const menuItem = useSelector((state) => state.MENU.menuItem);
  const userInfor = useSelector((state) => state.USER.userInfor);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInforCurrent = useSelector((state) => state.USER.userInfor);
  const token = useSelector((state) => state.USER.token);
  const lang = useSelector((state) => state.CONFIG.lang)
  
  useEffect(() => {
    if (!userInforCurrent) {
      dispatch(userGetInfor(token));
    }
  }, []);
  const userAvatar = userInforCurrent?.simple_local_avatar?.full || "";

  const newXhtml = menuItem.map(renderMenus);

  useEffect(() => {
    dispatch(fetchMenu(lang));
  }, [lang]);

  function onClickLogOut(event) {
    event.preventDefault();
    dispatch(userLogout());
    navigate("/");
  }

  const menuInfo = [
    { link: "/admin/profile", name: "Tài khoản" },
    { link: "/admin/articles", name: "Bài viết của tôi" },
  ];

  function inforPerson(menuInfo) {
    if (menuInfo.length > 0) {
      const htmlMenuInfor = menuInfo.map((item, index) => {
        return (
          <li key={index}>
            <Link to={item.link}>{item.name}</Link>
          </li>
        );
      });
      return htmlMenuInfor;
    }
  }

  function handleChangeLang(lang = 'vi') {
    i18n.changeLanguage(lang);
    dispatch(changeLanguage(lang));
  }
  const { t, i18n } = useTranslation();

  return (
    <div className="tcl-col-7">
      <div className="header-nav">
        <ul className="header-nav__lists">{newXhtml}</ul>
        <ul className="header-nav__lists">
          {/* <li onClick={() => {handleChangeLang('vi')}}>VI</li>
          <li onClick={() => {handleChangeLang('en')}}>EN</li> */}
          <li className="user">
            {!userInfor && (
              <Link to="/login">
                <i className="icons ion-person" />
                {t("login")}
              </Link>
            )}
            {userInfor && (
              <>
                <Link to="#">
                  <img src={userAvatar} alt={userInfor.nickname} />
                  {userInfor.nickname}
                </Link>
                <ul>
                  {inforPerson(menuInfo)}
                  <li>
                    <Link to="#" onClick={onClickLogOut}>
                      Đăng xuất
                    </Link>
                  </li>
                </ul>
              </>
            )}
          </li>
        </ul>
        <LanguageSwitcher />
      </div>
    </div>
  );
}

export default HeaderMenus;
