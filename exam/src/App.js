import logo from './logo.svg';
import './App.css';
import { Col, Image, ListGroup, Row, Button, Modal, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function App() {

  const [carList, setCarList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editRecord, setEditRecord] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  function fetchData(){
    fetch('api/cars')
    .then(r => r.json())
    .then(j => setCarList(j));
  }

  function saveRecord(car) {
    setLoading(true);
    fetch(`api/cars?id=${car.id}`, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(car)})
      .then(() => {
        fetchData();   
      },() => {
        alert('An error ocurred during update');
      }).finally(() => {
        setLoading(false);
      });
  }

  function handleNotMaintenanceClick(e, i) {
    e.stopPropagation();
    const newArr = [...carList];
    newArr[i].inMaintenance = false;
    saveRecord(newArr[i]);
  }

  function handleEditRecordClick(e, i) {
    e.stopPropagation();
    setEditRecord({...carList[i]});
    setShowModal(true);
  }

  function handleClose() {
    setShowModal(false);
  }

  function handleChange(e) {
    const newRecord = {...editRecord};
    newRecord[e.target.name] = e.target.value;
    setEditRecord(newRecord);
  }

  function handleSaveClick() {
    editRecord.inMaintenance = true;
    saveRecord(editRecord);
    setShowModal(false);
  }

  return (
    <div>
      <h5>Click on a record to edit and send to maintenance</h5>
      <ListGroup>
        {
          carList.map((c, i) => 
            <ListGroup.Item 
              key={i} 
              disabled={loading} 
              className={c.inMaintenance === true ? 'in-maintenance' : ''}
              onClick={(e) => handleEditRecordClick(e, i)}>
              <Row>
                <Col xs={2}>
                  <Image className={"car-image"} src={c.image}/>
                </Col>
                <Col xs={10} >
                  <Row>
                    <Col xs={1}>
                      Id: {c.id}
                    </Col>
                    <Col xs={3}>
                      {c.description}
                    </Col>
                    <Col xs={3}>
                      {c.make} / {c.model}
                    </Col>
                    <Col xs={2}>
                      {c.km ? c.km + ' km' : '' }
                    </Col>
                    <Col xs={2}>
                      {c.estimatedate}
                    </Col>
                  </Row>
                  { c.inMaintenance &&
                    <Row>
                      <Col xs={4}>
                        <Button onClick={(e) => handleNotMaintenanceClick(e, i)}>Remove from maintenance</Button>
                      </Col>
                    </Row>
                  }
                </Col>
              </Row>
            </ListGroup.Item>)
        }
      </ListGroup>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Send to maintenance</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Row>
            <Col xs={4}>Id</Col>
            <Col xs={4}>
              {editRecord.id}
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <label for="person">Person</label>
            </Col>
            <Col xs={4}>
              <input name="person" id="person" type="text" value={editRecord.person} onChange={handleChange}></input>
            </Col>
          </Row>
          <Row>
            <Col xs={4}>            
              <label for="estimatedate">Estimate date</label>
            </Col>
            <Col xs={4}>            
              <input name="estimatedate" id="estimatedate" type="text" value={editRecord.estimatedate} onChange={handleChange}></input>
            </Col>
          </Row>      
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveClick}>Save changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
