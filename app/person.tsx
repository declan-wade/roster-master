"use client";

// components/PersonForm.js
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";

type Role = string;
type Roles = Role[];
type Unavailability = string;
type Unavailabilities = Unavailability[];

export default function PersonForm({ onSubmit, rolesList }: any) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [unavailability, setUnavailability] = useState<Unavailability>("");
  const [roles, setRoles] = useState<Roles>([]);
  const [unavailabilities, setUnavailabilities] = useState<Unavailabilities>(
    []
  );
  const [formValid, setFormValid] = useState(true);
  const [nameValid, setNameValid] = useState(true);


  
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (name.length > 1) {
      if (roles.length > 0) {
        const person = { name, roles, unavailabilities };
        onSubmit(person);
        // Clear form fields
        setName("");
        setRole("");
        setUnavailability("");
        setRoles([]);
        setUnavailabilities([]);
        setFormValid(true);
        setNameValid(true);
      } else {
        setFormValid(false);
      }
    } else {
      setNameValid(false);
    }
  };

  const handleRoleAdd = () => {
    setRoles([...roles, role]);
    setRole("");
  };

  const handleUnavailabilityAdd = () => {
    setUnavailabilities([...unavailabilities, unavailability]);
    setUnavailability("");
  };

  const handleRoleDelete = (index: number) => {
    const updatedRoles = [...roles];
    updatedRoles.splice(index, 1);
    setRoles(updatedRoles);
  };

  const handleDateDelete = (index: number) => {
    const updatedDates = [...unavailabilities];
    updatedDates.splice(index, 1);
    setUnavailabilities(updatedDates);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-3">
        <Form.Label className="form-label">Name</Form.Label>
        <Form.Control
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {!nameValid ? (
        <Alert variant="danger" className="mt-3">
          Please provide a unique name.
        </Alert>
      ) : (
        <></>
      )}
      <div className="mb-3">
        <Form.Label className="form-label">Role</Form.Label>
        <div className="input-group">
          <Form.Select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">Select Role</option>
            {rolesList && rolesList.length > 0 ? (
              rolesList.map((roleItem: any, index: any) => (
                <option key={index} value={roleItem}>
                  {roleItem}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No roles available -  add a role at the bottom of the screen
              </option>
            )}
          </Form.Select>
          <Button
            type="button"
            className="btn btn-primary"
            onClick={handleRoleAdd}
            disabled={role.length <= 0}
          >
            Add Role
          </Button>
        </div>
        <ListGroup className="list-group mt-2">
          {roles.map((r, index) => (
            <ListGroup.Item
              variant="info"
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {r}
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRoleDelete(index)}
              >
                Delete
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
        {!formValid ? (
          <Alert variant="danger" className="mt-3">
            Please add at least one role.
          </Alert>
        ) : (
          <></>
        )}
      </div>
      <div className="mb-3">
        <Form.Label className="form-label">Unavailable Days</Form.Label>
        <div className="input-group">
          <Form.Control
            type="date"
            className="form-control"
            value={unavailability}
            onChange={(e) => setUnavailability(e.target.value)}
          />
          <Button
            type="button"
            className="btn btn-primary"
            onClick={handleUnavailabilityAdd}
            disabled={unavailability.length <= 0}
          >
            Add Unavailability
          </Button>
        </div>
        <ListGroup className="list-group mt-2">
          {unavailabilities.map((u, index) => (
            <ListGroup.Item
              variant="info"
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {u}
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDateDelete(index)}
              >
                Delete
              </Button>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <Button type="submit" className="btn btn-primary">
        Add Person to Roster
      </Button>
    </Form>
  );
}
