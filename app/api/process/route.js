const { DateTime } = require("luxon");

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function POST(req, res) {
  const searchParams = req.nextUrl.searchParams;
  const rosterData = await req.json();
  const params = await searchParams.get("startDate");
  const numberOfWeeks = await searchParams.get("numWeeks");
  const startDate = DateTime.fromISO(params);
  console.log(startDate)

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
function generateRoster(startDate, rosterData, numberOfWeeks) {
  return new Promise((resolve) => {
    const roster = {};
    const shiftsAssigned = new Map(); // Initialize shiftsAssigned map

    for (let week = 0; week < numberOfWeeks; week++) {
      const currentWeekStartDate = startDate.plus({ weeks: week });

      for (let i = 0; i < 5; i++) {
        const currentDate = currentWeekStartDate.plus({ days: i });
        const formattedDate = currentDate.toFormat('EEEE dd LLLL yyyy');
        roster[formattedDate] = {};
  
          const availablePeople = rosterData.filter((person) =>
            isAvailable(person, currentDate)
          );
  
          // Get all roles available in the rosterData
          const allRoles = availablePeople.reduce((roles, person) => {
            return roles.concat(person.roles);
          }, []);
  
          // Remove duplicate roles
          const uniqueRoles = Array.from(new Set(allRoles));
  
          // Assign shifts for each role
          uniqueRoles.forEach((role) => {
            roster[formattedDate][`morning_${role}`] = [];
            roster[formattedDate][`afternoon_${role}`] = [];
  
            const availablePeopleForRole = availablePeople.filter((person) =>
              person.roles.includes(role)
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
  
              roster[formattedDate][`morning_${role}`].push(
                availablePeopleForRole[morningIndex].name
              );
              roster[formattedDate][`afternoon_${role}`].push(
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
          });
        }
      }
      resolve(roster);
    });
  }


  // Generate roster from the startDate param
  const payload = await generateRoster(startDate, rosterData, numberOfWeeks);
  return Response.json(payload);
}
