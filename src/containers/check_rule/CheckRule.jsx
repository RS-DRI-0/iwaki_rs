import { useCallback, useEffect, useState } from 'react';
import { Select, Button, Form, Input, Row, Col, Table, notification, message } from 'antd';
import "./CheckRule.css"
import { authAxios } from '../../api/axiosClient';
import { localhost } from '../../server';
const { Option } = Select;

const CheckRule = () => {
    const defaultConditions = [
        { no1: "", operator1: '', value1: "", poi1: "", in1: "", find_oper1: "", connect1: "", no2: "", operator2: '', value2: "", poi2: "", in2: "", find_oper2: "", connect2: "", no3: "", operator3: '', value3: "", poi3: "", in3: "", find_oper3: "", connect3: "", no4: "", operator4: '', value4: "", poi4: "", in4: "", find_oper4: "" },
        { no1: "", operator1: '', value1: "", poi1: "", in1: "", find_oper1: "", connect1: "", no2: "", operator2: '', value2: "", poi2: "", in2: "", find_oper2: "", connect2: "", no3: "", operator3: '', value3: "", poi3: "", in3: "", find_oper3: "", connect3: "", no4: "", operator4: '', value4: "", poi4: "", in4: "", find_oper4: "" },
        { no1: "", operator1: '', value1: "", poi1: "", in1: "", find_oper1: "", connect1: "", no2: "", operator2: '', value2: "", poi2: "", in2: "", find_oper2: "", connect2: "", no3: "", operator3: '', value3: "", poi3: "", in3: "", find_oper3: "", connect3: "", no4: "", operator4: '', value4: "", poi4: "", in4: "", find_oper4: "" },
        { no1: "", operator1: '', value1: "", poi1: "", in1: "", find_oper1: "", connect1: "", no2: "", operator2: '', value2: "", poi2: "", in2: "", find_oper2: "", connect2: "", no3: "", operator3: '', value3: "", poi3: "", in3: "", find_oper3: "", connect3: "", no4: "", operator4: '', value4: "", poi4: "", in4: "", find_oper4: "" }

    ]
    const conditionCheckAction = ["", null, undefined]
    const [form] = Form.useForm();
    const listIndex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const [conditions, setConditions] = useState(defaultConditions);
    const [action, setAction] = useState({ no: "", operator: '>=', value: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "" });
    const [listTextAndOr, setListTextAndOr] = useState([])
    const [dataNotification, setDataNotification] = useState({ message: "", status: "" })
    const [listPumb, setListPumb] = useState([]);
    const [listField, setListField] = useState([]);
    const [isOpenTable, setIsOpenTable] = useState(false)
    const [dataRaw, setDataRaw] = useState("")
    const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

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
        {
            title: "No1",
            dataIndex: "no1",
            key: "no1",
            // ellipsis: true,
            // width: "40%"
            ellipsis: true,
            render: (text, record) => <Form.Item name={"no1"}><Input style={{ width: "100%" }}></Input></Form.Item>
        },
        {
            title: "No2",
            dataIndex: "no2",
            key: "no2",
            // ellipsis: true,
            // width: "40%"
            ellipsis: true,
            render: (text, record) => <Form.Item name={"no2"}><Input style={{ width: "100%" }}></Input></Form.Item>
        },
        {
            title: "No3",
            dataIndex: "no3",
            key: "no3",
            // ellipsis: true,
            // width: "40%"
            ellipsis: true,
            render: (text, record) => <Form.Item name={"no3"}><Input style={{ width: "100%" }}></Input></Form.Item>
        },
        {
            title: "No4",
            dataIndex: "no4",
            key: "no4",
            // ellipsis: true,
            // width: "40%"
            ellipsis: true,
            render: (text, record) => <Form.Item name={"no4"}><Input style={{ width: "100%" }}></Input></Form.Item>

        },
        {
            title: "No5",
            dataIndex: "no5",
            key: "no5",
            // ellipsis: true,
            // width: "40%"
            ellipsis: true,
            render: (text, record) => <Form.Item name={"no5"}><Input style={{ width: "100%" }}></Input></Form.Item>
        },
        {
            title: "No6",
            dataIndex: "no6",
            key: "no6",
            // ellipsis: true,
            // width: "40%"
            ellipsis: true,
            render: (text, record) => <Form.Item name={"no6"}><Input style={{ width: "100%" }}></Input></Form.Item>
        },
        {
            title: "No7",
            dataIndex: "no7",
            key: "no7",
            // ellipsis: true,
            // width: "40%"
            ellipsis: true,
            render: (text, record) => <Form.Item name={"no7"}><Input style={{ width: "100%" }}></Input></Form.Item>
        },
        {
            title: "No8",
            dataIndex: "no8",
            key: "no8",
            // ellipsis: true,
            // width: "40%"
            ellipsis: true,
            render: (text, record) => <Form.Item name={"no8"}><Input style={{ width: "100%" }}></Input></Form.Item>
        },
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
                if (val !== "index of") {
                    newConditions[index]["poi" + key[key.length - 1]] = ""
                }
                if (val !== "find") {
                    newConditions[index]["in" + key[key.length - 1]] = ""
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
                            newConditions[index]["in" + i] = ""
                            newConditions[index]["connect" + i] = ""
                            newConditions[index]["find_oper" + i] = ""
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

    const handleActionChange = useCallback((key, val) => {
        const newAction = { ...action };
        try {
            newAction[key] = val.target.value;
        } catch {
            newAction[key] = val;
        }
        setAction(newAction);
    }, [action]);

    const handleSubmit = (value) => {
        let dataSubmit = ''
        conditions.forEach((item, index) => {
            if (index === 0) {
                const values = Object.values(item != "" ? item : null)
                const result = values.map((value, indexItem) => {
                    // Không + giá trị của connected vào chuỗi

                    if (Object.keys(item)[indexItem] !== "connected") {
                        if (value === "find") {
                            values[indexItem + 2] = "in"
                            value = "find " + values[indexItem + 4]
                            values[indexItem + 4] = ""
                        } else
                            if (value === "index of") {
                                values[indexItem + 2] = "poi " + values[indexItem + 2]
                            }
                        return value;
                    }

                }).join(' ');
                dataSubmit += '( ' + result + ') '
            } else if (index !== 0) {
                if (!conditionCheckAction.includes(listTextAndOr[index - 1])) {
                    const values = Object.values(item != "" ? item : null)
                    const result = values.map((value, indexItem) => {
                        if (Object.keys(item)[indexItem] !== "connected") {
                            if (value === "find") {
                                values[indexItem + 2] = "in"
                                value = "find " + values[indexItem + 4]
                                values[indexItem + 4] = ""
                            } else
                                if (value === "index of") {
                                    values[indexItem + 2] = "poi " + values[indexItem + 2]
                                }
                            return value;
                        }
                    }).join(' ');
                    dataSubmit += (item.no1 !== "" && item.no2 !== "") ? listTextAndOr[index - 1] + ' ( ' + result + ') ' : ""
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



        const api = isOpenTable ? "get_logic_rule" : "update_logic_temp_data"
        authAxios()
            .post(`${localhost}/${api}`, dataResult

                // user_role: inforUser.user_role,
                // pumb_id: form.getFieldValue("pump_id"),
                // field_id: form.getFieldValue("field_name"),
                // raw_data: dataSubmit.replace(/\s+/g, ' '),
                // json_data: dataJson

                // headers: {
                //     "Content-Type": "application/json"
                // }
            ).then(res => {
                // setMessageNotifi(res.data.message)

                showMessageNotification(res.data, "success")
                // openNotification(res.data.message, "success")
                // setConditions([
                //     { no: "", operator: '>=', value: "", poi: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "", poiChild: "" },
                //     { no: "", operator: '>=', value: "", poi: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "", poiChild: "" },
                //     { no: "", operator: '>=', value: "", poi: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "", poiChild: "" }
                // ]);
                // setAction({ no: "", operator: '>=', value: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "" });
                // form.resetFields()
                
                if (!isOpenTable) {
                    clearCondition()
                }

            }).catch(err => {
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
                newListCondition[i - 1] = defaultConditions[0]
            }
            setConditions(newListCondition)

        }

        setListTextAndOr(newList)
    }

    // const showResultCreateRule = () => {
    //     let dataRule = ''

    //     conditions.forEach((item, index) => {
    //         if (item.no1 !== "" && item.value1 !== "") {
    //             dataRule += `if ${item.no1} ${item.operator1} ${item.value1} `
    //             if (item.operator === "index of") {
    //                 dataRule += `Poi ${item.poi1} `
    //             }
    //             if (!conditionCheckAction.includes(item.connect) && item.noChild !== "" && item.valueChild !== "") {
    //                 dataRule += `${item.connect} ${item.noChild} ${item.operatorChild} ${item.valueChild} `
    //                 if (item.operatorChild === "index of") {
    //                     dataRule += `Poi ${item.poiChild} `
    //                 }
    //             }
    //             if (index < conditions.length - 1) {
    //                 if (conditions[index + 1].no !== "" && conditions[index + 1].value !== "") {
    //                     dataRule += `${index < listTextAndOr.length ? listTextAndOr[index] : ""} `
    //                 }
    //             } else if (conditions[index].no !== "" && conditions[index].value !== "") {
    //                 dataRule += `${index < listTextAndOr.length ? listTextAndOr[index] : ""} `
    //             }
    //         }
    //     })

    //     let contentThen = `Then ${action.no} ${action.operator} ${action.value} `
    //     let checkDataChildOfThen = action.noChild !== "" || action.valueChild !== ""
    //     if (!conditionCheckAction.includes(action.connect) && checkDataChildOfThen) {
    //         contentThen += `${action.connect} ${action.noChild} ${action.operatorChild} ${action.valueChild} `
    //     }

    //     return (
    //         <span>{dataRule} {contentThen}</span>
    //     )
    // }

    const onFinish = (value) => {
        handleSubmit(value)
    }

    const showGroup = (condition, index, position) => {
        let listElement = ["no", "operator", "value", "poi", "in", "find_oper"]

        return (
            <div style={{ background: "rgb(145 209 177 / 81%)", display: "grid", padding: "4%", width: "100%", rowGap: "0.5ch", borderRadius: 8 }}>
                <div style={{ alignContent: "center" }}>
                    <Input
                        value={condition[listElement[0] + position]}
                        onChange={(val) => handleConditionChange(index, listElement[0] + position, val)}
                        placeholder='No.'
                        style={{ width: "25%" }}
                    />
                    <div style={{ width: "45%", display: "contents" }}>
                        <Select
                            value={condition[listElement[1] + position]}
                            onChange={(val) => handleConditionChange(index, listElement[1] + position, val)}
                            style={{ width: condition[listElement[1] + position] === "find" ? "22.5%" : "45%", padding: "0% 2%" }}
                        >
                            <Option value=">=">&ge;</Option>
                            <Option value="<=">&le;</Option>
                            <Option value=">">&gt;</Option>
                            <Option value="<">&lt;</Option>
                            <Option value="==">=</Option>
                            <Option value="!=">{"<>"}</Option>
                            <Option value="index of">Index of</Option>
                            <Option value="find">Find</Option>
                            <Option value="contains">Contains</Option>
                        </Select>
                        {condition[listElement[1] + position] === "find" &&
                            <Select
                                value={condition[listElement[5] + position]}
                                onChange={(val) => handleConditionChange(index, listElement[5] + position, val)}
                                style={{ width: "22.5%", padding: "0% 2%" }}
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
                        value={condition[listElement[2] + position]}
                        placeholder={condition[listElement[1]] !== "index of" ? 'Value ' : "No."}
                        onChange={(val) => handleConditionChange(index, listElement[2] + position, val)}
                        style={{ width: "30%" }}
                    />
                </div>
                {condition[listElement[1] + position] === "index of" &&
                    <span style={{ marginLeft: "auto" }}>
                        <span style={{ marginRight: '6px' }}>Poi:</span>
                        <Select
                            value={condition[listElement[3] + position]}
                            onChange={(val) => handleConditionChange(index, listElement[3] + position, val)}
                            style={{ textAlign: "end", width: "60px" }}
                        >
                            {listIndex.map(item => (
                                <Option key={item} value={item}>{item}</Option>
                            ))}
                        </Select>
                    </span>
                }
                {condition[listElement[1] + position] === "find" &&
                    <label style={{ marginLeft: "auto", display: "flex", alignItems: "center", width: "30%" }}>
                        <span style={{ marginRight: '6px' }}>In:</span>
                        <Input
                            value={condition[listElement[4] + position]}
                            onChange={(val) => handleConditionChange(index, listElement[4] + position, val)}
                        />
                    </label>
                }
            </div>
        )
    }

    // const showGroupThen = (type) => {
    //     let listElement = []
    //     if (type === 'child') {
    //         listElement = ["noChild", "operatorChild", "valueChild"]
    //     } else {
    //         listElement = ["no", "operator", "value"]
    //     }

    //     return (
    //         <Row style={{ display: "contents" }}>
    //             <div style={{ width: "15%" }}>
    //                 <Input
    //                     value={action[listElement[0]]}
    //                     onChange={(val) => handleActionChange(listElement[0], val)}
    //                     placeholder='No.'
    //                 />
    //             </div>
    //             <Select
    //                 style={{ width: "10%" }}
    //                 value={action[listElement[1]]}
    //                 onChange={(val) => handleActionChange(listElement[1], val)}
    //             >
    //                 <Option value=">=">&ge;</Option>
    //                 <Option value="<=">&le;</Option>
    //                 <Option value=">">&gt;</Option>
    //                 <Option value="<">&lt;</Option>
    //                 <Option value="==">=</Option>
    //                 <Option value="!=">{"<>"}</Option>
    //                 <Option value="find">Find</Option>
    //             </Select>

    //             <div style={{ width: "20%" }}>
    //                 <Input
    //                     value={action[listElement[2]]}
    //                     placeholder='Value'
    //                     onChange={(val) => handleActionChange(listElement[2], val)}
    //                 />
    //             </div>
    //         </Row>
    //     )
    // }

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
            no1: 10,
            no2: 20,
            no3: "10-0-10",
            no4: 40,
            no5: 50,
            no6: "30-20-10-0-10",
            no7: 80,
            no8: 10,
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

    useEffect(() => {
        // let dataGet = [DataTest[0].rule.group1, DataTest[0].rule.group2,DataTest[0].rule.group3]
        // setConditions(dataGet)
        // setListTextAndOr([DataTest[0].rule.group1.connected, DataTest[0].rule.group2.connected])
        // setAction(DataTest[1].result)
    }, []);
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
            setDataRaw(value.rawData)
        } else {
            clearCondition()
        }
    }
    return (
        <div className='container-create-rule' style={{ display: "flex" }}>
            <div className='body-create-rule' style={{ width: "100%" }}>
                <Form form={form} className='form-create-rule' onFinish={onFinish}>
                    {/* <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>Tạo quy tắc</h2> */}

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
                        {/* <Row style={{ display: "flex", width: "100%" }}> */}
                        {/* <Col span={2}>
                                {<p style={{ margin: 0 }}>Nếu: </p>}
                            </Col> */}
                        <Row style={{ display: "grid", rowGap: "2ch" }}>
                            {conditions.map((condition, index) => (
                                <>
                                    {index < listTextAndOr.length + 1 &&
                                        <>

                                            <div style={{ display: "flex", backgroundColor: "#ffffffcc", padding: "1.2%", borderRadius: 16 }}>
                                                <div style={{ width: "19%", display: "flex" }}>
                                                    {showGroup(condition, index, 1)}
                                                </div>
                                                <div style={{ width: "8%", display: "flex", alignItems: "center" }}>
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
                                                        <div style={{ width: "19%", display: "flex" }}>
                                                            {showGroup(condition, index, 2)}
                                                        </div>
                                                        <div style={{ width: "8%", display: "flex", alignItems: "center" }}>
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
                                                        <div style={{ width: "19%", display: "flex" }}>
                                                            {showGroup(condition, index, 3)}
                                                        </div>
                                                        <div style={{ width: "8%", display: "flex", alignItems: "center" }}>
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
                                                    <div style={{ width: "19%", display: "flex" }}>
                                                        {showGroup(condition, index, 4)}
                                                    </div>
                                                }
                                            </div>

                                            {/* && !(conditionCheckAction.includes(listTextAndOr[index])) */}
                                            {index < conditions.length - 1 &&
                                                <Select
                                                    value={listTextAndOr[index]}
                                                    onChange={(value) => changeTextAndOr(value, index)}
                                                    style={{ width: 80, border: "2px solid rgba(0, 0, 0, 0.34)", borderRadius: 8 }}

                                                    // optionFilterProp="children"
                                                    allowClear={true}
                                                >
                                                    <Option value="and">AND</Option>
                                                    <Option value="or">OR</Option>
                                                </Select>
                                            }
                                        </>
                                    }
                                    {/* {index < conditions.length - 1 &&
                                            <Select
                                                value={listTextAndOr[index]}
                                                onChange={(value) => changeTextAndOr(value, index)}
                                                style={{ width: 80 }}
                                                // optionFilterProp="children"
                                                allowClear={true}
                                            >
                                                <Option value="and">AND</Option>
                                                <Option value="or">OR</Option>
                                            </Select>} */}
                                </>
                            ))}
                        </Row>
                        {/* </Row> */}

                        {/* <Row>
                            <Col span={2}>
                                Thì:
                            </Col>
                            <Col span={22}>
                                <div style={{ columnGap: "0.5ch", display: "flex" }}>
                                    {showGroupThen("")}

                                    <Select
                                        value={action.connect}
                                        onChange={(val) => handleActionChange('connect', val)}
                                        style={{ width: "15%" }}
                                    >
                                        <Option value="and">AND</Option>
                                        <Option value="or">OR</Option>
                                    </Select>

                                    {showGroupThen("child")}
                                </div>
                            </Col>
                        </Row> */}
                        {/* 
                        <p style={{ display: "flex", alignItems: "center" }}>
                            {showResultCreateRule()}
                        </p> */}

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

                    {/* <Button htmlType='submit' style={{ textTransform: "uppercase", fontWeight: 600 }}>lưu quy tắc</Button> */}
                </Form>
            </div >
        </div >
    );
}

export default CheckRule