import { CloseOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Col, Modal, Row } from 'antd'
import { useEffect, useState } from 'react'
import "../ModalFileManager.css"
import IconTotalFile from "../../../../images/file_manager/IconTotalFile.svg";
import ModalViewImageHistory from './ModalViewImageHistory';
import { authAxios } from '../../../../api/axiosClient';
import { localhost } from '../../../../server';
import language from "../../../../language.json";
import NoDataIcon from "../../../../images/file_manager/NoDataIcon.svg";
import { templateNodata } from '../../../../Function';
import PropTypes from "prop-types";
import LoadingIcon from "../../../../images/iconLoading.svg";


const ModalShowHistory = ({ open, setIsOpenModalHistory, chooseLanguage }) => {
    const [isOpenViewImage, setIsOpenViewImage] = useState(false)
    const [listHistory, setListHistory] = useState([])
    const inforUser = JSON.parse(sessionStorage.getItem("info_user"));
    const [dataDetail, setDataDetail] = useState({})
    const [loadingData, setLoadingData] = useState(false)

    const handleCancel = () => {
        setIsOpenModalHistory(false)
    }
    const showImage = (data) => {
        setDataDetail(data)
        setIsOpenViewImage(true)
    }

    const fetchDataHistory = () => {
        const FormData = require("form-data");
        let data = new FormData();
        setLoadingData(true)
        data.append("id_user", inforUser.user_id);
        data.append("user_role", inforUser.user_role);
        authAxios()
            .post(`${localhost}/view_history`, data)
            .then((res) => {
                let listHaveId = []
                res.data.data.forEach((item, index) => {
                    listHaveId.push({
                        ...item, id: index
                    })
                });
                setLoadingData(false)
                setListHistory(listHaveId)
            })
            .catch((err) => {
                setLoadingData(false)
                console.log(err);
            });
    }
    useEffect(() => {
        fetchDataHistory()
    }, []);
    return (
        <>
            <Modal className='modal-history' open={open} onCancel={handleCancel} footer={false} closable={false} style={{ top: 10 }}>
                {!loadingData ?
                    <>
                        <Row className='row-title-history' >
                            <Col
                                span={16}
                                className='title-history'
                                offset={4}
                            >
                                {language[chooseLanguage].history_file}
                            </Col>
                            <Col span={4} style={{ textAlign: "-webkit-right" }}>
                                <Button className='btn-view-detail' style={{ height: 30 }} onClick={handleCancel}>
                                    <CloseOutlined />
                                </Button>
                            </Col>
                        </Row>
                        <div className='container-history-manager'>
                            {listHistory.length > 0 ?
                                listHistory.map(item => (
                                    <Row key={item.id} style={{ padding: "3% 6%", background: "rgb(209 228 248 / 40%)", borderRadius: 14 }}>
                                        <Col span={20} style={{ display: "grid" }}>
                                            <span style={{ color: "rgb(33,38,67)", fontWeight: "bold", fontSize: 16 }}>{item.pack_name}</span>
                                            <Row>
                                                <Col span={16}>
                                                    <span style={{ color: "rgb(109,121,203)", fontSize: 12 }}>{item.upload_date}</span>
                                                </Col>
                                                <Col span={8} style={{ display: "flex", alignItems: "center" }}>
                                                    <img style={{ height: 20 }} src={IconTotalFile} alt=""></img> {item.images}
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={4} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                                            <EyeOutlined style={{ fontSize: 22, opacity: "0.7" }} onClick={() => showImage(item)} />
                                        </Col>
                                    </Row>
                                ))
                                :
                                templateNodata(NoDataIcon, language, chooseLanguage)
                            }
                        </div>
                    </>
                    :
                    <div className="container-loading-file-manager">
                        <img
                            style={{ width: "7%", height: "auto" }}
                            src={LoadingIcon}
                            className="load-image-desktop"
                            alt=""
                        ></img>
                    </div>}
            </Modal>
            {isOpenViewImage &&
                <ModalViewImageHistory
                    open={isOpenViewImage}
                    setIsOpenViewImage={setIsOpenViewImage}
                    dataDetail={dataDetail}
                />
            }
        </>
    )
}

ModalShowHistory.propTypes = {
    open: PropTypes.bool,
    setIsOpenModalHistory: PropTypes.func,
    chooseLanguage: PropTypes.string,
}

export default ModalShowHistory