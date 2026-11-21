/* =====================================================================
   SITE SETTINGS
   Change these and the whole site updates. See README.md.
   ===================================================================== */

// The brand name. Rename here and it changes on every page.
var BRAND_NAME = "Crew";

// Contact email shown in the footer. Replace with your real address.
var CONTACT_EMAIL = "[CONTACT EMAIL]";

// Google Apps Script web app URL (README step 4). Leave empty until deployed.
// It looks like: https://script.google.com/macros/s/XXXXXXXX/exec
var SIGNUP_ENDPOINT = "https://script.google.com/macros/s/AKfycbx5E5Ur-9kYOksBxM-B2eFWTWzSew-Pxo2dBXlnURoIpxckXz9B-RG3lKVppkJ2ANg7Eg/exec";

// Which language from SITE_COPY to show. Add a "pt" block below to translate.
var SITE_LANGUAGE = "en";

// Pricing used by the demo calculator. Workers keep 100% of their rate;
// the family pays the fee on top.
var PRICING = {
  bookingFee: 0.15,   // new match: 15% on top of the worker's rate, includes insurance
  rebookFee: 0.05     // rebooking the same worker: 5%
};

/* =====================================================================
   ALL SITE COPY
   Every word on the site lives here. {brand} is replaced by BRAND_NAME
   and {email} by CONTACT_EMAIL.

   To add Portuguese: copy the whole "en" block, rename it "pt",
   translate the text, then set SITE_LANGUAGE = "pt".
   Keep every "value" in English so the Google Sheet stays consistent.
   ===================================================================== */

var SITE_COPY = {
  en: {
    meta: {
      locale: "en-IE",
      titleIndex: "{brand}: trained young people for local jobs in Cascais",
      titleLogin: "Log in | {brand} app demo",
      titleFamily: "Family app | {brand} demo",
      titleWorker: "Worker app | {brand} demo"
    },

    common: {
      skip: "Skip to content",
      place: "Cascais",
      demoBanner: "Demo with sample data. {brand} launches January 2027.",
      backToSite: "Back to the website",
      perHour: "/hr"
    },

    nav: {
      label: "Main",
      how: "How it works",
      jobs: "Jobs",
      safety: "Safety",
      pricing: "Pricing",
      faq: "FAQ",
      demo: "Try the app demo",
      signup: "Sign up"
    },

    hero: {
      title: "Trusted local help from trained young people",
      intro: "{brand} connects Cascais households and older neighbours with trained young people aged 16 to 24 for paid local jobs.",
      tabsLabel: "Who are you?",
      tabFamily: "I need help",
      tabWorker: "I want to work",
      familyLine: "Book a trained young person for the jobs around your home.",
      workerLine: "Earn money near home, learn new skills and build a real reference.",
      jobLabel: "What do you need help with?",
      jobPlaceholder: "Choose a job",
      ageLabel: "How old are you?",
      agePlaceholder: "Choose your age",
      parishLabel: "Your parish",
      start: "Get started",
      launch: "Launching in Cascais in January 2027. Signing up is free.",
      photoAlt: "A golden retriever being walked along a sunny pavement",
      previewLabel: "App preview with sample data",
      chipShortlistTitle: "Your shortlist is ready",
      chipShortlistText: "3 trained dog walkers",
      chipBadgeTitle: "Crew Certified",
      chipBadgeText: "Course passed and 3 jobs rated 4+ stars",
      trust: [
        { icon: "school", text: "Trained for every job type" },
        { icon: "verified_user", text: "Every booked job will be insured" },
        { icon: "family_restroom", text: "Parent consent for under-18s" },
        { icon: "payments", text: "Pay through {brand} after the job" }
      ]
    },

    how: {
      title: "How it works",
      intro: "Two simple paths, and a live app demo you can tap through.",
      tabsLabel: "Show steps for",
      tabFamily: "Families",
      tabWorker: "Young people",
      familySteps: [
        { title: "Post a job", text: "Tell us what you need, where and when.", screen: "post" },
        { title: "Get a shortlist", text: "We send you 2 or 3 vetted workers who fit the job.", screen: "shortlist" },
        { title: "Pick one", text: "Compare their ratings, Crew Certified status and hourly rates, then choose.", screen: "pick" },
        { title: "The job gets done, insured", text: "Every booked job will be insured, with the policy in place before launch.", screen: "confirm" },
        { title: "Pay and review", text: "Pay through {brand} after the job. You both leave a review.", screen: "bookings" }
      ],
      workerSteps: [
        { title: "Sign up", text: "Tell us which jobs you'd like and how much time you have.", screen: "account" },
        { title: "Parent consent if you're under 18", text: "A parent or guardian says yes before your first job.", screen: "consent" },
        { title: "Take a free course and quiz", text: "A short online course and quiz for each job type. Pass it to take that job.", screen: "courses" },
        { title: "Become Crew Certified", text: "Complete 3 jobs booked through Crew, each rated 4 stars or more. After 5 jobs you also get a written reference.", screen: "home" }
      ],
      stepsHint: "Click a step to jump to it in the app.",
      familyCta: "Sign up as a family",
      workerCta: "Sign up to work",
      demoTitle: "Live app demo",
      demoText: "Sample data only. Nothing you type is saved.",
      demoOpen: "Open the app demo",
      demoFrameTitle: "{brand} app demo"
    },

    jobs: {
      title: "Jobs you can book at launch",
      intro: "Workers set their own rate, usually around €10 an hour.",
      notOffered: "Not offered at launch: babysitting or childcare.",
      cardCta: "Book this job"
    },

    // Job types. "value" is what gets saved to the Google Sheet.
    jobTypes: [
      { value: "Event help", icon: "celebration", photo: "assets/job-events.jpg", name: "Event help", short: "Events", desc: "Setting up, serving and cleaning up at parties and family gatherings.", alt: "An outdoor table set for a lunch with flowers" },
      { value: "Pet care and dog walking", icon: "pets", photo: "assets/job-dog-walk.jpg", name: "Pet care and dog walking", short: "Pet care", desc: "Walks, feeding and company for your pets while you're out.", alt: "Someone walking a small white dog along a path lined with sunflowers" },
      { value: "Car washing", icon: "local_car_wash", photo: "assets/job-car-sponge.jpg", name: "Car washing", short: "Car wash", desc: "A careful hand wash at your home.", alt: "Soapy hands washing a car mirror with a sponge" },
      { value: "Garden care", icon: "yard", photo: "assets/job-garden.jpg", name: "Garden care", short: "Garden", desc: "Weeding, watering, raking and tidying, with hand tools only.", alt: "Gloved hands planting with a hand trowel" },
      { value: "Window cleaning", icon: "window", photo: "assets/job-window-squeegee.jpg", name: "Window cleaning", short: "Windows", desc: "Ground-level windows only. No ladders, ever.", alt: "A hand wiping a soapy window clean with a squeegee" },
      { value: "Tech help for seniors", icon: "devices", photo: "assets/job-tech.jpg", name: "Tech help for seniors", short: "Tech help", desc: "Patient help with phones, video calls, apps and email.", alt: "An older couple looking at a smartphone together" }
    ],

    safety: {
      title: "From sign-up to your front door",
      intro: "Every young person goes through the same four steps before they work for you. Nobody skips one.",
      steps: [
        { title: "They sign up", text: "We know their name, age, school and parish before anything else." },
        { title: "They pass the course and quiz", text: "A short course and quiz for each job type. No pass, no jobs of that type." },
        { title: "A parent says yes", text: "Under 18? A parent or guardian approves the account first." },
        { title: "They arrive, insured", text: "Every booked job will be insured, and you both leave a review afterwards." }
      ],
      ui: {
        nameLabel: "Name",
        nameValue: "Marta, 17",
        parishLabel: "Parish",
        parishValue: "Carcavelos e Parede",
        signupButton: "Sign up to work",
        coursePassed: "Car washing course and quiz",
        coursePassedMeta: "Passed, 9 of 10 right",
        courseLocked: "Window cleaning course",
        courseLockedMeta: "Not taken yet, so no window jobs",
        consentTitle: "Parent consent",
        consentGiven: "Given",
        consentLine1: "A parent said yes on 8 Jan 2027",
        consentLine2: "No jobs after 22:00 until 18"
      },
      photoAlt: "A young man handing fruit to an older woman at her front door",
      rules: ["No ladders", "No power tools", "No pools or driving", "No late jobs for under-18s", "Reviews both ways"]
    },

    skills: {
      title: "Crew Certified",
      intro: "Pass the free course and quiz for a job type, then complete 3 jobs booked through {brand}, each rated 4 stars or more, and you're Crew Certified. After 5 jobs you also get a written reference.",
      recordNote: "It's a verified work record: jobs done, average rating and courses passed. Families see it on your profile and in the shortlist, and you can share it with employers through a link. Only jobs booked through {brand} count toward it.",
      surveyLead: "We asked 33 local students.",
      survey: "{stat1} have already done some paid work, and {stat2} would take a free short course if it led to paid work.",
      stat1: "82%",
      stat2: "97%",
      badgesTitle: "Courses, each with a quiz",
      photoAlt: "A young woman with headphones doing an online course on her laptop",
      record: {
        kicker: "{brand} work record",
        name: "Marta, 17",
        level: "Crew Certified",
        colSkill: "Skill",
        colJobs: "Jobs",
        colRating: "Rating",
        rows: [
          { skill: "Car washing", jobs: "5", rating: "4.9" },
          { skill: "Pet care", jobs: "5", rating: "5.0" },
          { skill: "Garden care", jobs: "2", rating: "4.8" }
        ],
        foot: "12 jobs booked through {brand}, 4.9 average rating, 1 written reference."
      }
    },


    pricing: {
      title: "Simple, fair pricing",
      intro: "Workers keep everything they earn. Families pay a small fee on top that includes insurance.",
      offerTitle: "Rebook for 5%",
      offerText: "Book the same worker again and the fee drops from 15% to 5%.",
      exampleTitle: "Example: a 2-hour car wash at €10 an hour",
      exampleRate: "Worker's rate: 2 hours at €10",
      exampleRateValue: "€20.00",
      exampleFee: "Booking fee, new match (15%)",
      exampleFeeValue: "€3.00",
      exampleTotal: "You pay",
      exampleTotalValue: "€23.00",
      rebookTitle: "Rebooking the same worker",
      rebookFee: "Booking fee, rebooking (5%)",
      rebookFeeValue: "€1.00",
      rebookTotalValue: "€21.00",
      exampleWorker: "The worker keeps all €20.00 either way.",
      points: [
        { icon: "payments", title: "Workers set their own rate", text: "Usually around €10 an hour. Workers keep 100% of their rate." },
        { icon: "receipt_long", title: "15% booking fee for a new match", text: "Added on top of the worker's rate. It includes insurance." },
        { icon: "autorenew", title: "5% to rebook the same worker", text: "Book someone you already know again for a smaller fee." }
      ]
    },

    signup: {
      title: "Join {brand} before we launch",
      intro: "It takes about two minutes. We'll email you before we launch in January 2027.",
      tabsLabel: "Sign up as",
      tabFamily: "A family",
      tabWorker: "A young person (16 to 24)"
    },

    forms: {
      parishPlaceholder: "Choose your parish",
      parishes: [
        { value: "Alcabideche", label: "Alcabideche" },
        { value: "Carcavelos e Parede", label: "Carcavelos e Parede" },
        { value: "Cascais e Estoril", label: "Cascais e Estoril" },
        { value: "São Domingos de Rana", label: "São Domingos de Rana" },
        { value: "Not sure", label: "Not sure" }
      ],
      chooseAll: "Choose all that apply.",
      demoNext: "While you wait, log in to the app demo to see how {brand} will work. It uses sample data.",
      demoLogin: "Log in to the demo",
      sending: "Sending…",
      errors: {
        required: "Fill in this field.",
        email: "Enter an email like name@example.com.",
        chooseOne: "Choose one option.",
        chooseMany: "Choose at least one.",
        consent: "Tick the box to agree.",
        summary: "Some answers are missing. Check the fields marked below.",
        network: "Your sign-up wasn't sent. Check your internet connection and try again.",
        notConnected: "Sign-ups aren't connected yet. Add the Apps Script URL to config.js (see README)."
      },

      family: {
        title: "Sign up as a family",
        intro: "Be one of the first to book when {brand} launches in January 2027.",
        name: "Your name",
        email: "Email",
        phone: "Phone (optional)",
        parish: "Your parish in Cascais",
        jobs: "What do you need help with?",
        consent: "I agree that {brand} can keep my details and email me about the launch.",
        submit: "Sign up as a family",
        success: "Thanks, you're on the list. We'll email you before {brand} launches in January 2027."
      },

      worker: {
        title: "Sign up to work",
        intro: "For 16 to 24 year olds in Cascais. The courses are free.",
        name: "Your name",
        email: "Email",
        age: "How old are you?",
        ageOptions: [
          { value: "Under 16", label: "Under 16" },
          { value: "16 to 17", label: "16 to 17" },
          { value: "18 to 20", label: "18 to 20" },
          { value: "21 to 24", label: "21 to 24" }
        ],
        under16: "We start at 16. We'll be in touch when you're old enough.",
        parentEmail: "Parent or guardian's email",
        parentHint: "We'll ask them for consent before your first job.",
        school: "School or university",
        schoolHint: "If you're not studying, write \"Not studying\".",
        parish: "Your parish in Cascais",
        jobs: "Which jobs interest you?",
        hours: "How many hours a week could you work?",
        hoursOptions: [
          { value: "0 to 2", label: "0 to 2" },
          { value: "3 to 5", label: "3 to 5" },
          { value: "6 to 10", label: "6 to 10" },
          { value: "10+", label: "10+" }
        ],
        bank: "Do you have a Portuguese bank account?",
        bankOptions: [
          { value: "Yes", label: "Yes" },
          { value: "No", label: "No" }
        ],
        consent: "I agree that {brand} can keep my details and email me about joining.",
        submit: "Sign up to work",
        success: "Thanks, you're signed up. We'll email you before {brand} launches in January 2027."
      }
    },

    faq: {
      title: "Questions",
      intro: "Can't find your answer? Email us at {email}.",
      items: [
        { q: "When does {brand} start?", a: "We launch in Cascais in January 2027. Sign up now and we'll email you when bookings open." },
        { q: "Is every job insured?", a: "Yes. Every booked job will be insured, and the policy will be in place before we launch. Insurance is included in the booking fee." },
        { q: "How are workers checked?", a: "Workers pass a short online course and quiz for each job type before they can take that job. Under-18s need a parent or guardian's consent, and every job ends with reviews from both sides." },
        { q: "How much does it cost?", a: "Workers set their own rate, usually around €10 an hour, and keep 100% of it. Families pay a 15% booking fee on top for a new match, or 5% to rebook the same worker. The fee includes insurance. You pay through {brand} after the job." },
        { q: "I'm 16 or 17. Can I join?", a: "Yes, with a parent or guardian's consent. You won't be offered jobs after 22:00." },
        { q: "What can't I book?", a: "No babysitting or childcare at launch, and nothing that needs ladders, power tools, a pool or driving." }
      ]
    },

    footer: {
      project: "A Venture for Change 2026 student project",
      contact: "Contact:",
      nav: "Footer",
      photos: "Job photos from Unsplash."
    },

    /* ---------- App demo ---------- */

    demo: {
      stageTitle: "Try the {brand} app",
      stageText: "This is how {brand} will work on your phone. Everything here is sample data, and nothing you type is saved.",
      tryTitle: "Try this",
      tryLogin: ["Choose A family or A worker.", "Type anything, or nothing, and tap Log in."],
      tryFamily: ["Tap Find workers for the sample car wash.", "Compare ratings, ages and Crew Certified status, then tap Pick.", "Check the price: €20 for the worker plus a 15% fee is €23.", "In Bookings, tap Book again to see the 5% rebooking fee, then open the worker's app.", "Set the start time to 21:00 and search again: workers under 18 disappear."],
      tryWorker: ["See progress toward Crew Certified.", "Open Courses to see passed and locked courses.", "Open Record for the work record employers can see."],
      switchLabel: "Switch view",
      familyView: "Family app",
      workerView: "Worker app",
      logout: "Log out",
      back: "Back",
      tabsLabel: "App sections",
      statusTime: "9:41",

      login: {
        welcome: "Welcome to {brand}",
        intro: "Trusted local help from trained young people in Cascais.",
        roleLegend: "I'm using {brand} as",
        roleFamily: "A family",
        roleWorker: "A worker",
        email: "Email",
        password: "Password",
        show: "Show",
        hide: "Hide",
        submit: "Log in",
        note: "Demo login: nothing you type is checked or saved."
      },

      family: {
        tabHome: "Post a job",
        tabBookings: "Bookings",
        tabAccount: "Account",
        hello: "Hello, {name}",
        postTitle: "Post a job",
        postIntro: "Tell us what you need. We'll send you a shortlist of trained workers.",
        job: "Which job?",
        parish: "Parish",
        date: "Date",
        time: "Start time",
        hours: "How long?",
        hoursUnit: "hours",
        hourUnit: "hour",
        notes: "Anything the worker should know? (optional)",
        submit: "Find workers",
        shortlistTitle: "Your shortlist",
        shortlistIntro: "Free at that time and passed the {job} course.",
        lateNote: "This job ends after 22:00, so workers under 18 are not shown.",
        rating: "rating",
        newWorker: "New",
        age: "Age {age}",
        jobsDone: "jobs",
        jobDone: "job",
        certified: "Crew Certified",
        progress: "{done} of {target} jobs toward Crew Certified",
        pick: "Pick",
        picked: "Picked",
        confirmTitle: "Booking confirmed",
        confirmIntro: "{worker} will do your job. You pay through {brand} after the job is done.",
        summaryJob: "Job",
        summaryWhen: "When",
        summaryWhere: "Where",
        rateLine: "{hours} at {rate}",
        feeLine: "Booking fee (15%, new match)",
        rebookFeeLine: "Booking fee (5%, rebooking)",
        rebookNote: "Book {worker} again later for a 5% fee.",
        rebookTitle: "Book {worker} again",
        rebookLine: "{hours} at {rate} plus a 5% fee",
        rebook: "Book again",
        seeWorker: "Job done? See {worker}'s app",
        total: "You pay after the job",
        workerKeeps: "{worker} keeps 100% of their rate.",
        insured: "This job is insured.",
        done: "Done",
        changeWorker: "Choose someone else",
        bookingsTitle: "Bookings",
        bookingsEmpty: "No bookings yet. Post a job and pick a worker from your shortlist.",
        bookingsCta: "Post a job",
        accountTitle: "Account",
        switchToWorker: "See the worker app"
      },

      worker: {
        tabHome: "Home",
        tabCourses: "Courses",
        tabRecord: "Record",
        tabAccount: "Account",
        hello: "Hello, {name}",
        statusTitle: "Your status",
        certified: "Crew Certified",
        certifiedDetail: "{jobs} jobs done, {rating} average rating.",
        progress: "{done} of {target} jobs toward Crew Certified",
        progressNote: "Only jobs booked through {brand} and rated 4 stars or more count.",
        stepCourse: "Course and quiz passed",
        stepJobs: "3 jobs rated 4+ stars",
        stepReference: "Written reference after 5 jobs",
        stepReferenceDone: "Written reference",
        justDone: "Job completed: {job} for {family}. You're one job closer to Crew Certified: {done} of {target}.",
        justCertified: "Job completed: {job} for {family}. You're now Crew Certified.",
        justDoneCertified: "Job completed: {job} for {family}. It's been added to your Crew Certified record.",
        earningsTitle: "Earned this month",
        earningsNote: "From {count} jobs. You keep 100% of your rate.",
        upcomingTitle: "Upcoming jobs",
        coursesTitle: "Your courses",
        coursesIntro: "Pass a job type's free course and quiz to take that job.",
        courseEarned: "Passed {date}",
        courseNotYet: "Free course and quiz available",
        recordTitle: "Work record",
        recordIntro: "Jobs done, average rating and courses passed. Families see it on your profile, and you can share it with employers through a link.",
        colSkill: "Skill",
        colJobs: "Jobs",
        colRating: "Rating",
        colPassed: "Course passed",
        referenceDone: "Written references: {count}",
        referenceLocked: "Written reference after 5 jobs booked through {brand}.",
        accountTitle: "Account",
        ageLabel: "Age",
        consentNote: "Parent consent is only needed for 16 and 17 year olds.",
        consentTitle: "Parent consent",
        consentGiven: "Given",
        consentBy: "{parent} said yes on {date}.",
        consentEmail: "Sent to {email}",
        consentLimit: "No jobs after 22:00 until you turn 18.",
        consentWhy: "You're 16 or 17, so a parent or guardian approved your account before your first job.",
        consentAsk: "You're {age}, so a parent or guardian needs to say yes before your first job.",
        consentWaiting: "Waiting for {parent}",
        consentSent: "Request sent to {email}",
        consentYes: "{parent} said yes",
        consentClose: "Close",
        switchToFamily: "See the family app"
      }
    }
  }
};
