import { CloseOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Modal, Row, Table } from 'antd'
import PropTypes from "prop-types";
import "./DataMaster.css"
const ModalDataMasterSecond = (
    { isOpenModalDataMaster,
        setIsOpenModalDataMaster,
        dataLastCheck,
        onFinish,
        loadingTable,
        listDataMaster
    }) => {
    const [form] = Form.useForm();
    const dataMaster = ["1", "2", "3", "4", "5"]
    const example = ["2", "LK", "F", "55", "VC"]
    const columns = [
        {
            title: 'STT',
            dataIndex: 'no',
            key: 'no',
            align: "center",
            width: 40,
        },

        {
            title: 'Thứ tự chữ cái',
            dataIndex: 'm11',
            key: 'm11',
            align: "center",
            width: 100,
        },

        {
            title: 'Tên',
            dataIndex: 'm1',
            key: 'm1',
            align: "center",
            width: 80,
        },

        {
            title: 'Mô tả',
            dataIndex: 'm23',
            key: 'm23',
            align: "center",
            width: 80,
        },
        {
            title: 'Cột bên Master',
            dataIndex: 'm4',
            key: 'm4',
            align: "center",
            width: 100,
        },
        {
            title: 'VD',
            dataIndex: 'm5',
            key: 'm5',
            align: "center",
            width: 100,
        },
    ];

    const handleCancel = () => {
        setIsOpenModalDataMaster(false)
    }

    return (

        <Modal open={isOpenModalDataMaster} onCancel={handleCancel} closeIcon={false} footer={false} width={"60%"} style={{ top: 30 }}>
            <Row>
                <Col span={8}></Col>
                <Col span={8} className='element-center'>
                    <span className='title-data-master'>{dataLastCheck[1].checksheet || ""}</span>
                </Col>
                <Col span={8} className='icon-cancel'>
                    <Button className='btn-view-detail' style={{ height: 34, width: 34 }} onClick={handleCancel}>
                        <CloseOutlined />
                    </Button>

                </Col>
            </Row>

            <Form form={form} onFinish={onFinish} style={{ marginTop: "1%" }}>
                <Row>
                    {dataMaster.map((item, index) =>
                        <Col key={item} span={4} offset={index !== 0 ? 1 : null} style={{ display: "grid" }}>
                            <Form.Item
                                name={`input_${item}`}
                                label={""}
                                key={item}
                            >
                                <Input placeholder={`vd: ${example[index]}`} style={{ width: "100%" }}></Input>
                            </Form.Item>
                        </Col>
                    )}
                </Row>

                <Table
                    size="small"
                    columns={columns}
                    dataSource={listDataMaster}
                    pagination={false}
                    scroll={{
                        y: "55vh"
                    }}
                    loading={loadingTable}
                    bordered
                ></Table>

                <Row style={{ marginTop: "2%", display: "flex", justifyContent: "flex-end" }}>
                    <Button loading={loadingTable} htmlType='submit' type='primary' iconPosition={'start'}>
                        SUBMIT
                    </Button>
                </Row>
            </Form>
        </Modal>
    )
}

ModalDataMasterSecond.propTypes = {
    dataLastCheck: PropTypes.arrayOf(
        PropTypes.shape({
            checksheet: PropTypes.string
        })
    ),
    listDataMaster: PropTypes.arrayOf(PropTypes.string),
    isOpenModalDataMaster: PropTypes.bool,
    loadingTable: PropTypes.bool,
    setIsOpenModalDataMaster: PropTypes.func,
    onFinish: PropTypes.func,

}

export default ModalDataMasterSecond