"use client";
import React from "react";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import { getObjectFromStorage} from '../storageService'
import { Col, Row } from 'react-bootstrap';

interface Roster {
  [day: string]: {
    [shift: string]: string[]
  };
}

interface RosterCardProps {
    date: any;
    shifts: any[];
}

const RosterTable: React.FC = () => {
  const roster: Roster | null = getObjectFromStorage("roster-cookie");


  function RosterCard({ date, shifts }: RosterCardProps) {
    return (
        <Card>
          <Card.Header>
            <Card.Title>{date}</Card.Title>
          </Card.Header>
          <Card.Body>
            {shifts && (
                <div>
                  {/* All-Day Shifts */}
                  <Table striped bordered hover size="sm">
                    <thead>
                    <tr>
                      <th colSpan={2}>🕒 All-Day Shifts</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(shifts).map(([shift, people]) =>
                        !shift.startsWith("morning_") && !shift.startsWith("afternoon_") ? (
                            <tr key={shift}>
                              <td>{shift}</td>
                              <td>{people.join(", ")}</td>
                            </tr>
                        ) : null
                    )}
                    </tbody>
                  </Table>

                  {/* Morning Shifts */}
                  <Table striped bordered hover size="sm">
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

                  {/* Afternoon Shifts */}
                  <Table striped bordered hover variant="dark" size="sm">
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
            )}
          </Card.Body>
        </Card>
    )
  }

  return (
      <div>
        <div className="container mt-3">
          {roster ? (
            <div>
              <Row xs={1} md={3} lg={3} className="mb-3">
                {Object.entries(roster).map(([date, shifts]) => (
                    <Col key={date} className="mb-3">
                      <RosterCard date={date} shifts={shifts as any} />
                    </Col>
                ))}
              </Row>
              </div>
              ) : (
              <h3>Loading...</h3>
          )}
        </div>
      </div>
  );
};

export default RosterTable;
