import { Button, Modal, Row } from 'antd'
import "../LastCheck.css"
import PropTypes from "prop-types";
import language from "../../../language.json";

const ModalSubmitLC = ({
    isOpenModalSubmit,
    setIsOpenModalSubmit,
    onFinish,
    listNotQualified,
    dataQA,
}) => {
    const checkQualified = listNotQualified.length > 0
    const handleCancel = () => {
        setIsOpenModalSubmit(false)
    }

    const showTextStatus = () => {
        if (dataQA !== "") {
            return <span className='highlight-text-status' style={{ color: "rgb(255 168 0)" }}>{language["english"].images_not_good}</span>
        } else if (checkQualified) {
            return <span className='highlight-text-status' style={{ color: "#C63F3F" }}>{language["english"].not_qualified}</span>
        }
        else {
            return <span className='highlight-text-status' style={{ color: "#07864B" }}>{language["english"].qualified}</span>
        }
    }

    return (
        <Modal className='modal-submit-lc' open={isOpenModalSubmit} onCancel={handleCancel} footer={false} maskClosable={false} style={{ padding: "2%" }} closeIcon={false}>
            <div style={{ marginTop: "3%" }}>
                <Row
                    className='row-content-modal-submit-lc'
                >
                    <span className='text-content-modal-submit-lc'>Kết quả của LC là {showTextStatus()}</span>
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