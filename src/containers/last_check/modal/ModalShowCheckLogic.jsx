import { Modal, Table } from 'antd'
import { useEffect, useState } from 'react'
import { localhost } from '../../../server'
import { authAxios } from '../../../api/axiosClient'
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
  dataDetail
}) => {
  const [dataCheckLogic, setDataCheckLogic] = useState([])
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

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
      width: "20%",
    },

    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      align: "left",
      ellipsis: true,
      width: 80,
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

    authAxios()
      .post(`${localhost}/check_logic`, {
        results: isSortData ? newDataTable : dataLastCheck,
        pump_id: pumpId,
        user_role: inforUser.user_role
      })
      .then((res) => {
        const listNo = res.data.lst_report.map(item => item.No)
        setListNoCheckLogic(listNo)
        setIsOpenModalCheckLogic(true)

        setDataCheckLogic(res.data.lst_report)

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
    if (isOpenModalCheckLogic === true) {
      fetchDataCheckLogic()
    }
  }, [isOpenModalCheckLogic]);

  return (
    <Modal open={isOpenModalCheckLogic} onCancel={handleCancel} footer={false} style={{ padding: "2%" }} width={"50%"} closeIcon={false}>
      <Table
        size="small"
        columns={columns}
        // dataSource={dataInputUser1}
        dataSource={dataCheckLogic}
        pagination={false}
        scroll={{
          y: "60vh",
        }}
        style={{ overflow: "auto" }}
        bordered
      ></Table>
    </Modal>
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