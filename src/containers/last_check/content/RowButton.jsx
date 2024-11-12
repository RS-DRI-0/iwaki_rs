import { Button, Col } from 'antd'
import { useEffect, useState } from 'react'
import ModalShowCheckLogic from '../modal/ModalShowCheckLogic'
import ModalDataMaster from '../modal/ModalDataMaster'
import { localhost } from '../../../server'
import { SaveOutlined } from '@ant-design/icons'
import { authAxios } from '../../../api/axiosClient'
import PropTypes from "prop-types";
import ModalDataMasterSecond from '../modal/ModalDataMasterSecond'
// import mockDataMasterLK from "../mockDataMasterLK.json"
import mockDataMasterMDH from "../mockDataMasterMDH.json"

const RowButton = (
    { listNoCheckLogic,
        dataLastCheck,
        pumpId,
        setListNoCheckLogic,
        setListCheckRuleWarning,
        dataDetail,
        setDataLastCheck,
        listDataDefault,
        dataPumb,
        form,
        setListNotQualified,
        setIsCheckLogic,
        setIsSortData,
        isSortData,
        newDataTable,
        setLoadingMainTable,
        setListIndexLogicGrid,
        formGrid,
        dataGridLastCheck,
        listRuleCompare,
        setListLogicMulti,
        listLogicMulti,
        isCheckShowDataMaster,
        setIsCheckShowDataMaster,
        valueIsMaster,
        setListReport,
        listReport
    }) => {
    const [isOpenModalCheckLogic, setIsOpenModalCheckLogic] = useState(false)
    const [isOpenModalDataMaster, setIsOpenModalDataMaster] = useState(false)
    const [isOpenModalDataMasterSecond, setIsOpenModalDataMasterSecond] = useState(false)
    const [listDataMaster, setListDataMaster] = useState([])
    const [loadingTable, setLoadingTable] = useState(false)
    const inforUser = JSON.parse(sessionStorage.getItem("info_user"));
    // const [dataCheckLogicListReport, setDataCheckLogicListReport] = useState()

    const checkLogicData = () => {

        // dataPumb.is_master === 0 là MDG
        // dataPumb.is_master === 1 là LK
        if (parseInt(dataPumb.is_master) === 0) {
            checkLogicGrid()
        }
        setIsOpenModalCheckLogic(true)
    }

    const showModalSetDataMaster = () => {
        if (valueIsMaster === "1") {
            setIsOpenModalDataMaster(true)
        } else if (valueIsMaster === "2") {
            setIsOpenModalDataMasterSecond(true)
        }
    }

    const isPumpHaveMaster = parseInt(dataPumb.is_master) !== 0

    const functionSetArrData = (data, arrData) => {
        data.forEach(item => {
            arrData.push({
                No: item.No,
                field_name: item.field_name,
                checksheet: item.checksheet,
                Tem: item.Tem,
                Result: item.Result,
                Production_Instructions: item.Production_Instructions,
                Name_plate: item.Name_plate,
                Master: item.Master,
                rule_point: item.rule_point,
                check_result: item.check_result,
                mark: item.mark,
                vl_rule: item.vl_rule,
                mark_checksheet: item.mark_checksheet,
                mark_Production_Instructions: item.mark_Production_Instructions,
                mark_Name_plate: item.mark_Name_plate,
                mark_Tem: item.mark_Tem,
                other_rule: item.other_rule,
                is_qualified: item.is_qualified,
                no_compair: item.no_compair,
                vl_grid: item.vl_grid,
                vl_grid_compair: item.vl_grid_compair,
                raw_value: item.raw_value
            })
        })
    }

    const funcDataCheckLogic = (data, dataForm, isSetDataForm) => {
        if (isSetDataForm) {
            Object.keys(dataForm).map(item => {
                let arr_key = item.split("__");
                return form.setFieldValue(item, data[arr_key[1]][arr_key[2]])
            });
        } else {
            Object.keys(dataForm).map(item => {
                let arr_key = item.split("__");
                return data[arr_key[1]][arr_key[2]] = dataForm[item]
            });
        }
    }

    const someAsyncFunction = async () => {
        // Thực hiện một số tác vụ bất đồng bộ
        setLoadingMainTable(true);
        setLoadingTable(true)
        return new Promise((resolve) => setTimeout(resolve, 200));
    };

    const onFinish = async (values) => {
        await someAsyncFunction()
        const dataForm = form.getFieldValue()
        let arrData = []
        const checkTypePump = Number(dataPumb.is_master) === 2
        funcDataCheckLogic(listDataDefault, dataForm, false)

        functionSetArrData(listDataDefault, arrData)
        let newArr = []
        for (let i = 1; i < (checkTypePump ? 6 : 11); i++) {
            if (values[`input_${i}`] === undefined) {
                newArr.push("")
            } else {
                newArr.push(values[`input_${i}`])
            }
        }
        const dataNo40 = arrData.filter(item => parseInt(item.No) === 40)
        const FormData = require("form-data");
        let data = new FormData();


        data.append("lst_master", newArr);
        data.append("pump_id", dataPumb.value);
        data.append("no40_vl", dataNo40[0].checksheet);
        data.append("user_role", inforUser.user_role);


        let dataMaster2 = new FormData();
        dataMaster2.append("lst_master", newArr);
        dataMaster2.append("user_role", inforUser.user_role);

        const apiMaster = checkTypePump ? "view_master_2" : "view_master"
        const dataSubmit = checkTypePump ? dataMaster2 : data
        authAxios()
            .post(`${localhost}/${apiMaster}`, dataSubmit).then(res => {
                let listIndexHaveMaster = []
                for (let i = 0; i < arrData.length; i++) {
                    for (const element of res.data.lst_master) {

                        if (arrData[i].No === element.no) {
                            if (element.Value === undefined) {
                                if (arrData[i].checksheet === "") {
                                    arrData[i] = { ...arrData[i], Master: element.m11 }
                                    listIndexHaveMaster.push(i)
                                    break
                                }
                                else if (arrData[i].checksheet !== "") {
                                    if (arrData[i].checksheet === element.m11) {
                                        arrData[i] = { ...arrData[i], Master: arrData[i].checksheet }
                                        listIndexHaveMaster.push(i)
                                        break;
                                    } else {
                                        arrData[i] = { ...arrData[i], Master: element.m11 }
                                        listIndexHaveMaster.push(i)
                                    }
                                }
                            } else if (element.Value !== undefined) {
                                if (arrData[i].checksheet === "") {
                                    arrData[i] = { ...arrData[i], Master: element.Value }
                                    listIndexHaveMaster.push(i)
                                    break
                                }
                                else if (arrData[i].checksheet !== "") {
                                    if (arrData[i].checksheet === element.Value) {
                                        arrData[i] = { ...arrData[i], Master: arrData[i].checksheet }
                                        listIndexHaveMaster.push(i)
                                        break;
                                    } else {
                                        arrData[i] = { ...arrData[i], Master: element.Value }
                                        listIndexHaveMaster.push(i)
                                    }
                                }
                            }
                        }
                    }
                }

                listIndexHaveMaster.forEach(item => {
                    form.setFieldValue(`data_add__${item}__Master`, arrData[item].Master)
                })
                // setListDataMaster(res.data.lst_master)
                setListDataMaster(res.data.lst_master)
                saveData()

                // if (listNoCheckLogic.length === 0) {

                // }
                setLoadingMainTable(false)
                setIsCheckShowDataMaster(true)
                setIsCheckLogic(false)
                setIsSortData(false)
                setLoadingTable(false)
            }).catch(err => {
                setLoadingMainTable(false)
                setLoadingTable(false)
            })
    }

    const fetchDataCheckLogic = (newDataLastCheck) => {
        const dataChecksheet = {}
        newDataLastCheck.forEach(item => {
            dataChecksheet[item.No] = item.checksheet
        })
        authAxios()
            .post(`${localhost}/check_logic`, {
                results: newDataLastCheck,
                pump_id: pumpId,
                user_role: inforUser.user_role,
                vl_checksheet: dataChecksheet
            })
            .then((res) => {
                let listNoWarning = []
                res.data.lst_report.forEach(item => {
                    if (res.data.lst_rule_warning.includes(item.rule)) {
                        listNoWarning.push(item.No)
                    }
                })
                const listNo = res.data.lst_report.filter(item => !listNoWarning.includes(item.No)).map(item => item.No)
                const listNoCheckLogicOld = [...listNoCheckLogic]

                // Tìm No không xuất hiện ở listNO mới

                const elementNotExist = listNoCheckLogicOld.filter(item => !listNo.includes(item));
                newDataLastCheck.forEach(item => {
                    if (listNo.includes(item.No)) {
                        item.Result = "✖"
                    } else if (elementNotExist.includes(item.No)) {
                        item.Result = "✔"
                    }
                })

                setListCheckRuleWarning(listNoWarning)
                setListNoCheckLogic(listNo)
                // setDataCheckLogicListReport(res.data.lst_report)

                // if (Object.keys(res.data.lst_circle).length > 0) {
                //     let listIndex = []
                //     res.data.lst_circle.round_2.split("|").forEach((item, index) => {
                //         if (item == 0) {
                //             listIndex.push(index)
                //         }
                //     })
                //     setListInput(listIndex)
                //     setListIndexInput(listIndex)
                // }

                // setListCircle(res.data.lst_circle)
                setListLogicMulti(res.data.lst_logic_multi)
                setIsCheckLogic(true)
                if (dataDetail.grid.length > 0) {
                    functionCheckLogicMaster(listNo)
                }
                setDataLastCheck(newDataLastCheck)
                setLoadingMainTable(false)
            }).catch(err => {
                console.log(err)
            })
    }

    const functionCheckLogicMaster = (listNo) => {
        let arrIndex = []
        let newArrData = dataLastCheck
        const dataForm = form.getFieldsValue()

        if (listNo.length > 0) {
            for (let i = 0; i < dataLastCheck.length; i++) {
                for (const element of listNo) {
                    if (dataLastCheck[i].No === element) {
                        arrIndex.push({
                            index: i,
                            result: "✖"
                        })
                        break;
                    } else {
                        arrIndex.push({
                            index: i,
                            result: dataLastCheck[i].check_result
                        })
                    }
                }
            }
        } else {
            for (let i = 0; i < dataLastCheck.length; i++) {
                arrIndex.push({
                    index: i,
                    result: dataLastCheck[i].check_result
                })
            }
        }
        arrIndex.forEach(item => {
            newArrData[item.index].Result = item.result
        })

        Object.keys(dataForm).map(item => {
            let arr_key = item.split("__");
            return form.setFieldValue(item, newArrData[arr_key[1]][arr_key[2]])
        });

        let dataNotQualified = newArrData.filter(item => item.Result === "✖")
        setListNotQualified(dataNotQualified)
        setDataLastCheck(newArrData)
    }

    const addDataEqual = (listArrHaveContent, dataCheckSheet) => {
        // Đúng
        listArrHaveContent.push(dataCheckSheet)
        listArrHaveContent.push(dataCheckSheet)
    }

    const functionAddDataOftilede = (listArrHaveContent, item) => {
        if (item.checksheet !== "") {
            listArrHaveContent.push(item.checksheet.split("~")[0])
        }
        if (item.Name_plate !== "") {
            listArrHaveContent.push(item.Name_plate.split("~")[0])
        }
        if (item.Production_Instructions !== "") {
            listArrHaveContent.push(item.Production_Instructions.split("~")[0])
        }
        if (item.Tem !== "") {
            listArrHaveContent.push(item.Tem.split("~")[0])
        }

        if (item.Master !== "") {
            listArrHaveContent.push(item.Master.split("~")[0])
        }
    }

    const functionCheckConditionOftilede = (condition, arrProduction, listArrHaveContent, item, dataCheckSheet) => {
        if (condition) {
            if (parseInt(arrProduction[0].match(/\d+/g).join('')) <= parseInt(dataCheckSheet.match(/\d+/g).join('')) && parseInt(dataCheckSheet.match(/\d+/g).join('')) <= parseInt(arrProduction[1].match(/\d+/g).join(''))) {
                addDataEqual(listArrHaveContent, dataCheckSheet)
            } else {
                functionAddDataOftilede(listArrHaveContent, item)
            }
        } else {
            functionAddDataOftilede(listArrHaveContent, item)
        }
    }

    // function check ~ 
    const functionChecktilde = (item, listArrHaveContent) => {
        if (item.Production_Instructions.includes("~")) {
            let arrProduction = item.Production_Instructions.split("~")

            let dataCheckSheet = ''

            if (item.checksheet.includes("~")) {
                dataCheckSheet = item.checksheet.split("~")[0]
            } else {
                dataCheckSheet = item.checksheet
            }

            let condition = false
            if (item.Name_plate !== "" && item.Tem !== "") {
                condition = dataCheckSheet === item.Name_plate && dataCheckSheet === item.Tem
                functionCheckConditionOftilede(condition, arrProduction, listArrHaveContent, item, dataCheckSheet)
            } else if (item.Name_plate !== "" && item.Tem === "") {
                condition = dataCheckSheet === item.Name_plate
                functionCheckConditionOftilede(condition, arrProduction, listArrHaveContent, item, dataCheckSheet)
            } else if (item.Name_plate === "" && item.Tem !== "") {
                condition = dataCheckSheet === item.Tem
                functionCheckConditionOftilede(condition, arrProduction, listArrHaveContent, item, dataCheckSheet)
            } else if (parseInt(arrProduction[0].match(/\d+/g).join('')) <= parseInt(dataCheckSheet.match(/\d+/g).join('')) && parseInt(dataCheckSheet.match(/\d+/g).join('')) <= parseInt(arrProduction[1].match(/\d+/g).join(''))) {
                addDataEqual(listArrHaveContent, dataCheckSheet)
            } else {
                functionAddDataOftilede(listArrHaveContent, item)
            }
        }
    }

    // function check _
    const functionCheckUnderline = (item, listArrHaveContent) => {
        if (item.Name_plate !== "") {
            listArrHaveContent.push(item.Name_plate.split("_")[0])
        }
        if (item.Production_Instructions !== "") {
            listArrHaveContent.push(item.Production_Instructions.split("_")[0])
        }
        if (item.Tem !== "") {
            listArrHaveContent.push(item.Tem.split("_")[0])
        }

        if (item.Master !== "") {
            listArrHaveContent.push(item.Master.split("_")[0])
        }
    }

    const functionAddAllDataCol = (item, listArrHaveContent) => {
        if (item.checksheet !== "") {
            listArrHaveContent.push(item.checksheet)
        }
        if (item.Name_plate !== "") {
            listArrHaveContent.push(item.Name_plate)
        }
        if (item.Production_Instructions !== "") {
            listArrHaveContent.push(item.Production_Instructions)
        }
        if (item.Tem !== "") {
            listArrHaveContent.push(item.Tem)
        }

        if (item.Master !== "") {
            listArrHaveContent.push(item.Master)
        }
    }

    const functionPushData = (newArrData, item, dataResult) => {
        // item = arrData[i]
        newArrData.push({
            ...item, Result: dataResult
        })
    }

    const functionCheckConditionCompare = (condition, newArrData, element) => {
        if (condition) {
            functionPushData(newArrData, element, element.check_result)
        } else {
            functionPushData(newArrData, element, "✖")
        }
    }

    const functionSetCheckResult = (element, newArrData, listArrHaveContent) => {
        if (parseInt(element.No) !== 31) {
            console.log(element)
            if (parseInt(element.is_qualified) === 0) {
                functionPushData(newArrData, element, "✔")
            }
            else if (element.checksheet === "/" && element.Master !== "") {
                functionPushData(newArrData, element, element.check_result)
            }
            else if (listArrHaveContent.length === 0 || listArrHaveContent.length === 1) {
                functionCheckConditionCompare(element.Master === "", newArrData, element)
            }
            else {
                const compareData = listArrHaveContent.every(value => value === listArrHaveContent[0])
                console.log(listArrHaveContent)
                console.log(compareData)
                functionCheckConditionCompare(compareData, newArrData, element)
            }
        } else {
            functionPushData(newArrData, element, element.check_result)
        }
    }

    const saveData = () => {
        const values = form.getFieldsValue()
        let arrData = []

        funcDataCheckLogic(listDataDefault, values, false)
        functionSetArrData(listDataDefault, arrData)

        let newArrData = []
        for (const element of arrData) {
            let listArrHaveContent = [];

            if (element.checksheet.includes("_")) {
                const dataNo3 = element.checksheet.split("_")
                listArrHaveContent.push(dataNo3[0])

                functionCheckUnderline(element, listArrHaveContent)
            } else if (element.Production_Instructions.includes("~")) {
                functionChecktilde(element, listArrHaveContent)
            }
            else {
                console.log(listArrHaveContent)
                functionAddAllDataCol(element, listArrHaveContent)
            }

            functionSetCheckResult(element, newArrData, listArrHaveContent)
        }

        const newDataForm = form.getFieldsValue()
        funcDataCheckLogic(newArrData, newDataForm, true)

        let dataNotQualified = newArrData.filter(item => item.Result === "✖")
        // if (listNoCheckLogic.length > 0) {
        //     fetchDataCheckLogic(newArrData)
        // } else {
        //     setDataLastCheck(newArrData)
        // }
        newArrData.forEach(item => {
            if (listNoCheckLogic.includes(item.No)) {
                item.Result = "✖"
            }
        })

        setDataLastCheck(newArrData)
        setListNotQualified(dataNotQualified)
    }

    const checkLogicGrid = () => {
        const dataFormGrid = formGrid.getFieldsValue();
        let listIndexLogic = []
        let newData = dataGridLastCheck

        // true set form
        // false set data
        funcDataCheckLogic(newData, dataFormGrid, false)
        newData.forEach((item, index) => {
            let arrProduction = item.production.split("~")
            let newArr = []
            try {
                for (const element of listRuleCompare) {
                    if (arrProduction[0][0] === element.value) {
                        newArr.push(arrProduction[0].replace(arrProduction[0][0], element.month))
                    }
                    if (arrProduction[1][0] === element.value) {
                        newArr.push(arrProduction[1].replace(arrProduction[1][0], element.month))
                    }
                }
                if (item.mfg_no === "") {
                    listIndexLogic.push(index)
                } else {
                    let newNumber = "0" + item.mfg_no.slice(-5)
                    let newDataCompare = item.mfg_no.replace(item.mfg_no.slice(-5), newNumber)
                    if (!(parseInt(newArr[0]) <= parseInt(newDataCompare) && parseInt(newDataCompare) <= parseInt(newArr[1]))) {
                        listIndexLogic.push(index)
                    }
                }
            } catch (err) {
                console.log(err)
            }
        })
        setListIndexLogicGrid(listIndexLogic)
    }

    const saveDataMDG = () => {
        const dataFormInput = form.getFieldsValue()
        let newData = dataLastCheck
        funcDataCheckLogic(newData, dataFormInput, false)

        let dataNotQualified = newData.filter(item => item.Result === "✖")
        setListNotQualified(dataNotQualified)

        setIsCheckLogic(true)
        checkLogicGrid()
    }

    useEffect(() => {
        if (listLogicMulti.length > 0) {
            let arrIndex = []
            let newArrData = dataLastCheck
            const dataForm = form.getFieldsValue()
            for (let i = 0; i < dataLastCheck.length; i++) {
                for (const element of listLogicMulti) {
                    if (dataLastCheck[i].No === element.no) {
                        arrIndex.push({
                            index: i,
                            result: element.result
                        })
                        break;
                    }
                }
            }

            arrIndex.forEach(item => {
                newArrData[item.index].Result = item.result
            })
            Object.keys(dataForm).map(item => {
                let arr_key = item.split("__");
                return form.setFieldValue(item, newArrData[arr_key[1]][arr_key[2]])
            });

            let dataNotQualified = newArrData.filter(item => item.Result === "✖")
            setListNotQualified(dataNotQualified)
            setDataLastCheck(newArrData)
        }

    }, [listLogicMulti]);

    return (
        <>
            <Col span={8} style={{ display: "flex", justifyContent: "flex-end", columnGap: "2ch" }}>
                {isPumpHaveMaster &&
                    <Button disabled={!isCheckShowDataMaster} onClick={onFinish}><SaveOutlined /></Button>
                }
                {!isPumpHaveMaster &&
                    <Button onClick={saveDataMDG}><SaveOutlined /></Button>
                }

                {parseInt(dataDetail.is_checksheet) === 1 &&
                    <Button disabled={isPumpHaveMaster ? !isCheckShowDataMaster : false} onClick={checkLogicData}>Check logic</Button>
                }

                {isPumpHaveMaster &&
                    <Button onClick={showModalSetDataMaster}>View data master</Button>
                }
            </Col>
            {isOpenModalCheckLogic &&
                <ModalShowCheckLogic
                    isOpenModalCheckLogic={isOpenModalCheckLogic}
                    setIsOpenModalCheckLogic={setIsOpenModalCheckLogic}
                    setIsCheckLogic={setIsCheckLogic}
                    dataLastCheck={dataLastCheck}
                    pumpId={pumpId}
                    setListNoCheckLogic={setListNoCheckLogic}
                    setListCheckRuleWarning={setListCheckRuleWarning}
                    form={form}
                    isSortData={isSortData}
                    newDataTable={newDataTable}
                    setListLogicMulti={setListLogicMulti}
                    setListNotQualified={setListNotQualified}
                    setDataLastCheck={setDataLastCheck}
                    dataDetail={dataDetail}
                    dataPumb={dataPumb}
                    listNoCheckLogic={listNoCheckLogic}
                    setListReport={setListReport}
                    listReport={listReport}
                />
            }
            {isOpenModalDataMaster && valueIsMaster === "1" &&
                <ModalDataMaster
                    isOpenModalDataMaster={isOpenModalDataMaster}
                    setIsOpenModalDataMaster={setIsOpenModalDataMaster}
                    dataLastCheck={dataLastCheck}
                    onFinish={onFinish}
                    loadingTable={loadingTable}
                    listDataMaster={listDataMaster}
                />
            }
            {isOpenModalDataMasterSecond && valueIsMaster === "2" &&
                <ModalDataMasterSecond
                    isOpenModalDataMaster={isOpenModalDataMasterSecond}
                    setIsOpenModalDataMaster={setIsOpenModalDataMasterSecond}
                    dataLastCheck={dataLastCheck}
                    onFinish={onFinish}
                    loadingTable={loadingTable}
                    listDataMaster={listDataMaster}
                />
            }
        </>
    )
}

RowButton.propTypes = {
    dataLastCheck: PropTypes.any,
    pumpId: PropTypes.string,
    setListNoCheckLogic: PropTypes.func,
    setListCheckRuleWarning: PropTypes.func,
    dataDetail: PropTypes.shape({
        is_checksheet: PropTypes.string,
    }),
    setDataLastCheck: PropTypes.func,
    listDataDefault: PropTypes.array,
    dataPumb: PropTypes.shape({
        is_master: PropTypes.string,
        value: PropTypes.string,
    }),
    form: PropTypes.shape({
        getFieldsValue: PropTypes.func,
        setFieldValue: PropTypes.func,
        getFieldValue: PropTypes.func,
    }),
    setListNotQualified: PropTypes.func,
    setIsCheckLogic: PropTypes.func,
    setIsSortData: PropTypes.func,
    isSortData: PropTypes.bool,
    newDataTable: PropTypes.array,
    setLoadingMainTable: PropTypes.func,
    setListIndexLogicGrid: PropTypes.func,
    formGrid: PropTypes.shape({
        getFieldsValue: PropTypes.func,
        setFieldValue: PropTypes.func,
        getFieldValue: PropTypes.func,
    }),
    dataGridLastCheck: PropTypes.array,
    listRuleCompare: PropTypes.array,
    setListLogicMulti: PropTypes.func,
    listLogicMulti: PropTypes.array,
    isCheckShowDataMaster: PropTypes.bool,
    setIsCheckShowDataMaster: PropTypes.func,
};


export default RowButton