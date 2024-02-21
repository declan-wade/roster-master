//const fs = require("fs");
//const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const XLSX = require("xlsx");

// Load YAML file
//const yamlData = fs.readFileSync("roster.yaml", "utf8");

// Parse YAML
//const rosterData = yaml.load(yamlData);

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function POST(req, res) {
  const rosterData = await req.json();
  console.warn(rosterData)

  // Function to check availability
  function isAvailable(person, date) {
    const unavailabilities = person.unavailabilities || [];
    const currentDate = DateTime.fromISO(date);

    // Check if the current date matches any of the unavailable dates
    for (const range of unavailabilities) {
      const unavailableDate = DateTime.fromISO(range);
      if (currentDate.hasSame(unavailableDate, "day")) {
        return false;
      }
    }

    // If no unavailability matches the current date, person is available
    return true;
  }

  // Function to generate roster for a week
  function generateRoster(startDate) {
    return new Promise((resolve, reject) => {
      const roster = {};
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

      const shiftsAssigned = new Map(); // Initialize shiftsAssigned map

      for (let i = 0; i < 5; i++) {
        const currentDate = startDate.plus({ days: i });
        const dayName = days[currentDate.weekday - 1];
        roster[dayName] = {};

        const availablePeople = rosterData.filter((person) =>
          isAvailable(person, currentDate)
        );

        const morningRoles = [
          "morning_Role1",
          "morning_Role2",
          "morning_Role3",
          "morning_Role4",
        ];
        const afternoonRoles = [
          "afternoon_Role1",
          "afternoon_Role2",
          "afternoon_Role3",
          "afternoon_Role4",
        ];

        for (const morningRole of morningRoles) {
          roster[dayName][morningRole] = [];
        }

        for (const afternoonRole of afternoonRoles) {
          roster[dayName][afternoonRole] = [];
        }

        for (let roleIndex = 0; roleIndex < 4; roleIndex++) {
          const morningRole = morningRoles[roleIndex];
          const afternoonRole = afternoonRoles[roleIndex];

          const availablePeopleForRole = availablePeople.filter((person) =>
            person.roles.includes(`Role${roleIndex + 1}`)
          );
          const numberOfPeople = availablePeopleForRole.length;

          if (numberOfPeople > 0) {
            // Sort available people based on the number of shifts assigned (ascending order)
            availablePeopleForRole.sort(
              (a, b) =>
                (shiftsAssigned.get(a.name) || 0) -
                (shiftsAssigned.get(b.name) || 0)
            );

            // Assign shifts to available people
            const morningIndex = i % numberOfPeople;
            const afternoonIndex = (i + 1) % numberOfPeople;

            roster[dayName][morningRole].push(
              availablePeopleForRole[morningIndex].name
            );
            roster[dayName][afternoonRole].push(
              availablePeopleForRole[afternoonIndex].name
            );

            // Update the number of shifts assigned to each person
            shiftsAssigned.set(
              availablePeopleForRole[morningIndex].name,
              (shiftsAssigned.get(availablePeopleForRole[morningIndex].name) ||
                0) + 1
            );
            shiftsAssigned.set(
              availablePeopleForRole[afternoonIndex].name,
              (shiftsAssigned.get(
                availablePeopleForRole[afternoonIndex].name
              ) || 0) + 1
            );
          }
        }
      }
      resolve(roster);
      return roster;
    });
  }

  // Function to generate XLSX file from roster data
  // Function to generate XLSX file from roster data
  function generateXLSX(roster, startDate) {
    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Loop through each day in the roster
    for (const dayName in roster) {
      if (roster.hasOwnProperty(dayName)) {
        // Create a new worksheet for each day
        const ws = XLSX.utils.aoa_to_sheet([["Shift", "Person"]]);

        // Get morning shifts for the day
        const morningShifts = [];
        for (let i = 1; i <= 4; i++) {
          morningShifts.push(...roster[dayName][`morning_Role${i}`]);
        }

        // Add morning shifts to the worksheet
        morningShifts.forEach((person, index) => {
          XLSX.utils.sheet_add_aoa(
            ws,
            [[`Morning Shift ${index + 1}`, person]],
            {
              origin: `A${index + 2}`,
            }
          );
        });

        // Get afternoon shifts for the day
        const afternoonShifts = [];
        for (let i = 1; i <= 4; i++) {
          afternoonShifts.push(...roster[dayName][`afternoon_Role${i}`]);
        }

        // Add afternoon shifts to the worksheet
        afternoonShifts.forEach((person, index) => {
          XLSX.utils.sheet_add_aoa(
            ws,
            [[`Afternoon Shift ${index + 1}`, person]],
            { origin: `C${index + 2}` }
          );
        });

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, dayName);
      }
    }

    // Generate a file name based on the start date
    const fileName = `roster_${startDate.toISODate()}.xlsx`;

    // Write the workbook to a file
    XLSX.writeFile(wb, fileName);

    console.log(`Roster XLSX file generated: ${fileName}`);
  }

  // Generate roster for the week starting from today
  const today = DateTime.local(2024, 2, 26);
  const payload = await generateRoster(today)
    return Response.json(payload)
}
