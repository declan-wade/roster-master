"use client";

import { DateTime } from 'luxon';
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import ListGroup from "react-bootstrap/ListGroup";
import InputGroup from "react-bootstrap/InputGroup";
import { Tooltip } from 'react-tooltip'

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
    const [weight, setWeight] = useState<any>(100);
    const [unavDay, setUnavDay] = useState<UnavDay>("");
    const [leaveStart, setLeaveStart] = useState("");
    const [leaveEnd, setLeaveEnd] = useState("");
    const [leaveDays, setLeaveDays] = useState<any>([]);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (name.length > 1) {
            if (roles.length > 0) {
                const person = {name, roles, unavailabilities, wfhDays, leaveDays, weight};
                onSubmit(person);
                // Clear form fields
                setName("");
                setWeight(100)
                setRole("");
                setDayType("All-Day")
                setUnavDay("");
                setUnavailability([]);
                setWfhDay("");
                setRoles([]);
                setUnavailabilities([]);
                setLeaveDays([]);
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

    const handleLeaveAdd = () => {
        if (leaveStart.trim() !== "" && leaveEnd.trim() !== "") {
            const newLeave = { startDate: leaveStart.trim(), endDate: leaveEnd.trim() };
            console.log({newLeave})
            setLeaveDays([...leaveDays, newLeave]);
            setLeaveEnd("");
            setLeaveStart("");
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

    const handlLeaveDelete = (index: number) => {
        const updatedDates = [...leaveDays];
        updatedDates.splice(index, 1);
        setLeaveDays(updatedDates);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <div className="mb-3">
                <Form.Label className="form-label">Name</Form.Label>
                <Form.Control
                    type="text"
                    data-tooltip-id="staff-name"
                    data-tooltip-html="The name or alias of the person."
                    data-tooltip-place="top"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Tooltip id="staff-name" />
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
                        data-tooltip-id="staff-role"
                        data-tooltip-html="Select which roles this person can be assigned to.<br />Roles are assigned in a 'round-robin' style allocation<br />method to try and distribute it evenly across staff."
                        data-tooltip-place="top"
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
                                No roles available - add a role in the Role Manager at the bottom of the screen
                            </option>
                        )}
                    </Form.Select>
                    <Tooltip id="staff-role" />
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
                <Form.Label className="form-label">Rostered-Off Days</Form.Label>
                <InputGroup className="mb-3">
                    <Form.Control
                     data-tooltip-id="staff-unav"
                     data-tooltip-html="Select a specifc day the staff member<br />is unavailable to be assigned to a shift."
                     data-tooltip-place="top"
                        type="date"
                        className="form-control"
                        value={unavDay}
                        onChange={(e) => setUnavDay(e.target.value)}
                    />
                    <Tooltip id="staff-unav" />
                    <InputGroup.Text>
                        <strong>OR</strong>
                    </InputGroup.Text>
                    <Form.Select
                        className="form-control"
                        data-tooltip-id="staff-unav2"
                        data-tooltip-html="Select any recurring days the staff member<br />is unavailable to be assigned to a shift."
                        data-tooltip-place="top"
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
                    <Tooltip id="staff-unav2" />
                    <InputGroup.Text>
                        <strong>AND</strong>
                    </InputGroup.Text>
                    <Form.Select
                        className="form-control"
                        data-tooltip-id="staff-unav3"
                        data-tooltip-html="Is the person unavailable the whole day,<br />or only morning, or only afternoon."
                        data-tooltip-place="top"
                        value={dayType}
                        onChange={(e) => setDayType(e.target.value)}
                    >
                        <option value="All-Day">Unavailable All-Day</option>
                        <option value="AM">Unavailable AM</option>
                        <option value="PM">Unavailable PM</option>
                    </Form.Select>
                    <Tooltip id="staff-unav3" />
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
                <InputGroup className="mb-3">
                    <Form.Control
                        data-tooltip-id="staff-wfh"
                        data-tooltip-html="Select a day the staff is working from home."
                        data-tooltip-place="top"
                        type="date"
                        className="form-control"
                        value={wfhDay}
                        onChange={(e) => setWfhDay(e.target.value)}
                    />
                    <Tooltip id="staff-wfh" />
                    <InputGroup.Text>
                        <strong>OR</strong>
                    </InputGroup.Text>
                    <Form.Select
                        className="form-control"
                        data-tooltip-id="staff-wfh2"
                        data-tooltip-html="Select a recurring day the<br />staff is working from home."
                        data-tooltip-place="top"
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
                    <Tooltip id="staff-wfh2" />
                    <Button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleWfhAdd}
                        disabled={wfhDay.length <= 0}
                    >
                        Add WFH Day
                    </Button>
                    </InputGroup>
                    <ListGroup className="list-group mt-2">
                    { (wfhDays || []).map((u, index) => (
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
                <div className="mb-3">
                <Form.Label className="form-label">Extended Leave</Form.Label>
                <div className="input-group">
                    <Form.Control
                        value={leaveStart}
                        data-tooltip-id="start-date"
                        data-tooltip-html="The first day of leave"
                        data-tooltip-place="top"
                        type="date"
                        onChange={(e) => setLeaveStart(e.target.value)}/>
                        <Tooltip id="start-date" />
                    <Form.Control
                        value={leaveEnd}
                        data-tooltip-id="end-date"
                        data-tooltip-html="The last day of leave"
                        data-tooltip-place="top"
                        type="date"
                        onChange={(e) => setLeaveEnd(e.target.value)}/>
                        <Tooltip id="end-date" />
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
                    {leaveDays.map((u: any, index: any) => (
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
                    ))}
                </ListGroup>
                    </div>
                <div className="mb-3">
                    <ListGroup className="list-group mt-2">
                    <Form.Label className="form-label">Weighting % - smaller value will de-prioritise this person from being assigned a role.</Form.Label>
                    <Form.Control
                        value={weight}
                        data-tooltip-id="staff-weight"
                        data-tooltip-html="A way to prioritise the liklihood someone is assigned a shift.<br />A smaller value will de-prioritise this person from<br />being assigned a role. If unsure, leave this at 100%"
                        data-tooltip-place="top"
                        type="number"
                        min="10"
                        max="100"
                        step="10"
                        onChange={(e) => setWeight(e.target.value)}/>
                    </ListGroup>
                    <Tooltip id="staff-weight" />
                </div>
            
            <Button type="submit" className="btn btn-primary">
                Add Person to Roster
            </Button>
        </Form>
    );
}
