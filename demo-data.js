/* =====================================================================
   SAMPLE DATA FOR THE CLICKABLE DEMO ONLY
   Nothing here is real. The ratings, jobs and earnings are made up to
   show how the app will work.
   Job names must match a "value" in SITE_COPY.jobTypes (config.js).
   ===================================================================== */

var DEMO_DATA = {
  family: {
    name: "Sample family",
    photo: "assets/people/family.jpg",
    demoToday: "2027-03-10",   // the demo's pretend "today", used for the date picker
    // Pre-filled on the "Post a job" form so the demo is quick to click through.
    sampleJob: {
      job: "Car washing",
      parish: "Carcavelos e Parede",
      date: "2027-03-13",
      start: 10,   // 10:00
      hours: 2
    }
  },

  // Crew Certified: course and quiz passed, plus 3 jobs booked through Crew,
  // each rated 4 stars or more. A written reference comes after 5 jobs.
  certification: { jobsNeeded: 3, minRating: 4, referenceAfter: 5 },

  // The shortlist a family sees after posting a job.
  workers: [
    {
      id: "marta",
      name: "Marta",
      initials: "M",
      photo: "assets/people/worker-a.jpg",
      age: 17,               // under 18: hidden from jobs that end after 22:00
      area: "Carcavelos",
      rate: 10,
      rating: 4.9,
      jobsDone: 12,
      certified: true,
      references: 1,
      courses: ["Car washing", "Pet care and dog walking", "Garden care"]
    },
    {
      id: "b",
      name: "Sample worker B",
      initials: "B",
      photo: "assets/people/worker-b.jpg",
      age: 19,
      area: "Cascais",
      rate: 10,
      rating: 5.0,
      jobsDone: 1,           // 1 of 3 jobs toward Crew Certified
      certified: false,
      references: 0,
      demoPick: true,        // the worker "Pick one" chooses on the website
      courses: ["Car washing"]
    },
    {
      id: "c",
      name: "Sample worker C",
      initials: "C",
      photo: "assets/people/worker-c.jpg",
      age: 16,               // under 18: hidden from jobs that end after 22:00
      area: "Parede",
      rate: 9,
      rating: null,          // no jobs yet
      jobsDone: 0,
      certified: false,
      references: 0,
      courses: ["Car washing", "Window cleaning"]
    }
  ],

  // The worker app. Opened on its own it shows Marta. Opened from a demo
  // booking (worker.html?worker=b&done=1) it shows the booked worker, with
  // that job counted as completed.
  defaultWorker: "marta",
  workerViews: {
    marta: {
      // Marta is 17, so her account shows the parent consent card.
      parentConsent: { parent: "Sample parent", email: "parent@example.com", date: "2027-01-08" },
      month: "2027-03",
      coursesPassed: {
        "Car washing": "2027-01-09",
        "Pet care and dog walking": "2027-01-16",
        "Garden care": "2027-02-06"
      },
      completedThisMonth: [
        { date: "2027-03-02", job: "Car washing", hours: 2, rate: 10 },
        { date: "2027-03-05", job: "Pet care and dog walking", hours: 1, rate: 10 },
        { date: "2027-03-08", job: "Garden care", hours: 2, rate: 10 }
      ],
      upcoming: [
        { date: "2027-03-13", start: "11:00", hours: 1, job: "Pet care and dog walking", parish: "Carcavelos e Parede", rate: 10 },
        { date: "2027-03-17", start: "16:00", hours: 2, job: "Car washing", parish: "Cascais e Estoril", rate: 10 },
        { date: "2027-03-20", start: "10:00", hours: 2, job: "Garden care", parish: "Carcavelos e Parede", rate: 10 }
      ],
      skills: [
        { job: "Car washing", jobs: 5, rating: 4.9 },
        { job: "Pet care and dog walking", jobs: 5, rating: 5.0 },
        { job: "Garden care", jobs: 2, rating: 4.8 }
      ]
    },
    b: {
      month: "2027-03",
      coursesPassed: {
        "Car washing": "2027-02-20"
      },
      completedThisMonth: [
        { date: "2027-03-04", job: "Car washing", hours: 2, rate: 10 }
      ],
      upcoming: [
        { date: "2027-03-18", start: "15:00", hours: 2, job: "Car washing", parish: "Cascais e Estoril", rate: 10 }
      ],
      skills: [
        { job: "Car washing", jobs: 1, rating: 5.0 }
      ]
    }
  },

  // How the demo booking is rated once it is done (counts toward Crew Certified).
  demoJobRating: 5
};
