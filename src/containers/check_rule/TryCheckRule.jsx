import { useCallback, useEffect, useState } from 'react';
import { Select, Button, Form, Input, Row, Col, Table, notification, message } from 'antd';
import "./CheckRule.css"
import { authAxios } from '../../api/axiosClient';
import { localhost } from '../../server';
const { Option } = Select;

const TryCheckRule = () => {
  const conditionCheckAction = ["", null, undefined]
  const listIndex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const [conditions, setConditions] = useState([
    { no: "", operator: '>=', value: "", poi: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "", poiChild: "" },
    { no: "", operator: '>=', value: "", poi: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "", poiChild: "" },
    { no: "", operator: '>=', value: "", poi: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "", poiChild: "" }
  ]);
  const [action, setAction] = useState({ no: "", operator: '>=', value: "", connect: "", noChild: "", operatorChild: '>=', valueChild: "" });
  const [listTextAndOr, setListTextAndOr] = useState([])
  const [dataNotification, setDataNotification] = useState({ message: "", status: "" })
  const [listPumb, setListPumb] = useState([]);
  const [listField, setListField] = useState([]);

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

  const handleConditionChange = useCallback((index, key, val) => {
    const newConditions = [...conditions];
    try {
      // delete Poi if operator is not in
      if (key === "operatorChild" || key === "operator") {
        if (val !== "in") {
          if (key === "operator") {
            newConditions[index]["poi"] = ""
          } else {
            newConditions[index]["poiChild"] = ""
          }
        }
      }
      newConditions[index][key] = val.target.value;
    } catch {
      newConditions[index][key] = val;
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
      if (item.no !== "" && item.value !== "") {
        dataSubmit += `if ${item.no} ${item.operator} ${item.value} `
        // connect operator index of
        if (item.operator === "in") {
          dataSubmit += `Poi ${item.poi} `
        }
        if (!conditionCheckAction.includes(item.connect) && item.noChild !== "" && item.valueChild !== "") {
          dataSubmit += `${item.connect} ${item.noChild} ${item.operatorChild} ${item.valueChild} `

          // connect operator index of
          if (item.operatorChild === "in") {
            dataSubmit += `Poi ${item.poiChild} `
          }
        }

        // connect AND/OR
        if (index < conditions.length - 1) {
          if (conditions[index + 1].no !== "" && conditions[index + 1].value !== "") {
            dataSubmit += `${index < listTextAndOr.length ? listTextAndOr[index] : ""} `
          }
        } else if (conditions[index].no !== "" && conditions[index].value !== "") {
          dataSubmit += `${index < listTextAndOr.length ? listTextAndOr[index] : ""} `
        }
      }
    })

    let contentThen = `${action.no} ${action.operator} ${action.value} `
    let checkDataChildOfThen = action.noChild !== "" || action.valueChild !== ""
    if (!conditionCheckAction.includes(action.connect) && checkDataChildOfThen) {
      contentThen += `${action.connect} ${action.noChild} ${action.operatorChild} ${action.valueChild} `
    }
    dataSubmit += `Then ${contentThen}`

    const checkConnect1To2 = (conditions[0].no === "" && conditions[0].value === "") || (conditions[1].no === "" && conditions[1].value === "")
    const checkConnect2To3 = (conditions[1].no === "" && conditions[1].value === "") || (conditions[2].no === "" && conditions[2].value === "")

    const dataGr = {
      group1: { ...conditions[0], connected: conditionCheckAction.includes(listTextAndOr[0]) ? "" : checkConnect1To2 ? "" : listTextAndOr[0] },
      group2: { ...conditions[1], connected: conditionCheckAction.includes(listTextAndOr[1]) ? "" : checkConnect2To3 ? "" : listTextAndOr[1] },
      group3: { ...conditions[2], connected: "" },
    }

    let dataJson = [
      {
        rule: dataGr
      },
      {
        result: action
      }
    ]

    const dataResult = {
      groupRule: dataJson,
      contentRule: dataSubmit,
      mockValue: value
    }

    authAxios()
      .post(`${localhost}/get_logic_rule`, dataResult).then(res => {
        // setMessageNotifi(res.data.message)
        showMessageNotification(res.data, "success")
        openNotification(res.data.message, "success")
      }).catch(err => {
        showMessageNotification(err.data, "error")
        openNotification(err.data.message, "error")
        // setMessageNotifi(err.data.message)
      })

  };

  const changeTextAndOr = (value, index) => {
    let newList = [...listTextAndOr]
    newList[index] = value
    setListTextAndOr(newList)
  }


  const showResultCreateRule = () => {
    let dataRule = ''

    conditions.forEach((item, index) => {
      if (item.no !== "" && item.value !== "") {
        dataRule += `if ${item.no} ${item.operator} ${item.value} `
        if (item.operator === "in") {
          dataRule += `Poi ${item.poi} `
        }
        if (!conditionCheckAction.includes(item.connect) && item.noChild !== "" && item.valueChild !== "") {
          dataRule += `${item.connect} ${item.noChild} ${item.operatorChild} ${item.valueChild} `
          if (item.operatorChild === "in") {
            dataRule += `Poi ${item.poiChild} `
          }
        }
        if (index < conditions.length - 1) {
          if (conditions[index + 1].no !== "" && conditions[index + 1].value !== "") {
            dataRule += `${index < listTextAndOr.length ? listTextAndOr[index] : ""} `
          }
        } else if (conditions[index].no !== "" && conditions[index].value !== "") {
          dataRule += `${index < listTextAndOr.length ? listTextAndOr[index] : ""} `
        }
      }
    })

    let contentThen = `Then ${action.no} ${action.operator} ${action.value} `
    let checkDataChildOfThen = action.noChild !== "" || action.valueChild !== ""
    if (!conditionCheckAction.includes(action.connect) && checkDataChildOfThen) {
      contentThen += `${action.connect} ${action.noChild} ${action.operatorChild} ${action.valueChild} `
    }

    return (
      <span>{dataRule} {contentThen}</span>
    )
  }

  const onFinish = (value) => {
    handleSubmit(value)
  }

  const showGroup = (condition, index, type) => {
    let listElement = []
    if (type === 'child') {
      listElement = ["noChild", "operatorChild", "valueChild", "poiChild"]
    } else {
      listElement = ["no", "operator", "value", "poi"]
    }

    return (
      <Row style={{ display: "contents" }}>
        <div style={{ width: "15%" }}>
          <Input
            value={condition[listElement[0]]}
            onChange={(val) => handleConditionChange(index, listElement[0], val)}
            placeholder='No.'
          />
        </div>
        <Select
          value={condition[listElement[1]]}
          onChange={(val) => handleConditionChange(index, listElement[1], val)}
          style={{ width: "10%" }}
        >
          <Option value=">=">&ge;</Option>
          <Option value="<=">&le;</Option>
          <Option value=">">&gt;</Option>
          <Option value="<">&lt;</Option>
          <Option value="==">=</Option>
          <Option value="!=">{"<>"}</Option>
          <Option value="in">in</Option>
        </Select>

        <div style={{ display: "grid", rowGap: "0.5ch", alignContent: "space-between", width: "20%" }}>
          <Input
            value={condition[listElement[2]]}
            placeholder={condition[listElement[1]] !== "in" ? 'Value ' : "No."}
            onChange={(val) => handleConditionChange(index, listElement[2], val)}
          />
          {condition[listElement[1]] === "in" &&
            <label style={{ marginLeft: "auto" }}>
              <span style={{ marginRight: '6px' }}>Poi:</span>
              <Select
                value={condition[listElement[3]]}
                onChange={(val) => handleConditionChange(index, listElement[3], val)}
                style={{ textAlign: "end", width: "fit-content" }}
              >
                {listIndex.map(item => (
                  <Option key={item} value={item}>{item}</Option>
                ))}
              </Select>
            </label>
          }
        </div>
      </Row>
    )
  }

  const showGroupThen = (type) => {
    let listElement = []
    if (type === 'child') {
      listElement = ["noChild", "operatorChild", "valueChild"]
    } else {
      listElement = ["no", "operator", "value"]
    }

    return (
      <Row style={{ display: "contents" }}>
        <div style={{ width: "15%" }}>
          <Input
            value={action[listElement[0]]}
            onChange={(val) => handleActionChange(listElement[0], val)}
            placeholder='No.'
          />
        </div>
        <Select
          style={{ width: "10%" }}
          value={action[listElement[1]]}
          onChange={(val) => handleActionChange(listElement[1], val)}
        >
          <Option value=">=">&ge;</Option>
          <Option value="<=">&le;</Option>
          <Option value=">">&gt;</Option>
          <Option value="<">&lt;</Option>
          <Option value="==">=</Option>
          <Option value="!=">{"<>"}</Option>
        </Select>

        <div style={{ width: "20%" }}>
          <Input
            value={action[listElement[2]]}
            placeholder='Value'
            onChange={(val) => handleActionChange(listElement[2], val)}
          />
        </div>
      </Row>
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
    if (data.list_error.length > 0) {
      setDataNotification({ message: data.list_error, status: status })
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

  const chooseModel = (value, data) => {

    // if (dataDetail !== undefined) {
    //   returnPackage(dataDetail.pack_id, dataDetail.op_table);
    // }
    // setPumpId(value)
    // setDataPumb(data);
    // // setIsCheckLogic(false)
    // functionResetData()
    // fetchDataInsert(data);
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

  return (
    <Form style={{ display: "grid", rowGap: "3ch" }} onFinish={onFinish}>
      <Row>
        <Col span={11}>
          <Form.Item name={"pump_id"}>
            <Select
              size={"middle"}
              id="code_pump"
              className="SelectTTDN"
              style={{ textAlign: "left", width: "100%" }}
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
        </Col>
        <Col span={11} offset={2}>
          <Form.Item name={"field_name"}>
            <Select
              size={"middle"}
              id="field_name"
              className="SelectTTDN"
              style={{ textAlign: "left", width: "100%" }}
              optionFilterProp="children"
              placeholder="Chọn trường"
            >
              {listField.map((item, index) => (
                <Select.Option key={item.pumb_id} value={item.pumb_id} is_master={item.is_master} is_multi={item.is_multi}>
                  {item.pumb_model}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

      </Row>
      <Table
        columns={columns}
        style={{ width: "100%" }}
        dataSource={dataRule}
        bordered
        pagination={false}
      />

      <div style={{ display: "grid", rowGap: "2ch" }}>
        <Row style={{ display: "flex", width: "100%" }}>
          <Col span={2}>
            {<p style={{ margin: 0 }}>Nếu: </p>}
          </Col>
          <Col span={22} style={{ display: "grid", rowGap: "2ch" }}>
            {conditions.map((condition, index) => (
              <>
                <div style={{ columnGap: "0.5ch", display: "flex" }}>
                  {showGroup(condition, index, "")}
                  <Select
                    value={condition.connect}
                    onChange={(val) => handleConditionChange(index, 'connect', val)}
                    style={{ width: "15%" }}
                  >
                    <Option value="and">AND</Option>
                    <Option value="or">OR</Option>
                  </Select>

                  {showGroup(condition, index, "child")}
                </div>

                {index < conditions.length - 1 &&
                  <Select
                    value={listTextAndOr[index]}
                    onChange={(value) => changeTextAndOr(value, index)}
                    style={{ width: 80 }}

                  >
                    <Option value="and">AND</Option>
                    <Option value="or">OR</Option>
                  </Select>}
              </>
            ))}
          </Col>
        </Row>

        <Row>
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
        </Row>

        <p style={{ display: "flex", alignItems: "center" }}>
          {showResultCreateRule()}
        </p>

        {!conditionCheckAction.includes(dataNotification.message) ? showError() : null}
      </div>
      <Button htmlType='submit' style={{ textTransform: "uppercase", fontWeight: 600 }}>lưu quy tắc</Button>
    </Form>
  );
}

export default TryCheckRule