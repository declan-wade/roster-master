"use client";

// components/PersonTable.js
import React from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Table from "react-bootstrap/Table";

export default function PersonTable(payload: any) {
  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position / Role</th>
            <th>Dates Unavailable</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {payload ? (
            payload.length > 0 ? (
              payload.map((item: any) => (
                <tr key={`${item.name}`}>
                  <td>{`${item.name}`}</td>
                  <td>{`${item.roles}`}</td>
                  <td>{`${item.unavailabilities}`}</td>
                  <td><ButtonGroup><Button size="sm" variant="danger">Delete</Button><Button size="sm" variant="info">Edit</Button></ButtonGroup></td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4}>No people added to roster</td></tr>
            )
          ) : (
            <tr><td colSpan={4}>Loading...</td></tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
