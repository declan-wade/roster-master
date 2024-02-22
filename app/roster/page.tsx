"use client"
import React from "react";
import Container from 'react-bootstrap/Container';
import Table from "react-bootstrap/Table";
import {
  getObjectFromCookie,
} from "../cookieService";

interface Roster {
  [day: string]: {
    [shift: string]: string[];
  };
}

const Roster: React.FC = () => {

  const roster: Roster | null = getObjectFromCookie("roster-cookie")

    return (
      <div>
        <Container fluid="md">
        {roster ? (Object.entries(roster).map(([day, shifts]) => (
          <div key={day}>
            <h2>{day}</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th colSpan={2}>☀️ Morning Shifts</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(shifts).map(([shift, people]) =>
                  shift.startsWith("morning_") ? (
                    <tr key={shift}>
                      <td>{shift.split("_")[1]}</td>
                      <td>{people.join(", ")}</td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </Table>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  <th colSpan={2}>🌙 Afternoon Shifts</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(shifts).map(([shift, people]) =>
                  shift.startsWith("afternoon_") ? (
                    <tr key={shift}>
                      <td>{shift.split("_")[1]}</td>
                      <td>{people.join(", ")}</td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </Table>
          </div>
        ))):(
        <h3>Loading</h3>
        )}
      </Container>
      </div>
    )
}

export default Roster;