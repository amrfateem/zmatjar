"use client";
import { useEffect, useState } from "react";
import { Link } from "react-scroll";
import { useRecoilState } from "recoil";
import { categoriesState, colStyleState, searchState } from "../atoms";
import { useTranslations } from "next-intl";

function NavBar({ categories, locale }) {
  const [activeSection, setActiveSection] = useState(null);
  const [show, setShow] = useState(false);
  const [colStyle, setColStyle] = useRecoilState(colStyleState);
  const [isSticky, setIsSticky] = useState(false);

  const [cats, setCats] = useRecoilState(categoriesState);

  setCats(categories);

  const t = useTranslations();

  const [searchTerm, setSearchTerm] = useRecoilState(searchState);

  const handleSearch = (e) => {
    let nav = document.getElementById("nav");
    nav.scrollIntoView();
    setSearchTerm(e.target.value);
  };

  const handleColStyle = (e) => {
    if (e.target.id === "gridStyle") {
      setColStyle("grid");
    } else {
      setColStyle("list");
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const navElement = document.getElementById("nav");
      const threshold = navElement.offsetTop;

      if (offset >= threshold && !isSticky) {
        setIsSticky(true);
      } else if (offset < threshold && isSticky) {
        setIsSticky(false);
      }
      const sections = categories.map((category, i) => ({
        id: `${locale}/cat${i}`,
        link: `${locale}/link${i}`,
      }));
      const newActiveSection = sections.find(({ id }) => {
        const sectionElement = document.getElementById(id);
        if (sectionElement) {
          const rect = sectionElement.getBoundingClientRect();
          return rect.top <= 0 && rect.bottom > 0;
        }
        return false;
      });

      if (newActiveSection && newActiveSection.id !== activeSection) {
        setActiveSection(newActiveSection.id);
        const activeSectionElement = document.getElementById(
          newActiveSection.link
        );
        if (activeSectionElement) {
          activeSectionElement.scrollIntoView();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isSticky, activeSection]);

  return (
    <div id="nav" className="h-12 relative shadow-custom">
      <div
        className={`bg-white flex py-2 px-2 gap-2 z-20 overflow-hidden w-full max-w-[460px] ${
          isSticky ? "fixed top-0" : ""
        }`}
      >
        {!show ? (
          <>
            <a
              className={`self-center cursor-pointer ${
                colStyle === "grid" ? "active-svg" : "faded-svg"
              }`}
              onClick={(e) => handleColStyle(e)}
            >
              <svg
                viewBox="0 0 21 21"
                xmlns="http://www.w3.org/2000/svg"
                className="icon-grid atom-icon nav-category_icon"
                width={21}
                height={21}
                id="gridStyle"
              >
                <path d="M4.067 2.8a.267.267 0 00-.267.267v4.266c0 .148.12.267.267.267h4.266c.148 0 .267-.12.267-.267V3.067a.267.267 0 00-.267-.267H4.067zM2.2 3.067c0-1.031.836-1.867 1.867-1.867h4.266c1.031 0 1.867.836 1.867 1.867v4.266A1.867 1.867 0 018.333 9.2H4.067A1.867 1.867 0 012.2 7.333V3.067zM4.067 12.4a.267.267 0 00-.267.267v4.266c0 .148.12.267.267.267h4.266c.148 0 .267-.12.267-.267v-4.266a.267.267 0 00-.267-.267H4.067zm-1.867.267c0-1.031.836-1.867 1.867-1.867h4.266c1.031 0 1.867.836 1.867 1.867v4.266A1.867 1.867 0 018.333 18.8H4.067A1.867 1.867 0 012.2 16.933v-4.266zM13.667 2.8a.267.267 0 00-.267.267v4.266c0 .148.12.267.267.267h4.266c.148 0 .267-.12.267-.267V3.067a.267.267 0 00-.267-.267h-4.266zm-1.867.267c0-1.031.836-1.867 1.867-1.867h4.266c1.031 0 1.867.836 1.867 1.867v4.266A1.867 1.867 0 0117.933 9.2h-4.266A1.867 1.867 0 0111.8 7.333V3.067zm1.867 9.333a.267.267 0 00-.267.267v4.266c0 .148.12.267.267.267h4.266c.148 0 .267-.12.267-.267v-4.266a.267.267 0 00-.267-.267h-4.266zm-1.867.267c0-1.031.836-1.867 1.867-1.867h4.266c1.031 0 1.867.836 1.867 1.867v4.266a1.867 1.867 0 01-1.867 1.867h-4.266a1.867 1.867 0 01-1.867-1.867v-4.266z"></path>
              </svg>
            </a>
            <a
              className={`self-center cursor-pointer ${
                colStyle === "list" ? "active-svg" : "faded-svg"
              }`}
              onClick={(e) => handleColStyle(e)}
            >
              <svg
                viewBox="0 0 21 21"
                xmlns="http://www.w3.org/2000/svg"
                height={21}
                width={21}
                id="listStyle"
              >
                <path d="M14.417 3.6a.75.75 0 00-.75-.75H3a.75.75 0 000 1.5h10.667a.75.75 0 00.75-.75zm0 6.4a.75.75 0 00-.75-.75H3a.75.75 0 000 1.5h10.667a.75.75 0 00.75-.75zm0 6.4a.75.75 0 00-.75-.75H3a.75.75 0 000 1.5h10.667a.75.75 0 00.75-.75zM18.25 2.75v1.7h-1.7v-1.7h1.7zm1.5-.217c0-.708-.575-1.283-1.283-1.283h-2.134c-.708 0-1.283.575-1.283 1.283v2.134c0 .708.575 1.283 1.283 1.283h2.134c.708 0 1.283-.575 1.283-1.283V2.533zm-1.5 6.617v1.7h-1.7v-1.7h1.7zm1.5-.217c0-.708-.575-1.283-1.283-1.283h-2.134c-.708 0-1.283.575-1.283 1.283v2.134c0 .708.575 1.283 1.283 1.283h2.134c.708 0 1.283-.575 1.283-1.283V8.933zm-1.5 6.617v1.7h-1.7v-1.7h1.7zm1.5-.217c0-.708-.575-1.283-1.283-1.283h-2.134c-.708 0-1.283.575-1.283 1.283v2.134c0 .708.575 1.283 1.283 1.283h2.134c.708 0 1.283-.575 1.283-1.283v-2.134z"></path>
              </svg>
            </a>

            <div className="flex overflow-auto gap-2 scrollbar-hide">
              {categories.map((cat, index) => (
                <Link
                  id={`link${index}`}
                  to={`cat${index}`}
                  href={`link${index}`}
                  key={index}
                  smooth={true}
                  spy={true}
                >
                  <span
                    className={`nav-category_label h-8  px-4 rounded-full text-xs leading-6 border-[1px] whitespace-nowrap flex items-center transition-all duration-300 ease-in-out font-ITC-BK rtl:font-DIN-Bold ${
                      activeSection === `cat${index}`
                        ? "bg-secondry text-white"
                        : ""
                    }`}
                  >
                    {cat}
                  </span>
                </Link>
              ))}
            </div>

            <a className="self-center cursor-pointer" onClick={() => setShow(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 122.879 119.799"
                height={21}
                width={21}
              >
                <path d="M49.988,0h0.016v0.007C63.803,0.011,76.298,5.608,85.34,14.652c9.027,9.031,14.619,21.515,14.628,35.303h0.007v0.033v0.04 h-0.007c-0.005,5.557-0.917,10.905-2.594,15.892c-0.281,0.837-0.575,1.641-0.877,2.409v0.007c-1.446,3.66-3.315,7.12-5.547,10.307 l29.082,26.139l0.018,0.016l0.157,0.146l0.011,0.011c1.642,1.563,2.536,3.656,2.649,5.78c0.11,2.1-0.543,4.248-1.979,5.971 l-0.011,0.016l-0.175,0.203l-0.035,0.035l-0.146,0.16l-0.016,0.021c-1.565,1.642-3.654,2.534-5.78,2.646 c-2.097,0.111-4.247-0.54-5.971-1.978l-0.015-0.011l-0.204-0.175l-0.029-0.024L78.761,90.865c-0.88,0.62-1.778,1.209-2.687,1.765 c-1.233,0.755-2.51,1.466-3.813,2.115c-6.699,3.342-14.269,5.222-22.272,5.222v0.007h-0.016v-0.007 c-13.799-0.004-26.296-5.601-35.338-14.645C5.605,76.291,0.016,63.805,0.007,50.021H0v-0.033v-0.016h0.007 c0.004-13.799,5.601-26.296,14.645-35.338C23.683,5.608,36.167,0.016,49.955,0.007V0H49.988L49.988,0z M50.004,11.21v0.007h-0.016 h-0.033V11.21c-10.686,0.007-20.372,4.35-27.384,11.359C15.56,29.578,11.213,39.274,11.21,49.973h0.007v0.016v0.033H11.21 c0.007,10.686,4.347,20.367,11.359,27.381c7.009,7.012,16.705,11.359,27.403,11.361v-0.007h0.016h0.033v0.007 c10.686-0.007,20.368-4.348,27.382-11.359c7.011-7.009,11.358-16.702,11.36-27.4h-0.006v-0.016v-0.033h0.006 c-0.006-10.686-4.35-20.372-11.358-27.384C70.396,15.56,60.703,11.213,50.004,11.21L50.004,11.21z"></path>
              </svg>
            </a>
          </>
        ) : (
          <>
            <input
              type="text"
              className="border-[1px] border-secondry rounded-full px-4 py-2 w-full h-8 focus:border-secondry hover:ring-0 font-ITC-BK rtl:font-DIN-Bold "
              placeholder={t("search")}
              value={searchTerm}
              onChange={handleSearch}
            />

            <a
              className="self-center cursor-pointer"
              onClick={() => {
                setShow(false), setSearchTerm("");
              }}
            >
              <svg
                version="1.1"
                viewBox="0 0 512 512"
                xmlns="http://www.w3.org/2000/svg"
                height={21}
                width={21}
              >
                <path d="M443.6,387.1L312.4,255.4l131.5-130c5.4-5.4,5.4-14.2,0-19.6l-37.4-37.6c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4  L256,197.8L124.9,68.3c-2.6-2.6-6.1-4-9.8-4c-3.7,0-7.2,1.5-9.8,4L68,105.9c-5.4,5.4-5.4,14.2,0,19.6l131.5,130L68.4,387.1  c-2.6,2.6-4.1,6.1-4.1,9.8c0,3.7,1.4,7.2,4.1,9.8l37.4,37.6c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1L256,313.1l130.7,131.1  c2.7,2.7,6.2,4.1,9.8,4.1c3.5,0,7.1-1.3,9.8-4.1l37.4-37.6c2.6-2.6,4.1-6.1,4.1-9.8C447.7,393.2,446.2,389.7,443.6,387.1z"></path>
              </svg>
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default NavBar;
