import { Button, Modal, Row } from 'antd'
import "../LastCheck.css"
import PropTypes from "prop-types";

const ModalSubmitLC = ({
    isOpenModalSubmit,
    setIsOpenModalSubmit,
    onFinish,
    listNotQualified,
    dataQA,
    dataGridLastCheck
}) => {
    const checkQualified = listNotQualified.length > 0
    const handleCancel = () => {
        setIsOpenModalSubmit(false)
    }

    const showTextStatus = () => {
        if (dataGridLastCheck.length === 0) {
            if ((dataQA !== "")) {
                return "Images not good"
            } else if (checkQualified) {
                return "Not Qualified"
            }
            else {
                return "Qualified"
            }
        } else if (dataGridLastCheck.length !== 0) {
            if (dataQA !== "") {
                return "Images not good"
            } else if (checkQualified) {
                return "Not Qualified"
            }
            else {
                return "Qualified"
            }
        }
    }

    const showColorStatus = () => {
        if (dataGridLastCheck.length === 0) {
            if ((dataQA !== "") && dataGridLastCheck.length === 0) {
                return "rgb(255 168 0)"
            } else if (checkQualified) {
                return "#C63F3F"
            }
            else {
                return "#07864B"
            }
        } else if (dataGridLastCheck.length !== 0) {
            if (dataQA !== "") {
                return "rgb(255 168 0)"
            } else if (checkQualified) {
                return "#C63F3F"
            }
            else {
                return "#07864B"
            }
        }
    }

    return (
        <Modal className='modal-submit-lc' open={isOpenModalSubmit} onCancel={handleCancel} footer={false} maskClosable={false} style={{ padding: "2%" }} closeIcon={false}>
            <div style={{ marginTop: "3%" }}>
                <Row
                    className='row-content-modal-submit-lc'
                >
                    <span className='text-content-modal-submit-lc'>Kết quả của LC là <span style={{ fontWeight: 600, color: showColorStatus(), fontSize: 24 }}>{showTextStatus()}</span></span>
                    <span className='text-content-modal-submit-lc'>Bạn có chắc chắn muốn submit kết quả kiểm tra ?</span>
                </Row>

                <Row className='row-btn-modal-submit-lc'>
                    <Button className='btn-modal-submit-lc' onClick={handleCancel}>CANCEL</Button>
                    <Button className='btn-modal-submit-lc' onClick={onFinish} type='primary'>SUBMIT</Button>
                </Row>
            </div>
        </Modal>
    )
}

ModalSubmitLC.propTypes = {
    isOpenModalSubmit: PropTypes.bool,
    setIsOpenModalSubmit: PropTypes.func,
    onFinish: PropTypes.func,
    listNotQualified: PropTypes.array,
    dataQA: PropTypes.string,
    dataGridLastCheck: PropTypes.array,
}

export default ModalSubmitLC