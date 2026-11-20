/* =====================================================================
   SAMPLE DATA FOR THE CLICKABLE DEMO ONLY
   Nothing here is real. Every name is an obvious sample name, and the
   ratings, jobs and earnings are made up to show how the app will work.
   Job names must match a "value" in SITE_COPY.jobTypes (config.js).
   ===================================================================== */

var DEMO_DATA = {
  family: {
    name: "Sample family",
    photo: "assets/people/family.jpg",
    demoToday: "2027-03-10",   // the demo's pretend "today", used for the date picker
    // Pre-filled on the "Post a job" form so the demo is quick to click through.
    sampleJob: {
      job: "Garden care",
      parish: "Cascais e Estoril",
      date: "2027-03-13",
      start: 10,   // 10:00
      hours: 2
    }
  },

  // The shortlist a family sees after posting a job.
  workers: [
    {
      id: "a",
      name: "Sample worker A",
      initials: "A",
      photo: "assets/people/worker-a.jpg",
      ageBand: "21 to 24",
      level: "trusted",
      rate: 11,
      rating: 4.9,
      jobsDone: 23,
      courses: ["Garden care", "Event help", "Tech help for seniors"]
    },
    {
      id: "b",
      name: "Sample worker B",
      initials: "B",
      photo: "assets/people/worker-b.jpg",
      ageBand: "16 to 17",   // the worker app shows this worker, so it shows parent consent
      level: "verified",
      rate: 10,
      rating: 4.8,
      jobsDone: 8,
      courses: ["Pet care and dog walking", "Car washing", "Window cleaning"]
    },
    {
      id: "c",
      name: "Sample worker C",
      initials: "C",
      photo: "assets/people/worker-c.jpg",
      ageBand: "16 to 17",   // under 18: hidden from jobs that end after 22:00
      level: "starter",
      rate: 9.5,
      rating: 5.0,
      jobsDone: 2,
      courses: ["Pet care and dog walking"]
    }
  ],

  // The worker dashboard shows this worker.
  me: {
    workerId: "b",
    parentConsent: { parent: "Sample parent", email: "parent@example.com", date: "2027-01-08" },
    month: "2027-03",
    levelTargets: { verified: 5, trusted: 20 },

    coursesPassed: {
      "Pet care and dog walking": "2027-01-12",
      "Car washing": "2027-01-20",
      "Window cleaning": "2027-02-03"
    },

    completedThisMonth: [
      { date: "2027-03-02", job: "Pet care and dog walking", hours: 1, rate: 10 },
      { date: "2027-03-06", job: "Car washing", hours: 2, rate: 10 },
      { date: "2027-03-09", job: "Pet care and dog walking", hours: 1.5, rate: 10 }
    ],

    upcoming: [
      { date: "2027-03-13", start: "10:00", hours: 2, job: "Car washing", parish: "Cascais e Estoril", rate: 10 },
      { date: "2027-03-16", start: "17:30", hours: 1, job: "Pet care and dog walking", parish: "Carcavelos e Parede", rate: 10 },
      { date: "2027-03-20", start: "09:00", hours: 2, job: "Window cleaning", parish: "Alcabideche", rate: 10 }
    ],

    skills: [
      { job: "Pet care and dog walking", jobs: 4, rating: 4.8 },
      { job: "Car washing", jobs: 3, rating: 4.7 },
      { job: "Window cleaning", jobs: 1, rating: 5.0 }
    ]
  }
};
