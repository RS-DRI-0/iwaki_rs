import { CloseOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Modal, Row, Table } from 'antd'
import PropTypes from "prop-types";
import "./DataMaster.css"
const ModalDataMaster = (
    { isOpenModalDataMaster,
        setIsOpenModalDataMaster,
        dataLastCheck,
        onFinish,
        loadingTable,
        listDataMaster
    }) => {
    const [form] = Form.useForm();
    const dataMaster = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
    const example = ["2", "LK", "F", "55", "VC", "H", "02", "F", "E", "S"]
    const columns = [
        {
            title: 'No.',
            dataIndex: 'no',
            key: 'no',
            align: "center",
            width: 40,
        },

        {
            title: 'Result',
            dataIndex: 'm11',
            key: 'm11',
            align: "center",
            width: 100,
        },

        {
            title: 'Đầu bơm',
            dataIndex: 'm1',
            key: 'm1',
            align: "center",
            width: 80,
        },

        {
            title: 'Tên seri',
            dataIndex: 'm2',
            key: 'm2',
            align: "center",
            width: 80,
        },
        {
            title: 'Bộ dẫn động',
            dataIndex: 'm3',
            key: 'm3',
            align: "center",
            width: 100,
        },
        {
            title: 'Kích thước màn bơm / Tỷ số hộp giảm tốc',
            dataIndex: 'm4',
            key: 'm4',
            align: "center",
            width: 100,
        },
        {
            title: 'Vật liệu phần bị ướt',
            dataIndex: 'm5',
            key: 'm5',
            align: "center",
            width: 100,

        },
        {
            title: 'Loại kết nối',
            dataIndex: 'm6',
            key: 'm6',
            align: "center",

            width: 100,
        },
        {
            title: 'Công suất động cơ',
            dataIndex: 'm7',
            key: 'm7',
            align: "center",
            width: 100,
        },
        {
            title: 'Biến tầng',
            dataIndex: 'm8',
            key: 'm8',
            align: "center",
            width: 100,
        },
        {
            title: 'Servo',
            dataIndex: 'm9',
            key: 'm9',
            align: "center",
            width: 100,
        },
        {
            title: 'Loại bơm đặc biệt/ Tiêu chuẩn',
            dataIndex: 'm10',
            key: 'm10',
            align: "center",
            width: 80,
        },

    ];

    const handleCancel = () => {
        setIsOpenModalDataMaster(false)
    }

    return (

        <Modal open={isOpenModalDataMaster} onCancel={handleCancel} closeIcon={false} footer={false} width={"80%"} style={{ top: 30 }}>
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
                        <Col key={item} style={{ display: "grid", width: `${100 / dataMaster.length}%` }}>
                            <Form.Item
                                name={`input_${item}`}
                                label={""}
                                key={item}
                            >
                                <Input placeholder={`vd: ${example[index]}`} style={{ width: "90%" }}></Input>
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
                    bordered
                    loading={loadingTable}
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

ModalDataMaster.propTypes = {
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

export default ModalDataMaster