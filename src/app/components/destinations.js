import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Space, Modal } from 'antd';
import axios from 'axios';

const Destination = () => {
    const [form] = Form.useForm();
    const [destinations, setDestinations] = useState([]);
    const [editDestination, setEditDestination] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchId, setSearchId] = useState('');
    const [searchedDestination, setSearchedDestination] = useState(null);
    const [displayTable, setDisplayTable] = useState(false);

    const handleSearch = () => {
        // Send a GET request to fetch a specific destination by ID
        axios.get(`http://localhost:5000/destinations/${searchId}`)
          .then((response) => {
            console.log(response.data);
            setSearchedDestination(response.data); // Update the state with the fetched destination
          })
          .catch((error) => {
            // Handle any errors here and show a message
            console.error('Error:', error);
            setSearchedDestination(null); // Reset the state if there was an error
          });
      };
      

    useEffect(() => {
        // Fetch destinations from your Flask API and set them in the state
        axios.get('http://localhost:5000/destinations').then((response) => {
            setDestinations(response.data);
        });
    }, []);

    const onFinish = (values) => {
        // Send a POST request to your Flask API to add a new destination
        axios
            .post('http://localhost:5000/destinations', values)
            .then((response) => {
                // Update the destinations list with the newly added destination
                setDestinations([...destinations, response.data]);
                form.resetFields();
            })
            .catch((error) => {
                // Handle any errors here and show a message
                console.error('Error:', error);
            });
    };

    const showEditModal = (destination) => {
        form.setFieldsValue(destination); // Set the form fields with destination data
        setEditDestination(destination);
        setIsModalVisible(true);
    };

    const handleEditCancel = () => {
        setEditDestination(null);
        setIsModalVisible(false);
    };

    const handleEditOk = () => {
        form
            .validateFields()
            .then((values) => {
                // Send a PUT request to update the destination
                axios
                    .put(`http://localhost:5000/destinations/${editDestination.id}`, values)
                    .then((response) => {
                        // Update the destinations list with the edited destination
                        const updatedDestinations = destinations.map((dest) =>
                            dest.id === response.data.id ? response.data : dest
                        );
                        setDestinations(updatedDestinations);
                        handleEditCancel();
                    })
                    .catch((error) => {
                        // Handle any errors here and show a message
                        console.error('Error:', error);
                        handleEditCancel();
                    });
            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
            });
    };

    const handleDelete = (destination) => {
        // Send a DELETE request to delete the destination
        axios
            .delete(`http://localhost:5000/destinations/${destination.id}`)
            .then(() => {
                // Remove the deleted destination from the destinations list
                const updatedDestinations = destinations.filter((dest) => dest.id !== destination.id);
                setDestinations(updatedDestinations);
            })
            .catch((error) => {
                // Handle any errors here and show a message
                console.error('Error:', error);
            });
    };



    const columns = [
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Description', dataIndex: 'description', key: 'description' },
        { title: 'Location', dataIndex: 'location', key: 'location' },
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
            <h2>Destination</h2>
            <Form form={form} name="destination-form" onFinish={onFinish}>
                {/* Form fields go here */}
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input />
                </Form.Item>
                <Form.Item label="Location" name="location">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Destination
                    </Button>
                </Form.Item>
            </Form>

            <div>
                <Input
                    placeholder="Search by ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
                <Button style={{ margin: '10px' }} type="primary" onClick={handleSearch}>
                    Search
                </Button>
                {/* Display the searched destination, if any */}
                {searchedDestination && (
                    <div style={{ color: 'black' }}>
                        <h3>Searched Destination</h3>
                        <p>ID: {searchedDestination.id}</p>
                        <p>Name: {searchedDestination.name}</p>
                        <p>Description: {searchedDestination.description}</p>
                        <p>Location: {searchedDestination.location}</p>
                    </div>
                )}
            </div>


            {/* Add a "Display" button to show/hide the table */}
            <Button style={{ margin: '10px' }} onClick={() => setDisplayTable(!displayTable)}>
                {displayTable ? 'Hide Table' : 'Display Table'}
            </Button>

            {/* Display the table when displayTable is true */}
            {displayTable && <Table columns={columns} dataSource={destinations} />}

            <Modal
                title="Edit Destination"
                visible={isModalVisible}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
            >
                {/* Edit destination form goes here */}
                <Form form={form} onFinish={handleEditOk}>
                    <Form.Item label="Name" name="name" initialValue={editDestination?.name}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Description" name="description" initialValue={editDestination?.description}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Location" name="location" initialValue={editDestination?.location}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Destination;
