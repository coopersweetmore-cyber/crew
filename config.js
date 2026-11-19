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

// Pricing used by the demo calculator (locked decisions).
var PRICING = {
  bookingFee: 0.15,   // 15% on top of the worker's rate, includes insurance
  foundingFee: 0.075  // founding families pay half, until 30 June 2027
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
      chipBadgeTitle: "Course passed",
      chipBadgeText: "Pet care course, level Starter",
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
        { title: "Post a job", text: "Tell us what you need, where and when." },
        { title: "Get a shortlist", text: "We send you 2 or 3 vetted workers who fit the job." },
        { title: "Pick one", text: "Compare their badges, reviews and hourly rates, then choose." },
        { title: "The job gets done, insured", text: "Every booked job will be insured, with the policy in place before launch." },
        { title: "Pay and review", text: "Pay through {brand} after the job. You both leave a review." }
      ],
      workerSteps: [
        { title: "Sign up", text: "Tell us which jobs you'd like and how much time you have." },
        { title: "Parent consent if you're under 18", text: "A parent or guardian says yes before your first job." },
        { title: "Take a free course", text: "A short online course for each job type. Pass it to take that job." },
        { title: "Earn badges and level up", text: "Go from Starter to Verified to Trusted as you complete jobs." }
      ],
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
      cardCta: "Sign up for this job"
    },

    // Job types. "value" is what gets saved to the Google Sheet.
    jobTypes: [
      { value: "Event help", icon: "celebration", photo: "assets/job-events.jpg", name: "Event help", short: "Events", desc: "Setting up, serving and cleaning up at parties and family gatherings.", alt: "An outdoor table set for a lunch with flowers" },
      { value: "Pet care and dog walking", icon: "pets", photo: "assets/job-pets.jpg", name: "Pet care and dog walking", short: "Pet care", desc: "Walks, feeding and company for your pets while you're out.", alt: "A dog on a lead in a field" },
      { value: "Car washing", icon: "local_car_wash", photo: "assets/job-car.jpg", name: "Car washing", short: "Car wash", desc: "A careful hand wash at your home.", alt: "Hands cleaning a car with a green cloth" },
      { value: "Garden care", icon: "yard", photo: "assets/job-garden.jpg", name: "Garden care", short: "Garden", desc: "Weeding, watering, raking and tidying, with hand tools only.", alt: "Gloved hands planting with a hand trowel" },
      { value: "Window cleaning", icon: "window", photo: "assets/job-windows.jpg", name: "Window cleaning", short: "Windows", desc: "Ground-level windows only. No ladders, ever.", alt: "A person cleaning a window from inside the room" },
      { value: "Tech help for seniors", icon: "devices", photo: "assets/job-tech.jpg", name: "Tech help for seniors", short: "Tech help", desc: "Patient help with phones, video calls, apps and email.", alt: "An older couple looking at a smartphone together" }
    ],

    safety: {
      title: "Safety is built in from day one",
      intro: "Families and older neighbours will be trusting us with their homes. These rules are not optional.",
      items: [
        { icon: "verified_user", title: "Every booked job insured", text: "Every booked job will be insured. The policy will be in place before we launch." },
        { icon: "school", title: "Trained for each job", text: "Workers pass a short course for a job type before they can take that job." },
        { icon: "family_restroom", title: "Parent consent under 18", text: "Workers aged 16 and 17 need a parent or guardian's consent to join." },
        { icon: "bedtime", title: "No late jobs for under-18s", text: "Nobody under 18 works after 22:00." },
        { icon: "do_not_touch", title: "Low-risk jobs only", text: "No ladders, power tools, pools or driving." },
        { icon: "reviews", title: "Reviews both ways", text: "After every job, the family and the worker review each other." }
      ]
    },

    skills: {
      title: "Skills that count for young people",
      intro: "Each job type has its own free online course. Pass it and you earn that badge. Complete jobs and you move up a level.",
      surveyLead: "We asked 33 local students.",
      survey: "{stat1} have already done some paid work, and {stat2} would take a free short course if it led to paid work.",
      stat1: "82%",
      stat2: "97%",
      badgesTitle: "Course badges",
      levelsTitle: "Levels",
      unlocks: "Unlocks"
    },

    // Levels, in order. Used on the website and in the worker demo.
    levels: [
      { id: "starter", name: "Starter", rule: "Pass your first course.", unlocks: "Take jobs of that type." },
      { id: "verified", name: "Verified", rule: "Complete 5 well-rated jobs.", unlocks: "A written reference and a skills record." },
      { id: "trusted", name: "Trusted", rule: "Complete 20 jobs.", unlocks: "Help train newcomers." }
    ],

    pricing: {
      title: "Simple, fair pricing",
      intro: "Workers keep everything they earn. Families pay a small fee that includes insurance.",
      offerTitle: "Founding family offer",
      offerText: "Sign up before launch and pay half the booking fee, 7.5%, until 30 June 2027.",
      exampleTitle: "Example: 2 hours of garden care",
      exampleRate: "Worker's rate: 2 hours at €10",
      exampleRateValue: "€20.00",
      exampleFee: "Booking fee (15%, includes insurance)",
      exampleFeeValue: "€3.00",
      exampleFounding: "Founding family fee (7.5%)",
      exampleFoundingValue: "€1.50",
      exampleTotal: "You pay",
      exampleTotalValue: "€21.50",
      exampleWorker: "The worker keeps all €20.00.",
      points: [
        { icon: "payments", title: "Workers set their own rate", text: "Usually around €10 an hour. Workers keep 100% of their rate." },
        { icon: "receipt_long", title: "15% booking fee for families", text: "Added on top of the worker's rate. It includes insurance." },
        { icon: "card_membership", title: "Membership from July 2027", text: "€6 a month or €15 for 3 months, with no booking fees." }
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
        intro: "Founding families pay half the booking fee until 30 June 2027. Your answers also help us plan the service.",
        name: "Your name",
        email: "Email",
        phone: "Phone (optional)",
        parish: "Your parish in Cascais",
        jobs: "Which jobs would you book?",
        frequency: "How often would you book?",
        frequencyOptions: [
          { value: "Once a month or less", label: "Once a month or less" },
          { value: "2 to 3 times a month", label: "2 to 3 times a month" },
          { value: "Weekly", label: "Weekly" },
          { value: "Several times a week", label: "Several times a week" }
        ],
        fee: "Would you pay a 15% booking fee for insured, vetted workers?",
        feeOptions: [
          { value: "Yes", label: "Yes" },
          { value: "Maybe", label: "Maybe" },
          { value: "No", label: "No" }
        ],
        rate: "What's a fair hourly rate?",
        rateOptions: [
          { value: "8 to 9 euros", label: "€8 to 9" },
          { value: "10 to 11 euros", label: "€10 to 11" },
          { value: "12 to 13 euros", label: "€12 to 13" },
          { value: "14+ euros", label: "€14 or more" }
        ],
        payment: "How would you prefer to pay?",
        paymentOptions: [
          { value: "MB WAY", label: "MB WAY" },
          { value: "Card", label: "Card" },
          { value: "Either", label: "Either" }
        ],
        consent: "I agree that {brand} can keep these answers and email me about the launch.",
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
        consent: "I agree that {brand} can keep these answers and email me about joining.",
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
        { q: "How are workers checked?", a: "Workers pass a short online course for each job type before they can take that job. Under-18s need a parent or guardian's consent, and every job ends with reviews from both sides." },
        { q: "How much does it cost?", a: "Workers set their own rate, usually around €10 an hour. Families pay a 15% booking fee on top, which includes insurance. Founding families pay 7.5% until 30 June 2027. You pay through {brand} after the job." },
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
      tryFamily: ["Pick a job and tap Find workers.", "Compare the shortlist and tap Pick.", "Check the price breakdown with the founding discount.", "Set the start time to 21:00 and search again: the under-18 worker disappears."],
      tryWorker: ["See the level and progress to Trusted.", "Open Badges to see passed and locked courses.", "Open Record for the skills record schools and employers can see."],
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
        founding: "Founding family",
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
        jobsDone: "jobs",
        pick: "Pick",
        confirmTitle: "Booking confirmed",
        confirmIntro: "{worker} will do your job. You pay through {brand} after the job is done.",
        summaryJob: "Job",
        summaryWhen: "When",
        summaryWhere: "Where",
        rateLine: "{hours} at {rate}",
        feeLine: "Booking fee (15%, includes insurance)",
        foundingLine: "Founding family fee (7.5%)",
        foundingNote: "Founding families pay half the fee until 30 June 2027.",
        total: "You pay after the job",
        workerKeeps: "{worker} keeps 100% of their rate.",
        insured: "This job is insured.",
        done: "Done",
        changeWorker: "Choose someone else",
        bookingsTitle: "Bookings",
        bookingsEmpty: "No bookings yet. Post a job and pick a worker from your shortlist.",
        bookingsCta: "Post a job",
        accountTitle: "Account",
        foundingText: "You pay a 7.5% booking fee instead of 15% until 30 June 2027.",
        switchToWorker: "See the worker app"
      },

      worker: {
        tabHome: "Home",
        tabBadges: "Badges",
        tabRecord: "Record",
        tabAccount: "Account",
        hello: "Hello, {name}",
        levelTitle: "Your level",
        progress: "{done} of {target} jobs to {next}",
        maxLevel: "You've reached the top level.",
        earningsTitle: "Earned this month",
        earningsNote: "From {count} jobs. You keep 100% of your rate.",
        upcomingTitle: "Upcoming jobs",
        badgesTitle: "Your badges",
        badgesIntro: "Pass a free course to unlock each job type.",
        badgeEarned: "Passed {date}",
        badgeNotYet: "Free course available",
        recordTitle: "Skills record",
        recordIntro: "Your jobs and ratings in one place. Share it with schools and employers.",
        colSkill: "Skill",
        colJobs: "Jobs",
        colRating: "Rating",
        colPassed: "Course passed",
        reference: "Written reference: unlocked at Verified.",
        accountTitle: "Account",
        ageBand: "Age band",
        consentNote: "Parent consent is only needed for 16 and 17 year olds.",
        switchToFamily: "See the family app"
      }
    }
  }
};
