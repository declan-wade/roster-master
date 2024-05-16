"use client";
import React, { useState } from "react";
import PersonForm from "./person";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Accordion from "react-bootstrap/Accordion";
import Alert from "react-bootstrap/Alert";
import { Tooltip } from 'react-tooltip'
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PopoverForm from "./offcanvas";
import ToastContainer from 'react-bootstrap/ToastContainer';
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import UploadJsonButton from './UploadJsonButton'; 
import Modal from 'react-bootstrap/Modal';
import {
  saveObjectToCookie,
  getObjectFromCookie,
  clearCookie,
} from "./cookieService";
import {
  saveObjectToStorage,
  clearStorage,
} from "./storageService";
import RolesForm from "./roles";
import { ButtonGroup } from "react-bootstrap";
import Toast from 'react-bootstrap/Toast';
import BulkAdd from "@/app/bulkAdd";
import { DateTime } from 'luxon';

export default function Page() {

  const [payload, setPayload] = useState<any[]>([]);
  const [roster, setRoster] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [numWeeks, setNumWeeks] = useState("1");
  const [formValid, setFormValid] = useState(true);
  const [roleList, setRoleList] = useState([]);
  const [editPerson, setEditPerson] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [doubleShiftFlag, setDoubleShiftFlag] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState("")
  const handleCloseUpload = () => setShowUpload(false);
  const handleShowUpload = () => setShowUpload(true);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const toggleToast = (msg: string) => {
    setToastMsg(msg)
    setShowToast(!showToast);
  }

  function handleJsonUpload(jsonData: any) {
    saveObjectToCookie(jsonData, uploadData);
    setShowUpload(false);
    getObjectFromCookie(uploadData);
    setUploadData('')
    window.location.reload();
  }

  const handleSubmit = (person: any) => {
    setPayload((previous) => [...previous, person]);
    toggleToast("Added person successfully!");
  };

  const onUpdate = (person: any) => {
    setPayload((previous) => {
      const updatedPayload = previous.map((item) => {
        if (item.name === person.name) {
          return { ...item, ...person }; // Merge the existing item with the new person data
        }
        return item;
      });

      // If no matching item was found, add the new person to the payload array
      if (!updatedPayload.some((item) => item.name === person.name)) {
        updatedPayload.push(person);
      }
      toggleToast("Saved successfully!")
      return updatedPayload;
    });
  };

  const handleRoleAdd = (myRoles: any) => {
    setRoleList(myRoles);
  };

  const removeFromPayload = (nameToRemove: any) => {
    setPayload((previous) =>
      previous.filter((person) => person.name !== nameToRemove)
    );
    toggleToast("Removed successfully!");
  };

  const handleClearCookies = () => {
    clearCookie("staff-cookie")
    clearCookie("roles-cookie")
    toggleToast("Cleared all cookies successfully!");
    window.location.reload();
  }

  const handleClearStorage = () => {
    clearStorage("roster-cookie")
    toggleToast("Cleared storage successfully!");
  }

  function downloadJSONFromCookie(cookieName: any, fileName: any) {

    // Retrieve the object from the specified cookie
    const objectFromCookie = getObjectFromCookie(cookieName);
  
    if (!objectFromCookie) {
      console.error(`No valid data found in the cookie: ${cookieName}`);
      toggleToast(`No valid data found in the cookie: ${cookieName}`)
      return;
    }
  
    const jsonString = JSON.stringify(objectFromCookie, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const getNextMonday = () => {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const daysSinceMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    const daysUntilPreviousMonday = 7 + daysSinceMonday;
    currentDate.setDate(currentDate.getDate() - daysUntilPreviousMonday);
    return currentDate.toISOString().split("T")[0];
  };

  const handleGenerate = async () => {
    if (startDate === "") {
      setFormValid(false);
    } else {
      clearStorage("roster-cookie");
      try {
        const response = await fetch(
          `/api/process?startDate=${encodeURIComponent(
            startDate
          )}&numWeeks=${encodeURIComponent(numWeeks)}&doubleShiftFlag=${encodeURIComponent(doubleShiftFlag)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"staffData": payload, "rolesData": roleList} ),
          }
        );

        if (!response.ok) {
          new Error("Failed to send POST request");
        }
        setRoster(await response.json());
        console.log("POST request successful");
        window.open(
          `/roster`,
          "_ blank"
        );
      } catch (error) {
        console.error("Error sending POST request:", error);
        throw error;
      }
    }
  };

  const overrideShow = () => {
    setShowOffcanvas(false);
    setEditPerson([]);
  };

  React.useEffect(() => {
    if (editPerson && Object.keys(editPerson).length > 0) {
      setShowOffcanvas(true);
    }
    console.log(editPerson);
  }, [editPerson]);

  React.useEffect(() => {
    console.log(roster);
    saveObjectToStorage(roster, "roster-cookie");
    console.info("Saved roster cookie");
  }, [roster]);

  React.useEffect(() => {
    console.log(payload);
    console.log("Payload length: ", payload.length);
    if (payload.length === 0) {
      console.log("Payload empty");
    } else {
      saveObjectToCookie(payload, "staff-cookie");
    }
  }, [payload]);

  React.useEffect(() => {
      saveObjectToCookie({"doubleShiftFlag": doubleShiftFlag}, "settings-cookie");
  }, [doubleShiftFlag]);

  React.useEffect(() => {
    const objectFromCookie = getObjectFromCookie("staff-cookie");
    if (objectFromCookie) {
      setPayload(objectFromCookie);
    }
  }, []);

  return (
    <div>
      <Navbar expand="lg" bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src="/avatar.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            RosterMaster
          </Navbar.Brand>
          <Nav className="me-auto" fill={true}>
            <NavDropdown title="Tools" className="nav-item">
              <NavDropdown.Item href="https://issue-form-two.vercel.app/">
                📢 Report an Issue
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleClearCookies}>
                🍪 Clear Cookies
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleClearStorage}>
                📦 Clear Local Storage
              </NavDropdown.Item>
              <NavDropdown.Item onClick={()=>downloadJSONFromCookie('staff-cookie', 'staffData')}>
                ⬇️ Download Staff Data
              </NavDropdown.Item>
              <NavDropdown.Item onClick={()=>downloadJSONFromCookie('roles-cookie', 'rolesData')}>
                ⬇️ Download Roles Data
              </NavDropdown.Item>
              <NavDropdown.Item onClick={()=>setShowUpload(true)}>
                ⤴️ Upload Data
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Container>
      </Navbar>
      <ToastContainer
          className="p-3"
          position="top-end"
          style={{ zIndex: 1000, position: 'fixed' }}

      >
      <Toast show={showToast} onClose={() => toggleToast("")} autohide={true} delay={3000} bg="success" >
        <Toast.Header>
          <strong className="me-auto">{toastMsg}</strong>
        </Toast.Header>
        <Toast.Body>

          </Toast.Body>
        </Toast>
        </ToastContainer>
        <Modal show={showUpload} onHide={handleCloseUpload}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card bg='danger' text='white'> <Card.Text>‎ This action will overwrite any existing data!</Card.Text></Card>
          <br></br>
        <Form.Select onChange={(e) => setUploadData(e.target.value)}>
          <option>Select data type...</option>
          <option value="staff-cookie">Staff</option>
          <option value="roles-cookie">Roles</option>
        </Form.Select>
        <br></br>
          <UploadJsonButton onUpload={handleJsonUpload} disabled={uploadData == ''}></UploadJsonButton>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpload}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
        <div className="container mt-5">
        <h4>Add Staff Member</h4>
        <PersonForm onSubmit={handleSubmit} rolesList={roleList} />
        <br></br>
        <hr></hr>
        <h4>Generate Roster</h4>
        <Container>
          <Row className="ps-0">
            <Col className="ps-0">
              <Form.Label className="form-label">
                Start Date (must be a Monday):
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  type="date"
                  data-tooltip-id="gen-day"
                  data-tooltip-html="Select the start day for the roster."
                  data-tooltip-place="top"
                  step="7"
                  className="form-control"
                  min={getNextMonday()}
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Tooltip id="gen-day" />
              </div>
              {!formValid ? (
                <Alert variant="danger" className="mt-3">
                  Please provide a start date.
                </Alert>
              ) : (
                <></>
              )}
            </Col>
            <Col>
              <Form.Label className="form-label">
                Number of Weeks to Generate (first week is always odd):
              </Form.Label>
              <Form.Control
                type="number"
                step="1"
                max="8"
                value={numWeeks}
                name="quantity"
                onChange={(e) => setNumWeeks(e.target.value)}
                className="quantity-field text-center w-25"
              ></Form.Control>
            </Col>
          </Row>
        </Container>

        <br></br>
        <Button 
        variant="warning" 
        data-tooltip-id="gen-btn"
        data-tooltip-content="Generate the roster in a new tab."
        data-tooltip-place="top"
        onClick={handleGenerate}>
          Generate Roster
        </Button>
        <Tooltip id="gen-btn" />
        <br></br>
        <hr></hr>
        <br></br>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header
            data-tooltip-id="acc-staff"
            data-tooltip-html="This is where you can manage and edit the staff you have created."
            data-tooltip-place="top"
            >
              <h5>Staff List</h5>‎ ‎ ‎ ‎{" "}
              <Badge>{payload ? payload.length : 0}</Badge>
            </Accordion.Header>
            <Tooltip id="acc-staff" />
            <Accordion.Body>
              <Button variant="outline-primary" onClick={openModal}>Bulk import</Button>
              <br></br>
              <br></br>
              <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton>
                  <Modal.Title>Bulk Import Staff</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <BulkAdd existingArray={payload} onArrayUpdate={setPayload} closeModal={closeModal}></BulkAdd>
                </Modal.Body>
              </Modal>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position / Role</th>
                    <th>RDO and Unavailable Dates</th>
                    <th>Dates WFH</th>
                    <th>Weighting</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payload ? (
                    payload.length > 0 ? (
                      payload.map((item: any) => (
                        <tr key={`${item.name}`}>
                          <td>{item.name}</td>
                          <td>
                            {item.roles.map((role: string) => (
                              <Badge
                                key={role}
                                pill
                                bg="primary"
                                className="me-1"
                              >
                                {role}
                              </Badge> // Adding margin for spacing
                            ))}
                          </td>
                          <td>
                            {item.unavailabilities.map(
                              (u: any, index: number) => (
                                <Badge
                                  key={index}
                                  pill
                                  bg="info"
                                  className="me-1"
                                >{`${u.unavDay}${
                                  u.dayType ? ` - ${u.dayType}` : ""
                                }`}</Badge> // Adding margin for spacing
                              )
                            )}
                            {item.leaveDays.map(
                              (u: any, index: number) => (
                                <Badge
                                  key={index}
                                  pill
                                  bg="info"
                                  className="me-1"
                                >{`${DateTime.fromISO(u.startDate).toFormat('dd LLLL yy')} -> ${DateTime.fromISO(u.endDate).toFormat('dd LLLL yy')}`}</Badge> // Adding margin for spacing
                              )
                            )}
                          </td>
                          <td>{item.wfhDays?.map(
                                  (u: any, index: number) => (
                                      <Badge
                                          key={index}
                                          pill
                                          bg="secondary"
                                          className="me-1"
                                      >{u}</Badge> // Adding margin for spacing
                                  )
                              )
                              ?? "N/A"}</td>
                          {" "}
                          <td>{item.weight? `${item.weight}` : "N/A"}
                          {" "}
                          </td>
                          <td className="align-middle">
                            <ButtonGroup>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => removeFromPayload(item.name)}
                              >
                                Delete
                              </Button>
                              <Button
                                size="sm"
                                variant="info"
                                onClick={() => setEditPerson(item)}
                              >
                                Edit
                              </Button>
                            </ButtonGroup>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6}>No staff added to roster</td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan={6}>Loading...</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header
             data-tooltip-id="acc-roles"
             data-tooltip-html="This is where you can define the different roles a person can be assigned to."
             data-tooltip-place="top"
            >
              <h5>Role Manager</h5>‎ ‎ ‎ ‎{" "}
              <Badge>{roleList ? roleList.length : 0}</Badge>
            </Accordion.Header>
            <Tooltip id="acc-roles" />
            <Accordion.Body>
              <RolesForm updateRoleList={handleRoleAdd} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header
              data-tooltip-id="acc-setting"
              data-tooltip-html="Manage advanced options and settings."
              data-tooltip-place="top"
              >
              <h5>Settings</h5>
            </Accordion.Header>
            <Tooltip id="acc-setting" />
            <Accordion.Body>
              <div className="mb-3">
                <Form.Label 
                className="form-label">Prevent staff from being assigned more than one shift per day.</Form.Label>
                <div>
                  <Form.Check
                      type="switch"
                      checked={doubleShiftFlag}
                      onChange={() => setDoubleShiftFlag(!doubleShiftFlag)}
                  />
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
          <br></br>
          <hr></hr>
          <br></br>
          <PopoverForm
              payload={editPerson}
              show={showOffcanvas}
              setShow={overrideShow}
              onUpdate={onUpdate}
              roleList={roleList}
        ></PopoverForm>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
      <footer className="footer fixed-bottom py-3 bg-light">
        <div className="container text-center">
          <span className="text-muted">
            RosterMaster - v0.12 - Licensed under MIT - Made in Perth, Western
            Australia - Code available{" "}
            <a href="https://github.com/declan-wade/roster-master">here</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
