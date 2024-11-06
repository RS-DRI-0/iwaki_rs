import { Button, Col, Form, Input, Modal, Row, Table } from 'antd'
import { useEffect, useState } from 'react'
import { localhost } from '../../../server'
import { authAxios } from '../../../api/axiosClient'
import "./DataMaster.css"
import PropTypes from "prop-types";


const ModalShowCheckLogic = ({
  isOpenModalCheckLogic,
  setIsOpenModalCheckLogic,
  setIsCheckLogic,
  dataLastCheck,
  pumpId,
  setListNoCheckLogic,
  setListCheckRuleWarning,
  form,
  isSortData,
  newDataTable,
  setListLogicMulti,
  setDataLastCheck,
  setListNotQualified,
  dataDetail,
  dataPumb,
  listNoCheckLogic

}) => {
  const [dataCheckLogicListReport, setDataCheckLogicListReport] = useState([])
  const [listInput, setListInput] = useState([])
  const [listCircle, setListCircle] = useState([])
  // const [dataCheckLogicListReport, setDataCheckLogicListReport] = useState()
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));
  const [listIndexInput, setListIndexInput] = useState([])
  const [listReport, setListReport] = useState([])
  const [listNoOther, setListNoOther] = useState([])

  const handleCancel = () => {
    setIsOpenModalCheckLogic(false)
  }
  const columns = [
    {
      title: 'No.',
      dataIndex: 'No',
      key: 'No',
      align: "left",
      ellipsis: true,
      width: 25,
    },

    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      align: "left",
      ellipsis: true,
      width: 150,
    },
  ];

  const funcDataCheckLogic = (data, dataForm) => {
    Object.keys(dataForm).map(item => {
      let arr_key = item.split("__");
      return data[arr_key[1]][arr_key[2]] = dataForm[item]
    });
  }

  const fetchDataCheckLogic = () => {
    const dataForm = form.getFieldsValue()

    if (!isSortData) {
      funcDataCheckLogic(dataLastCheck, dataForm)
    } else {
      funcDataCheckLogic(newDataTable, dataForm)
    }

    const dataChecksheet = {}
    dataLastCheck.forEach(item => {
      dataChecksheet[item.No] = item.checksheet
    })
    authAxios()
      .post(`${localhost}/check_logic`, {
        results: isSortData ? newDataTable : dataLastCheck,
        pump_id: pumpId,
        user_role: inforUser.user_role,
        vl_checksheet: dataChecksheet
      })
      .then((res) => {
        let listNoWarning = []
        let newDataLastCheck = [...dataLastCheck]
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
        setIsOpenModalCheckLogic(true)
        setDataCheckLogicListReport(res.data.lst_report)

        if (Object.keys(res.data.lst_circle).length > 0) {
          let listIndex = []
          res.data.lst_circle.round_2.split("|").forEach((item, index) => {
            if (item == 0) {
              listIndex.push(index)
            }
          })
          setListInput(listIndex)
          setListIndexInput(listIndex)
        }

        setListCircle(res.data.lst_circle)
        // setCountInput(Number(res.data.lst_circle[0].input_count))
        setListLogicMulti(res.data.lst_logic_multi)
        setIsCheckLogic(true)
        if (dataDetail.grid.length > 0) {
          functionCheckLogicMaster(listNo)
        }
        let newArrOther = []
        if (res.data.lst_other.length > 0) {
          res.data.lst_other.forEach(item => {
            newArrOther.push(item.content)
          })
          let listNoOther = res.data.lst_other.map(item => item.No)
          newDataLastCheck.forEach(item => {
            if (listNoOther.includes(item.No)) {
              item.Result = "✖"
            }
          })
          setListNoOther(listNoOther)
        }
        setListReport(newArrOther)
        setDataLastCheck(newDataLastCheck)

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

  useEffect(() => {
    fetchDataCheckLogic()
  }, [isOpenModalCheckLogic]);

  const checkMaster2 = Number(dataPumb.is_master) === 2

  return (
    <>
      {
        checkMaster2 ?
          <Modal className='modal-checkLogic-master2' open={isOpenModalCheckLogic} onCancel={handleCancel} footer={false} width={"80%"} closeIcon={false}>
            <CheckLogicForMaster2
              columns={columns}
              dataCheckLogicListReport={dataCheckLogicListReport}
              isOpenModalCheckLogic={isOpenModalCheckLogic}
              handleCancel={handleCancel}
              listInput={listInput}
              dataLastCheck={dataLastCheck}
              listCircle={listCircle}
              listIndexInput={listIndexInput}
              listReport={listReport}
              setListReport={setListReport}
              listNoOther={listNoOther}
              setDataLastCheck={setDataLastCheck}
            />
          </Modal>
          :
          <Modal open={isOpenModalCheckLogic} onCancel={handleCancel} footer={false} style={{ padding: "2%" }} width={"50%"} closeIcon={false}>
            <Table
              size="small"
              columns={columns}
              dataSource={dataCheckLogicListReport}
              pagination={false}
              scroll={{
                y: "60vh",
              }}
              style={{ overflow: "auto" }}
              bordered
            ></Table>
          </Modal>
      }
    </>
  )
}

const CheckLogicForMaster2 = ({
  dataCheckLogicListReport,
  columns,
  isOpenModalCheckLogic,
  handleCancel,
  listInput,
  dataLastCheck,
  listCircle,
  listIndexInput,
  listReport,
  setListReport,
  listNoOther,
  setDataLastCheck
}) => {
  const [form] = Form.useForm();
  const [dataMaster, setDataMaster] = useState([])
  const [dataError, setDataError] = useState([])
  const dataColumnMaster = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
  const dataColumnExample = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  const valueExample = ["実性能", "MX", "F", "400", "AV", "(IE3)", "日東", "0.4", "50", "5", "200"]

  const dataExample = [
    {
      col1: "実性能",
      col2: "MDH",
      col3: "F",
      col4: "401",
      col5: "",
      col6: "(IE3)",
      col7: "日東",
      col8: "0.75",
      col9: "50",
      col10: "T",
      col11: "200",
    },
    {
      col1: "実性能",
      col2: "MX",
      col3: "F",
      col4: "401",
      col5: "",
      col6: "(IE3)",
      col7: "東芝",
      col8: "0.75",
      col9: "60",
      col10: "Z",
      col11: "200",
    },
  ]

  const columnsMaster = [

    ...dataColumnMaster.map((item, index) => ({
      title: item,
      dataIndex: index,
      key: item,
      align: "left",
      // ellipsis: true,
      // width: 20
    }))
  ];
  const columnsExample = [
    ...dataColumnExample.map((item, index) => ({
      title: item,
      dataIndex: 'col' + item,
      key: item,
      align: "left",
      ellipsis: true,
    }))
  ];

  const onFinish = (value) => {
    authAxios()
      .post(`${localhost}/check_logic_20`, {
        results: dataLastCheck,
        lst_ct: Object.values(value),
        lst_circle: listCircle
      })
      .then((res) => {
        // form.resetFields()
        let listData = []
        let newDataLastCheck = [...dataLastCheck]
        if (res.data.vlue_round.length > 0) {
          listData.push(res.data.vlue_round[0].content)
        }

        if (res.data.lst_report.length > 0) {
          res.data.lst_report.forEach(item => {
            listData.push(item.content)
          })
        }
        const dataRowTemp = {}
        if (res.data.row_temp.length > 0) {
          Object.keys(res.data.row_temp).forEach((item, index) => {
            dataRowTemp[item] = res.data.row_temp[index]
          })
          setDataMaster([dataRowTemp])
          newDataLastCheck.forEach(item => {
            if (listNoOther.includes(item.No)) {
              item.Result = "✔"
            }
          })
        } else {
          setDataMaster([])
          newDataLastCheck.forEach(item => {
            if (listNoOther.includes(item.No)) {
              item.Result = "✖"
            }
          })
        }
        setDataLastCheck(newDataLastCheck)
        setListReport(listData)
      }).catch(err => {
        console.log(err)
      })
  }

  const showDataRule = (val) => {
    if (val.vl_data === "") {
      setDataError([])
    } else {
      setDataError(val.vl_data.split("\r\n"))
    }
  }

  useEffect(() => {
    if (listInput.length > 0) {
      for (let i = 0; i < listInput.length; i++) {
        form.setFieldValue(`input_${i}`, "")
      }
    }
  }, [listInput]);



  return (
    <Row>
      <Col span={9} className='col-table-check-logic'>
        <Table
          size="small"
          columns={columns}
          // dataSource={dataInputUser1}
          dataSource={dataCheckLogicListReport}
          pagination={false}
          scroll={{
            y: "75vh",
          }}
          onRow={(record) => ({
            onClick: () => showDataRule(record),
          })}
          rowClassName={'row-table-check-logic'}
          bordered
          className='table-checkLogic'
        ></Table>
      </Col>
      <Col span={15} style={{ height: "80vh", paddingLeft: "2%" }}>
        <Row className='box-checkLogic-master2 list-error'>
          <div className='container-rule20' style={{ display: "grid" }}>
            {/* {listReport.map((item, index) => (
              <span className='content-report' style={{ fontSize: 14, fontWeight: 600 }} key={index}>{item}</span>
            ))} */}
            {dataError.length === 0 ?
              <span className='content-empty'>Nội dung lỗi</span>
              :
              dataError.map((item, index) => (
                <span key={index} className={'content-report'}>{item}</span>
              ))
            }
          </div>
        </Row>
        <Row className='box-checkLogic-master2' style={{ height: "85%", marginTop: "2%", border: "2px solid rgb(239, 71, 101)", padding: "1%" }}>
          <div className='container-rule20'>
            <Form
              form={form}
              layout='vertical'
              onFinish={onFinish}
            >
              <div >
                <span>Example:</span>

                <Table
                  size="small"
                  columns={columnsExample}
                  // dataSource={dataInputUser1}
                  dataSource={dataExample}
                  pagination={false}
                  style={{ overflow: "auto", width: "100%", opacity: 0.6 }}
                  bordered
                  className='table-checkLogic-example'
                ></Table>
              </div>
              <div className='row-input-check-circle2'>
                {listInput.map((item, index) => (
                  <Form.Item style={{ width: (100 / listInput.length) + "%" }} label={listIndexInput[index] + 1 + " ( " + valueExample[listIndexInput[index]] + " ) "} name={`input_${index}`} key={index}>
                    <Input></Input>
                  </Form.Item>
                ))}
              </div>

              <Row style={{ paddingTop: "1%", justifyContent: "flex-end" }}>
                <Button disabled = {listCircle.length === 0} htmlType='submit' className='button-check-circle-2'>Check vòng 2</Button>
              </Row>
            </Form>

            <Table
              size="small"
              columns={columnsMaster}
              // dataSource={dataInputUser1}
              dataSource={dataMaster}
              pagination={false}
              style={{ overflow: "auto", width: "100%", paddingTop: "1%", marginBottom: "2%" }}
              bordered
              className='table-checkLogic-example'
            ></Table>


            <Row className='box-checkLogic-master2' style={{ height: "38%", padding: "1%", border: "2px solid rgb(239, 71, 101)" }}>
              <div className='content-wrong-rule'>
                {listReport.length === 0 ?
                  <span className='content-empty'>Nội dung sai qui tắc</span>
                  :
                  listReport.map((item, index) => (
                    <span className='content-report' style={{ fontWeight: 600 }} key={index}>{item}</span>
                  ))
                }
              </div>
            </Row>
          </div>
        </Row>
      </Col>
    </Row>
  )
}


ModalShowCheckLogic.propTypes = {
  isOpenModalCheckLogic: PropTypes.bool,
  isSortData: PropTypes.bool,
  setIsOpenModalCheckLogic: PropTypes.func,
  setIsCheckLogic: PropTypes.func,
  dataLastCheck: PropTypes.arrayOf(
    PropTypes.shape({
      check_result: PropTypes.string,
      No: PropTypes.string,

    })
  ).isRequired,
  pumpId: PropTypes.string,
  setListNoCheckLogic: PropTypes.func,
  setListCheckRuleWarning: PropTypes.func,
  form: PropTypes.shape({
    getFieldsValue: PropTypes.func,
    setFieldValue: PropTypes.func,
    getFieldValue: PropTypes.func,
    resetFields: PropTypes.func,
    setFieldsValue: PropTypes.func,
  }),
  newDataTable: PropTypes.array,
  setListLogicMulti: PropTypes.func,
  setDataLastCheck: PropTypes.func,
  setListNotQualified: PropTypes.func,
  dataDetail: PropTypes.shape({
    grid: PropTypes.array
  })
}

export default ModalShowCheckLogic