"use client";
import React, { useState } from "react";
import PersonForm from "./person";
import PersonTable from "./table";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Table from "react-bootstrap/Table";
import {
  saveObjectToCookie,
  getObjectFromCookie,
  clearCookie,
} from "./cookieService";

export default function Page() {

  interface Person {
    name: string;
    roles: string[];
    unavailabilities: string[];
  }

  const [payload, setPayload] = useState<Person[]>([]);

  const handleSubmit = (person: any) => {
    setPayload((previous) => [...previous, person]);
  };

  const removeFromPayload = (nameToRemove: any) => {
    setPayload((previous) => previous.filter(person => person.name !== nameToRemove));
  };

  const handleGenerate = async() => {
    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to send POST request");
      }
      console.log("POST request successful");
    } catch (error) {
      console.error("Error sending POST request:", error);
      throw error;
    }
  }

  React.useEffect(() => {
    console.log(payload);
    console.log("Payload length: ", payload.length)
    if (payload.length === 0) {
      console.log("Payload empty");
    } else {
    saveObjectToCookie(payload);
    }
  }, [payload]);

  React.useEffect(() => {
    const objectFromCookie = getObjectFromCookie();
    if (objectFromCookie) {
      setPayload(objectFromCookie);
    }
  }, []);

  return (
    <div>
    <Navbar expand="lg" bg="primary" data-bs-theme="dark">
      <Container>
        <Navbar.Brand href="#home" >RosterMaster</Navbar.Brand>
        </Container>
        </Navbar>
    <div className="container mt-5">
      <h3>Add Person</h3>
      <PersonForm onSubmit={handleSubmit} />
      <br></br>
      <Button variant="warning" onClick={handleGenerate}>Generate Roster</Button>
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
                  <td><Button size="sm" variant="danger" onClick={() => removeFromPayload(`${item.name}`)}>Delete</Button></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4}>No people added to roster</td></tr>
            )
          ) : (
            <tr><td colSpan={4}>Loading...</td></tr>
          )}
        </tbody>
      </Table>
      <br></br>
    </div>
    </div>
  );
}
