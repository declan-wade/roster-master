"use client";
import React, { useState } from "react";
import PersonForm from "./person";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import {
  saveObjectToCookie,
  getObjectFromCookie,
  clearCookie,
} from "./cookieService";
import { url } from "inspector";

export default function Page() {
  interface Person {
    name: string;
    roles: string[];
    unavailabilities: string[];
  }

  const [payload, setPayload] = useState<Person[]>([]);
  const [roster, setRoster] = useState([]);

  const handleSubmit = (person: any) => {
    setPayload((previous) => [...previous, person]);
  };

  const removeFromPayload = (nameToRemove: any) => {
    setPayload((previous) =>
      previous.filter((person) => person.name !== nameToRemove)
    );
  };

  const handleGenerate = async () => {
    clearCookie("roster-cookie");
    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send POST request");
      }
      setRoster(await response.json())
      console.log("POST request successful");
      window.open("/roster", "_ blank");
    } catch (error) {
      console.error("Error sending POST request:", error);
      throw error;
    }
  };

  React.useEffect(() => {
    console.log(roster)
    saveObjectToCookie(roster, "roster-cookie");
    console.info("Saved roster cookie")
  }, [roster])

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
            />{' '}
            RosterMaster</Navbar.Brand>
        </Container>
      </Navbar>
      <div className="container mt-5">
        <h3>Add Staff Member</h3>
        <PersonForm onSubmit={handleSubmit} />
        <br></br>
        <Button variant="warning" onClick={handleGenerate}>
          Generate Roster
        </Button>
        <br></br>
        <hr></hr>
        <h3>Staff List</h3>
        <br></br>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Position / Role</th>
              <th>Dates Unavailable</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {payload ? (
              payload.length > 0 ? (
                payload.map((item: any) => (
                  <tr key={`${item.name}`}>
                    <td>{`${item.name}`}</td>
                    <td>{`${item.roles}`}</td>
                    <td>{`${item.unavailabilities}`}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => removeFromPayload(`${item.name}`)}
                      >
                        Delete
                      </Button>
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
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
      </div>
      <footer className="footer fixed-bottom py-3 bg-light">
      <div className="container text-center">
        <span className="text-muted">RosterMaster - v0.2 - Licensed under MIT - Made in Perth, Western Australia - Code available <a href="https://github.com/declan-wade/roster-master">here</a></span>
      </div>
    </footer>
    </div>
  );
}
