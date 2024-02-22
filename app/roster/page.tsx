"use client";
import React from "react";
import Container from "react-bootstrap/Container";
import { Suspense } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { getObjectFromCookie } from "../cookieService";
import RosterTable from "./rosterTable";

interface Roster {
  [day: string]: {
    [shift: string]: string[];
  };
}

const Roster: React.FC = () => {
  const roster: Roster | null = getObjectFromCookie("roster-cookie");

  const handleConvert = async () => {
    try {
      const response = await fetch(
        `/api/convert`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roster),
        }
      );
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
              />{" "}
              RosterMaster
            </Navbar.Brand>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                <Button variant="success" onClick={handleConvert}>
                  Download to Excel
                </Button>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Suspense fallback={<div>Loading...</div>}>
        <RosterTable></RosterTable>
        </Suspense>
        </div>
  );
};

export default Roster;
