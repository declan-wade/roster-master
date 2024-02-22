const { DateTime } = require("luxon");

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function POST(req, res) {
  const searchParams = req.nextUrl.searchParams;
  const rosterData = await req.json();
  const params = await searchParams.get("startDate");
  const startDate =DateTime.fromISO(params);
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

        const morningRoles = ["Counter", "Supervisor", "Phones", "O&R", "Building Referrals"];
        const afternoonRoles = ["Counter", "Supervisor", "Phones", "O&R", "Building Referrals"];

        for (const morningRole of morningRoles) {
          roster[dayName][`morning_${morningRole}`] = [];
        }

        for (const afternoonRole of afternoonRoles) {
          roster[dayName][`afternoon_${afternoonRole}`] = [];
        }

        for (let roleIndex = 0; roleIndex < morningRoles.length; roleIndex++) {
          const morningRole = morningRoles[roleIndex];
          const afternoonRole = afternoonRoles[roleIndex];

          const availablePeopleForRole = availablePeople.filter((person) =>
            person.roles.includes(morningRole)
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

            roster[dayName][`morning_${morningRole}`].push(
              availablePeopleForRole[morningIndex].name
            );
            roster[dayName][`afternoon_${afternoonRole}`].push(
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

  // Generate roster from the startDate param
  const payload = await generateRoster(startDate);
  return Response.json(payload);
}
