import { CloseOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Modal, Row, Table } from 'antd'
import PropTypes from "prop-types";

const ModalDataMaster = (
    { isOpenModalDataMaster,
        setIsOpenModalDataMaster,
        dataLastCheck,
        onFinish,
        loadingTable,
        listDataMaster
    }) => {
    const [form] = Form.useForm();
    const dataMaster = ["1", "2", "3", "4", "5", "6", "7", "8"]
    const example = ["2", "LK", "F", "55", "VC", "H", "02", "F"]
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
            dataIndex: 'm23',
            key: 'm23',
            align: "center",
            width: 80,
        },
        {
            title: 'Bộ dẫn động',
            dataIndex: 'm4',
            key: 'm4',
            align: "center",
            width: 100,
        },
        {
            title: 'Kích thước màn bơm / Tỷ số hộp giảm tốc',
            dataIndex: 'm5',
            key: 'm5',
            align: "center",
            width: 100,
        },
        {
            title: 'Vật liệu phần bị ướt',
            dataIndex: 'm67',
            key: 'm67',
            align: "center",
            width: 100,

        },
        {
            title: 'Loại kết nối',
            dataIndex: 'm8',
            key: 'm8',
            align: "center",

            width: 100,
        },
        {
            title: 'Công suất động cơ',
            dataIndex: 'm9',
            key: 'm9',
            align: "center",
            width: 100,
        },
        {
            title: 'Biến tầng',
            dataIndex: 'm10',
            key: 'm10',
            align: "center",
            width: 100,
        },
        {
            title: 'Servo',
            dataIndex: 'other_1',
            key: 'other_1',
            align: "center",
            width: 100,
        },
        {
            title: 'Loại bơm đặc biệt/ Tiêu chuẩn',
            dataIndex: 'other_2',
            key: 'other_2',
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
                <Col span={8} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <span style={{ fontWeight: 600, color: "rgb(37, 53, 91)", fontSize: 18 }}>{dataLastCheck[1].checksheet || ""}</span>
                </Col>
                <Col span={8} style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button className='btn-view-detail' style={{ height: 34, width: 34 }} onClick={handleCancel}>
                        <CloseOutlined />
                    </Button>
                </Col>
            </Row>

            <Form form={form} onFinish={onFinish} style={{ marginTop: "1%" }}>
                <Row>
                    {dataMaster.map((item, index) =>
                        <Col key={item} span={3} style={{ display: "grid" }}>
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
                    loading={loadingTable}
                ></Table>

                <Row style={{ marginTop: "2%", display: "flex", justifyContent: "flex-end" }}>
                    <Button htmlType='submit' type='primary'>
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