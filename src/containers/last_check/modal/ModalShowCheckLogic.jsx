import { Button, Col, Form, Input, Modal, Row, Table } from 'antd'
import { memo, useEffect, useState } from 'react'
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
  form,
  isSortData,
  newDataTable,
  setListLogicMulti,
  setDataLastCheck,
  setListNotQualified,
  dataDetail,
  dataPumb
}) => {
  const [dataCheckLogicListReport, setDataCheckLogicListReport] = useState([])
  const [listInput, setListInput] = useState([])
  const [listCircle, setListCircle] = useState([])
  // const [dataCheckLogicListReport, setDataCheckLogicListReport] = useState()
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));
  const [countInput, setCountInput] = useState(0)

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
        const listNo = res.data.lst_report.map(item => item.No)
        setListNoCheckLogic(listNo)
        setIsOpenModalCheckLogic(true)
        setDataCheckLogicListReport(res.data.lst_report)
        console.log(res.data)
        
        if (Object.keys(res.data.lst_circle).length > 0) {
          setListInput(res.data.lst_circle.rs_12.split("|"))
        }
        setListCircle(res.data.lst_circle)
        // setCountInput(Number(res.data.lst_circle[0].input_count))
        setListLogicMulti(res.data.lst_logic_multi)
        setIsCheckLogic(true)
        if (dataDetail.grid.length > 0) {
          functionCheckLogicMaster(listNo)
        }
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
          <Modal open={isOpenModalCheckLogic} onCancel={handleCancel} footer={false} style={{ padding: "2%", top: 15 }} width={"80%"} closeIcon={false}>
            <CheckLogicForMaster2
              columns={columns}
              dataCheckLogicListReport={dataCheckLogicListReport}
              isOpenModalCheckLogic={isOpenModalCheckLogic}
              handleCancel={handleCancel}
              listInput={listInput}
              dataLastCheck={dataLastCheck}
              listCircle= {listCircle}
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
  listCircle
}) => {
  const [form] = Form.useForm();
  const [listReport, setListReport] = useState([])

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
      col2: "MDH",
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

  const columnsExample = [
    {
      title: '1',
      dataIndex: 'col1',
      key: 'col1',
      align: "left",
      ellipsis: true,

    },

    {
      title: '2',
      dataIndex: 'col2',
      key: 'col2',
      align: "left",
      ellipsis: true,

    },
    {
      title: '3',
      dataIndex: 'col3',
      key: 'col3',
      align: "left",
      ellipsis: true,

    },

    {
      title: '4',
      dataIndex: 'col4',
      key: 'col4',
      align: "left",
      ellipsis: true,

    },
    {
      title: '5',
      dataIndex: 'col5',
      key: 'col5',
      align: "left",
      ellipsis: true,

    },

    {
      title: '6',
      dataIndex: 'col6',
      key: 'col6',
      align: "left",
      ellipsis: true,

    },
    {
      title: '7',
      dataIndex: 'col7',
      key: 'col7',
      align: "left",
      ellipsis: true,

    },

    {
      title: '8',
      dataIndex: 'col8',
      key: 'col8',
      align: "left",
      ellipsis: true,

    },

    {
      title: '9',
      dataIndex: 'col9',
      key: 'col9',
      align: "left",
      ellipsis: true,

    },
    {
      title: '10',
      dataIndex: 'col10',
      key: 'col10',
      align: "left",
      ellipsis: true,

    },

    {
      title: '11',
      dataIndex: 'col11',
      key: 'col11',
      align: "left",
      ellipsis: true,
    },
  ];

  const onFinish = (value) => {
    authAxios()
      .post(`${localhost}/check_logic_20`, {
        // results: isSortData ? newDataTable : dataLastCheck,
        // pump_id: pumpId,
        // user_role: inforUser.user_role,
        // vl_checksheet: dataChecksheet
        results: dataLastCheck,
        lst_ct: Object.values(value),
        lst_circle: listCircle
      })
      .then((res) => {
        form.resetFields()
        let listData = []
        if(res.data.vlue_round.length > 0){
          listData.push(res.data.vlue_round[0].content)
        }

        if(res.data.lst_report.length > 0) {
          res.data.lst_report.forEach(item => {
            listData.push(item.content)
          })
        }
        setListReport(listData)
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
  }


  return (
    <Row>
      <Col span={6}>
        <Table
          size="small"
          columns={columns}
          // dataSource={dataInputUser1}
          dataSource={dataCheckLogicListReport}
          pagination={false}
          scroll={{
            y: "60vh",
          }}
          style={{ overflow: "auto", width: "100%" }}
          bordered
          className='table-checkLogic'
        ></Table>
      </Col>
      <Col span={18} style={{ height: "80vh", paddingLeft: "2%" }}>
        <Row className='box-checkLogic-master2' style={{ height: "20%",overflow: "scroll", overflowX: "hidden"}}>
          <div className='container-rule20' style={{display: "grid"}}>
            {listReport.map((item, index) => (
              <span className='content-report' style={{fontSize: 14, fontWeight: 600}} key={index}>{item}</span>
            ))}
          </div>
        </Row>
        <Row className='box-checkLogic-master2' style={{ height: "80%", marginTop: "2%" }}>
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
                  style={{ overflow: "auto", width: "100%" }}
                  bordered
                  className='table-checkLogic-example'
                ></Table>
              </div>
              <div style={{ columnGap: "2ch", display: "flex", paddingTop: "1%" }}>
                {listInput.map((item, index) => (
                  <Form.Item style={{ width: (100 / listInput.length) + "%" }} name={`input_${index}`} key={index}>
                    <Input></Input>
                  </Form.Item>
                ))}
              </div>


              <Row style={{ paddingTop: "1%", justifyContent: "flex-end" }}>
                <Button htmlType='submit'>Lấy dữ liệu</Button>
              </Row>
            </Form>
            <Table
              size="small"
              columns={columnsExample}
              // dataSource={dataInputUser1}
              dataSource={dataExample}
              pagination={false}
              style={{ overflow: "auto", width: "100%", paddingTop: "1%" }}
              bordered
              className='table-checkLogic-example'
            ></Table>
            <Table
              size="small"
              columns={columnsExample}
              // dataSource={dataInputUser1}
              dataSource={dataExample}
              pagination={false}
              style={{ overflow: "auto", width: "100%", paddingTop: "1%" }}
              bordered
              className='table-checkLogic'

            ></Table>
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