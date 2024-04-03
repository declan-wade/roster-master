"use client";

import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import Stack from 'react-bootstrap/Stack';
import {
  saveObjectToCookie,
  getObjectFromCookie,
} from "./cookieService";
import { Badge } from "react-bootstrap";

interface RolesFormProps {
  updateRoleList: (roles: string[]) => void;
}

const RolesForm: React.FC<RolesFormProps> = ({ updateRoleList }) => {
  const [role, setRole] = useState("");
  const [isWfh, setIsWfh] = useState(false);
  const [isAllDay, setIsAllDay] = useState(false);
  const [roles, setRoles] = useState<any>([]);
  const [formValid, setFormValid] = useState(true);

  const handleRoleAdd = () => {
    if (role.trim() !== "") {
      const newRole = { role: role.trim(), isWfh: isWfh, isAllDay: isAllDay }; // Create new role object
      setRoles([...roles, newRole]); // Add new role object to roles array
      setRole("");
      setIsWfh(false); // Reset isWfh to default value
      setIsAllDay(false)
      setFormValid(true); // Reset form validity
    }
  };

  useEffect(() => {
    const objectFromCookie = getObjectFromCookie("roles-cookie");
    if (objectFromCookie) {
      setRoles(objectFromCookie);
    }
  }, []);

  useEffect(() => {
    updateRoleList(roles);
    if (roles.length === 0) {
      console.warn("Roles list empty");
    } else {
      saveObjectToCookie(roles, "roles-cookie");
      console.log(roles);
    }
  }, [roles]);

  const handleRoleDelete = (index: number) => {
    const updatedRoles = [...roles];
    updatedRoles.splice(index, 1);
    setRoles(updatedRoles);
  };

  return (
    <div className="mb-3">
      <div className="mb-3">
        <Form.Label className="form-label">Role</Form.Label>
        <div className="input-group">
          <Form.Control
            type="text"
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
        </div>
      </div>
      <div className="mb-3">
        <Form.Label className="form-label">WFH Compatible?</Form.Label>
        <div>
          <Form.Check
            type="switch"
            checked={isWfh}
            onChange={() => setIsWfh(!isWfh)}
          />
        </div>
      </div>
      <div className="mb-3">
        <Form.Label className="form-label">All day?</Form.Label>
        <div>
          <Form.Check
            type="switch"
            checked={isAllDay}
            onChange={() => setIsAllDay(!isAllDay)}
          />
        </div>
      </div>
      <div className="mb-3">
        <Button
          type="button"
          className="btn btn-primary"
          onClick={handleRoleAdd}
        >
          Add Role
        </Button>
      </div>

      <ListGroup className="list-group mt-2">
        {roles && roles.length > 0 ? (
          roles.map((roleObj: any, index: any) => (
            <ListGroup.Item
              variant="info"
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <Stack direction="horizontal" gap={2}>
              <>{roleObj.role}</> <Badge bg="secondary"> WFH Available? {roleObj.isWfh ? "Yes" : "No"}</Badge><Badge bg="warning"> All-Day? {roleObj.isAllDay ? "Yes": "No"}</Badge>
              </Stack>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRoleDelete(index)}
              >
                Delete
              </Button>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item variant="info">No roles available</ListGroup.Item>
        )}
      </ListGroup>

      {!formValid ? (
        <Alert variant="danger" className="mt-3">
          Please add at least one role.
        </Alert>
      ) : (
        <></>
      )}
    </div>
  );
};

export default RolesForm;
