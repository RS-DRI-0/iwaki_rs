import { Form, Tabs } from 'antd'
import React, { useState } from 'react'
import "./CheckRule.css"
import CheckRule from './CheckRule'
import TryCheckRule from './TryCheckRule'

const ContainerRule = () => {
    const [activeKey, setActiveKey] = useState("1")
    const items = [
        {
            label: 'Main',
            key: '1',
            children: <CheckRule />
        },
        {
            label: 'Try it!',
            key: '2',
            children: <TryCheckRule />,
        }
    ]

    const changeActiveKey = (e) => {
        setActiveKey(e)
    }

    return (
        <div className='container-create-rule' style={{ display: "flex" }}>
            <div className='body-create-rule' style={{ width: "100%" }}>
                <div className='form-create-rule'>
                    <h2 style={{ textAlign: "center", textTransform: "uppercase" }}>Tạo quy tắc</h2>
                    <Tabs
                        defaultActiveKey={activeKey}
                        items={items}
                        onChange={changeActiveKey}
                    />
                </div>
            </div>
        </div>
    )
}

export default ContainerRule