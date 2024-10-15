/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "./style.scss";
import ManagementDashboard from "./ManagementDashboard";
import { localhost } from "../../server";
import { authAxios } from "../../api/axiosClient";
import { ColorModeContext, useMode } from "../../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import ManagementUser from "../managementUser";
import HeaderMobile from "./Header/HeaderMobile";
import ManagementDashboardMobile from "./ManagementDashboardMobile";

const ManagementDashboardIndex = () => {
  const currentDate = dayjs();

  const [isOpenModalChecksheets, setIsOpenModalChecksheets] = useState(false);
  const [isOpenModalDailyLC, setIsOpenModalDailyLC] = useState(false);
  const [isOpenModalDailyAverage, setIsOpenModalDailyAverage] = useState(false);
  const [isOpenTable, setIsOpenTable] = useState(false);
  const [listPackageAll, setListPackageAll] = useState([]);
  const [isValueDashBoard, setIsValueDashBoard] = useState([]);
  const [isValueDashBoardOld, setIsValueDashBoardOld] = useState([]);
  const [isValueCheckSheets, setIsValueCheckSheets] = useState([]);
  const [isValueDailyNotqualified, setIsValueDailyNotqualified] = useState([]);
  const [isValueDailyNG, setIsValueDailyNG] = useState([]);
  const [isValueDailyAll, setIsValueDailyAll] = useState([]);
  const [isValueDailyAverage, setIsValueDailyAverage] = useState([]);
  const [checkValueResult, setCheckValueResult] = useState(undefined);
  const [checkValueStatus, setCheckValueStatus] = useState(undefined);
  const [checkClickSearch, setCheckClickSearch] = useState(false);
  const [
    isValueDatePickerModalCheckSheet,
    setIsValueDatePickerModalCheckSheet,
  ] = useState(undefined);
  const [isValueDatePickerModalDaily, setIsValueDatePickerModalDaily] =
    useState(undefined);
  const [isValueAverageTimeLc, setIsValueAverageTimeLc] = useState(undefined);
  const [
    isValueDatePickerModalDailyAverage,
    setIsValueDatePickerModalDailyAverage,
  ] = useState(undefined);
  const [isValueDatePickerManagement, setIsValueDatePickerManagement] =
    useState(undefined);
  const [valueSearch, setValueSearch] = useState([]);
  const [checkValueSearch, setCheckValueSearch] = useState(undefined);
  const [listPumb, setListPumb] = useState([]);
  const [dataPumb, setDataPumb] = useState(undefined);
  const [datePickerValue, setDatePickerValue] = useState(dayjs());
  const [chooseLanguage, setChooseLanguage] = useState(
    sessionStorage.getItem("choosedLanguage") !== null
      ? sessionStorage.getItem("choosedLanguage")
      : "japanese"
  );
  const [valueKeyMenu, setValueKeyMenu] = useState("1");
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));
  const [showOverlay, setShowOverlay] = useState(false);

  const handleClickOpenModalChecksheets = () => {
    setIsOpenModalChecksheets((prevState) => !prevState);
    setIsValueDatePickerModalCheckSheet(undefined);
    setDatePickerValue(dayjs());
  };

  const handleClickOpenModalDailyLC = () => {
    setIsOpenModalDailyLC((prevState) => !prevState);
    setIsValueDatePickerModalDaily(undefined);
    setDatePickerValue(dayjs());
  };

  const handleClickOpenModalDailyAverage = () => {
    setIsOpenModalDailyAverage((prevState) => !prevState);
    setIsValueDatePickerModalDailyAverage(undefined);
    setDatePickerValue(dayjs());
  };

  const fetchListPumb = () => {
    authAxios()
      .get(`${localhost}/get_list_pump`, {
        params: {
          user_role: inforUser.user_role,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setListPumb(res.data.list_pumb);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchListPackageAll = (pumbModel) => {
    authAxios()
      .post(`${localhost}/dash_board_content`, {
        user_role: inforUser.user_role,
        date_time:
          isValueDatePickerManagement === undefined
            ? currentDate.format("YYMMDD")
            : isValueDatePickerManagement,
        is_multi: pumbModel.is_multi,
        pump_id: pumbModel.value,
      })
      .then((res) => {
        setListPackageAll(res.data.lst_view);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClickButtonOpenTable = () => {
    setIsOpenTable((prevState) => !prevState);
    setCheckValueSearch(undefined);
    setCheckClickSearch(false);
    setValueSearch([]);
  };

  const fetchListDashBoard = (pumbModel) => {
    authAxios()
      .get(`${localhost}/dash_board`, {
        params: {
          user_role: inforUser.user_role,
          date_time:
            isValueDatePickerManagement === undefined
              ? currentDate.format("YYMMDD")
              : isValueDatePickerManagement,
          is_multi: pumbModel.is_multi,
          pump_id: pumbModel.value,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res.data);
        setIsValueDashBoard(res.data);
        setIsValueDashBoardOld(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchListMonthlyChecksheet = () => {
    const isMulti = listPumb[0].is_multi;
    const pumbId = listPumb[0].pumb_id;

    authAxios()
      .post(`${localhost}/monthly_checksheet`, {
        user_role: inforUser.user_role,
        date_time:
          isValueDatePickerModalCheckSheet === undefined
            ? currentDate.format("YYMM")
            : isValueDatePickerModalCheckSheet,
        is_multi: dataPumb === undefined ? isMulti : dataPumb.is_multi,
        pump_id: dataPumb === undefined ? pumbId : dataPumb.value,
      })
      .then((res) => {
        setIsValueCheckSheets(res.data.lst_view);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchListMonthlyQaNotq = () => {
    const isMulti = listPumb[0].is_multi;
    const pumbId = listPumb[0].pumb_id;

    authAxios()
      .post(`${localhost}/monthly_qa_notq`, {
        user_role: inforUser.user_role,

        date_time:
          isValueDatePickerModalDaily === undefined
            ? currentDate.format("YYMM")
            : isValueDatePickerModalDaily,
        is_multi: dataPumb === undefined ? isMulti : dataPumb.is_multi,
        pump_id: dataPumb === undefined ? pumbId : dataPumb.value,
      })
      .then((res) => {
        setIsValueDailyNotqualified(res.data.lst_notqualified);
        setIsValueDailyNG(res.data.lst_ng);
        setIsValueDailyAll(res.data.lst_all);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchListMonthlyAveTimeLC = () => {
    const isMulti = listPumb[0].is_multi;
    const pumbId = listPumb[0].pumb_id;

    authAxios()
      .post(`${localhost}/monthly_ave_timelc`, {
        user_role: inforUser.user_role,

        date_time:
          isValueDatePickerModalDailyAverage === undefined
            ? currentDate.format("YYMM")
            : isValueDatePickerModalDailyAverage,
        is_multi: dataPumb === undefined ? isMulti : dataPumb.is_multi,
        pump_id: dataPumb === undefined ? pumbId : dataPumb.value,
      })
      .then((res) => {
        setIsValueDailyAverage(res.data.lst_all);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDatePickerModalCheckSheet = (date) => {
    if (date) {
      setDatePickerValue(dayjs(date));
      const yymm = date.format("YYMM");

      setIsValueDatePickerModalCheckSheet(yymm);
    }
  };

  const handleDatePickerModalDaily = (date) => {
    if (date) {
      setDatePickerValue(dayjs(date));
      const yymm = date.format("YYMM");
      setIsValueDatePickerModalDaily(yymm);
    }
  };

  const handleDatePickerModalDailyAverage = (date) => {
    if (date) {
      setDatePickerValue(dayjs(date));
      const yymm = date.format("YYMM");
      setIsValueDatePickerModalDailyAverage(yymm);
    }
  };

  const handleDatePickerManagement = (date) => {
    if (date) {
      const yymm = date.format("YYMMDD");
      setIsValueDatePickerManagement(yymm);
      setCheckValueSearch(undefined);
      setCheckValueStatus(undefined);
      setCheckValueResult(undefined);
      setCheckClickSearch(false);
    }
  };

  const handleSearchTableManagemant = (e) => {
    setCheckValueSearch(e.target.value);
  };

  const handleChangeResult = (e) => {
    setCheckValueResult(e);
  };
  const handleChangeStatus = (e) => {
    setCheckValueStatus(e);
  };

  const filterByStatus = (list, status) =>
    list.filter((value) => value.status === status);

  const filterByResult = (list, result) =>
    list.filter((value) => value.result === result);

  const filterByKeyword = (list, keyword) => {
    const upperKeyword = keyword.toUpperCase();
    return list.filter(
      (value) =>
        value.vl_mfg_no.toUpperCase().includes(upperKeyword) ||
        value.vl_model_name.toUpperCase().includes(upperKeyword)
    );
  };

  const handleClickSearch = () => {
    setCheckClickSearch(true);
    let valueSS = listPackageAll;

    if (checkValueStatus !== undefined) {
      valueSS = filterByStatus(valueSS, checkValueStatus);
    }
    if (checkValueResult !== undefined) {
      valueSS = filterByResult(valueSS, checkValueResult);
    }
    if (checkValueSearch !== undefined) {
      valueSS = filterByKeyword(valueSS, checkValueSearch);
    }

    setValueSearch(valueSS);
  };

  const handleClearDataSearch = () => {
    setCheckValueSearch(undefined);
    setCheckValueStatus(undefined);
    setCheckValueResult(undefined);

    if (checkClickSearch === true) {
      setCheckClickSearch(false);
      setIsValueDashBoard(isValueDashBoardOld);
    }
  };

  const chooseModel = (value, data) => {
    const filterPumb = listPumb.filter((e) => e.pumb_id === data.key);
    sessionStorage.setItem("OptionMachine", JSON.stringify(filterPumb));

    setDataPumb(data);
    fetchListDashBoard(data);
    fetchListPackageAll(data);

    setCheckValueSearch(undefined);
    setCheckValueStatus(undefined);
    setCheckValueResult(undefined);
    setCheckClickSearch(false);
  };

  useEffect(() => {
    fetchListPumb();
    const idMenu = sessionStorage.getItem("id_menu");
    if (idMenu !== null) {
      setValueKeyMenu(idMenu);
    }
  }, []);

  useEffect(() => {
    if (listPumb.length !== 0) {
      const isMulti = listPumb[0].is_multi;
      const pumbId = listPumb[0].pumb_id;

      const data = {
        is_multi: isMulti,
        value: pumbId,
      };
      fetchListPackageAll(data);

      fetchListDashBoard(data);
    }
  }, [listPumb]);

  useEffect(() => {
    if (isValueDashBoard.length !== 0) {
      if (isValueDashBoard.average_time_lc.length === 0) {
        setIsValueAverageTimeLc(0);
      } else {
        const total = isValueDashBoard.average_time_lc.reduce(
          (acc, num) => acc + num,
          0
        );
        const average = total / isValueDashBoard.average_time_lc.length;
        setIsValueAverageTimeLc(Math.round(average));
      }
    }
  }, [isValueDashBoard]);

  useEffect(() => {
    if (
      isOpenModalChecksheets === true ||
      isValueDatePickerModalCheckSheet !== undefined
    ) {
      fetchListMonthlyChecksheet();
    }
  }, [isOpenModalChecksheets, isValueDatePickerModalCheckSheet]);

  useEffect(() => {
    if (
      isOpenModalDailyLC === true ||
      isValueDatePickerModalDaily !== undefined
    ) {
      fetchListMonthlyQaNotq();
    }
  }, [isOpenModalDailyLC, isValueDatePickerModalDaily]);

  useEffect(() => {
    if (
      isOpenModalDailyAverage === true ||
      isValueDatePickerModalDailyAverage !== undefined
    ) {
      fetchListMonthlyAveTimeLC();
    }
  }, [isOpenModalDailyAverage, isValueDatePickerModalDailyAverage]);

  useEffect(() => {
    if (isOpenTable === true || isValueDatePickerManagement !== undefined) {
      const isMulti = listPumb[0].is_multi;
      const pumbId = listPumb[0].pumb_id;

      const data = {
        is_multi: dataPumb === undefined ? isMulti : dataPumb.is_multi,
        value: dataPumb === undefined ? pumbId : dataPumb.value,
      };

      fetchListDashBoard(data);
      fetchListPackageAll(data);
    }
  }, [isValueDatePickerManagement]);

  const [theme, colorMode] = useMode();

  const handleChangeSelectLanguage = (value) => {
    setChooseLanguage(value);
    sessionStorage.setItem("choosedLanguage", value);
  };
  const onClickMenuDashboard = (value) => {
    setValueKeyMenu(value.key);
    sessionStorage.setItem("id_menu", value.key);
    setShowOverlay(false);
    const isMulti = listPumb[0].is_multi;
    const pumbId = listPumb[0].pumb_id;

    const data = {
      is_multi: dataPumb === undefined ? isMulti : dataPumb.is_multi,
      value: dataPumb === undefined ? pumbId : dataPumb.value,
    };
    const currentDate = dayjs();
    const yymm = currentDate.format("YYMMDD");
    setIsValueDatePickerManagement(yymm);

    fetchListPackageAll(data);
    fetchListDashBoard(data);
  };

  const screenWidth = window.innerWidth;

  useEffect(() => {
    if (
      showOverlay ||
      isOpenModalChecksheets ||
      isOpenModalDailyLC ||
      isOpenModalDailyAverage
    ) {
      // Disable scroll
      document.body.style.overflow = "hidden";
    } else {
      // Enable scroll
      document.body.style.overflow = "auto";
    }

    // Cleanup function to re-enable scroll when component is unmounted or overlay is closed
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [
    showOverlay,
    isOpenModalChecksheets,
    isOpenModalDailyLC,
    isOpenModalDailyAverage,
  ]);

  const [orientation, setOrientation] = useState(
    window.innerWidth > window.innerHeight ? "landscape" : "portrait"
  );

  const handleResize = () => {
    if (window.innerWidth > window.innerHeight) {
      setOrientation("landscape");
    } else {
      setOrientation("portrait");
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // useEffect(() => {
  //   alert(screenWidth);
  // }, [orientation]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div
          className="app"
          style={{ display: "flex", flexDirection: "column", height: "100vh" }}
        >
          <main className="content1" style={{ flex: "1" }}>
            {screenWidth <= 1000 ? (
              <HeaderMobile
                chooseLanguage={chooseLanguage}
                handleChangeSelectLanguage={handleChangeSelectLanguage}
                onClickMenuDashboard={onClickMenuDashboard}
                valueKeyMenu={valueKeyMenu}
                setShowOverlay={setShowOverlay}
                showOverlay={showOverlay}
              />
            ) : (
              <Header
                chooseLanguage={chooseLanguage}
                handleChangeSelectLanguage={handleChangeSelectLanguage}
                onClickMenuDashboard={onClickMenuDashboard}
                valueKeyMenu={valueKeyMenu}
              />
            )}

            <div className="container-fluid" style={{ maxWidth: "100%" }}>
              {valueKeyMenu === "1" ? (
                <>
                  {screenWidth <= 1000 ? (
                    <ManagementDashboardMobile
                      isOpenModalChecksheets={isOpenModalChecksheets}
                      handleClickOpenModalChecksheets={
                        handleClickOpenModalChecksheets
                      }
                      isOpenModalDailyLC={isOpenModalDailyLC}
                      handleClickOpenModalDailyLC={handleClickOpenModalDailyLC}
                      isOpenModalDailyAverage={isOpenModalDailyAverage}
                      handleClickOpenModalDailyAverage={
                        handleClickOpenModalDailyAverage
                      }
                      isOpenTable={isOpenTable}
                      listPackageAll={listPackageAll}
                      isValueDashBoard={isValueDashBoard}
                      isValueCheckSheets={isValueCheckSheets}
                      isValueDailyNotqualified={isValueDailyNotqualified}
                      isValueDailyNG={isValueDailyNG}
                      isValueDailyAll={isValueDailyAll}
                      isValueDailyAverage={isValueDailyAverage}
                      handleClickButtonOpenTable={handleClickButtonOpenTable}
                      handleDatePickerModalCheckSheet={
                        handleDatePickerModalCheckSheet
                      }
                      handleDatePickerModalDaily={handleDatePickerModalDaily}
                      handleDatePickerModalDailyAverage={
                        handleDatePickerModalDailyAverage
                      }
                      handleDatePickerManagement={handleDatePickerManagement}
                      handleSearchTableManagemant={handleSearchTableManagemant}
                      valueSearch={valueSearch}
                      checkValueSearch={checkValueSearch}
                      handleChangeResult={handleChangeResult}
                      handleClickSearch={handleClickSearch}
                      handleChangeStatus={handleChangeStatus}
                      checkClickSearch={checkClickSearch}
                      checkValueStatus={checkValueStatus}
                      checkValueResult={checkValueResult}
                      isValueAverageTimeLc={isValueAverageTimeLc}
                      handleClearDataSearch={handleClearDataSearch}
                      listPumb={listPumb}
                      chooseModel={chooseModel}
                      datePickerValue={datePickerValue}
                      chooseLanguage={chooseLanguage}
                    />
                  ) : (
                    <ManagementDashboard
                      isOpenModalChecksheets={isOpenModalChecksheets}
                      handleClickOpenModalChecksheets={
                        handleClickOpenModalChecksheets
                      }
                      isOpenModalDailyLC={isOpenModalDailyLC}
                      handleClickOpenModalDailyLC={handleClickOpenModalDailyLC}
                      isOpenModalDailyAverage={isOpenModalDailyAverage}
                      handleClickOpenModalDailyAverage={
                        handleClickOpenModalDailyAverage
                      }
                      isOpenTable={isOpenTable}
                      listPackageAll={listPackageAll}
                      isValueDashBoard={isValueDashBoard}
                      isValueCheckSheets={isValueCheckSheets}
                      isValueDailyNotqualified={isValueDailyNotqualified}
                      isValueDailyNG={isValueDailyNG}
                      isValueDailyAll={isValueDailyAll}
                      isValueDailyAverage={isValueDailyAverage}
                      handleClickButtonOpenTable={handleClickButtonOpenTable}
                      handleDatePickerModalCheckSheet={
                        handleDatePickerModalCheckSheet
                      }
                      handleDatePickerModalDaily={handleDatePickerModalDaily}
                      handleDatePickerModalDailyAverage={
                        handleDatePickerModalDailyAverage
                      }
                      handleDatePickerManagement={handleDatePickerManagement}
                      handleSearchTableManagemant={handleSearchTableManagemant}
                      valueSearch={valueSearch}
                      checkValueSearch={checkValueSearch}
                      handleChangeResult={handleChangeResult}
                      handleClickSearch={handleClickSearch}
                      handleChangeStatus={handleChangeStatus}
                      checkClickSearch={checkClickSearch}
                      checkValueStatus={checkValueStatus}
                      checkValueResult={checkValueResult}
                      isValueAverageTimeLc={isValueAverageTimeLc}
                      handleClearDataSearch={handleClearDataSearch}
                      listPumb={listPumb}
                      chooseModel={chooseModel}
                      datePickerValue={datePickerValue}
                      chooseLanguage={chooseLanguage}
                    />
                  )}
                </>
              ) : (
                <ManagementUser chooseLanguage={chooseLanguage} />
              )}
            </div>
          </main>
          <Footer chooseLanguage={chooseLanguage} />
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ManagementDashboardIndex;
