"use client";
import React, {useState, useEffect} from "react";
import Container from "react-bootstrap/Container";
import { Suspense } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { getObjectFromStorage} from '../storageService'
import RosterTable from "./rosterTable";
import Modal from 'react-bootstrap/Modal';
import * as DateTime from 'luxon';
import ShiftStatistics from "@/app/roster/statistics";

interface Roster {
  [day: string]: {
    [shift: string]: string[];
  };
}

interface WeeklyShiftCounts {
  [person: string]: {
    week1: number;
    week2: number; // Add more weeks if needed
  };
}

const Roster: React.FC = () => {
  const roster: Roster | null = getObjectFromStorage("roster-cookie");
  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

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

  const [weeklyShifts, setWeeklyShifts] = useState<WeeklyShiftCounts>({});
  const [weekMap, setWeekMap] = useState<{ [key: number]: string }>({}); // Initialize weekMap

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
              <Navbar.Text className="me-3">
                <Button variant="success" onClick={handleConvert}>
                  Download to Excel
                </Button>
              </Navbar.Text>
              <Navbar.Text>
                <Button variant="warning" onClick={openModal}>
                  Statistics
                </Button>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Modal className="modal-lg" centered scrollable show={showModal} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Roster Statistics</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
             <ShiftStatistics />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      <Suspense fallback={<div>Loading...</div>}>
        <RosterTable></RosterTable>
      </Suspense>
    </div>
  );
};

export default Roster;
