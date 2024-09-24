import { Form, Input, Table } from 'antd'
import { useEffect, useMemo } from 'react'
import PropTypes from "prop-types";

const TableGridLastCheck = ({
    dataGridLastCheck,
    formGrid,
    listIndexLogicGrid,
    setLoadingTableGrid,
    loadingTableGrid,
    dataPumb,
    setIsCheckLogic,
}) => {
    const listKeyShortcuts = ["!", "@", "#", "$", "%", "^", "&", "*", "(", ")"];

    const columns = [
        {
            title: "#",
            align: "center",
            ellipsis: true,
            width: 40,
            render: (value, item, index) => index + 1,
        },
        {
            title: "MFG　No.（製造番号)",
            dataIndex: "mfg_no",
            key: "mfg_no",
            align: "center",
            ellipsis: true,
            width: 40,
            render: (text, record, index) => formInsert(index, text, 'mfg_no', record)
        },
        {
            title: "Production Instructions",
            dataIndex: "production",
            key: "production",
            align: "center",
            ellipsis: true,
            width: 40,
            render: (text, record, index) => formInsert(index, text, 'production', record)
        },
    ];

    const formInsert = (index, text, dataIndex, record) => {
        return <Form.Item
            name={`data_grid__${index}__${dataIndex}`}
            label={""}
            key={dataIndex}
            initialValue={text}
            className='insert-infor'
        >
            <Input
                type="text"
                name="input1"
                id={dataIndex + index}
                value={text}
                // disabled={checkDisabled}
                // readOnly={dataIndex === "production" ? true : false}
                onKeyDown={(e) => handleKeyPressChange(e, dataIndex, index, `data_grid__${index}__${dataIndex}`)}
            >
            </Input>
        </Form.Item>
    }

    const functionHandleArrowRight = (nameColumn, index, indexColumn, input, e) => {
        if (
            nameColumn === "Master" &&
            index === dataGridLastCheck.length - 1
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
            if (index === dataGridLastCheck.length - 1) {
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
        // Lấy danh sách các field trong formGrid
        const fields = formGrid.getFieldsValue();
        // Duyệt qua từng field
        Object.keys(fields).forEach((fieldKey) => {
            if (fieldKey === currentField) {
                formGrid.setFieldsValue({
                    [currentField]: formGrid.getFieldValue()[currentField] + value,
                });
                // return;
            }
        });
        event.preventDefault();
        // return;
    };

    useEffect(() => {
        formGrid.resetFields()

        if (dataGridLastCheck.length > 0) {
            setLoadingTableGrid(false)
        }
    }, [dataGridLastCheck]);

    const getRowClassName = (record, index) => {
        if (listIndexLogicGrid.includes(index)) {
            return "bg-not-qualified";
        } else {
            return null;
        }
    };

    const memoizedRowClassName = useMemo(() => getRowClassName, [listIndexLogicGrid]);
    return (
        <Form
            form={formGrid}
        >
            <Table
                style={{ marginTop: 15, width: "60%" }}
                size="small"
                columns={columns}
                loading={loadingTableGrid}
                dataSource={dataGridLastCheck}
                pagination={false}
                scroll={{
                    y: "25vh",
                }}
                rowClassName={memoizedRowClassName}
            ></Table>
        </Form>
    )
}
TableGridLastCheck.propTypes = {
    dataGridLastCheck: PropTypes.array,
    formGrid: PropTypes.shape({
        getFieldsValue: PropTypes.func,
        setFieldValue: PropTypes.func,
        getFieldValue: PropTypes.func,
        resetFields: PropTypes.func,
        setFieldsValue: PropTypes.func,
    }),
    listIndexLogicGrid: PropTypes.arrayOf(PropTypes.number),
    setLoadingTableGrid: PropTypes.func,
    loadingTableGrid: PropTypes.bool,
    dataPumb: PropTypes.shape({
        is_master: PropTypes.string,
        value: PropTypes.string,
    }),
    setIsCheckLogic: PropTypes.func,
}

export default TableGridLastCheck