"use client";

import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import {
  saveObjectToCookie,
  getObjectFromCookie,
  clearCookie,
} from "./cookieService";

interface RolesFormProps {
  updateRoleList: (roles: string[]) => void;
}

const RolesForm: React.FC<RolesFormProps> = ({updateRoleList}) => {
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState<string[]>([]);
  const [formValid, setFormValid] = useState(true);

  const handleRoleAdd = () => {
    if (role.trim() !== "") {
      setRoles([...roles, role.trim()]);
      setRole("");
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
  console.log(roles)
  if (roles.length === 0) {
    console.warn("Roles list empty");
  } else {
    saveObjectToCookie(roles, "roles-cookie");
  }
  }, [roles]);

  const handleRoleDelete = (index: number) => {
    const updatedRoles = [...roles];
    updatedRoles.splice(index, 1);
    setRoles(updatedRoles);
  };

  return (
      <div className="mb-3">
          <h4>Role Manager</h4>
        <div className="mb-3">
          <Form.Label className="form-label">Role</Form.Label>
          <div className="input-group">
          <Form.Control
            type="text"
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <Button
            type="button"
            className="btn btn-primary"
            onClick={handleRoleAdd}
          >
            Add Role
          </Button>
          </div>
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
  );
}

export default RolesForm;