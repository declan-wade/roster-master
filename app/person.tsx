'use client'

// components/PersonForm.js
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

type Role = string;
type Roles = Role[];
type Unavailability = string;
type Unavailabilities = Unavailability[];


export default function PersonForm({ onSubmit }: any) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [unavailability, setUnavailability] = useState<Unavailability>('');
  const [roles, setRoles] = useState<Roles>([]);
  const [unavailabilities, setUnavailabilities] = useState<Unavailabilities>([]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const person = { name, roles, unavailabilities };
    onSubmit(person);
    // Clear form fields
    setName('');
    setRole('');
    setUnavailability('');
    setRoles([]);
    setUnavailabilities([]);
  };

  const handleRoleAdd = () => {
    setRoles([...roles, role]);
    setRole('');
  };

  const handleUnavailabilityAdd = () => {
    setUnavailabilities([...unavailabilities, unavailability]);
    setUnavailability('');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-3">
        <Form.Label className="form-label">Name</Form.Label>
        <Form.Control type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="mb-3">
        <Form.Label className="form-label">Role</Form.Label>
        <div className="input-group">
          <Form.Control type="text" className="form-control" value={role} onChange={(e) => setRole(e.target.value)} />
          <Button type="button" className="btn btn-primary" onClick={handleRoleAdd}>Add Role</Button>
        </div>
        <ul className="list-group mt-2">
          {roles.map((r, index) => <li key={index} className="list-group-item">{r}</li>)}
        </ul>
      </div>
      <div className="mb-3">
        <Form.Label className="form-label">Unavailability</Form.Label>
        <div className="input-group">
          <Form.Control type="date" className="form-control" value={unavailability} onChange={(e) => setUnavailability(e.target.value)} />
          <Button type="button" className="btn btn-primary" onClick={handleUnavailabilityAdd}>Add Unavailability</Button>
        </div>
        <ul className="list-group mt-2">
          {unavailabilities.map((u, index) => <li key={index} className="list-group-item">{u}</li>)}
        </ul>
      </div>
      <Button type="submit" className="btn btn-primary">Add Person to Roster</Button>
    </Form>
  );
};

