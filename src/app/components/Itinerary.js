import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Table, Space } from 'antd';
import axios from 'axios';

const Itinerary = () => {
  const [form] = Form.useForm();
  const [itineraries, setItineraries] = useState([]);
  const [searchId, setSearchId] = useState('');
  const [searchedItineraries, setSearchedItineraries] = useState([]);
  const [destinationId, setDestinationId] = useState(''); // For destination selection

  useEffect(() => {
    // Fetch itineraries from your Flask API and set them in the state
    console.log('Fetching itineraries with destinationId:', destinationId);
    axios.get(`http://localhost:5000/itineraries/${destinationId}`).then((response) => {
      console.log('Received itineraries:', response.data);
      setItineraries(response.data);
    });
  }, [destinationId]); // Fetch itineraries when the destination changes

  const onFinish = (values) => {
    // Send a POST request to your Flask API to add a new itinerary activity for the selected destination
    console.log('Adding itinerary for destinationId:', destinationId);
    axios
      .post('http://localhost:5000/itineraries', {
        destination_id: destinationId, // Add the selected destination ID
        activity: values.activity,
      })
      .then((response) => {
        console.log('Added itinerary:', response.data);
        // Update the itineraries list with the newly added itinerary
        setItineraries([...itineraries, response.data]);
        form.resetFields();
      })
      .catch((error) => {
        // Handle any errors here and show a message
        console.error('Error:', error);
      });
  };

  const handleSearch = () => {
    // Send a GET request to fetch itinerary activities for a specific destination by ID
    console.log('Searching for itineraries with destinationId:', searchId);
    axios.get(`http://localhost:5000/itineraries/${searchId}`).then((response) => {
      console.log('Searched itineraries:', response.data);
      setSearchedItineraries(response.data);
    });
  };

  const columns = [
    { title: 'Activity', dataIndex: 'activity', key: 'activity' },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Button>Edit</Button>
          <Button>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Itinerary</h2>
      <Form form={form} name="itinerary-form" onFinish={onFinish}>
        {/* Form fields go here */}
        <Form.Item label="Activity" name="activity" rules={[{ required: true, message: 'Activity is required' }]}>
          <Input />
        </Form.Item>
        {/* Add other form fields as needed */}
        <Form.Item label="Destination">
          <Input
            placeholder="Enter Destination ID"
            value={destinationId}
            onChange={(e) => setDestinationId(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Itinerary
          </Button>
        </Form.Item>
      </Form>
      {/* <Table columns={columns} dataSource={itineraries} /> */}
      <Input
        placeholder="Search by Destination ID"
        value={searchId}
        onChange={(e) => setSearchId(e.target.value)}
      />
      <Button style={{ margin: '10px' }} type="primary" onClick={handleSearch}>
        Search
      </Button>
      <h3 style={{ color: 'black' }}>Searched Itineraries</h3>
      <Table columns={columns} dataSource={searchedItineraries} />
    </div>
  );
};

export default Itinerary;
