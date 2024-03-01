const {DateTime} = require("luxon");

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function POST(req, res) {
    const searchParams = req.nextUrl.searchParams;
    const rosterData = await req.json();
    const params = await searchParams.get("startDate");
    const numberOfWeeks = await searchParams.get("numWeeks");
    const startDate = DateTime.fromISO(params);
    console.log(startDate)

    // Function to check availability
    function isAvailable(person, date, week) {
        const unavailabilities = person.unavailabilities || [];
        const currentDate = DateTime.fromISO(date);

        // Check unavailability by date and day type
        for (const range of unavailabilities) {

            // Prioritize 'All-Day' unavailabilities for any date
            if (range.dayType === 'All-Day') {
                if (isDateUnavailable(currentDate, range.unavDay, week)) return false;
            }
        }
        // Check if date is a WFH day and role is not allowed for WFH
        return !(person.wfhDays.includes(date) && !person.roles.some((role) => role.isWFH));
         // Available by default if no rules match
    }

    function isAvailableHalfDay(person, date, week, dayType) {
        const unavailabilities = person.unavailabilities || [];
        const currentDate = DateTime.fromISO(date);
        const currentDayOfWeek = currentDate.toFormat('EEEE');
        let numericWeek = parseInt(week, 10);
        for (const range of unavailabilities) {
            // Correctly using slice indices based on the prefix length
            if ((range.unavDay.startsWith('Even_') && numericWeek % 2 === 0 && range.dayType === dayType && currentDayOfWeek === range.unavDay.slice(5)) ||
                (range.unavDay.startsWith('Odd_') && numericWeek % 2 !== 0 && range.dayType === dayType && currentDayOfWeek === range.unavDay.slice(4))) {
                return false;
            }
            if (range.dayType === dayType && currentDayOfWeek === range.unavDay) {
                return false;
            }
        }
        return true;
    }

    function isDateUnavailable(currentDate, unavDay, week) {
        // Direct match for specific dates
        if (DateTime.fromISO(unavDay).isValid && DateTime.fromISO(unavDay).hasSame(currentDate, 'day')) return true;

        // Match for day names like "Tuesdays"
        if (currentDate.toFormat('EEEE') === unavDay) return true;

        // Adjusted logic for 'Even_' and 'Odd_' prefixed days
        const dayOfWeek = currentDate.toFormat('EEEE');
        let numericWeek = parseInt(week, 10);
        if ((unavDay.startsWith('Even_') && numericWeek % 2 === 0 && dayOfWeek === unavDay.slice(5)) ||
            (unavDay.startsWith('Odd_') && numericWeek % 2 !== 0 && dayOfWeek === unavDay.slice(4))) {
            return true;
        }
        return false;
    }

// Function to generate roster for a week
    function generateRoster(startDate, rosterData, numberOfWeeks) {
        return new Promise((resolve) => {
            const roster = {};
            const shiftsAssigned = new Map(); // Initialize shiftsAssigned map

            for (let week = 1;  week < parseInt(numberOfWeeks, 10) +1; week++) {
                const currentWeekStartDate = startDate.plus({weeks: week});
                console.log("Processing week ", week)
                for (let i = 0; i < 5; i++) {
                    const currentDate = currentWeekStartDate.plus({days: i});
                    const formattedDate = currentDate.toFormat('EEEE dd LLLL yyyy');
                    roster[formattedDate] = {};

                    const availablePeople = rosterData.filter((person) =>
                        isAvailable(person, currentDate, week)
                    );

                    // Get all roles available in the rosterData
                    const allRoles = availablePeople.reduce((roles, person) => {
                        return roles.concat(person.roles);
                    }, []);

                    // Remove duplicate roles
                    const uniqueRoles = Array.from(new Set(allRoles));

                    // Assign shifts to available people more fairly
                    uniqueRoles.forEach((role) => {

                        if (!roster[formattedDate][`morning_${role}`]) {
                            roster[formattedDate][`morning_${role}`] = [];
                        }
                        if (!roster[formattedDate][`afternoon_${role}`]) {
                            roster[formattedDate][`afternoon_${role}`] = [];
                        }

                        const availablePeopleForRoleAM = availablePeople.filter(person =>
                            person.roles.includes(role) && isAvailableHalfDay(person, currentDate, week, 'AM')
                        );
                        //console.log(availablePeopleForRoleAM);

                        const availablePeopleForRolePM = availablePeople.filter(person =>
                            person.roles.includes(role) && isAvailableHalfDay(person, currentDate, week, 'PM')
                        );
                        //console.log(availablePeopleForRolePM);

                        // Morning shift assignment
                        if (availablePeopleForRoleAM.length > 0) {
                            const personForMorningShift = availablePeopleForRoleAM.sort(
                                (a, b) => (shiftsAssigned.get(a.name) || 0) - (shiftsAssigned.get(b.name) || 0)
                            )[0];
                            roster[formattedDate][`morning_${role}`].push(personForMorningShift.name);
                            shiftsAssigned.set(personForMorningShift.name, (shiftsAssigned.get(personForMorningShift.name) || 0) + 1);
                        }

                        // Afternoon shift assignment
                        if (availablePeopleForRolePM.length > 0) {
                            const personForAfternoonShift = availablePeopleForRolePM.sort(
                                (a, b) => (shiftsAssigned.get(a.name) || 0) - (shiftsAssigned.get(b.name) || 0)
                            )[0];
                            roster[formattedDate][`afternoon_${role}`].push(personForAfternoonShift.name);
                            shiftsAssigned.set(personForAfternoonShift.name, (shiftsAssigned.get(personForAfternoonShift.name) || 0) + 1);
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
