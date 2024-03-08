const {DateTime} = require("luxon");
import Cookies from 'js-cookie';

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function POST(req, res) {
    const searchParams = req.nextUrl.searchParams;
    const incoming = await req.json();
    const rosterData = incoming.staffData
    const params = await searchParams.get("startDate");
    const numberOfWeeks = await searchParams.get("numWeeks");
    const startDate = DateTime.fromISO(params);
    const uniqueRoles = incoming.rolesData
    console.log(startDate)
    console.log("unique roles: ", uniqueRoles)
    // Function to check availability
    function isAvailable(person, date, roleToCheck, week) {
        const unavailabilities = person.unavailabilities || [];
        const wfhDays = person.wfhDays || []; // Handle potential empty array
        const currentDate = DateTime.fromISO(date);
        console.log({currentDate})
        console.log({wfhDays})
        console.log({person})
        console.log({roleToCheck})
        // Check unavailability by date and day type
        for (const range of unavailabilities) {
            // Prioritize 'All-Day' unavailabilities for any date
            if (range.dayType === 'All-Day') {
                if (isDateUnavailable(currentDate, range.unavDay, week)) return false;
            }
        }

        // Find the role object for the role we're checking availability for
        const roleObj = uniqueRoles.find(roleObj => roleObj.role === roleToCheck);
        console.log({roleObj})

        // Check if date is a WFH day
        const isWfhDay = isDateWfhDay(currentDate, wfhDays, week);
        console.log({isWfhDay})

        // If it's a WFH day but the role doesn't allow WFH, the person is unavailable
        if (isWfhDay && roleObj && !roleObj.isWfh) {
            return false;
        }

        // Available by default if no rules match
        return true;
    }

    function isDateWfhDay(date, wfhDays, week) {
        const dayOfWeek = date.toFormat('cccc'); // 'Monday', 'Tuesday', etc.
        const isEvenWeek = week % 2 === 0;

        return wfhDays.some(day => {
            if (day.includes('_')) { // Handles 'Odd_' or 'Even_' prefixed days
                const [type, dayName] = day.split('_'); // Split into type ('Odd'/'Even') and dayName ('Monday', 'Wednesday', etc.)
                if (type === 'Odd' && !isEvenWeek && dayOfWeek === dayName) {
                    return true; // Matches odd weeks
                } else if (type === 'Even' && isEvenWeek && dayOfWeek === dayName) {
                    return true; // Matches even weeks
                }
            } else if (dayOfWeek === day) {
                return true; // Matches days of the week like 'Friday'
            } else {
                // Check for specific date strings
                try {
                    const wfhDate = DateTime.fromISO(day);
                    if (date.hasSame(wfhDate, 'day')) {
                        return true; // Matches specific dates
                    }
                } catch (error) {
                    // Handle error or invalid date format if necessary
                }
            }
            return false;
        });
    }

function isRepeatingDayUnavailable(date, repeatingDay, week) {
    const dayOfWeek = date.weekdayLong; // e.g., "Monday"

    if (repeatingDay === dayOfWeek) return true; // Exact match

    // Handle Even/Odd weeks
    const isEvenWeek = date.weekNumber % 2 === 0;
    if (repeatingDay.startsWith('Even_') && isEvenWeek &&
        repeatingDay.slice(5) === dayOfWeek) { // Remove "Even_" prefix
        return true;
    }
    if (repeatingDay.startsWith('Odd_') && !isEvenWeek &&
        repeatingDay.slice(4) === dayOfWeek) { // Remove "Odd_" prefix
        return true;
    }

    return false;
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
            //console.log(rosterData)
            rosterData.forEach(person => {
                // Ensure weight is treated as an integer
                person.weight = parseInt(person.weight, 10);
            });

            for (let week = 1; week < parseInt(numberOfWeeks, 10) + 1; week++) {
                const currentWeekStartDate = startDate.plus({weeks: week - 1});
                console.log("Processing week ", week)
                for (let i = 0; i < 5; i++) {
                    const currentDate = currentWeekStartDate.plus({days: i});
                    const formattedDate = currentDate.toFormat('EEEE dd LLLL yyyy');
                    roster[formattedDate] = {};

                    // Get all unique roles available in the rosterData
                    //const uniqueRoles = getObjectFromCookie("roles-cookie");
                    //console.log(uniqueRoles);
                    uniqueRoles.forEach((roleObj) => {
                        const role = roleObj.role; // Extracting role from the object
                        console.log(role)
                        if (!roster[formattedDate][`morning_${role}`]) {
                            roster[formattedDate][`morning_${role}`] = [];
                        }
                        if (!roster[formattedDate][`afternoon_${role}`]) {
                            roster[formattedDate][`afternoon_${role}`] = [];
                        }

                        // Filter people available for the role considering WFH compatibility
                        const availablePeopleForRoleAM = rosterData.filter(person =>
                            person.roles.includes(role) && isAvailable(person, currentDate, role, week) && isAvailableHalfDay(person, currentDate, week, 'AM')
                        );
                        //console.log(availablePeopleForRoleAM);
                        const availablePeopleForRolePM = rosterData.filter(person =>
                            person.roles.includes(role) && isAvailable(person, currentDate, role, week) && isAvailableHalfDay(person, currentDate, week, 'PM')
                        );
                        //console.log(availablePeopleForRolePM);
                        // Morning shift assignment
                        if (availablePeopleForRoleAM.length > 0) {
                            const personForMorningShift = availablePeopleForRoleAM.sort(
                                (a, b) => ((shiftsAssigned.get(a.name) || 0) + 1) / a.weight - ((shiftsAssigned.get(b.name) || 0) + 1) / b.weight
                            )[0];
                            roster[formattedDate][`morning_${role}`].push(personForMorningShift.name);
                            shiftsAssigned.set(personForMorningShift.name, (shiftsAssigned.get(personForMorningShift.name) || 0) + 1);
                        }

                        // Afternoon shift assignment
                        if (availablePeopleForRolePM.length > 0) {
                            const personForAfternoonShift = availablePeopleForRolePM.sort(
                                (a, b) => ((shiftsAssigned.get(a.name) || 0) + 1) / a.weight - ((shiftsAssigned.get(b.name) || 0) + 1) / b.weight
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
