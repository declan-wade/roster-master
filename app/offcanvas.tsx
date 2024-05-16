import React, { useEffect, useState } from "react";
import { Alert, Button, Form, InputGroup, ListGroup, Offcanvas } from "react-bootstrap";
import { DateTime } from 'luxon';

interface Props {
    payload: any;
    show: any;
    setShow: any;
    onUpdate: any;
    roleList: any;
}

type wfhDay = string;
type wfhDays = wfhDay[];
type DayType = string;
type UnavDay = string;
type Role = [];
type Roles = Role[];

const PopoverForm: React.FC<Props> = ({
    payload,
    show,
    setShow,
    onUpdate,
    roleList,
}) => {
    const [name, setName] = useState(payload.name);
    const [role, setRole] = useState("");
    const [unavailability, setUnavailability] = useState<any>("");
    const [nameValid, setNameValid] = useState(true);
    const [rolesList, setRolesList] = useState<string[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [unavailabilities, setUnavailabilities] = useState<any[]>([]);
    const [formValid, setFormValid] = useState(true);
    const [dayType, setDayType] = useState<DayType>("All-Day");
    const [unavDay, setUnavDay] = useState<UnavDay>("");
    const [wfhDays, setWfhDays] = useState<wfhDays>([]);
    const [wfhDay, setWfhDay] = useState<wfhDay>("");
    const [weight, setWeight] = useState<any>(100)
    const [leaveStart, setLeaveStart] = useState("");
    const [leaveEnd, setLeaveEnd] = useState("");
    const [leaveDays, setLeaveDays] = useState<any>([]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (name.length > 1) {
            if (roles.length > 0) {
                const person = { name, roles, unavailabilities, wfhDays, leaveDays, weight };
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

    useEffect(() => {
        setRolesList(roleList)
    }, [roleList])

    useEffect(() => {
        setRoles(payload.roles);
        setName(payload.name);
        setUnavailabilities(payload.unavailabilities);
        setWfhDays(payload.wfhDays);
        setWeight(payload.weight);
        setLeaveDays(payload.leaveDays);
    }, [payload]);

    const handleRoleAdd = () => {
        setRoles([...roles, role]);
        setRole("");
    };

    const handleClose = () => {
        setShow(false);
        //setUnavailabilities([])
    };

    const handleWfhAdd = () => {
        setWfhDays([...wfhDays, wfhDay]);
        setWfhDay("");
    };

 const handleLeaveAdd = () => {
    if (leaveStart.trim() !== "" && leaveEnd.trim() !== "") {
        const newLeave = { startDate: leaveStart.trim(), endDate: leaveEnd.trim() };
        console.log({ newLeave });
        const updatedLeaveDays = leaveDays ? [...leaveDays, newLeave] : [newLeave];
        setLeaveDays(updatedLeaveDays);
        setLeaveEnd("");
        setLeaveStart("");
    }
};

    const handlLeaveDelete = (index: number) => {
        const updatedDates = [...leaveDays];
        updatedDates.splice(index, 1);
        setLeaveDays(updatedDates);
    };

    const handleUnavailabilityAdd = () => {
        if (unavDay.trim() !== "") {
            const newUnav = { unavDay: unavDay.trim(), dayType: dayType }; // Create new unavailability object
            setUnavailabilities([...unavailabilities, newUnav]); // Add new role object to unavailabilities array
            setRole("");
            setUnavDay("");
            setDayType("All-Day")
            setUnavailability([]);
            console.log({ unavailability });
            console.log({ unavailabilities });
        }
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
                                disabled
                            />
                        </div>
                        <br></br>
                        <hr></hr>
                        <br></br>
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
                                        rolesList.map((roleItem: any, index) => (
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
                        <br></br>
                        <hr></hr>
                        <br></br>
                        <Form.Label className="form-label">Rostered-Off Days</Form.Label>
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
                        </InputGroup>
                        <InputGroup className="mb-3">
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
                        </InputGroup>
                        <InputGroup className="mb-3">
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
                            {unavailabilities.map((u: any, index) => (
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
                        <br></br>
                        <hr></hr>
                        <br></br>
                        <div className="mb-3">
                            <Form.Label className="form-label">WFH Days</Form.Label>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    type="date"
                                    className="form-control"
                                    value={wfhDay}
                                    onChange={(e) => setWfhDay(e.target.value)}
                                />
                                <InputGroup.Text>
                                    <strong>OR</strong>
                                </InputGroup.Text>
                            </InputGroup>
                            <InputGroup className="mb-3">
                                <Form.Select
                                    className="form-control"
                                    value={wfhDay}
                                    onChange={(e) => setWfhDay(e.target.value)}
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
                            </InputGroup>
                            <Button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleWfhAdd}
                                disabled={wfhDay.length <= 0}
                            >
                                Add WFH Day
                            </Button>
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
                            <br></br>
                            <hr></hr>
                            <br></br>
                            <div className="mb-3">
                                <Form.Label className="form-label">Extended Leave</Form.Label>
                                <div className="input-group">
                                    <Form.Control
                                        value={leaveStart}
                                        type="date"
                                        onChange={(e) => setLeaveStart(e.target.value)} />
                                    <Form.Control
                                        value={leaveEnd}
                                        type="date"
                                        onChange={(e) => setLeaveEnd(e.target.value)} />
                                    <Button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleLeaveAdd}
                                        disabled={leaveStart.trim() == "" && leaveEnd.trim() == ""}
                                    >
                                        Add Leave
                                    </Button>
                                </div>
                                <ListGroup className="list-group mt-2">
                                    {leaveDays ? leaveDays.map((u: any, index: any) => (
                                        <ListGroup.Item
                                            variant="info"
                                            key={index}
                                            className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                            {`${DateTime.fromISO(u.startDate).toFormat('dd LLLL yyyy')} until ${DateTime.fromISO(u.endDate).toFormat('dd LLLL yyyy')}`}
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handlLeaveDelete(index)}
                                            >
                                                Delete
                                            </Button>
                                        </ListGroup.Item>
                                    )) : null}
                                </ListGroup>
                            </div>
                            <hr></hr>
                            <div className="mb-3">
                                <ListGroup className="list-group mt-2">
                                    <Form.Label className="form-label">Weighting % - smaller value will de-prioritise
                                        this person from being assigned a role.</Form.Label>
                                    <Form.Control
                                        value={weight}
                                        type="number"
                                        min="10"
                                        max="100"
                                        step="10"
                                        onChange={(e) => setWeight(e.target.value)} />
                                </ListGroup>
                            </div>
                        </div>
                        <Button type="submit">Save</Button>
                    </Form>
                ) : (
                    <div>
                        No staff selected
                    </div>
                )
                }

            </Offcanvas.Body>
        </Offcanvas>
    )
};

export default PopoverForm;
