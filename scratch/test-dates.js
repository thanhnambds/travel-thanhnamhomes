import fs from 'fs';

const tours = JSON.parse(fs.readFileSync('data/generated/tours-public.json', 'utf8'));
let invalidTours = [];

for (const tour of tours) {
  for (const date of tour.departure_dates) {
    const d = new Date(`${date}T12:00:00+07:00`);
    if (isNaN(d.getTime())) {
      invalidTours.push({
        id: tour.id,
        title: tour.title,
        invalidDate: date,
        source: tour.source_sheet_name
      });
    }
  }
}

console.log('INVALID TOURS FOUND:', invalidTours.length);
if (invalidTours.length > 0) {
  console.log(JSON.stringify(invalidTours, null, 2));
}
