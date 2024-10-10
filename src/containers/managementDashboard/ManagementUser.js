import React from "react";

const ManagementUser = () => {
  const [listInforUserAll, setListInforUserAll] = useState([]);
  const [listInforUserFilter, setListInforUserFilter] = useState([]);

  const [openDrawerAddUser, setOpenDrawerAddUser] = useState(false);
  const [openDrawerEditUser, setOpenDrawerEditUser] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState({
    pageSize: 10,
    current: 1,
  });
  const [page, setPage] = useState(0);
  const [valueEdit, setValueEdit] = useState(undefined);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [checkValueSearch, setCheckValueSearch] = useState(undefined);
  const [valueSearch, setValueSearch] = useState([]);
  const [keyTabsTable, setKeyTabsTable] = useState(undefined);
  const [activeKey, setActiveKey] = useState("ALL");
  const inforUser = JSON.parse(sessionStorage.getItem("info_user"));

  const handleClickEdit = (index) => {
    setValueEdit(index);
    showDrawerEditUser(true);
  };

  const handleClickDelete = (index) => {
    setOpenConfirmDelete(true);

    confirm({
      title:
        index.is_active === 1
          ? "Bạn có muốn mở khóa người dùng?"
          : "Bạn có muốn khóa người dùng?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        setOpenConfirmDelete(false);
        authAxios()
          .post(`${localhost}/delete_user`, {
            user_id: index.Id,
            vl_lock: index.is_active === 1 ? 0 : 1,
            current_role: inforUser.user_role,
          })
          .then((res) => {
            fetchListUserAllDelete();
            openNotificationSweetAlertAdmin(SuccessIcon, res.data.message);
          })
          .catch((err) => {
            openNotificationSweetAlertAdmin(ErrorIcon, err.data.message);
          });
      },
      onCancel() {
        setOpenConfirmDelete(false);
      },
    });
  };

  const handleClickSetPassword = (index) => {
    authAxios()
      .post(`${localhost}/set_password`, {
        user_id: index.Id,
        user_new_pw: "Rs@12345",
        current_role: inforUser.user_role,
      })
      .then((res) => {
        fetchListUserAll();
        openNotificationSweetAlertAdmin(SuccessIcon, res.data.message);
      })
      .catch((err) => {
        openNotificationSweetAlertAdmin(ErrorIcon, err.data.message);
      });
  };

  const columns = [
    {
      title: "#",
      // dataIndex: "no",
      key: "stt",
      align: "center",
      width: 70,
      render: (value, item, index) =>
        ((rowsPerPage.current || 1) - 1) * rowsPerPage.pageSize + index + 1,
    },
    {
      title: "ID",
      dataIndex: "user_msnv",
      key: "user_msnv",
    },

    {
      title: "User Name",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Full Name",
      dataIndex: "user_fullname",
      key: "user_fullname",
    },
    {
      title: "Role",
      dataIndex: "user_role_title",
      key: "user_role_title",
      align: "center",
    },
    {
      title: "User Center",
      dataIndex: "user_center",
      key: "user_center",
      align: "center",
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (index, record) => (
        <Space size="middle">
          <IconButton onClick={() => handleClickEdit(index)}>
            <EditOutlined />
          </IconButton>
          <IconButton
            onClick={() => handleClickDelete(index)}
            disabled={openConfirmDelete}
          >
            <LockOutlined
              style={
                index.is_active === 0 ? { color: "#80b918" } : { color: "red" }
              }
            />
          </IconButton>
          <IconButton onClick={() => handleClickSetPassword(index)}>
            <HistoryOutlined />
          </IconButton>
        </Space>
      ),
    },
  ];

  const onChangeTabsTable = (key) => {
    const valueListAppUser = listInforUserAll.filter(
      (e) => e.user_role_title === key
    );
    setActiveKey(key);
    setListInforUserFilter(valueListAppUser);
    setKeyTabsTable(key);

    setPage((prev) => ({
      ...prev,
      current: 1,
    }));
    setCheckValueSearch();
    setRowsPerPage({
      pageSize: 10,
      current: 1,
    });
  };

  const items = [
    {
      key: "ALL",
      label: "ALL",
    },
    {
      key: "APP_USER",
      label: "APP_USER",
    },
    {
      key: "APP_MANAGER",
      label: "APP_MANAGER",
    },
    {
      key: "ENTRY",
      label: "ENTRY",
    },
    {
      key: "CHECK",
      label: "CHECK",
    },
    {
      key: "LASTCHECK",
      label: "LASTCHECK",
    },
    {
      key: "ADMIN",
      label: "ADMIN",
    },
    {
      key: "NOUHIN",
      label: "NOUHIN",
    },
    {
      key: "CLF",
      label: "CLF",
    },
    {
      key: "CHECK_CLF",
      label: "CHECK_CLF",
    },
  ];

  const fetchListUserAll = () => {
    authAxios()
      .get(`${localhost}/list_user`, {
        params: {
          user_role: inforUser.user_role,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        setListInforUserAll(res.data.List_user);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const fetchListUserAllDelete = () => {
    authAxios()
      .get(`${localhost}/list_user`, {
        params: {
          user_role: inforUser.user_role,
        },
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (checkValueSearch !== undefined) {
          const keyword = checkValueSearch.toUpperCase();

          const valueListAppUser = res.data.List_user.filter(
            (e) => e.user_role_title === keyTabsTable
          );

          const checkRuleSearch =
            valueListAppUser.length !== 0
              ? valueListAppUser
              : res.data.List_user;

          const valueSS = checkRuleSearch
            .filter(
              (value) =>
                value.user_name.toUpperCase().includes(keyword) ||
                value.user_fullname.toUpperCase().includes(keyword) ||
                value.user_center.toUpperCase().includes(keyword) ||
                value.user_role_title.toUpperCase().includes(keyword) ||
                value.user_msnv.toUpperCase().includes(keyword)
            )
            .map((item) => {
              return item;
            });
          setListInforUserAll(res.data.List_user);
          setValueSearch(valueSS);
        } else if (keyTabsTable !== undefined) {
          const valueListAppUser = res.data.List_user.filter(
            (e) => e.user_role_title === keyTabsTable
          );
          setListInforUserFilter(valueListAppUser);
        } else {
          setListInforUserAll(res.data.List_user);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showDrawerAddUser = (newOpen) => {
    setOpenDrawerAddUser(newOpen);
  };

  const showDrawerEditUser = (newOpen) => {
    setOpenDrawerEditUser(newOpen);
  };

  const onFinishEdit = (values) => {
    const splitString = values.user_role_title.split("+");
    authAxios()
      .post(`${localhost}/edit_user`, {
        user_id: valueEdit.Id,
        user_msnv: values.user_msnv.trim(),
        user_role_title: splitString[0],
        user_role: splitString[1],
        current_role: inforUser.user_role,
        user_lvl: splitString[2],
        user_pair: splitString[3],
        user_name: values.user_name.trim(),
        user_fullname: values.user_fullname.trim(),
        user_center: values.user_center,
      })
      .then((res) => {
        fetchListUserAllDelete();
        setOpenDrawerEditUser(false);
        openNotificationSweetAlertAdmin(SuccessIcon, res.data.message);
      })
      .catch((err) => {
        openNotificationSweetAlertAdmin(ErrorIcon, err.response.data.message);
      });
  };

  const onFinishAdd = (values) => {
    const splitString = values.user_role_title.split("+");

    authAxios()
      .post(`${localhost}/create_user`, {
        user_msnv: values.user_msnv.trim(),
        user_role_title: splitString[0],
        user_role: splitString[1],
        current_role: inforUser.user_role,
        user_lvl: splitString[2],
        user_pair: splitString[3],
        user_name: values.user_name.trim(),
        user_fullname: values.user_fullname.trim(),
        user_center: values.user_center,
      })
      .then((res) => {
        fetchListUserAllDelete();
        setOpenDrawerAddUser(false);
        openNotificationSweetAlertAdmin(SuccessIcon, res.data.message);
      })
      .catch((err) => {
        openNotificationSweetAlertAdmin(ErrorIcon, err.response.data.message);
      });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setRowsPerPage(pagination);
    setPage({
      ...pagination,
    });
  };

  const handleSearchUser = (e) => {
    const keyword = e.target.value.toUpperCase();
    setCheckValueSearch(e.target.value);

    const checkRuleSearch =
      listInforUserFilter.length !== 0 ? listInforUserFilter : listInforUserAll;

    const valueSS = checkRuleSearch
      .filter(
        (value) =>
          value.user_name.toUpperCase().includes(keyword) ||
          value.user_fullname.toUpperCase().includes(keyword) ||
          value.user_center.toUpperCase().includes(keyword) ||
          value.user_role_title.toUpperCase().includes(keyword) ||
          value.user_msnv.toUpperCase().includes(keyword)
      )
      .map((item) => {
        return item;
      });

    setPage((prev) => ({
      ...prev,
      current: 1,
    }));

    setRowsPerPage({
      pageSize: 10,
      current: 1,
    });
    setValueSearch(valueSS);
  };

  useEffect(() => {
    fetchListUserAll();
  }, []);

  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;

  const [valueColTabsUser, setValueColTabsUser] = useState([]);

  useEffect(() => {
    if (screenWidth > 1650) {
      setValueColTabsUser([2, 22]);
    } else if (screenWidth > 1024) {
      setValueColTabsUser([3, 21]);
    } else if (screenWidth <= 1024) {
      setValueColTabsUser([5, 19]);
    }
  }, [screenWidth]);

  const checkListInforUserFilter =
    listInforUserFilter.length !== 0 ? listInforUserFilter : listInforUserAll;

  return (
    <Row style={{ width: "100%", margin: "auto" }}>
      <Col span={24}>
        <div className="header-page-admin-user">
          <Row className="row-page-admin-user">
            <Col span={10}>
              <h3>USER MANAGEMENT</h3>
            </Col>
            <Col span={14} className="header-page-admin-user-col-14">
              <Input
                size="large"
                style={{ width: "20%", marginRight: 30 }}
                placeholder="Search..."
                value={checkValueSearch}
                onChange={handleSearchUser}
              ></Input>
              <Button
                variant="outlined"
                className="header-page-admin-user-button"
                startIcon={<PersonAddAltIcon />}
                onClick={() => showDrawerAddUser(true)}
              >
                ADD USER
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span={24} style={{ marginTop: 10 }}>
        <Row className="row-page-admin-user">
          <Col span={valueColTabsUser[0]}>
            <Tabs
              activeKey={activeKey}
              onChange={onChangeTabsTable}
              className="tabs-page-admin-user"
              tabPosition={"left"}
            >
              {items.map((item) => (
                <Tabs.TabPane tab={item.label} key={item.key}>
                  {item.label}
                </Tabs.TabPane>
              ))}
            </Tabs>
          </Col>
          <Col span={valueColTabsUser[1]}>
            <Table
              columns={columns}
              dataSource={
                checkValueSearch && checkValueSearch.length > 0
                  ? valueSearch
                  : checkListInforUserFilter
              }
              onChange={handleTableChange}
              scroll={{
                y: screenHeight - 295,
              }}
              pagination={page}
              size="middle"
              rowKey="stt"
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default ManagementUser;
