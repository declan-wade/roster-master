"use client";

// components/PersonForm.js
import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import InputGroup from "react-bootstrap/InputGroup";

type DayType = string;
type UnavDay = string;
type wfhDay = string;
type wfhDays = wfhDay[];

export default function PersonForm({onSubmit, rolesList}: any) {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [unavailability, setUnavailability] = useState<any>([]);
    const [roles, setRoles] = useState<any>([]);
    const [unavailabilities, setUnavailabilities] = useState<any>([]);
    const [wfhDays, setWfhDays] = useState<wfhDays>([]);
    const [wfhDay, setWfhDay] = useState<wfhDay>("");
    const [formValid, setFormValid] = useState(true);
    const [nameValid, setNameValid] = useState(true);
    const [dayType, setDayType] = useState<DayType>("All-Day");
    const [unavDay, setUnavDay] = useState<UnavDay>("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (name.length > 1) {
            if (roles.length > 0) {
                const person = {name, roles, unavailabilities, wfhDays};
                onSubmit(person);
                // Clear form fields
                setName("");
                setRole("");
                setDayType("All-Day")
                setUnavDay("");
                setUnavailability([]);
                setWfhDay("");
                setRoles([]);
                setUnavailabilities([]);
                setWfhDays([]);
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
        if (unavDay.trim() !== "") {
            const newUnav = {unavDay: unavDay.trim(), dayType: dayType}; // Create new unavailability object
            setUnavailabilities([...unavailabilities, newUnav]); // Add new role object to unavailabilities array
            setRole("");
            setUnavDay("");
            setDayType("All-Day")
            setUnavailability([]);
            console.log({unavailability});
            console.log({unavailabilities});
        }
    };

    const handleWfhAdd = () => {
        setWfhDays([...wfhDays, wfhDay]);
        setWfhDay("");
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

    const handleWfhDelete = (index: number) => {
        const updatedDates = [...wfhDays];
        updatedDates.splice(index, 1);
        setWfhDays(updatedDates);
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
                                <option key={index} value={roleItem.role}>
                                    {roleItem.role}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>
                                No roles available - add a role at the bottom of the screen
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
                    {roles.map((r: any, index: any) => (
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
                <InputGroup className="mb-3">
                    <Form.Control
                        type="date"
                        className="form-control"
                        value={unavDay}
                        onChange={(e) => setUnavDay(e.target.value)}
                    />
                    <InputGroup.Text>
                        <strong>OR</strong>
                    </InputGroup.Text>
                    <Form.Select
                        className="form-control"
                        value={unavDay}
                        onChange={(e) => setUnavDay(e.target.value)}
                    >
                        <option>Choose a repeating day</option>
                        <option value="Monday">Every Monday</option>
                        <option value="Tuesday">Every Tuesday</option>
                        <option value="Wednesday">Every Wednesday</option>
                        <option value="Thursday">Every Thursday</option>
                        <option value="Friday">Every Friday</option>
                        <option value="Even_Monday">
                            Fortnightly Monday (even weeks)
                        </option>
                        <option value="Even_Tuesday">
                            Fortnightly Tuesday (even weeks)
                        </option>
                        <option value="Even_Wednesday">
                            Fortnightly Wednesday (even weeks)
                        </option>
                        <option value="Even_Thursday">
                            Fortnightly Thursday (even weeks)
                        </option>
                        <option value="Even_Friday">
                            Fortnightly Friday (even weeks)
                        </option>
                        <option value="Odd_Monday">Fortnightly Monday (odd weeks)</option>
                        <option value="Odd_Tuesday">
                            Fortnightly Tuesday (odd weeks)
                        </option>
                        <option value="Odd_Wednesday">
                            Fortnightly Wednesday (odd weeks)
                        </option>
                        <option value="Odd_Thursday">
                            Fortnightly Thursday (odd weeks)
                        </option>
                        <option value="Odd_Friday">Fortnightly Friday (odd weeks)</option>
                    </Form.Select>
                    <InputGroup.Text>
                        <strong>AND</strong>
                    </InputGroup.Text>
                    <Form.Select
                        className="form-control"
                        value={dayType}
                        onChange={(e) => setDayType(e.target.value)}
                    >
                        <option value="All-Day">Unavailable All-Day</option>
                        <option value="AM">Unavailable AM</option>
                        <option value="PM">Unavailable PM</option>
                    </Form.Select>
                    <Button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleUnavailabilityAdd}
                        disabled={unavDay.length <= 0}
                    >
                        Add Unavailability
                    </Button>
                </InputGroup>
                <ListGroup className="list-group mt-2">
                    {unavailabilities.map((u: any, index: any) => (
                        <ListGroup.Item
                            variant="info"
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            {u.unavDay}
                            {u.dayType && ` - ${u.dayType}`}
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
            <div className="mb-3">
                <Form.Label className="form-label">WFH Days</Form.Label>
                <div className="input-group">
                    <Form.Control
                        type="date"
                        className="form-control"
                        value={wfhDay}
                        onChange={(e) => setWfhDay(e.target.value)}
                    />
                    <Button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleWfhAdd}
                        disabled={wfhDay.length <= 0}
                    >
                        Add WFH Day
                    </Button>
                </div>
                <ListGroup className="list-group mt-2">
                    {wfhDays.map((u, index) => (
                        <ListGroup.Item
                            variant="info"
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            {u}
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleWfhDelete(index)}
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
