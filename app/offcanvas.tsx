import React, { useState, useEffect } from "react";
import { Button, Form, Offcanvas, Alert, ListGroup } from "react-bootstrap";

interface Props {
  payload: any;
  show: any;
  setShow: any;
  onUpdate: any;
  roleList: any;
}

const PopoverForm: React.FC<Props> = ({
  payload,
  show,
  setShow,
  onUpdate,
  roleList,
}) => {
  const [name, setName] = useState(payload.name);
  const [role, setRole] = useState("");
  const [unavailability, setUnavailability] = useState("");
  const [nameValid, setNameValid] = useState(true);
  const [rolesList, setRolesList] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [unavailabilities, setUnavailabilities] = useState<string[]>([]);
  const [formValid, setFormValid] = useState(true);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name.length > 1) {
      if (roles.length > 0) {
        const person = { name, roles, unavailabilities };
        onUpdate(person);
        // Clear form fields
        handleClose();
        setFormValid(true);
        setNameValid(true);
      } else {
        setFormValid(false);
      }
    } else {
      setNameValid(false);
    }
  };

  useEffect(() =>{
    setRolesList(roleList)
  },[roleList])

  useEffect(() => {
    setRoles(payload.roles);
    setName(payload.name);
    setUnavailabilities(payload.unavailabilities)
  }, [payload]);

  const handleRoleAdd = () => {
    setRoles([...roles, role]);
    setRole("");
  };

  const handleClose = () => {
    setShow(false);
    //setUnavailabilities([])
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
    <Offcanvas show={show} onHide={handleClose}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Edit Staff Memeber</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {roles ? (
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
                        No roles available - add a role at the bottom of the
                        screen
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
                  {unavailabilities && unavailabilities.length > 0 ? (
                    unavailabilities.map((u, index) => (
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
                    ))
                  ) : (
                    <ListGroup.Item variant="info">
                      No unavailabilities
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </div>
              <Button type="submit">Save</Button>
            </Form>
          ) : (
            <div>No staff selected</div>
          )
        }
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default PopoverForm;
