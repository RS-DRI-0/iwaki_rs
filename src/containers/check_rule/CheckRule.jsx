import { useCallback, useEffect, useState } from 'react';
import { Select, Form, Input, Row, Col, Table, notification } from 'antd';
import "./CheckRule.css"
import { authAxios } from '../../api/axiosClient';
import { localhost } from '../../server';
import { openNotificationSweetAlert } from '../../Function';
const { Option } = Select;

const CheckRule = () => {
    const defaultConditions = [
        { no1: "", operator1: '', value1: "", poi1: "", find_oper1: "", in1: "", check1: "", connect1: "", no2: "", operator2: '', value2: "", poi2: "", find_oper2: "", in2: "", check2: "", connect2: "", no3: "", operator3: '', value3: "", poi3: "", find_oper3: "", in3: "", check3: "", connect3: "", no4: "", operator4: '', value4: "", poi4: "", find_oper4: "", in4: "", check4: "" },
        { no1: "", operator1: '', value1: "", poi1: "", find_oper1: "", in1: "", check1: "", connect1: "", no2: "", operator2: '', value2: "", poi2: "", find_oper2: "", in2: "", check2: "", connect2: "", no3: "", operator3: '', value3: "", poi3: "", find_oper3: "", in3: "", check3: "", connect3: "", no4: "", operator4: '', value4: "", poi4: "", find_oper4: "", in4: "", check4: "" },
        { no1: "", operator1: '', value1: "", poi1: "", find_oper1: "", in1: "", check1: "", connect1: "", no2: "", operator2: '', value2: "", poi2: "", find_oper2: "", in2: "", check2: "", connect2: "", no3: "", operator3: '', value3: "", poi3: "", find_oper3: "", in3: "", check3: "", connect3: "", no4: "", operator4: '', value4: "", poi4: "", find_oper4: "", in4: "", check4: "" },
        { no1: "", operator1: '', value1: "", poi1: "", find_oper1: "", in1: "", check1: "", connect1: "", no2: "", operator2: '', value2: "", poi2: "", find_oper2: "", in2: "", check2: "", connect2: "", no3: "", operator3: '', value3: "", poi3: "", find_oper3: "", in3: "", check3: "", connect3: "", no4: "", operator4: '', value4: "", poi4: "", find_oper4: "", in4: "", check4: "" }

    ]
    const conditionCheckAction = ["", null, undefined]
    const [form] = Form.useForm();
    const listIndex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const [conditions, setConditions] = useState(defaultConditions);
    const [listTextAndOr, setListTextAndOr] = useState([])
    const [dataNotification, setDataNotification] = useState({ message: "", status: "" })
    const [listPumb, setListPumb] = useState([]);
    const [listField, setListField] = useState([]);
    const [isOpenTable, setIsOpenTable] = useState(false)
    const [dataRaw, setDataRaw] = useState("")
    const [pumpId, setPumpId] = useState()
    const inforUser = JSON.parse(sessionStorage.getItem("info_user"));
    const columnTryIt = ["No1", "No2", "No3", "No4", "No5", "No6", "No7", "No8"]

    const dataRule = [
        {
            no1: "",
            no2: "",
            no3: "",
            no4: "",
            no5: "",
            no6: "",
            no7: "",
            no8: "",
        },
    ]

    const columns = [
        ...columnTryIt.map(item => ({
            title: item,
            dataIndex: item,
            key: item,
            // ellipsis: true,
            // width: "40%"
            ellipsis: true,
            render: () => <Form.Item name={item}><Input style={{ width: "100%" }}></Input></Form.Item>
        }))
    ];

    const clearCondition = () => {
        setConditions(defaultConditions);
        setListTextAndOr([])
        setDataRaw("")
    }

    const handleConditionChange = useCallback((index, key, val) => {
        const newConditions = [...conditions];
        try {
            if (key.includes("operator")) {
                if (val !== "find in" && val !== "find check") {
                    newConditions[index]["find_oper" + key[key.length - 1]] = ""
                }
                if (val !== "index of") {
                    newConditions[index]["poi" + key[key.length - 1]] = ""
                }
                if (val !== "find in") {
                    newConditions[index]["in" + key[key.length - 1]] = ""
                }
                if (val !== "find check") {
                    newConditions[index]["check" + key[key.length - 1]] = ""
                }
            }
            newConditions[index][key] = val.target.value;
        } catch {
            if (val === undefined) {
                try {
                    if (key.includes("connect")) {
                        for (let i = newConditions.length; i > Number(key[key.length - 1]); i--) {
                            newConditions[index]["no" + i] = ""
                            newConditions[index]["operator" + i] = ""
                            newConditions[index]["value" + i] = ""
                            newConditions[index]["poi" + i] = ""
                            newConditions[index]["find_oper" + i] = ""
                            newConditions[index]["in" + i] = ""
                            newConditions[index]["check" + i] = ""
                            newConditions[index]["connect" + i] = ""
                        }
                    }
                    // Xóa tát cả các dữ liệu ở sau
                    newConditions[index][key] = "";
                } catch (err) {
                    console.log(err)
                }

            } else {
                newConditions[index][key] = val;
            }

        }
        setConditions(newConditions);
    }, [conditions]);

    const sortObjectByLastChar = (item) => {
        // const obj = Object.keys(item)[indexItem]
        return Object.keys(item)
            .sort((a, b) => {
                const lastCharA = a[a.length - 1];
                const lastCharB = b[b.length - 1];
                return lastCharA.localeCompare(lastCharB);
            })
            .reduce((sortedObj, key) => {
                sortedObj[key] = item[key];
                return sortedObj;
            }, {});
    };

    const handleContentSubmit = (item) => {
        const values = Object.values(item)
        const listKey = Object.keys(item)
        const result = values.map((value, indexItem) => {
            // Không + giá trị của connected vào chuỗi

            // console.log(Object.keys(item)[indexItem])
            if (Object.keys(item)[indexItem] !== "connected") {
                if (value === "find in" || value === "find check") {
                    if (value === "find in") {
                        values[indexItem + 2] = "in"
                    } else {
                        values[indexItem + 2] = "check"
                    }
                    value = "find " + values[indexItem + 3]
                    values[indexItem + 3] = ""

                } else
                    if (value === "index of") {
                        values[indexItem + 2] = "poi " + values[indexItem + 2]
                    }
                return value;
            }
        }).join(' ');
        return result
    }

    const handleSubmit = (value) => {
        let dataSubmit = ''
        console.log(listTextAndOr)
        conditions.forEach((item, index) => {
            if (index === 0) {
                // handleContentSubmit(item)
                // const values = Object.values(item)
                // const listKey = Object.keys(item)
                // const result = values.map((value, indexItem) => {
                //     // Không + giá trị của connected vào chuỗi

                //     // console.log(Object.keys(item)[indexItem])
                //     if (Object.keys(item)[indexItem] !== "connected") {
                //         if (value === "find in" || value === "find check") {
                //             if (value === "find in") {
                //                 values[indexItem + 2] = "in"
                //             } else {
                //                 const index = listKey[indexItem + 3][listKey[indexItem + 3].length - 1]
                //                 values[indexItem + 2] = "check"
                //                 values[indexItem + 3] = item["check" + index]
                //                 values[29] = ""
                //                 values[30] = ""
                //                 values[31] = ""
                //                 values[32] = ""
                //             }
                //             value = "find " + values[indexItem + 4]
                //             values[indexItem + 4] = ""

                //         } else
                //             if (value === "index of") {
                //                 values[indexItem + 2] = "poi " + values[indexItem + 2]
                //             }
                //         return value;
                //     }
                // }).join(' ');
                dataSubmit += '( ' + handleContentSubmit(item) + ') '
            } else if (index !== 0) {
                console.log(!conditionCheckAction.includes(listTextAndOr[index - 1]))
                if (!conditionCheckAction.includes(listTextAndOr[index - 1])) {
                    dataSubmit += (item.no1 !== "") ? listTextAndOr[index - 1] + ' ( ' + handleContentSubmit(item) + ') ' : ""
                }
            }
        })

        const checkConnect1To2 = (conditions[0].no1 === "" && conditions[0].value1 === "") || (conditions[1].no1 === "" && conditions[1].value1 === "")
        const checkConnect2To3 = (conditions[1].no1 === "" && conditions[1].value1 === "") || (conditions[2].no1 === "" && conditions[2].value1 === "")
        const checkConnect3To4 = (conditions[2].no1 === "" && conditions[2].value1 === "") || (conditions[3].no1 === "" && conditions[3].value1 === "")

        const dataGr = {
            group1: { ...conditions[0], connected: conditionCheckAction.includes(listTextAndOr[0]) ? "" : checkConnect1To2 ? "" : listTextAndOr[0] },
            group2: { ...conditions[1], connected: conditionCheckAction.includes(listTextAndOr[1]) ? "" : checkConnect2To3 ? "" : listTextAndOr[1] },
            group3: { ...conditions[2], connected: conditionCheckAction.includes(listTextAndOr[2]) ? "" : checkConnect3To4 ? "" : listTextAndOr[2] },
            group4: { ...conditions[3], connected: "" },
        }

        // let newArr1 = Object.values(dataGr.group1)
        // let newArr2 = Object.values(dataGr.group2)
        // let newArr3 = Object.values(dataGr.group3)
        // let newArr4 = Object.values(dataGr.group4)

        // for (let i = 0; i < newArr1.length; i++) {
        //     if (newArr1[i] === "find check" || newArr1[i] === "find in") {
        //         newArr1[i] = "find"
        //     }
        // }
        // for (let i = 0; i < newArr2.length; i++) {
        //     if (newArr2[i] === "find check" || newArr2[i] === "find in") {
        //         newArr2[i] = "find"
        //     }
        // }
        // for (let i = 0; i < newArr3.length; i++) {
        //     if (newArr3[i] === "find check" || newArr3[i] === "find in") {
        //         newArr3[i] = "find"
        //     }
        // }
        // for (let i = 0; i < newArr4.length; i++) {
        //     if (newArr4[i] === "find check" || newArr4[i] === "find in") {
        //         newArr4[i] = "find"
        //     }
        // }

        // const newDataGr = { newArr1, newArr2, newArr3, newArr4 }

        let dataJson = [
            {
                rule: dataGr
            }
        ]

        const dataResult = isOpenTable ? {
            rule: dataGr,
            mockValue: value
        } : {
            user_role: inforUser.user_role,
            pumb_id: form.getFieldValue("pump_id"),
            field_id: form.getFieldValue("field_name"),
            raw_data: dataSubmit.replace(/\s+/g, ' '),
            json_data: dataJson
        }
        console.log(dataSubmit.replace(/\s+/g, ' '))
        const api = isOpenTable ? "get_logic_rule" : "update_logic_temp_data"
        authAxios()
            .post(`${localhost}/${api}`, dataResult).then(res => {
                showMessageNotification(res.data, "success")
                // openNotification(res.data.message, "success")
                // setConditions([
                //     { no: "", operator: '>=', value: "", poi: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "", poiChild: "" },
                //     { no: "", operator: '>=', value: "", poi: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "", poiChild: "" },
                //     { no: "", operator: '>=', value: "", poi: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "", poiChild: "" }
                // ]);
                // setAction({ no: "", operator: '>=', value: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "" });
                // form.resetFields()
                form.setFieldValue("field_name", "")
                // openNotificationSweetAlert()
                setDataRaw("")
                // fetchListPumb()
                fetchLogicTempData(pumpId)
                if (!isOpenTable) {
                    clearCondition()
                }

            }).catch(err => {
                // openNotificationSweetAlert()
                showMessageNotification(err.data, "error")
                // openNotification(err.data.message, "error")
                // setMessageNotifi(err.data.message)
            })

    };

    const changeTextAndOr = (value, index) => {
        let newList = [...listTextAndOr]
        let newListCondition = [...conditions]

        if (!conditionCheckAction.includes(value)) {
            // Lúc xóa And/Or
            newList[index] = value
        } else {
            newList.splice(index, newListCondition.length - (index + 1))

            for (let i = newListCondition.length; i > index + 1; i--) {
                newListCondition[i - 1] = defaultConditions[i - 1]
            }
            setConditions(newListCondition)

        }

        setListTextAndOr(newList)
    }

    const onFinish = (value) => {
        handleSubmit(value)
    }

    const showGroup = (condition, index, position) => {
        return (
            <div style={{ background: "rgb(145 209 177 / 81%)", display: "grid", padding: "4%", width: "100%", rowGap: "0.5ch", borderRadius: 8 }}>
                <div style={{ alignContent: "center" }}>
                    <Input
                        value={condition["no" + position]}
                        onChange={(val) => handleConditionChange(index, "no" + position, val)}
                        placeholder='No.'
                        style={{ width: "20%" }}
                    />
                    <div style={{ width: "50%", display: "contents" }}>
                        <Select
                            value={condition["operator" + position]}
                            onChange={(val) => handleConditionChange(index, "operator" + position, val)}
                            style={{ width: condition["operator" + position].includes("find") ? "30%" : "50%", padding: "0% 2%" }}
                        >
                            <Option value=">=">&ge;</Option>
                            <Option value="<=">&le;</Option>
                            <Option value=">">&gt;</Option>
                            <Option value="<">&lt;</Option>
                            <Option value="==">=</Option>
                            <Option value="!=">{"<>"}</Option>
                            <Option value="index of">Index of</Option>
                            <Option value="find in">Find In</Option>
                            <Option value="find check">Find Check</Option>
                            <Option value="contains">Contains</Option>
                        </Select>
                        {condition["operator" + position].includes("find") &&
                            <Select
                                value={condition["find_oper" + position]}
                                onChange={(val) => handleConditionChange(index, "find_oper" + position, val)}
                                style={{ width: "20%", padding: "0% 2%" }}
                            >
                                <Option value=">=">&ge;</Option>
                                <Option value="<=">&le;</Option>
                                <Option value=">">&gt;</Option>
                                <Option value="<">&lt;</Option>
                                <Option value="==">=</Option>
                                <Option value="!=">{"<>"}</Option>
                            </Select>
                        }
                    </div>

                    <Input
                        value={condition["value" + position]}
                        placeholder={condition["operator"] !== "index of" ? 'Value ' : "No."}
                        onChange={(val) => handleConditionChange(index, "value" + position, val)}
                        style={{ width: "30%" }}
                    />
                </div>
                {condition["operator" + position] === "index of" &&
                    <span style={{ marginLeft: "auto" }}>
                        <span style={{ marginRight: '6px' }}>Poi:</span>
                        <Select
                            value={condition["poi" + position]}
                            onChange={(val) => handleConditionChange(index, "poi" + position, val)}
                            style={{ textAlign: "end", width: "60px" }}
                        >
                            {listIndex.map(item => (
                                <Option key={item} value={item}>{item}</Option>
                            ))}
                        </Select>
                    </span>
                }
                {condition["operator" + position] === "find in" &&
                    <label style={{ marginLeft: "auto", display: "flex", alignItems: "center", width: "30%" }}>
                        <span style={{ marginRight: '6px' }}>In:</span>
                        <Input
                            value={condition["in" + position]}
                            onChange={(val) => handleConditionChange(index, "in" + position, val)}
                        />
                    </label>
                }
                {condition["operator" + position] === "find check" &&
                    <label style={{ marginLeft: "auto", display: "flex", alignItems: "center", width: "35%" }}>
                        <span style={{ marginRight: '6px' }}>Check:</span>
                        <Input
                            value={condition["check" + position]}
                            onChange={(val) => handleConditionChange(index, "check" + position, val)}
                        />
                    </label>
                }
            </div>
        )
    }

    const openNotification = (data, type) => {
        notification[type]({
            message: 'Thông báo',
            description: data,
            duration: 3,
            maxCount: 1,
            placement: "topRight"
        });
    };

    const showMessageNotification = (data, status) => {
        if (data.list_error !== undefined) {
            if (data.list_error.length > 0) {
                setDataNotification({ message: data.list_error, status: status })
            } else {
                setDataNotification({ message: data.message, status: status })
            }
        } else {
            setDataNotification({ message: data.message, status: status })
        }

    }

    const showError = () => {
        if (typeof dataNotification.message !== "string") {
            return (
                <Row style={{ display: "grid" }}>
                    {dataNotification.message.map(item => (
                        <span className='content-error' key={item}>{item}</span>
                    ))}
                </Row>
            )
        } else {
            return (
                <span className='content-error' style={{ color: dataNotification.status === "error" ? "red" : "green" }}>{dataNotification.message}</span>
            )
        }
    }

    useEffect(() => {

        if (!conditionCheckAction.includes(dataNotification.message)) {
            showError()
        }
    }, [dataNotification]);

    useEffect(() => {
        form.setFieldsValue({
            No1: 10,
            No2: 20,
            No3: "10-0-10",
            No4: 40,
            No5: 50,
            No6: "30-20-10-0-10",
            No7: 80,
            No8: 10,
        })
        const handleKeyPress = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
            }
        };

        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, []);

    const fetchLogicTempData = (pumpID) => {
        authAxios()
            .get(`${localhost}/get_logic_temp_data`,
                {
                    params: {
                        user_role: inforUser.user_role,
                        pumb_id: pumpID
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            .then((res) => {
                setListField(res.data.lst_data)
                // setListPumb(res.data.list_pumb);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const chooseModel = (value, data) => {
        form.setFieldValue("field_name", "")
        clearCondition()
        setPumpId(value)
        fetchLogicTempData(value)
    };

    const fetchListPumb = () => {
        authAxios()
            .get(`${localhost}/get_list_pump`,
                {
                    params: {
                        user_role: inforUser.user_role
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            .then((res) => {
                setListPumb(res.data.list_pumb);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchListPumb()
    }, []);

    const showTable = () => {
        setDataNotification({ message: "", status: "" })
        setIsOpenTable(prev => !prev)
    }

    const chooseField = (e, value) => {
        if (value.jsonData !== "") {
            let data = value.jsonData
            const newStr = data.replace(/'/g, '"');

            const obj = JSON.parse(newStr);

            let dataGet = [obj.rule.group1, obj.rule.group2, obj.rule.group3, obj.rule.group4]



            setConditions(dataGet)
            let listConnect = []
            dataGet.forEach(item => {
                if (item.connected !== "") {
                    listConnect.push(item.connected)
                }
            })

            setListTextAndOr(listConnect)
            const listIndex = []
            const listLetter = value.rawData.split("")
            listLetter.forEach((item, index) => {
                if (item === ")") {
                    listIndex.push(index + 1)
                }
            })
            const newChar = "\n"
            let newString = "";

            if (listIndex.length === 1) {
                newString += `${value.rawData.slice(0, listIndex[0])}`
            } else {
                listIndex.forEach((item, index) => {
                    if (index === 0) {
                        newString += `${value.rawData.slice(0, listIndex[0])}${newChar}`
                    } else if (index === listIndex.length - 1) {
                        newString += `${value.rawData.slice(listIndex[index - 1] + 1, listIndex[index] + 1)}`
                    } else {
                        newString += `${value.rawData.slice(listIndex[index - 1] + 1, listIndex[index] + 1)}${newChar}`
                    }
                })
            }
            setDataRaw(newString)
        } else {
            clearCondition()
        }
    }
    return (
        <div className='container-create-rule' style={{ display: "flex" }}>
            <div className='body-create-rule' style={{ width: "100%" }}>
                <Form form={form} className='form-create-rule' onFinish={onFinish}>
                    <h2 style={{ textAlign: "center", textTransform: "uppercase", marginTop: 0 }}>Bảng tạo qui tắc rule 18</h2>

                    <Row>
                        <Col span={8} style={{ display: "flex", columnGap: "2ch" }}>
                            <Form.Item name={"pump_id"}>
                                <Select
                                    size={"middle"}
                                    id="code_pump"
                                    className="SelectTTDN"
                                    style={{ textAlign: "left", width: "200px", border: "2px solid #00000057", borderRadius: 8 }}
                                    optionFilterProp="children"
                                    placeholder="Chọn mã máy"
                                    onChange={chooseModel}

                                >
                                    {listPumb.map((item, index) => (
                                        <Select.Option key={item.pumb_id} value={item.pumb_id} is_master={item.is_master} is_multi={item.is_multi}>
                                            {item.pumb_model}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item name={"field_name"}>
                                <Select
                                    size={"middle"}
                                    id="field_name"
                                    style={{ textAlign: "left", width: "200px", border: "2px solid #00000057", borderRadius: 8 }}
                                    optionFilterProp="children"
                                    placeholder="Chọn trường"
                                    onChange={chooseField}
                                >
                                    {listField.map((item) => (
                                        <Select.Option key={item.field_id} value={item.field_id} jsonData={item.json_data} rawData={item.raw_data}>
                                            {item.no}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        {!conditionCheckAction.includes(dataRaw) &&
                            <Col span={15} offset={1}>
                                <Input.TextArea value={dataRaw} autoSize={{
                                    minRows: 1,
                                    maxRows: 3,
                                }}></Input.TextArea>
                            </Col>
                        }
                    </Row>

                    <div style={{ display: "grid", rowGap: "2ch" }}>
                        <Row style={{ display: "grid", rowGap: "2ch" }}>
                            {conditions.map((condition, index) => (
                                <>
                                    {index < listTextAndOr.length + 1 &&
                                        <>

                                            <div style={{ display: "flex", backgroundColor: "#ffffffcc", padding: "1.2%", borderRadius: 16 }}>
                                                <div style={{ width: "20.5%", display: "flex" }}>
                                                    {showGroup(condition, index, 1)}
                                                </div>
                                                <div style={{ width: "6%", display: "flex", alignItems: "center" }}>
                                                    <Select
                                                        value={condition.connect1}
                                                        onChange={(val) => handleConditionChange(index, 'connect1', val)}
                                                        style={{
                                                            width: "100%", margin: "0% 10%", border: "2px solid rgb(145 209 177 / 81%)",
                                                            borderRadius: 8
                                                        }}
                                                        allowClear
                                                    >
                                                        <Option value="and">AND</Option>
                                                        <Option value="or">OR</Option>
                                                    </Select>
                                                </div>


                                                {condition.connect1 !== "" &&
                                                    <>
                                                        <div style={{ width: "20.5%", display: "flex" }}>
                                                            {showGroup(condition, index, 2)}
                                                        </div>
                                                        <div style={{ width: "6%", display: "flex", alignItems: "center" }}>
                                                            <Select
                                                                value={condition.connect2}
                                                                onChange={(val) => handleConditionChange(index, 'connect2', val)}
                                                                style={{
                                                                    width: "100%", margin: "0% 10%", border: "2px solid rgb(145 209 177 / 81%)",
                                                                    borderRadius: 8
                                                                }}
                                                                allowClear
                                                            >
                                                                <Option value="and">AND</Option>
                                                                <Option value="or">OR</Option>
                                                            </Select>
                                                        </div>
                                                    </>
                                                }

                                                {condition.connect2 !== "" &&
                                                    <>
                                                        <div style={{ width: "20.5%", display: "flex" }}>
                                                            {showGroup(condition, index, 3)}
                                                        </div>
                                                        <div style={{ width: "6%", display: "flex", alignItems: "center" }}>
                                                            <Select
                                                                value={condition.connect3}
                                                                onChange={(val) => handleConditionChange(index, 'connect3', val)}
                                                                style={{
                                                                    width: "100%", margin: "0% 10%", border: "2px solid rgb(145 209 177 / 81%)",
                                                                    borderRadius: 8
                                                                }}
                                                                allowClear
                                                            >
                                                                <Option value="and">AND</Option>
                                                                <Option value="or">OR</Option>
                                                            </Select>
                                                        </div>
                                                    </>

                                                }
                                                {condition.connect3 !== "" &&
                                                    <div style={{ width: "20.5%", display: "flex" }}>
                                                        {showGroup(condition, index, 4)}
                                                    </div>
                                                }
                                            </div>

                                            {/* && !(conditionCheckAction.includes(listTextAndOr[index])) */}
                                            {index < conditions.length - 1 &&
                                                <Select
                                                    value={listTextAndOr[index]}
                                                    onChange={(value) => changeTextAndOr(value, index)}
                                                    style={{ width: 80, border: "2px solid rgb(145 209 177 / 81%)", borderRadius: 8 }}

                                                    // optionFilterProp="children"
                                                    allowClear={true}
                                                >
                                                    <Option value="and">AND</Option>
                                                    <Option value="or">OR</Option>
                                                </Select>
                                            }
                                        </>
                                    }
                                </>
                            ))}
                        </Row>
                        {!conditionCheckAction.includes(dataNotification.message) ? showError() : null}
                    </div>

                    <Row style={{ display: "flex", justifyContent: "flex-start" }}>
                        <Row style={{ display: "flex", columnGap: "2ch" }}>
                            <button type='button' className='button-tryIt' style={{ background: `linear-gradient(to right bottom, rgb(239 71 101), rgb(255 154 90 / 95%))` }} onClick={showTable}>Dùng thử !</button>
                            <button type='submit' className="button-30">Lưu quy tắc</button>
                        </Row>
                    </Row>
                    {isOpenTable &&
                        <Table
                            columns={columns}
                            style={{ width: "100%" }}
                            dataSource={dataRule}
                            bordered
                            pagination={false}
                        />
                    }
                </Form>
            </div>
        </div>
    );
}

export default CheckRule