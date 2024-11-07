import { Button, Col, Row } from 'antd'
import { useEffect, useState } from 'react'
import ModalSubmitLC from '../modal/ModalSubmitLC'
import PropTypes from "prop-types";

const ButtonSubmitLC = ({
    isOpenModalSubmit,
    setIsOpenModalSubmit,
    onFinish,
    loadingBtnSubmit,
    isCheckLogic,
    dataQA,
    listNoCheckLogic,
    listCheckRuleWarning,
    dataGridLastCheck,
    dataDetail,
    dataLastCheck,
    setDataLastCheck,
    form,
    setListReport,
    listReport,
    dataPumb
}) => {
    const [listNotQualified, setListNotQualified] = useState([])
    const showModalSubmit = () => {
        setIsOpenModalSubmit(true)
    }
    useEffect(() => {
        if (isOpenModalSubmit === true) {
            const dataForm = form.getFieldsValue()
            let data = dataLastCheck
            Object.keys(dataForm).map(item => {
                let arr_key = item.split("__");
                return data[arr_key[1]][arr_key[2]] = dataForm[item]
            });
            let dataNotQualified = data.filter(item => item.Result === "✖")

            setListNotQualified(dataNotQualified)
            setDataLastCheck(data)
        }

        const handleBeforeUnload1 = async (event) => {
            if (event.key === "F1") {
                event.preventDefault();
                if (isOpenModalSubmit === false) {
                    document.getElementById("btn-submit-lc").click();
                    return;
                } else {
                    onFinish()
                }
            }
        };

        window.addEventListener("keydown", handleBeforeUnload1);

        return () => {
            window.removeEventListener("keydown", handleBeforeUnload1);
        };

    }, [isOpenModalSubmit]);
    return (
        <>
            <Row style={{ position: "absolute", paddingTop: "1.5%", right: 0, paddingRight: "1.5%", width: "100%" }}>
                <Col
                    span={18}
                    style={{
                        display: "flex",
                        paddingLeft: "2%",
                        columnGap: "5ch",
                        alignItems: "center",
                    }}
                >
                    {Number(dataPumb.is_master) === 2 &&
                        <Row className='show-content-check-rule20'>
                            <div className='content-wrong-rule' style={{fontSize: 12}}>
                                {listReport.length === 0 ?
                                    <span className='content-empty'>Nội dung sai qui tắc</span>
                                    :
                                    listReport.map((item, index) => (
                                        <span className='content-report' style={{ fontWeight: 600 }} key={index}>{item}</span>
                                    ))
                                }
                            </div>
                        </Row>
                    }
                </Col>
                <Col span={5} offset={1} style={{
                    display: "flex",
                    columnGap: "2ch",
                    justifyContent: "flex-end"
                }}>
                    <Button
                        id="btn-submit-lc"
                        loading={loadingBtnSubmit}
                        style={{
                            marginTop: "1%",
                            fontWeight: "bold",
                        }}
                        type="primary"
                        disabled={parseInt(dataDetail.is_checksheet) !== 1 ? false : !isCheckLogic}
                        onClick={showModalSubmit}
                    >
                        SUBMIT (F1)
                    </Button>
                </Col>
            </Row>
            {isOpenModalSubmit &&
                <ModalSubmitLC
                    isOpenModalSubmit={isOpenModalSubmit}
                    setIsOpenModalSubmit={setIsOpenModalSubmit}
                    onFinish={onFinish}
                    listNotQualified={listNotQualified}
                    dataQA={dataQA}
                    listNoCheckLogic={listNoCheckLogic}
                    listCheckRuleWarning={listCheckRuleWarning}
                    dataGridLastCheck={dataGridLastCheck}
                />
            }
        </>
    )
}

ButtonSubmitLC.propTypes = {
    isOpenModalSubmit: PropTypes.bool,
    setIsOpenModalSubmit: PropTypes.func,
    onFinish: PropTypes.func,
    loadingBtnSubmit: PropTypes.bool,
    isCheckLogic: PropTypes.bool,
    dataQA: PropTypes.string,
    listNoCheckLogic: PropTypes.array,
    listCheckRuleWarning: PropTypes.array,
    dataGridLastCheck: PropTypes.array,
    dataLastCheck: PropTypes.array,
    setDataLastCheck: PropTypes.func,
    form: PropTypes.shape({
        getFieldsValue: PropTypes.func,
    }),
    dataDetail: PropTypes.shape({
        is_checksheet: PropTypes.string,
    })
};

export default ButtonSubmitLC