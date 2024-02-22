"use client"
import React from "react";
import Container from 'react-bootstrap/Container';
import Table from "react-bootstrap/Table";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { DateTime } from 'luxon';
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams()
  const params: any = searchParams.get('startDate')
  const startDate = DateTime.fromISO(params);
  const formattedDate = startDate.toFormat('EEEE dd LLLL yyyy');

  const formatDate = (startDate: any, dayIndex: any) => {
    const formattedDate = DateTime.fromISO(startDate).plus({ days: dayIndex }).toFormat('cccc LLLL d, yyyy');
    return formattedDate;
  }

  const handleConvert = async () => {
    try {
      const response = await fetch(`/api/convert?startDate=${encodeURIComponent(params)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roster),
      });
      if (!response.ok) {
        throw new Error("Failed to send POST request");
      }
      // Get the response data as a blob
      const blob = await response.blob();

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element
      const link = document.createElement("a");
      link.href = url;
      link.download = "roster.csv";

      // Simulate a click on the link to trigger the download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error sending POST request:", error);
      throw error;
    }
  };

    return (
      <div>
        <Navbar expand="lg" bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">
          <img
              alt=""
              src="/avatar.svg"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            RosterMaster</Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
          <Button variant="success" onClick={handleConvert}>Download to Excel</Button>
          </Navbar.Text>
        </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container mt-5">
          <h3>For week starting {formattedDate}</h3>
          <hr></hr>
        {roster ? (Object.entries(roster).map(([day, shifts], dayIndex) => (
          
          <div key={day}>
            
            <h4>{formatDate(startDate, dayIndex)}</h4>
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
            <br></br>
          </div>
        ))):(
        <h3>Loading</h3>
        )}
      </div>
      </div>
    )
}

export default Roster;