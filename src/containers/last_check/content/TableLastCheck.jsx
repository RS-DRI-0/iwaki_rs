import { Form, Input, Table } from 'antd';
import { memo, useEffect } from 'react'
import PropTypes from "prop-types";
import useZoomLevel from '../../custom_hook/useZoomLevel';
const TableLastCheck = ({
    dataLastCheck,
    loadingTable,
    listNoCheckLogic,
    listCheckRuleWarning,
    form,
    isHaveGrid,
    setIsCheckLogic,
    dataPumb,
    dataGridLastCheck
}) => {
    const listKeyShortcuts = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];
    const zoomLevel = useZoomLevel();

    const columns = [
        {
            title: '#',
            dataIndex: 'row_number',
            key: 'row_number',
            align: "center",
            ellipsis: true,
            width: 20,
            render: (text, record, index) => index + 1
        },
        {
            title: 'No.',
            dataIndex: 'No',
            key: 'No',
            align: "center",
            ellipsis: true,
            width: 30,
        },

        {
            title: '項目名',
            dataIndex: 'field_name',
            key: 'field_name',
            align: "center",
            // ellipsis: true,
            width: 80,
        },

        {
            title: 'Checksheet',
            dataIndex: 'checksheet',
            key: 'checksheet',
            align: "center",
            // ellipsis: true,
            width: 100,
            render: (text, record, index) => formInsert(index, text, 'checksheet', record)
        },
        {
            title: 'Name plate/ Image',
            dataIndex: 'Name_plate',
            key: 'Name_plate',
            align: "center",
            // ellipsis: true,
            width: 100,
            render: (text, record, index) => formInsert(index, text, 'Name_plate', record)

        },
        {
            title: zoomLevel > 100 ? 'P. Instructions' : 'Production Instructions',
            dataIndex: 'Production_Instructions',
            key: 'Production_Instructions',
            align: "center",
            // ellipsis: true,
            width: 100,
            render: (text, record, index) => formInsert(index, text, 'Production_Instructions', record)

        },
        {
            title: 'Tem',
            dataIndex: 'Tem',
            key: 'Tem',
            align: "center",
            // ellipsis: true,
            width: 100,
            render: (text, record, index) => formInsert(index, text, 'Tem', record)
        },
        {
            title: 'Master',
            dataIndex: 'Master',
            key: 'Master',
            align: "center",
            ellipsis: true,
            width: 60,
            render: (text, record, index) => formInsert(index, text, 'Master', record)
        },
        {
            title: 'Result',
            dataIndex: 'Result',
            key: 'Result',
            align: "center",
            ellipsis: true,
            width: 50,
            render: (text, record, index) => formInsert(index, text, 'Result', record)
        },
    ];

    const formInsert = (index, text, dataIndex, record) => {
        const listColumns = ["checksheet", "Production_Instructions", "Name_plate", "Tem"]
        let checkDisabled = false
        let isCheckReadOnly;

        if (listColumns.includes(dataIndex)) {
            if (record[`mark_` + dataIndex].toLowerCase() === "none") {
                checkDisabled = true
            }
        }
        if (dataIndex === "Master") {
            isCheckReadOnly = true
        } else if (dataIndex === "Result" && record.other_rule !== "1") {
            checkDisabled = true
        } else {
            isCheckReadOnly = false
        }

        return <Form.Item
            name={`data_add__${index}__${dataIndex}`}
            label={""}
            key={dataIndex}
            initialValue={text}
            className='insert-infor'
        >
            <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 3 }}
                type="text"
                name="input1"
                id={dataIndex + index}

                value={text}
                disabled={checkDisabled}
                readOnly={isCheckReadOnly}
                onKeyDown={(e) => handleKeyPressChange(e, dataIndex, index, `data_add__${index}__${dataIndex}`)}
            >
            </Input.TextArea>
        </Form.Item>
    }

    const functionHandleArrowRight = (nameColumn, index, indexColumn, input, e) => {
        if (
            nameColumn === "Master" &&
            index === dataLastCheck.length - 1
        ) {
            return;
        } else {
            switch (nameColumn) {
                case "checksheet":
                    nameColumn = "Name_plate";
                    break;
                case "Name_plate":
                    nameColumn = "Production_Instructions";
                    break;
                case "Production_Instructions":
                    nameColumn = "Tem";
                    break;
                case "Tem":
                    nameColumn = "Master";
                    break;
                case "Master":
                    nameColumn = "checksheet";
                    indexColumn = indexColumn + 1;
                    break;
                default:
            }
            input = document.getElementById(nameColumn + indexColumn);
            e.preventDefault();
            input.focus();
        }
    }

    const functionHandleArrowLeft = (nameColumn, index, indexColumn, input, e) => {
        if (nameColumn === "checksheet" && index === 0) {
            return;
        } else {
            switch (nameColumn) {
                case "checksheet":
                    nameColumn = "Master";
                    indexColumn = indexColumn - 1;
                    break;
                case "Name_plate":
                    nameColumn = "checksheet";
                    break;
                case "Production_Instructions":
                    nameColumn = "Name_plate";
                    break;
                case "Tem":
                    nameColumn = "Production_Instructions";
                    break;
                case "Master":
                    nameColumn = "Tem";
                    break;
                default:
            }
            input = document.getElementById(nameColumn + indexColumn);
            e.preventDefault();
            input.focus();
        }
    }

    const functionHandleCtrlKey = (e, index, nameColumn, input, indexColumn) => {
        if (e.code === "ArrowDown") {
            if (index === dataLastCheck.length - 1) {
                return;
            } else {
                input = document.getElementById(nameColumn + (indexColumn + 1));
                e.preventDefault();
                input.focus();
            }
        } else if (e.code === "ArrowRight") {
            functionHandleArrowRight(nameColumn, index, indexColumn, input, e)
        } else if (e.code === "ArrowLeft") {
            functionHandleArrowLeft(nameColumn, index, indexColumn, input, e)
        } else if (e.code === "ArrowUp") {
            if (index === 0) {
                return;
            } else {
                input = document.getElementById(nameColumn + (indexColumn - 1));
                e.preventDefault();
                input.focus();
            }
        }
    }

    const functionHandleAltKey = (e, currentField) => {
        if (e.key === "1") {
            functionSetData(e, "☑", currentField);
        } else if (e.key === "2") {
            functionSetData(e, "✔", currentField);
        } else if (e.key === "3") {
            functionSetData(e, "✖", currentField);
        } else if (e.key === "4") {
            functionSetData(e, "●", currentField);
        } else if (e.key === "5") {
            functionSetData(e, "φ", currentField);
        }
    }

    const handleKeyPressChange = (e, dataIndex, index, currentField) => {
        let input = document.getElementById(dataIndex + index);
        let nameColumn = dataIndex;
        let indexColumn = index;
        if (parseInt(dataPumb.is_master) === 0) {
            setIsCheckLogic(false)
        }

        if (e.ctrlKey) {
            functionHandleCtrlKey(e, index, nameColumn, input, indexColumn)
        }

        else if (e.shiftKey) {
            if (listKeyShortcuts.includes(e.key)) {
                e.preventDefault();
            }
        }

        else if (e.altKey) {
            if (e.code.slice(0, 5) === "Digit") {
                if (currentField) {
                    functionHandleAltKey(e, currentField)
                }
            }
        }
    };

    const functionSetData = (event, value, currentField) => {
        // Lấy danh sách các field trong form
        const fields = form.getFieldsValue();
        // Duyệt qua từng field
        Object.keys(fields).forEach((fieldKey) => {
            if (fieldKey === currentField) {
                form.setFieldsValue({
                    [currentField]: form.getFieldValue()[currentField] + value,
                });
                // return;
            }
        });
        event.preventDefault();
        // return;
    };

    useEffect(() => {
        form.resetFields()
    }, [dataLastCheck]);
    return (
        <Form
            form={form}
        // onFinish={onFinish}
        >
            <Table
                // style={{ marginTop: 15 }}
                size="small"
                columns={columns}
                bordered
                loading={loadingTable}
                dataSource={dataLastCheck}
                pagination={false}
                scroll={{
                    y: isHaveGrid ? "40vh" : "70vh",
                }}
                key={"table-lc"}
                rowClassName={(record, index) => {
                    if (dataGridLastCheck.length === 0) {
                        if (record.Result === "✖" || listNoCheckLogic.includes(record.No)) {
                            // if (record.Result === "✖") {
                            return "bg-not-qualified";
                        } else if (listCheckRuleWarning.includes(record.No)) {
                            return "bg-checkLogic";
                        } else {
                            return null;
                        }
                    } else if (dataGridLastCheck.length !== 0) {
                        if (record.Result === "✖") {
                            return "bg-not-qualified";
                        } else if (listCheckRuleWarning.includes(record.No)) {
                            return "bg-checkLogic";
                        } else {
                            return null;
                        }
                    }
                }}
            ></Table>
        </Form>
    )
}

TableLastCheck.propTypes = {
    dataLastCheck: PropTypes.any,
    listCheckRuleWarning: PropTypes.any,
    loadingTable: PropTypes.bool,
    form: PropTypes.shape({
        getFieldsValue: PropTypes.func,
        setFieldValue: PropTypes.func,
        getFieldValue: PropTypes.func,
        resetFields: PropTypes.func,
        setFieldsValue: PropTypes.func,
    }),
    listNoCheckLogic: PropTypes.arrayOf(
        PropTypes.shape({
            No: PropTypes.number
        })
    ),
    isHaveGrid: PropTypes.bool,
    setIsCheckLogic: PropTypes.func,
    dataPumb: PropTypes.shape({
        is_master: PropTypes.string,
        value: PropTypes.string,
    }),
    dataGridLastCheck: PropTypes.arrayOf(PropTypes.string),

}

export default memo(TableLastCheck)