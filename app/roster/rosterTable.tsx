"use client";
import React from "react";
import Table from "react-bootstrap/Table";
import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";
import { getObjectFromStorage} from '../storageService'

interface Roster {
  [day: string]: {
    [shift: string]: string[];
  };
}

const RosterTable: React.FC = () => {
  const roster: Roster | null = getObjectFromStorage("roster-cookie");
  const searchParams = useSearchParams();
  const params: any = searchParams.get("startDate");
  const startDate = DateTime.fromISO(params);
  const formattedDate = startDate.toFormat("EEEE dd LLLL yyyy");

  const formatDate = (startDate: any, dayIndex: any) => {
    const formattedDate = DateTime.fromISO(startDate)
      .plus({ days: dayIndex })
      .toFormat("cccc LLLL d, yyyy");
    return formattedDate;
  };

  return (
      <div>
        <div className="container mt-5">
          {roster ? (
              Object.entries(roster).map(([date, shifts]) => (
                  <div key={date}>
                    <h4>{date}</h4>
                    <hr/>
                    {shifts && (
                        <div>
                          {/* All-Day Shifts */}
                          <Table striped bordered hover>
                            <thead>
                            <tr>
                              <th colSpan={2}>🕒 All-Day Shifts</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(shifts).map(([shift, people]) =>
                                !shift.startsWith("morning_") && !shift.startsWith("afternoon_") ? (
                                    <tr key={shift}>
                                      <td>{shift}</td>
                                      <td>{people.join(", ")}</td>
                                    </tr>
                                ) : null
                            )}
                            </tbody>
                          </Table>
                          <br/>

                          {/* Morning Shifts */}
                          <Table striped bordered hover>
                            <thead>
                            <tr>
                              <th colSpan={2}>☀️ Morning Shifts</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(shifts).map(([shift, people]) =>
                                shift.startsWith("morning_") ? (
                                    <tr key={shift}>
                                      <td>{shift.split("_")[1]}</td>
                                      <td>{people.join(", ")}</td>
                                    </tr>
                                ) : null
                            )}
                            </tbody>
                          </Table>

                          {/* Afternoon Shifts */}
                          <Table striped bordered hover variant="dark">
                            <thead>
                            <tr>
                              <th colSpan={2}>🌙 Afternoon Shifts</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.entries(shifts).map(([shift, people]) =>
                                shift.startsWith("afternoon_") ? (
                                    <tr key={shift}>
                                      <td>{shift.split("_")[1]}</td>
                                      <td>{people.join(", ")}</td>
                                    </tr>
                                ) : null
                            )}
                            </tbody>
                          </Table>
                          <br/>
                        </div>
                    )}
                  </div>
              ))
          ) : (
              <h3>Loading...</h3>
          )}
        </div>
      </div>
  );
};

export default RosterTable;
