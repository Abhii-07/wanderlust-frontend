import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Space, Modal } from 'antd';
import axios from 'axios';

const Expense = () => {
  const [form] = Form.useForm();
  const [expenses, setExpenses] = useState([]);
  const [editExpense, setEditExpense] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchId, setSearchId] = useState('');
  const [searchedExpenses, setSearchedExpenses] = useState([]);
  const [destinationId, setDestinationId] = useState('');

  useEffect(() => {
    // Fetch expenses from your Flask API and set them in the state
    axios.get(`http://localhost:5000/expenses/${destinationId}`).then((response) => {
      setExpenses(response.data);
    });
  }, [destinationId]);

  const onFinish = (values) => {
    // Send a POST request to your Flask API to add a new expense for the selected destination
    axios
      .post('http://localhost:5000/expenses', {
        destination_id: destinationId,
        category: values.category,
        amount: values.amount,
      })
      .then((response) => {
        setExpenses([...expenses, response.data]);
        form.resetFields();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const showEditModal = (expense) => {
    form.setFieldsValue(expense);
    setEditExpense(expense);
    setIsModalVisible(true);
  };

  const handleEditCancel = () => {
    setEditExpense(null);
    setIsModalVisible(false);
  };

  const handleEditOk = () => {
    form
      .validateFields()
      .then((values) => {
        axios
          .put(`http://localhost:5000/expenses/${editExpense.id}`, values)
          .then((response) => {
            const updatedExpenses = expenses.map((exp) =>
              exp.id === response.data.id ? response.data : exp
            );
            setExpenses(updatedExpenses);
            handleEditCancel();
          })
          .catch((error) => {
            console.error('Error:', error);
            handleEditCancel();
          });
      })
      .catch((errorInfo) => {
        console.log('Validation failed:', errorInfo);
      });
  };

  const handleDelete = (expense) => {
    axios
      .delete(`http://localhost:5000/expenses/${expense.id}`)
      .then(() => {
        const updatedExpenses = expenses.filter((exp) => exp.id !== expense.id);
        setExpenses(updatedExpenses);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleSearch = () => {
    axios.get(`http://localhost:5000/expenses/${searchId}`).then((response) => {
      setSearchedExpenses(response.data);
    });
  };

  const columns = [
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => showEditModal(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Expense</h2>
      <Form form={form} name="expense-form">
        <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Category is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Amount is required' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Destination ID">
          <Input
            placeholder="Enter Destination ID"
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Expense
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={expenses} />
      <Input
        placeholder="Search by Expense ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      <Button style={{ margin: '10px' }} type="primary" onClick={handleSearch}>
        Search
      </Button>
      <h3 style={{ color: 'black' }}>Searched Expenses</h3>
      <Table columns={columns} dataSource={searchedExpenses} />
      <Modal
        title="Edit Expense"
        visible={isModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      >
        <Form form={form} onFinish={handleEditOk}>
          <Form.Item label="Category" name="category" initialValue={editExpense?.category}>
            <Input />
          </Form.Item>
          <Form.Item label="Amount" name="amount" initialValue={editExpense?.amount}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Expense;
