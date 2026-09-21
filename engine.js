/* world-clock engine: timezone conversion + work-hours overlap (pure, node-testable) */
var CITIES = [
  {id:'jerusalem', label:'Jerusalem', tz:'Asia/Jerusalem'},
  {id:'tel-aviv', label:'Tel Aviv', tz:'Asia/Jerusalem'},
  {id:'new-york', label:'New York', tz:'America/New_York'},
  {id:'los-angeles', label:'Los Angeles', tz:'America/Los_Angeles'},
  {id:'chicago', label:'Chicago', tz:'America/Chicago'},
  {id:'london', label:'London', tz:'Europe/London'},
  {id:'paris', label:'Paris', tz:'Europe/Paris'},
  {id:'berlin', label:'Berlin', tz:'Europe/Berlin'},
  {id:'athens', label:'Athens', tz:'Europe/Athens'},
  {id:'dubai', label:'Dubai', tz:'Asia/Dubai'},
  {id:'mumbai', label:'Mumbai', tz:'Asia/Kolkata'},
  {id:'bangkok', label:'Bangkok', tz:'Asia/Bangkok'},
  {id:'singapore', label:'Singapore', tz:'Asia/Singapore'},
  {id:'hong-kong', label:'Hong Kong', tz:'Asia/Hong_Kong'},
  {id:'tokyo', label:'Tokyo', tz:'Asia/Tokyo'},
  {id:'sydney', label:'Sydney', tz:'Australia/Sydney'},
  {id:'auckland', label:'Auckland', tz:'Pacific/Auckland'},
  {id:'sao-paulo', label:'Sao Paulo', tz:'America/Sao_Paulo'},
  {id:'mexico-city', label:'Mexico City', tz:'America/Mexico_City'},
  {id:'toronto', label:'Toronto', tz:'America/Toronto'},
  {id:'reykjavik', label:'Reykjavik', tz:'Atlantic/Reykjavik'},
  {id:'nairobi', label:'Nairobi', tz:'Africa/Nairobi'}
];
var WORK_START = 9, WORK_END = 18;

/* local wall-clock fields of an instant in a tz */
function localParts(ms, tz){
  var fmt = new Intl.DateTimeFormat('en-US',{timeZone:tz,hour:'numeric',minute:'numeric',hour12:false,year:'numeric',month:'numeric',day:'numeric',weekday:'short'});
  var parts = {};
  fmt.formatToParts(new Date(ms)).forEach(function(p){ parts[p.type]=p.value; });
  var h = +parts.hour === 24 ? 0 : +parts.hour;
  return { hour:h, minute:+parts.minute, year:+parts.year, month:+parts.month, day:+parts.day, weekday:parts.weekday };
}
/* offset in whole hours (approx display) of tz at ms */
function offsetHours(ms, tz){
  var lp = localParts(ms, tz);
  var asUTC = Date.UTC(lp.year, lp.month-1, lp.day, lp.hour, lp.minute);
  return Math.round((asUTC - ms) / 3600000 * 2) / 2;
}
/* is local time within work hours */
function inWork(ms, tz){
  var h = localParts(ms, tz).hour;
  return h >= WORK_START && h < WORK_END;
}
/* scan half-hour slots over 24h from dayStartUtc; return runs where ALL tzs are in work hours */
function overlapRuns(msList0, tzs){
  var runs = [], cur = null;
  for (var i=0;i<48;i++){
    var ms = msList0 + i*1800000;
    var ok = tzs.every(function(tz){ return inWork(ms, tz); });
    if (ok && !cur) cur = { start: ms, end: ms+1800000 };
    else if (ok) cur.end = ms+1800000;
    else if (cur){ runs.push(cur); cur = null; }
  }
  if (cur) runs.push(cur);
  return runs;
}
function bestOverlap(dayStartUtc, tzs){
  var runs = overlapRuns(dayStartUtc, tzs);
  if (!runs.length) return null;
  runs.sort(function(a,b){ return (b.end-b.start)-(a.end-a.start); });
  return runs[0];
}
if (typeof module !== 'undefined' && module.exports){
  module.exports = { CITIES:CITIES, WORK_START:WORK_START, WORK_END:WORK_END, localParts:localParts, offsetHours:offsetHours, inWork:inWork, overlapRuns:overlapRuns, bestOverlap:bestOverlap };
}
