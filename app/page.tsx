"use client";
import React, { useState } from "react";
import PersonForm from "./person";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import Accordion from "react-bootstrap/Accordion";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PopoverForm from "./offcanvas";
import {
  saveObjectToCookie,
  getObjectFromCookie,
  clearCookie,
} from "./cookieService";
import {
  saveObjectToStorage,
  clearStorage,
  getObjectFromStorage,
} from "./storageService";
import RolesForm from "./roles";
import { ButtonGroup } from "react-bootstrap";

export default function Page() {
  interface Person {
    name: string;
    roles: string[];
    unavailabilities: string[];
  }

  const [payload, setPayload] = useState<Person[]>([]);
  const [roster, setRoster] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [numWeeks, setNumWeeks] = useState("1");
  const [formValid, setFormValid] = useState(true);
  const [roleList, setRoleList] = useState([]);
  const [editPerson, setEditPerson] = useState([]);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleSubmit = (person: any) => {
    setPayload((previous) => [...previous, person]);
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
  };

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
          )}&numWeeks=${encodeURIComponent(numWeeks)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to send POST request");
        }
        setRoster(await response.json());
        console.log("POST request successful");
        window.open(
          `/roster?startDate=${encodeURIComponent(startDate)}`,
          "_ blank"
        );
      } catch (error) {
        console.error("Error sending POST request:", error);
        throw error;
      }
    }
  };
  
  const overrideShow = () => {
    setShowOffcanvas(false)
  }

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
        </Container>
      </Navbar>
      <div className="container mt-5">
        <h4>Add Staff Member</h4>
        <PersonForm onSubmit={handleSubmit} rolesList={roleList}/>
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
                  step="7"
                  className="form-control"
                  min={getNextMonday()}
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
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
                Number of Weeks to Generate:
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
        <Button variant="warning" onClick={handleGenerate}>
          Generate Roster
        </Button>
        <br></br>
        <hr></hr>
        <br></br>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h5>Staff List</h5>‎ ‎ ‎ ‎ <Badge>{payload ? payload.length : 0}</Badge>
            </Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Position / Role</th>
                    <th>Dates Unavailable</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payload ? (
                    payload.length > 0 ? (
                      payload.map((item: any) => (
                        <tr key={`${item.name}`}>
                          <td>{`${item.name}`}</td>
                          <td>
                            <Badge pill bg="primary">{`${item.roles}`}</Badge>
                          </td>
                          <td>{`${item.unavailabilities}`}</td>
                          <td className="align-middle">
                            <ButtonGroup>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() =>
                                  removeFromPayload(`${item.name}`)
                                }
                              >
                                Delete
                              </Button>
                              <Button size="sm" variant="info"
                               onClick={() =>
                                setEditPerson(item)
                              }
                              >
                                Edit
                              </Button>
                            </ButtonGroup>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4}>No staff added to roster</td>
                      </tr>
                    )
                  ) : (
                    <tr>
                      <td colSpan={4}>Loading...</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <h5>Role Manager</h5>‎ ‎ ‎ ‎ <Badge>{roleList ? roleList.length: 0}</Badge>
            </Accordion.Header>
            <Accordion.Body>
              <RolesForm updateRoleList={handleRoleAdd} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        <br></br>
        <hr></hr>
        <br></br>
        <PopoverForm payload={editPerson} show={showOffcanvas} setShow={overrideShow} onUpdate={onUpdate} roleList={roleList}></PopoverForm>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
      <footer className="footer fixed-bottom py-3 bg-light">
        <div className="container text-center">
          <span className="text-muted">
            RosterMaster - v0.7 - Licensed under MIT - Made in Perth, Western
            Australia - Code available{" "}
            <a href="https://github.com/declan-wade/roster-master">here</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
