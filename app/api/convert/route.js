const { DateTime } = require("luxon");
const json2csv = require("json2csv").parse;

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function POST(req, res) {
  const searchParams = req.nextUrl.searchParams;
  const data = await req.json();
  const params = await searchParams.get("startDate");
  const startDate = DateTime.fromISO(params);
  console.log(startDate);

  // Transform the roster data into a flat array of objects for CSV conversion
  const flatData = [];
  for (const day in data) {
    for (const shift in data[day]) {
      const shiftType = shift.startsWith("morning") ? "Morning" : "Afternoon";
      const roleName = shift.split("_")[1];
      const personList = data[day][shift];
      for (const person of personList) {
        flatData.push({
          Day: day,
          ShiftType: shiftType,
          Shift: roleName,
          Person: person,
        });
      }
    }
  }

  // Convert the flat data to CSV format
  const csv = json2csv(flatData);

  // Convert the CSV string to a Blob
  const csvBlob = new Blob([csv], { type: "text/csv" });

  // Create a Response object with the Blob as the body
  const response = new Response(csvBlob, {
    headers: {
      "Content-Disposition": "attachment; filename=roster.csv",
    },
  });

  return response;
}
