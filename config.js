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
      titleLogin: "Log in to the demo | {brand}",
      titleFamily: "Family dashboard demo | {brand}",
      titleWorker: "Worker dashboard demo | {brand}"
    },

    common: {
      skip: "Skip to content",
      place: "Cascais",
      demoBanner: "Demo with sample data. {brand} launches January 2027.",
      backToSite: "Back to the website",
      perHour: "/hr",
      required: "required"
    },

    nav: {
      label: "Main",
      how: "How it works",
      jobs: "Jobs",
      safety: "Safety",
      pricing: "Pricing",
      faq: "FAQ",
      demo: "See the demo",
      signup: "Sign up"
    },

    hero: {
      badge: "Launching in Cascais in January 2027",
      title: "Everyday jobs, done by trained young locals",
      intro: "{brand} connects Cascais households and older neighbours with trained young people aged 16 to 24 for paid local jobs.",
      familyLabel: "For families and neighbours",
      familyLine: "Book a trained young person for the jobs around your home.",
      familyCta: "Sign up as a family",
      workerLabel: "For 16 to 24 year olds",
      workerLine: "Earn money near home, learn new skills and build a real reference.",
      workerCta: "Sign up to work",
      demoCta: "See the demo",
      surveyTitle: "We surveyed 33 local students",
      stat1: "82%",
      stat1Label: "have already done some paid work",
      stat2: "97%",
      stat2Label: "would take a free short course if it led to paid work"
    },

    how: {
      title: "How it works",
      familyTitle: "For families and neighbours",
      familySteps: [
        { title: "Post a job", text: "Tell us what you need, where and when." },
        { title: "Get a shortlist", text: "We send you 2 or 3 vetted workers who fit the job." },
        { title: "Pick one", text: "Compare their badges, reviews and hourly rates, then choose." },
        { title: "The job gets done, insured", text: "Every booked job will be insured, with the policy in place before launch." },
        { title: "Pay and review", text: "Pay through {brand} after the job. You both leave a review." }
      ],
      familyCta: "Sign up as a family",
      workerTitle: "For young people aged 16 to 24",
      workerSteps: [
        { title: "Sign up", text: "Tell us which jobs you'd like and how much time you have." },
        { title: "Parent consent if you're under 18", text: "A parent or guardian says yes before your first job." },
        { title: "Take a free course", text: "A short online course for each job type. Pass it to take that job." },
        { title: "Earn badges and level up", text: "Go from Starter to Verified to Trusted as you complete jobs." }
      ],
      workerCta: "Sign up to work"
    },

    jobs: {
      title: "Jobs at launch",
      intro: "Workers set their own rate, usually around €10 an hour.",
      notOffered: "Not offered at launch: babysitting or childcare."
    },

    // Job types. "value" is what gets saved to the Google Sheet.
    jobTypes: [
      { value: "Event help", icon: "celebration", name: "Event help", desc: "Setting up, serving and cleaning up at parties and family gatherings." },
      { value: "Pet care and dog walking", icon: "pets", name: "Pet care and dog walking", desc: "Walks, feeding and company for your pets while you're out." },
      { value: "Car washing", icon: "local_car_wash", name: "Car washing", desc: "A careful hand wash at your home." },
      { value: "Garden care", icon: "yard", name: "Garden care", desc: "Weeding, watering, raking and tidying, with hand tools only." },
      { value: "Window cleaning", icon: "window", name: "Window cleaning", desc: "Ground-level windows only. No ladders, ever." },
      { value: "Tech help for seniors", icon: "devices", name: "Tech help for seniors", desc: "Patient help with phones, video calls, apps and email." }
    ],

    safety: {
      title: "Safety and insurance",
      intro: "Built so parents and older neighbours can say yes with confidence.",
      items: [
        { icon: "shield", title: "Every booked job insured", text: "Every booked job will be insured. The policy will be in place before we launch." },
        { icon: "school", title: "Trained for each job", text: "Workers pass a short course for a job type before they can take that job." },
        { icon: "family_restroom", title: "Parent consent under 18", text: "Workers aged 16 and 17 need a parent or guardian's consent to join." },
        { icon: "bedtime", title: "No late jobs for under-18s", text: "Nobody under 18 works after 22:00." },
        { icon: "do_not_touch", title: "Low-risk jobs only", text: "No ladders, power tools, pools or driving." },
        { icon: "reviews", title: "Reviews both ways", text: "After every job, the family and the worker review each other." }
      ]
    },

    skills: {
      title: "Skills that count",
      intro: "Each job type has its own free online course. Pass it and you earn that badge. Complete jobs and you move up a level.",
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
      title: "Pricing",
      intro: "Simple and fair for both sides.",
      exampleTitle: "Example: 2 hours of garden care",
      exampleRate: "Worker's rate: 2 hours at €10",
      exampleRateValue: "€20.00",
      exampleFee: "Booking fee (15%, includes insurance)",
      exampleFeeValue: "€3.00",
      exampleFounding: "Founding family fee (7.5%)",
      exampleFoundingValue: "€1.50",
      exampleTotal: "Founding family pays",
      exampleTotalValue: "€21.50",
      exampleWorker: "The worker keeps all €20.00.",
      points: [
        { icon: "payments", title: "Workers set their own rate", text: "Usually around €10 an hour. Workers keep 100% of their rate." },
        { icon: "receipt_long", title: "15% booking fee for families", text: "Added on top of the worker's rate. It includes insurance." },
        { icon: "star", title: "Founding families pay half", text: "Sign up now and pay a 7.5% fee until 30 June 2027." },
        { icon: "card_membership", title: "Membership from July 2027", text: "€6 a month or €15 for 3 months, with no booking fees." }
      ]
    },

    signup: {
      title: "Sign up",
      intro: "It takes about two minutes. We'll email you before we launch."
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
      nav: "Footer"
    },

    /* ---------- Demo screens ---------- */

    demo: {
      navLabel: "Demo",
      familyView: "Family view",
      workerView: "Worker view",
      logout: "Log out",

      login: {
        title: "Log in to the demo",
        intro: "Nothing you type here is checked or saved. Choose a view and continue.",
        roleLegend: "I am a",
        roleFamily: "Family",
        roleWorker: "Worker",
        email: "Email",
        password: "Password",
        submit: "Open the dashboard",
        noAccount: "Not signed up yet?",
        signupLink: "Sign up on the website"
      },

      family: {
        hello: "Hello, {name}",
        postTitle: "Post a job",
        postIntro: "Tell us what you need. We'll show you a shortlist of workers.",
        job: "Job type",
        parish: "Parish",
        date: "Date",
        time: "Start time",
        hours: "How many hours?",
        hoursUnit: "hours",
        hourUnit: "hour",
        notes: "Anything the worker should know? (optional)",
        submit: "Find workers",
        shortlistTitle: "Your shortlist",
        shortlistIntro: "These workers are free at that time and have passed the {job} course.",
        lateNote: "This job ends after 22:00, so workers under 18 are not shown.",
        rating: "rating",
        jobsDone: "jobs done",
        newWorker: "New",
        level: "Level",
        pick: "Pick",
        editJob: "Change the job",
        confirmTitle: "Booking confirmed",
        confirmIntro: "{worker} will do your job. You pay through {brand} after the job is done.",
        summaryJob: "Job",
        summaryWhen: "When",
        summaryWhere: "Where",
        rateLine: "Worker's rate: {hours} at {rate}",
        feeLine: "Booking fee (15%, includes insurance)",
        foundingLine: "Founding family fee (7.5%)",
        foundingNote: "Founding families pay half the fee until 30 June 2027.",
        total: "You pay",
        workerKeeps: "{worker} keeps 100% of their rate.",
        insured: "This job is insured.",
        another: "Post another job",
        back: "Back to the shortlist"
      },

      worker: {
        hello: "Hello, {name}",
        levelTitle: "Your level",
        progress: "{done} of {target} jobs to {next}",
        maxLevel: "You've reached the top level.",
        earningsTitle: "Earnings this month",
        earningsNote: "From {count} jobs. You keep 100% of your rate.",
        upcomingTitle: "Upcoming jobs",
        badgesTitle: "Your badges",
        badgeEarned: "Passed {date}",
        badgeNotYet: "Free course available",
        skillsTitle: "Skills record",
        skillsIntro: "Your record of jobs done and ratings. Share it with schools and employers.",
        colSkill: "Skill",
        colJobs: "Jobs done",
        colRating: "Average rating",
        colPassed: "Course passed",
        reference: "Written reference: unlocked at Verified."
      }
    }
  }
};
