---
title: "MindSpace: A Digital Mental Health Support Platform for Students"
subtitle: "B.Tech Project Report"
institution: "Department of Computer Science & Engineering"
---

# MindSpace
## A Digital Mental Health Support Platform for Students

**B.Tech Project Report**

Submitted in partial fulfillment of the requirements for the award of the degree of
**Bachelor of Technology in Computer Science and Engineering**

---

**Team: MindSpace Warriors**

| Name | Role |
|---|---|
| Brajabehari Pal | Project Lead & Project Manager |
| Saurabh Kumar | Frontend & Backend Developer |
| Sanjay Bhatti | AI/ML Specialist & Database |
| Sneha Sharma | Research & Documentation |
| Radha | UI/UX Designer |
| Rahul Dudi | IoT Devices Specialist |

---

*Submitted to the Smart India Hackathon (SIH) 2024*

---

---

# TABLE OF CONTENTS

```
ABSTRACT ...........................................................................................................  v

LIST OF TABLES .................................................................................................  vii

LIST OF FIGURES ...............................................................................................  viii

LIST OF SYMBOLS ..............................................................................................  ix

LIST OF ABBREVIATIONS .................................................................................  x

CHAPTER 1   INTRODUCTION .........................................................................  1

  1.1   Problem Introduction .................................................................................  2
       1.1.1   Motivation ........................................................................................  3
       1.1.2   Project Objective ..............................................................................  4
       1.1.3   Scope of the Project ..........................................................................  5
  1.2   Related Previous Work ..............................................................................  6
  1.3   Organization of the Report .........................................................................  8

CHAPTER 2   SOFTWARE REQUIREMENTS SPECIFICATION (SRS) ..........  10

  2.1   Product Perspective ...................................................................................  11
       2.1.1   System Interfaces .............................................................................  12
       2.1.2   User Interfaces .................................................................................  13
       2.1.3   Hardware Interfaces ..........................................................................  14
       2.1.4   Software Interfaces ...........................................................................  14
             2.1.4.1   MongoDB Atlas .......................................................................  15
             2.1.4.2   Google Generative AI API .......................................................  15
             2.1.4.3   Nodemailer / SMTP ................................................................  16
       2.1.5   Communications Interfaces ...............................................................  16
       2.1.6   Memory Constraints ..........................................................................  17
       2.1.7   Operations ........................................................................................  17
       2.1.8   Site Adaptation Requirements ...........................................................  18
  2.2   Product Functions .....................................................................................  18
  2.3   User Characteristics ...................................................................................  21
  2.4   Constraints ................................................................................................  22
  2.5   Assumptions and Dependencies .................................................................  23
  2.6   Apportioning of Requirements ...................................................................  24
  2.7   Use Case ...................................................................................................  25
       2.7.1   Use Case Model ................................................................................  25
       2.7.2   Use Case Diagram ............................................................................  26
       2.7.3   Use Case Scenarios ...........................................................................  27
  2.8   Sequence Diagrams ....................................................................................  31

CHAPTER 3   SYSTEM DESIGN ........................................................................  33

  3.1   Architecture Diagrams ...............................................................................  34
       3.1.1   Three-Tier Architecture .....................................................................  34
       3.1.2   Component Interaction Diagram ........................................................  35
  3.2   Class Diagrams ..........................................................................................  36
  3.3   Data Flow Diagram ....................................................................................  38
  3.4   Activity Diagrams ......................................................................................  40
       3.4.1   User Registration & Login Activity ...................................................  40
       3.4.2   Mental Health Assessment Activity ...................................................  41
  3.5   ER Diagrams ..............................................................................................  42
  3.6   Database Schema Diagrams .......................................................................  44

CHAPTER 4   IMPLEMENTATION AND RESULTS ..........................................  47

  4.1   Software and Hardware Requirements ........................................................  48
  4.2   Assumptions and Dependencies .................................................................  49
  4.3   Constraints .................................................................................................  50
  4.4   Implementation Details ..............................................................................  50
       4.4.1   Snapshots of Interfaces .....................................................................  51
       4.4.2   Test Cases ........................................................................................  58
       4.4.3   Results ..............................................................................................  61

CHAPTER 5   CONCLUSIONS ...........................................................................  64

  5.1   Performance Evaluation .............................................................................  65
  5.2   Comparison with Existing State-of-the-Art Technologies ...........................  66
  5.3   Future Directions .......................................................................................  68

APPENDIX A   API ENDPOINT REFERENCE ..................................................  71

APPENDIX B   ENVIRONMENT CONFIGURATION REFERENCE .................  74

REFERENCES .....................................................................................................  76
```

---

---

# ABSTRACT

Mental health is among the most pressing yet under-addressed challenges facing students in higher education institutions across India. The increasing pressure of academics, peer relationships, financial burdens, and social expectations has contributed to a significant rise in anxiety, depression, and stress-related disorders among the student population. Despite the scale of the problem, access to timely, affordable, and confidential mental health support remains extremely limited in most institutions.

MindSpace is a comprehensive web-based digital mental health support platform developed specifically for students in Indian higher education institutions. It was conceptualized and built as part of the Smart India Hackathon (SIH) 2024 under the theme of student wellness and institutional support systems.

The platform addresses the mental health crisis through four primary pillars: (1) intelligent AI-powered chatbot support available 24 hours a day, 7 days a week, enabling students to seek help immediately without fear of judgment; (2) a camera-based real-time mood detection system powered by a custom-trained convolutional neural network (CNN) using TensorFlow.js, capable of identifying seven emotional states from facial expressions; (3) a structured multi-module mental health assessment framework incorporating the clinically validated DASS-21, GAD-7, and PHQ-9 screening tools, producing a personalized risk analysis report with evidence-based recommendations; and (4) a curated, multi-format resource library covering videos, audio guides, and reading materials filtered by the user's current emotional state.

The system is built on a modern web technology stack — a Vanilla HTML/CSS/JavaScript frontend hosted on Vercel, a Node.js/Express.js RESTful backend deployed on Render, and a MongoDB Atlas cloud database. The backend integrates Google's Generative AI (Gemini) API for context-aware conversational support and uses JSON Web Tokens (JWT) for stateless, secure authentication.

Key engineering outcomes of this project include a zero-duplication assessment submission system using a three-layer guard (frontend flag, sessionStorage redirect, and backend idempotency check), a per-user rate limiter on the report generation endpoint, removal of clinically inappropriate self-reported metrics, and a redesigned report page featuring animated severity gauges and a fully print-optimized layout. An automated Continuous Integration (CI) pipeline via GitHub Actions ensures code quality through linting (ESLint) and automated testing (Jest) on every pull request.

The platform is live and accessible at https://mind-space-beryl.vercel.app/. It demonstrates that a small, dedicated engineering team can design and deploy a clinically informed, scalable, and privacy-respecting mental health platform capable of meaningfully improving student wellbeing at institutional scale.

**Keywords:** Mental Health, Student Wellbeing, AI Chatbot, Mood Detection, DASS-21, GAD-7, PHQ-9, Node.js, MongoDB, TensorFlow.js, Progressive Web App, Smart India Hackathon

---

---

# LIST OF TABLES

| Table No. | Title | Page |
|---|---|---|
| Table 2.1 | Software Interfaces and Version Details | 14 |
| Table 2.2 | Major Product Functions Summary | 19 |
| Table 2.3 | Use Case Scenario — User Registration | 27 |
| Table 2.4 | Use Case Scenario — Mental Health Assessment | 28 |
| Table 2.5 | Use Case Scenario — AI Chat Session | 29 |
| Table 2.6 | Use Case Scenario — Mood Detection | 30 |
| Table 2.7 | Apportioning of Requirements by Phase | 24 |
| Table 3.1 | MongoDB Collection Schema — Users | 44 |
| Table 3.2 | MongoDB Collection Schema — MentalHealthReports | 45 |
| Table 3.3 | MongoDB Collection Schema — Moods | 46 |
| Table 3.4 | MongoDB Collection Schema — Appointments | 46 |
| Table 4.1 | Software Requirements | 48 |
| Table 4.2 | Hardware Requirements | 49 |
| Table 4.3 | DASS-21 Severity Band Thresholds | 52 |
| Table 4.4 | GAD-7 Severity Band Thresholds | 52 |
| Table 4.5 | PHQ-9 Severity Band Thresholds | 53 |
| Table 4.6 | Test Cases — Authentication Module | 58 |
| Table 4.7 | Test Cases — Mental Health Assessment Module | 59 |
| Table 4.8 | Test Cases — Mood Detection Module | 60 |
| Table 4.9 | Test Cases — Anti-Duplication Submission Guard | 61 |
| Table 5.1 | Comparison with Existing Mental Health Platforms | 67 |

---

---

# LIST OF FIGURES

| Figure No. | Title | Page |
|---|---|---|
| Figure 1.1 | Mental Health Prevalence among Indian College Students | 3 |
| Figure 2.1 | System Context (Black-Box) Diagram | 11 |
| Figure 2.2 | Use Case Diagram — Student Actor | 26 |
| Figure 2.3 | Use Case Diagram — Admin/Counselor Actor | 26 |
| Figure 2.4 | Sequence Diagram — User Registration | 31 |
| Figure 2.5 | Sequence Diagram — Mental Health Assessment & Report Generation | 32 |
| Figure 3.1 | Three-Tier Architecture of MindSpace | 34 |
| Figure 3.2 | Component Interaction Diagram | 35 |
| Figure 3.3 | Class Diagram — Core Domain Objects | 36 |
| Figure 3.4 | Level-0 DFD (Context Diagram) | 38 |
| Figure 3.5 | Level-1 DFD — System Decomposition | 39 |
| Figure 3.6 | Activity Diagram — Registration & Login | 40 |
| Figure 3.7 | Activity Diagram — Mental Health Assessment Flow | 41 |
| Figure 3.8 | ER Diagram — MindSpace Database | 42 |
| Figure 3.9 | Database Schema Overview | 44 |
| Figure 4.1 | Landing Page / Home Screen | 51 |
| Figure 4.2 | User Registration Page | 52 |
| Figure 4.3 | User Dashboard | 53 |
| Figure 4.4 | Mental Health Assessment — Module 1 (Health & Vitals) | 54 |
| Figure 4.5 | Mental Health Assessment — Module 2 (DASS-21) | 54 |
| Figure 4.6 | Mental Health Report Page with Severity Gauges | 55 |
| Figure 4.7 | AI Chat (Gemini-Powered) Interface | 56 |
| Figure 4.8 | Mood Detection Camera Interface | 56 |
| Figure 4.9 | Resource Library | 57 |
| Figure 4.10 | Appointment Booking Page | 57 |
| Figure 4.11 | GitHub Actions CI Pipeline — Passing Run | 58 |
| Figure 5.1 | Radar Chart — Feature Comparison with Existing Tools | 67 |

---

---

# LIST OF SYMBOLS

| Symbol | Meaning |
|---|---|
| `∈` | Element of (set membership) |
| `∀` | For all |
| `→` | Maps to / implies |
| `≥` | Greater than or equal to |
| `≤` | Less than or equal to |
| `Σ` | Summation |
| `n` | Number of items / sample size |
| `P` | Probability |
| `%` | Percentage |
| `ms` | Milliseconds |
| `MB` | Megabytes |
| `KB` | Kilobytes |
| `req/min` | Requests per minute (API rate) |
| `O(n)` | Linear time complexity |
| `O(1)` | Constant time complexity |

---

---

# LIST OF ABBREVIATIONS

| Abbreviation | Full Form |
|---|---|
| AI | Artificial Intelligence |
| API | Application Programming Interface |
| CORS | Cross-Origin Resource Sharing |
| CNN | Convolutional Neural Network |
| CI/CD | Continuous Integration / Continuous Deployment |
| CRUD | Create, Read, Update, Delete |
| CSS | Cascading Style Sheets |
| DASS-21 | Depression Anxiety Stress Scale – 21 Items |
| DB | Database |
| DFD | Data Flow Diagram |
| DOM | Document Object Model |
| ER | Entity Relationship |
| ES6+ | ECMAScript 2015 and beyond |
| GAD-7 | Generalised Anxiety Disorder – 7 Items |
| GDPR | General Data Protection Regulation |
| GPA | Grade Point Average |
| GUI | Graphical User Interface |
| HTML | Hyper Text Markup Language |
| HTTP | Hyper Text Transfer Protocol |
| HTTPS | HTTP Secure |
| IoT | Internet of Things |
| IT | Information Technology |
| JWT | JSON Web Token |
| JSON | JavaScript Object Notation |
| MFA | Multi-Factor Authentication |
| ML | Machine Learning |
| MVC | Model View Controller |
| NLP | Natural Language Processing |
| NoSQL | Not Only SQL |
| NPM | Node Package Manager |
| OTP | One-Time Password |
| PDF | Portable Document Format |
| PHQ-9 | Patient Health Questionnaire – 9 Items |
| PWA | Progressive Web App |
| REST | Representational State Transfer |
| SIH | Smart India Hackathon |
| SPA | Single Page Application |
| SQL | Structured Query Language |
| SRS | Software Requirements Specification |
| SMTP | Simple Mail Transfer Protocol |
| SSL | Secure Sockets Layer |
| TF.js | TensorFlow.js |
| UI | User Interface |
| UX | User Experience |
| VR | Virtual Reality |
| WCAG | Web Content Accessibility Guidelines |

---

---

# CHAPTER 1
# INTRODUCTION

---

The world today is witnessing an unprecedented mental health crisis among young adults, particularly those enrolled in higher education. The transition from school to college brings with it a convergence of stressors — academic pressure, social adjustment, identity formation, financial anxiety, and, increasingly, the consequences of prolonged digital isolation. In India, where mental health services are chronically underfunded and culturally stigmatized, the consequences for the student population are especially severe.

Mental health, defined by the World Health Organization as "a state of well-being in which the individual realizes his or her own abilities, can cope with the normal stresses of life, can work productively and fruitfully, and is able to make a contribution to his or her community," is increasingly recognized as inseparable from academic performance, social integration, and overall quality of life.

Despite growing awareness, a large number of students in Indian higher education institutions do not have access to professional mental health support. Barriers include cost, stigma, lack of anonymity, insufficient counselor availability, and simple geographical distance from services. Technology — specifically, web-based and AI-powered platforms — presents a powerful opportunity to reduce these barriers significantly.

MindSpace was conceived and built precisely to address this gap. It is a Digital Mental Health Support Platform designed for students, deploying AI, clinical screening tools, and modern web technologies to make mental health support accessible, private, and actionable — 24 hours a day, seven days a week.

---

## 1.1 Problem Introduction

The mental health crisis among Indian college students has reached alarming proportions. A study published in the *Indian Journal of Psychiatry* (2019) found that approximately **35% of college students** in India reported clinically significant levels of depression, while **40%** reported measurable anxiety. These numbers are significantly higher than the general population estimates. Critically, over **80% of affected students never sought any form of professional help**, citing fear of judgment and stigma as the primary reasons.

At the institutional level, the picture is equally concerning:
- The average student-to-counselor ratio in Indian universities is approximately **1000:1** — the WHO recommends a ratio of **250:1**
- Most counseling centres operate only during weekday business hours, leaving nights, weekends, and examination periods — precisely when students are most vulnerable — completely unsupported
- Existing digital alternatives are largely designed for Western populations, do not integrate validated Indian-context screening tools, and often lack offline-capable features important for students in areas with poor connectivity

The problem is therefore twofold: **a clinical gap** (insufficient access to validated screening and support) and **a technological gap** (absence of a purpose-built, culturally appropriate, privacy-first digital platform for Indian students).

### 1.1.1 Motivation

The direct motivation for MindSpace arose during the Smart India Hackathon 2024, where the team observed that while several commercial mental health apps exist globally (BetterHelp, Headspace, Wysa), none were designed specifically for the unique pressures, cultural context, and resource constraints of Indian higher education students.

Key motivating factors included:

1. **Personal Proximity**: Members of the MindSpace Warriors team had direct experience with peer mental health struggles, including academic burnout, examination anxiety, and social isolation — particularly in the aftermath of COVID-19 pandemic disruptions to campus life.

2. **Clinical Vacuum**: The absence of any freely accessible, anonymized, clinically validated screening tool (DASS-21, GAD-7, PHQ-9) integrated into an Indian student platform represented a direct and addressable clinical gap.

3. **Technology Opportunity**: Advances in client-side machine learning (TensorFlow.js), large language model APIs (Google Gemini), and cloud-native deployment (Vercel, MongoDB Atlas) made it feasible for a small team to build a production-grade platform without significant infrastructure investment.

4. **Privacy Imperative**: Students are far more likely to engage with mental health tools when they trust that their data is protected. The architecture of MindSpace was designed from the ground up with privacy, anonymization options, and data minimization as core, non-negotiable requirements.

### 1.1.2 Project Objective

The primary objectives of the MindSpace project are:

1. **To develop a web-based mental health platform** that provides students with immediate, confidential, 24/7 access to AI-powered mental health support without requiring institutional referral or appointment.

2. **To implement clinically validated screening tools** (DASS-21, GAD-7, and PHQ-9) in a multi-module assessment format and generate a personalised, actionable mental health report with severity analysis and recommendations.

3. **To build a real-time emotion recognition system** using camera-based facial expression analysis powered by TensorFlow.js, enabling passive mood tracking without manual input burden.

4. **To integrate a curated, mood-adaptive resource library** delivering evidence-informed content (videos, audio meditations, written guides) matched to the user's current emotional state.

5. **To provide professional appointment booking** enabling users to schedule confidential sessions with licensed counselors directly through the platform.

6. **To enforce data privacy, security, and system integrity** through JWT authentication, bcrypt password hashing, input sanitization, CORS protection, and a multi-layer anti-duplication submission guard.

7. **To establish a maintainable, scalable codebase** with automated CI/CD pipelines (GitHub Actions), ESLint-enforced code quality, and a contribution-ready open-source structure.

### 1.1.3 Scope of the Project

The scope of MindSpace encompasses the following functional and non-functional boundaries:

**In Scope:**
- Student-facing web application accessible via any modern browser (Chrome, Firefox, Safari, Edge)
- User registration, authentication (email + OTP verification), and profile management
- Four-module mental health assessment (Health & Lifestyle Vitals, DASS-21, GAD-7, PHQ-9) with progress persistence and duplicate submission prevention
- AI-generated personalised mental health report with animated severity gauges, printable layout, PDF download, and email delivery
- Gemini-powered AI chatbot for mental health conversation support and crisis detection
- TensorFlow.js camera-based facial emotion recognition with historical tracking
- Multi-format resource library with mood-based and category-based filtering
- Appointment booking system for counselor sessions
- Admin panel for counselor and content management
- GitHub Actions CI pipeline for backend quality assurance
- Deployment on Vercel (frontend), Render (backend), MongoDB Atlas (database)

**Out of Scope:**
- Native mobile applications (iOS/Android) — planned for Phase 2
- Real-time peer-to-peer chat or group therapy features — planned for Phase 2
- Integration with institution HRMS or academic management systems
- Insurance billing or clinical record management
- Full clinical telehealth sessions with video/audio conferencing

---

## 1.2 Related Previous Work

The domain of digital mental health platforms has grown substantially over the past decade, driven by smartphones, AI advances, and growing awareness. A review of existing systems and academic literature reveals several relevant approaches:

**BetterHelp and Talkspace** (USA) are subscription-based teletherapy platforms connecting users with licensed therapists via text, video, and audio. While clinically rigorous, they are expensive, designed for adult general populations, not students, and do not include passive mood detection or self-assessment screening tools.

**Wysa** (UK/India) is an AI-powered chatbot for emotional wellbeing using cognitive behavioural therapy (CBT) techniques. It uses NLP to provide empathetic conversational support and was among the first mobile mental health apps to gain traction in India. However, it lacks structured clinical assessment tools, professional appointment booking, and a resource library tailored to students.

**iCall** (Tata Institute of Social Sciences, India) provides free online and phone-based counselling for students and individuals. It is among the most credible Indian platforms from a clinical standpoint, but it is not a technology-first solution — its digital presence is limited to call-in scheduling and does not include AI, mood tracking, or self-service assessments.

**Sangath's Manas Programme** has developed mobile mental health interventions specifically for Indian settings, including peer support and structured problem-solving therapy modules. However, these are research-focused programmes and not deployed as student-facing consumer platforms.

**Academic Research — Facial Emotion Recognition**: Happy et al. (2015) demonstrated a real-time facial expression recognition system achieving >90% accuracy on the FER-2013 dataset using a CNN architecture. Li and Deng (2020) conducted a comprehensive survey of facial expression recognition deep learning approaches, establishing that CNN-based models trained on augmented datasets consistently outperform classical feature-extraction methods. These findings informed the MindSpace mood detection module architecture.

**Academic Research — Digital Screening Tools**: Apolinario-Hagen et al. (2017) found in a systematic review that internet-based mental health screening tools achieve comparable sensitivity and specificity to in-person administration of the PHQ-9 and GAD-7 when presented in clean, low-anxiety digital environments — directly validating the MindSpace assessment format. Rajgopal (2020) documented the unique stressors of Indian college students and argued for low-cost, stigma-reducing digital first-contact solutions as a necessary public health intervention.

**Academic Research — Chatbot Efficacy**: Fitzpatrick et al. (2017), in a randomised controlled trial published in *JMIR Mental Health*, demonstrated that Woebot — a fully automated conversational agent using CBT principles — significantly reduced symptoms of depression and anxiety in college students over two weeks compared to a control group. This provides strong academic support for the AI chatbot component of MindSpace.

In summary, while individual components of MindSpace are addressed by existing tools and research, no single platform integrates all of the following for the Indian student context: clinical screening (DASS-21/GAD-7/PHQ-9), AI-powered chatbot, camera-based emotion recognition, a resource library, and appointment booking — as a unified, free, privacy-first web application.

---

## 1.3 Organization of the Report

This report is organized into five chapters, two appendices, and a references section, as described below:

**Chapter 1 — Introduction** introduces the problem domain, articulates the motivation behind MindSpace, defines the project objectives and scope, reviews related previous work in the digital mental health and AI domains, and provides this organizational overview.

**Chapter 2 — Software Requirements Specification (SRS)** provides a formal, structured description of the platform's requirements. It covers the product's perspective within the broader ecosystem, user interface, hardware, software, and communication interfaces, product functions, user characteristics, constraints, assumptions, dependencies, and apportioning of requirements. It also includes use case models, use case scenarios, and sequence diagrams for key system interactions.

**Chapter 3 — System Design** presents the technical architecture and design artifacts of MindSpace. This chapter covers the three-tier architecture diagram, component interaction diagram, class diagrams for core domain objects, Data Flow Diagrams (DFD) at context and decomposition levels, activity diagrams for key workflows, the Entity-Relationship (ER) diagram, and the MongoDB schema designs.

**Chapter 4 — Implementation and Results** documents the actual implementation of the platform, including software and hardware requirements, implementation details of each major module, interface screenshots, test cases covering authentication, assessment, mood detection, and the anti-duplication guard, and results including performance metrics and CI pipeline outcomes.

**Chapter 5 — Conclusions** evaluates the performance of the implemented system, compares MindSpace to existing state-of-the-art mental health platforms on key dimensions, and articulates future directions for development across planned phases.

**Appendix A** provides a complete reference of the REST API endpoints implemented in the platform.

**Appendix B** provides the environment variable configuration reference for backend deployment.

**References** lists all academic papers, technical documentation, standards, and online resources cited throughout the report.

---

---

# CHAPTER 2
# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)

---

This chapter provides a complete Software Requirements Specification for MindSpace. MindSpace is a web-based application designed to support student mental health through AI-driven conversation, clinical screening assessments, emotion recognition, and curated wellness resources. The SRS describes the general context, interfaces, product functions, user characteristics, constraints, and formal use case definitions that governed the design and development of the system. This document serves as the foundational agreement between the development team and stakeholders regarding what the system shall do.

---

## 2.1 Product Perspective

MindSpace is an independent, self-contained web application. It is not a component of a larger institutional management system, though it is designed to be integrated with institutional infrastructure in future phases (e.g., university SSO, campus counselor calendars). The platform is composed of three independently deployable tiers: a static frontend hosted on Vercel, a RESTful backend API deployed on Render, and a cloud-hosted MongoDB Atlas database cluster.

**Figure 2.1 — System Context (Black-Box) Diagram**

```
                          ┌─────────────────────────────────────────────────┐
                          │                                                 │
  [Student]─────────────→ │              MindSpace Platform                 │ ─────────────→ [MongoDB Atlas]
                          │                                                 │
  [Counselor]───────────→ │  (Black Box: Frontend + Backend + ML Model)     │ ─────────────→ [Google Gemini API]
                          │                                                 │
  [Admin]───────────────→ │                                                 │ ─────────────→ [SMTP Email Server]
                          │                                                 │
                          └─────────────────────────────────────────────────┘
```

External systems with which MindSpace interacts include:
- **MongoDB Atlas**: Cloud-hosted NoSQL database for all persistent data storage
- **Google Generative AI (Gemini)**: LLM API powering the mental health chatbot
- **Nodemailer/SMTP**: Email delivery service for OTP verification, password reset, and report emails
- **Vercel**: Static frontend hosting and CDN
- **Render**: Backend API hosting and process management
- **GitHub Actions**: Automated CI/CD pipeline triggered on push/pull request events

### 2.1.1 System Interfaces

MindSpace exposes and consumes the following system-level interfaces:

1. **Frontend ↔ Backend**: RESTful API over HTTPS. All requests carry a `Bearer` JWT token in the `Authorization` header. Request and response bodies use JSON encoding. The base URL is configurable via the `/api/config` endpoint served by the backend, allowing the frontend to dynamically resolve the backend URL without hardcoding — critical for multi-environment deployment.

2. **Backend ↔ MongoDB Atlas**: The backend connects using the Mongoose ODM (Object Data Modeling library for Node.js) over the MongoDB Wire Protocol. Connection parameters include a 30-second server selection timeout, a 45-second socket timeout, and a connection pool of up to 10 concurrent sockets. `retryWrites: true` and write concern `majority` ensure data durability.

3. **Backend ↔ Google Generative AI**: The `@google/generative-ai` npm package (v0.1.3) is used to communicate with the Gemini API. The backend acts as a proxy — the student's message, conversation history, and a system prompt defining the AI's mental health support persona are combined before being sent to the Gemini API. This architecture ensures the API key is never exposed to the client.

4. **Backend ↔ SMTP Server**: Nodemailer (v6.9.4) is used to connect to the configured SMTP server (Gmail by default, configurable via environment variables) for sending OTP verification emails, password reset emails, and PDF report email attachments.

5. **Frontend ↔ ML Service (TensorFlow.js)**: The mood detection model runs entirely client-side in the browser using TensorFlow.js. No image data is transmitted to any server during mood detection — this is a critical privacy design decision. The TF.js model is loaded from CDN on the mood page.

### 2.1.2 User Interfaces

MindSpace provides a Graphical User Interface (GUI) accessible through any modern web browser. The interface is built using HTML5, CSS3, and Vanilla JavaScript without client-side frameworks, ensuring maximum browser compatibility and minimal load times.

Key UI design principles applied:
- **Responsive Design**: The layout adapts to viewport widths from 320px (small mobile) to 1920px (large desktop) using CSS Flexbox and Grid with media query breakpoints at 480px, 768px, and 900px
- **Progressive Disclosure**: Complex assessment forms are broken into focused modules (one topic per screen) to reduce cognitive load
- **Accessibility**: Semantic HTML5 elements (`<main>`, `<section>`, `<article>`, `<nav>`) with ARIA roles and labels; all interactive elements have unique IDs; color contrast meets WCAG 2.1 AA standards
- **Micro-Animations**: Subtle CSS transitions (0.25s ease) on hover and focus states; score gauge bars animate with a cubic-bezier easing on report load for visual clarity
- **Dark Mode Compatibility**: CSS custom properties (`var(--primary-color)`) enable theming

The interface does not use any ADA-specific accommodations beyond WCAG 2.1 compliance — screen reader support is enabled through semantic HTML and ARIA labels.

### 2.1.3 Hardware Interfaces

The system has no direct hardware interface requirements other than the following:

- **Camera/Webcam**: The mood detection feature requires access to a device camera (laptop webcam or mobile rear/front camera). Access is requested using the browser's `MediaDevices.getUserMedia()` API with user consent — it is never accessed without explicit permission and is entirely optional.
- **Microphone**: Not currently used. Planned for future voice-input features.
- **Wearable Devices**: Planned for Phase 2. The backend has been architecturally prepared to receive biometric data streams (heart rate, SpO2) from wearable device integrations.

All other hardware interactions (keyboard, mouse, touchscreen) are handled by the browser natively.

### 2.1.4 Software Interfaces

**Table 2.1 — Software Interfaces and Version Details**

| Software | Version | Purpose | Source |
|---|---|---|---|
| Node.js | ≥16.0.0 | Backend JavaScript runtime | nodejs.org |
| Express.js | 4.18.2 | HTTP server and routing framework | npmjs.com |
| Mongoose | 7.5.0 | MongoDB ODM | npmjs.com |
| MongoDB | 6.x (Atlas) | NoSQL document database | mongodb.com |
| JWT (jsonwebtoken) | 9.0.2 | Stateless authentication | npmjs.com |
| bcryptjs | 2.4.3 | Password hashing | npmjs.com |
| Helmet | 7.0.0 | HTTP security headers | npmjs.com |
| express-rate-limit | 6.10.0 | API rate limiting | npmjs.com |
| Nodemailer | 6.9.4 | Email sending (SMTP) | npmjs.com |
| @google/generative-ai | 0.1.3 | Gemini AI API client | npmjs.com |
| TensorFlow.js | 3.x (CDN) | Client-side ML for mood detection | tensorflow.org |
| jsPDF | 2.5.1 (CDN) | Client-side PDF generation | jspdf.dev |
| Chart.js | 3.x (CDN) | Data visualization | chartjs.org |
| Font Awesome | 6.4.0 (CDN) | Icon library | fontawesome.com |
| Google Fonts (Poppins) | Latest (CDN) | Typography | fonts.google.com |
| Jest | 29.6.4 | Backend unit testing | jestjs.io |
| ESLint | 9.39.4 | Code quality linting (flat config) | eslint.org |
| Nodemon | 3.0.1 | Development auto-reload | npmjs.com |

#### 2.1.4.1 MongoDB Atlas

MongoDB Atlas is the cloud-hosted NoSQL database used by MindSpace. It provides a managed MongoDB cluster with automated backups, performance monitoring, and network access controls. The Mongoose ODM provides schema validation, document lifecycle hooks (e.g., pre-save password hashing), indexing declarations, and type coercion. Collections in use: `users`, `mentalHealthReports`, `moods`, `profiles`, `conversations`, `appointments`.

#### 2.1.4.2 Google Generative AI API (Gemini)

The Google Generative AI API provides access to the Gemini family of large language models. MindSpace uses the `gemini-pro` model variant, accessed via the `@google/generative-ai` npm package. The backend sends a structured prompt containing: (a) a system persona prompt defining the AI as a compassionate mental health support assistant; (b) the user's current mood if available; (c) the conversation history for context continuity; and (d) the user's latest message. This ensures responses are contextually appropriate, empathetic, and bounded to the mental health support domain.

#### 2.1.4.3 Nodemailer / SMTP

Nodemailer handles all email delivery from the platform. It is configured to connect to an SMTP server (defaulting to Gmail's SMTP) using credentials stored in environment variables. Email types supported: (1) OTP verification on registration, (2) password reset link emails, (3) mental health report emails with structured HTML body summarizing assessment results.

### 2.1.5 Communications Interfaces

MindSpace uses the following communication protocols:

- **HTTPS (TLS 1.2+)**: All client-server communication is encrypted using TLS. Vercel (frontend) and Render (backend) enforce HTTPS by default and redirect all HTTP traffic.
- **HTTP/1.1 REST**: The backend exposes a RESTful API following standard HTTP verbs (GET, POST, PUT, DELETE). JSON is the exclusive data interchange format (`Content-Type: application/json`).
- **CORS (Cross-Origin Resource Sharing)**: The backend implements a configurable CORS allowlist. In production, only the Vercel frontend origin is permitted. The `ALLOWED_ORIGINS` environment variable accepts a comma-separated list of origins, enabling multi-environment support (development + staging + production simultaneously).
- **MongoDB Wire Protocol**: The backend-to-database communication uses MongoDB's proprietary binary wire protocol over TCP, managed transparently by the Mongoose driver.
- **WebSocket (Planned)**: Socket.io is listed as a planned dependency for Phase 2's real-time peer support chat feature. It is not active in the current version.

### 2.1.6 Memory Constraints

The backend server is deployed on Render's free/starter tier, which provides 512MB of RAM. The backend is designed with this constraint in mind:
- MongoDB connection pool is capped at 10 simultaneous connections
- Request body size is limited to 2MB (`express.json({ limit: '2mb' })`)
- No in-memory session storage — all session state is stateless (JWT) or stored in MongoDB
- The ML (mood detection) model runs entirely client-side in the browser, imposing no server memory burden

The frontend is entirely static HTML/CSS/JS. The TensorFlow.js model (~25MB, loaded from CDN) runs in the browser's JavaScript engine and requires approximately 200-400MB of browser RAM during mood detection — standard for modern devices.

### 2.1.7 Operations

**Normal Operations:**
- The system operates 24/7 as a stateless, horizontally scalable service
- The backend server starts with `node server.js` (production) or `nodemon server.js` (development)
- MongoDB Atlas manages its own availability with automatic failover across replica set members
- Vercel CDN ensures frontend availability globally through edge network distribution

**Unattended Operations:**
- No scheduled batch jobs in the current version
- MongoDB Atlas performs automated daily backups
- Render performs automatic container restarts on process crash

**Backup & Recovery:**
- Database: MongoDB Atlas continuous backup with point-in-time recovery to any second within the past 7 days (free tier) or 35 days (paid tier)
- Frontend: Source code version-controlled in Git; Vercel maintains deployment history with one-click rollback
- Backend: Source code version-controlled in Git; Render supports deployment rollback via the dashboard

**Monitoring:**
- Render provides basic CPU, memory, and HTTP traffic metrics
- MongoDB Atlas provides query performance analysis, slow query logging, and connection pool monitoring
- A `/health` endpoint at `GET /health` returns the current database connection status and AI availability

### 2.1.8 Site Adaptation Requirements

For a new deployment of MindSpace, the following setup steps are required:

1. **MongoDB Atlas**: Create a cluster, whitelist the backend server IP (or `0.0.0.0/0` for dynamic IPs), create a database user, and set the `MONGODB_URI` environment variable
2. **Google AI API**: Obtain a Gemini API key from Google AI Studio and set `GOOGLE_AI_API_KEY`
3. **SMTP Email**: Configure an SMTP provider (Gmail recommended) and set `EMAIL_USER`, `EMAIL_PASS`
4. **JWT Secret**: Generate a cryptographically secure random string (≥32 characters) and set `JWT_SECRET`
5. **CORS Origins**: Set `ALLOWED_ORIGINS` to the frontend Vercel URL
6. **Frontend `.env`**: Set `VITE_API_URL` or the equivalent config variable to the backend Render URL

No physical hardware installation is required. All infrastructure is cloud-hosted.

---

## 2.2 Product Functions

MindSpace provides the following major functions:

**Table 2.2 — Major Product Functions Summary**

| # | Function | Description |
|---|---|---|
| F1 | User Registration & Authentication | Secure registration with OTP email verification; JWT-based login; password reset via email token |
| F2 | User Profile Management | View and update personal information, academic details, profile photo, contact information |
| F3 | Mental Health Assessment | Four-module guided assessment (Vitals, DASS-21, GAD-7, PHQ-9) with progress persistence |
| F4 | Report Generation | AI-analyzed assessment report with severity gauges, risk level, recommendations, PDF download, email |
| F5 | AI Chat Support | Gemini-powered mental health chatbot with context memory, mood awareness, and crisis detection |
| F6 | Mood Tracking | Manual mood logging and camera-based facial emotion recognition (7 emotion classes) |
| F7 | Resource Library | Curated multi-format (video, audio, guide) content library with mood-based and category filtering |
| F8 | Appointment Booking | Schedule confidential sessions with available counselors; manage booking history |
| F9 | Settings Management | Account settings: password change, notification preferences, privacy controls, data deletion |
| F10 | Admin Panel | Manage users, counselors, appointments, and platform content (admin role only) |
| F11 | CI/CD Pipeline | Automated backend linting and testing on every PR and push to main via GitHub Actions |

**Detailed Function Descriptions:**

**F3 — Mental Health Assessment**

The assessment is divided into four sequential modules, with progress saved to MongoDB via `POST /api/mental-health/progress` after each module so users can resume if they close the browser:

- **Module 1 — Health & Lifestyle Vitals**: Collects sleep duration (required), body temperature (optional), exercise frequency, smoking status, alcohol consumption, daily screen time (optional), chronic conditions, and current medications. Blood pressure and heart rate were deliberately excluded as they require clinical measurement equipment.

- **Module 2 — DASS-21**: The Depression Anxiety Stress Scale consists of 21 questions, each rated on a 0-3 Likert scale. Subscale scores (Depression, Anxiety, Stress) are calculated by summing the relevant 7 items and multiplying by 2 (to produce a 0-42 scale). Severity bands: Normal / Mild / Moderate / Severe.

- **Module 3 — GAD-7**: The Generalised Anxiety Disorder Scale consists of 7 questions rated 0-3 (total 0-21). Severity bands: None (0-4) / Mild (5-9) / Moderate (10-14) / Severe (15-21).

- **Module 4 — PHQ-9**: The Patient Health Questionnaire consists of 9 questions rated 0-3 (total 0-27). Severity bands: None (0-4) / Minimal (5-9) / Mild (10-14) / Moderate (15-19) / Severe (20-27).

Submission is protected by a three-layer duplication guard: a frontend `isSubmitting` flag (prevents double-click), a `sessionStorage` redirect guard (prevents back-button resubmission), and a backend 60-second idempotency check (prevents duplicate API calls). The analyze endpoint is also rate-limited to 3 requests per user per 10 minutes.

**F4 — Report Generation**

The controller (`analyzeMentalHealth`) processes the submitted data, calculates all subscale scores, determines overall risk level (`low`/`moderate`/`high`/`severe`) based on the highest severity across all scales, and generates a list of personalised recommendations categorized by domain (Sleep, Exercise, Stress Management, Professional Support, etc.). The report is stored in MongoDB and displayed on `mental-report.html` with animated progress-bar severity gauges for each scale.

**F5 — AI Chat Support**

The Gemini-powered chatbot (`POST /api/ai/chat`) accepts a user message and returns a contextually aware response. The system prompt defines the AI as "a compassionate and professional mental health support assistant for students." The backend maintains conversation history per session. Crisis keyword detection triggers an immediate response that includes helpline numbers (iCall: 9152987821, Emergency: 112) and an appointment booking prompt.

---

## 2.3 User Characteristics

MindSpace is designed for three distinct user roles:

**1. Students (Primary Users)**

- **Age Range**: 18-28 years
- **Technical Proficiency**: Moderate to high — comfortable with smartphones, web browsers, social media, and online forms. Unlikely to need a tutorial for basic navigation.
- **Mental Health Literacy**: Variable — some students understand clinical terms (anxiety, depression) while others may not. The platform uses plain language for all clinical concepts, with tooltips and explanation panels where needed.
- **Motivation**: Students approaching the platform are likely experiencing distress. The UI must be calming, non-judgmental, and load quickly. Every unnecessary step or confusing interface element represents a real risk of user abandonment at a critical moment.
- **Connectivity**: Students may access the platform on mobile data connections with variable bandwidth. The frontend is optimized for performance (static hosting on CDN, minimal JavaScript dependencies, lazy-loaded ML models).
- **Privacy Sensitivity**: Very high. The anonymization option and clear privacy communication are essential for engagement.

**2. Counselors (Secondary Users)**

- **Technical Proficiency**: Moderate — comfortable with standard web applications.
- **Use Pattern**: Access the admin/counselor dashboard to review appointment requests, manage schedules, and access student-consented assessment summaries.
- **Needs**: Clean, information-dense views of student caseloads; easy appointment management; ability to view shared report data when student has consented.

**3. Administrators (Tertiary Users)**

- **Technical Proficiency**: High — responsible for platform configuration, user management, and content library administration.
- **Use Pattern**: Infrequent access to backend admin panel for system-level management tasks.

---

## 2.4 Constraints

The following constraints limited the design options available to the development team:

1. **Regulatory**: No personal health data may be stored unencrypted. All passwords are hashed using bcrypt with a salt factor of 10 before storage. Sensitive environment variables (JWT secret, API keys, DB credentials) are stored in `.env` files and never committed to version control (enforced via `.gitignore`). GDPR-style data deletion is supported via the settings page.

2. **Hosting Budget**: The platform is deployed on free/starter tiers of Vercel and Render. Render's free tier imposes a 512MB RAM limit and "cold starts" (container spin-up delay of ~30 seconds after inactivity). This is documented in the UI with an appropriate loading message.

3. **API Key Exposure Prevention**: The Google Gemini API key must never be exposed to browser clients. All AI API calls are proxied through the backend server. This adds ~100-200ms of network latency per AI chat message but is a non-negotiable security requirement.

4. **No Client-Side Frameworks**: The frontend is built in Vanilla JavaScript without React, Vue, or Angular, to minimize bundle size and deployment complexity. This constrains but does not prevent the implementation of complex interactive features — they are achieved through modular JS function organization and DOM manipulation.

5. **Clinical Boundaries**: The platform explicitly does not diagnose. All assessments display a mandatory disclaimer: "This report is generated for informational purposes only and does not constitute medical advice." This boundary is enforced in UI copy, PDF content, and email templates.

6. **Mobile Camera Access**: Browser access to the device camera requires HTTPS — the application cannot use `getUserMedia()` over plain HTTP. This necessitates HTTPS even in development (handled via Vercel's local dev tunnel or browser flags).

---

## 2.5 Assumptions and Dependencies

**Assumptions:**

1. Users possess a device with a modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+) supporting ES6+, CSS Grid, and Flexbox
2. The Google Gemini API maintains backward compatibility with the `gemini-pro` model variant used in development; significant API changes may require prompt engineering updates
3. MongoDB Atlas remains available with ≥99.9% uptime (guaranteed by Atlas SLA on dedicated clusters)
4. Students have access to a device with a front-facing camera for the mood detection feature (not required for other features)
5. SMTP credentials remain valid; email delivery depends on the third-party email provider's infrastructure
6. Students have a valid email address for registration and OTP verification

**Dependencies:**

1. **Node.js ≥ 16.0.0**: Required for `async/await` support, ES modules, and compatibility with Mongoose 7.x
2. **MongoDB Atlas**: The platform cannot store persistent data without a live database connection. The server is designed to degrade gracefully in development (continue running without DB) but will exit in production if the database is unavailable
3. **Google AI API Key**: AI chat features are entirely disabled if `GOOGLE_AI_API_KEY` is not set; the server handles this gracefully with a user-facing error message
4. **Vercel CLI / GitHub Integration**: Automated frontend deployments depend on the Vercel-GitHub integration being active
5. **GitHub Actions Runners**: The CI pipeline depends on GitHub's hosted runner infrastructure (ubuntu-latest)

---

## 2.6 Apportioning of Requirements

**Table 2.7 — Apportioning of Requirements by Phase**

| Requirement | Phase 1 (Delivered) | Phase 2 (Planned) | Phase 3 (Future) |
|---|---|---|---|
| User registration & login | ✅ | | |
| OTP email verification | ✅ | | |
| Password reset via email | ✅ | | |
| Profile management | ✅ | | |
| DASS-21 assessment | ✅ | | |
| GAD-7 assessment | ✅ | | |
| PHQ-9 assessment | ✅ | | |
| Personalised report with PDF/email | ✅ | | |
| Animated severity gauges in report | ✅ | | |
| Anti-duplication submission guard | ✅ | | |
| Per-user API rate limiting | ✅ | | |
| AI chatbot (Gemini) | ✅ | | |
| Mood detection (TF.js, 7 emotions) | ✅ | | |
| Resource library (multi-format) | ✅ | | |
| Appointment booking system | ✅ | | |
| GitHub Actions CI/CD pipeline | ✅ | | |
| Peer support community/chat | | ✅ | |
| Mobile app (React Native) | | ✅ | |
| Wearable device integration | | ✅ | |
| Group therapy session booking | | ✅ | |
| Institution SSO integration | | ✅ | |
| VR/AR therapy experiences | | | ✅ |
| Advanced predictive analytics | | | ✅ |
| Multi-language support | | | ✅ |

---

## 2.7 Use Case

### 2.7.1 Use Case Model

**Primary Actors:**
- **Student**: The primary end-user. Interacts with all student-facing features.
- **Counselor**: A licensed mental health professional registered on the platform. Manages appointments and accesses consented reports.
- **Admin**: Platform administrator with elevated privileges for system management.
- **System (Time)**: Scheduled/triggered system actions (e.g., session expiry, automated email triggers).

**Key Use Cases:**
- UC1: Register Account
- UC2: Login / Logout
- UC3: Complete Mental Health Assessment
- UC4: View Mental Health Report
- UC5: Conduct AI Chat Session
- UC6: Detect Mood via Camera
- UC7: Log Mood Manually
- UC8: Browse and Filter Resources
- UC9: Book Counselor Appointment
- UC10: Manage Profile & Settings
- UC11: Manage Users (Admin)
- UC12: Manage Appointments (Counselor)

### 2.7.2 Use Case Diagram

```
                         ┌─────────────────────────────────────────────────────┐
                         │                  MindSpace System                   │
                         │                                                     │
  ┌────────┐             │  ┌─────────────────┐   ┌─────────────────┐         │
  │        │─────────────┼─→│ UC1: Register   │   │ UC3: Assessment │←────────┼──┐
  │        │─────────────┼─→│ UC2: Login      │   │ UC4: Report     │         │  │
  │Student │─────────────┼─→│ UC5: AI Chat    │   │ UC6: Mood Cam   │         │  │
  │        │─────────────┼─→│ UC7: Log Mood   │   │ UC8: Resources  │         │  │
  │        │─────────────┼─→│ UC9: Appointment│   │ UC10: Settings  │         │  │
  └────────┘             │  └─────────────────┘   └─────────────────┘         │  │
                         │                                                     │  │
  ┌──────────┐           │  ┌─────────────────┐                               │  │
  │Counselor │───────────┼─→│ UC12: Appointments│                              │  │
  └──────────┘           │  └─────────────────┘                               │  │
                         │                                                     │  │
  ┌───────┐              │  ┌─────────────────┐                               │  │
  │ Admin │──────────────┼─→│ UC11: User Mgmt │                               │  │
  └───────┘              │  └─────────────────┘                               │  │
                         │                                                     │  │
  ┌────────┐             │  ┌─────────────────┐                               │  │
  │ System │─────────────┼─→│ Session Expiry  │                               │  │
  │ (Time) │             │  │ Email Triggers  │───────────────────────────────┘  │
  └────────┘             └─────────────────────────────────────────────────────┘  │
                                                                                  │
  *UC3 & UC4 include <<extend>> UC5 (crisis triggers AI chat)                   │
```

### 2.7.3 Use Case Scenarios

**Table 2.3 — Use Case Scenario: User Registration**

| Element | Description |
|---|---|
| **Use Case Number** | UC1 |
| **Application** | MindSpace — Authentication Module |
| **Use Case Name** | Register Account |
| **Use Case Description** | A new student creates a MindSpace account by providing personal details and verifying their email address via OTP |
| **Primary Actor** | Student |
| **Precondition** | User does not have an existing MindSpace account; user has a valid email address |
| **Trigger** | User navigates to the registration page and submits the registration form |
| **Basic Flow** | 1. User navigates to `index.html` and clicks "Sign Up" <br>2. System displays the registration form with fields: First Name, Last Name, Email, Mobile, Date of Birth, Password, Confirm Password <br>3. User fills in all required fields and clicks "Register" <br>4. System validates input (email format, password length ≥6, matching passwords, mobile number) <br>5. System creates a new `User` document in MongoDB with `isVerified: false` <br>6. System generates a 6-digit OTP using `crypto.randomBytes`, hashes it, and stores the hash with a 10-minute expiry <br>7. System sends the OTP via email using Nodemailer <br>8. System displays the OTP input screen <br>9. User enters the received OTP and submits <br>10. System verifies the OTP hash, sets `isVerified: true`, and issues a JWT <br>11. User is redirected to the dashboard |
| **Alternate Flows** | AF1: Email already exists → System returns 400 error "Email already registered" <br>AF2: OTP expired → User requests a new OTP via "Resend OTP" button <br>AF3: Invalid OTP → System returns error "Invalid or expired OTP" (up to 3 attempts) <br>AF4: Validation failure → Inline error messages displayed next to respective fields |

---

**Table 2.4 — Use Case Scenario: Mental Health Assessment**

| Element | Description |
|---|---|
| **Use Case Number** | UC3 |
| **Application** | MindSpace — Mental Health Assessment Module |
| **Use Case Name** | Complete Mental Health Assessment |
| **Use Case Description** | A logged-in student completes a four-module mental health assessment and triggers report generation |
| **Primary Actor** | Student |
| **Precondition** | Student is authenticated (valid JWT); student has not submitted a report in the last 60 seconds |
| **Trigger** | Student navigates to `mental-home.html` |
| **Basic Flow** | 1. System checks `sessionStorage` — if `mindspace_assessment_submitted` is set, redirect immediately to `mental-report.html` <br>2. System loads saved progress from `GET /api/mental-health/progress` and pre-fills completed modules <br>3. Student completes Module 1 (Health & Lifestyle Vitals) and clicks "Save & Continue" <br>4. System saves Module 1 progress via `POST /api/mental-health/progress` <br>5. Student completes Module 2 (DASS-21 — 21 questions, 0-3 scale) and saves <br>6. Student completes Module 3 (GAD-7 — 7 questions, 0-3 scale) and saves <br>7. Student completes Module 4 (PHQ-9 — 9 questions, 0-3 scale) and clicks "Save & Generate Report" <br>8. System sets `isSubmitting = true` and disables the submit button <br>9. System sets `sessionStorage.mindspace_assessment_submitted = 'true'` <br>10. System posts all data to `POST /api/mental-health/analyze` with JWT Bearer token <br>11. Backend validates data, calculates DASS-21/GAD-7/PHQ-9 scores and severities, determines overall risk, generates recommendations <br>12. Backend saves report to MongoDB <br>13. System navigates to `mental-report.html` using `location.replace()` <br>14. Report page clears `sessionStorage` flag and displays the report |
| **Alternate Flows** | AF1: Incomplete module → System shows validation error and does not advance <br>AF2: Network error → `isSubmitting` resets; error toast displayed; user may retry <br>AF3: Rate limit exceeded (429) → User sees "Too many submissions — please wait" message <br>AF4: Duplicate detected within 60s (409) → System returns existing `reportId` and redirects to report page |

---

**Table 2.5 — Use Case Scenario: AI Chat Session**

| Element | Description |
|---|---|
| **Use Case Number** | UC5 |
| **Application** | MindSpace — AI Support Module |
| **Use Case Name** | Conduct AI Chat Session |
| **Use Case Description** | A student engages in a mental health support conversation with the Gemini-powered AI chatbot |
| **Primary Actor** | Student |
| **Precondition** | Student is authenticated; `GOOGLE_AI_API_KEY` is configured on the backend |
| **Trigger** | Student navigates to `AI-support.html` and types a message |
| **Basic Flow** | 1. Student opens the AI Support page and sees the chat interface <br>2. Student types a message and presses Send <br>3. System displays a typing indicator <br>4. System posts message to `POST /api/ai/chat` with conversation history <br>5. Backend combines system persona prompt + history + user message and calls Gemini API <br>6. Gemini returns a response <br>7. Backend screens response for crisis indicators <br>8. System displays the AI response in the chat window <br>9. Conversation history is updated for context continuity |
| **Alternate Flows** | AF1: Crisis keywords detected → Response includes immediate helpline numbers and "Book an appointment" CTA <br>AF2: API error → System shows "AI support is temporarily unavailable. Please try again shortly." <br>AF3: Empty message → Send button remains disabled |

---

**Table 2.6 — Use Case Scenario: Mood Detection**

| Element | Description |
|---|---|
| **Use Case Number** | UC6 |
| **Application** | MindSpace — Mood Tracking Module |
| **Use Case Name** | Detect Mood via Camera |
| **Use Case Description** | A student uses the device camera to detect their current emotional state via facial expression analysis |
| **Primary Actor** | Student |
| **Precondition** | Student is authenticated; device has a camera; browser has HTTPS context |
| **Trigger** | Student navigates to `mood.html` and grants camera permission |
| **Basic Flow** | 1. Student opens the Mood page <br>2. System requests camera access using `navigator.mediaDevices.getUserMedia()` <br>3. Student grants permission <br>4. System displays live video feed from camera <br>5. TensorFlow.js model (loaded from CDN) analyzes frames in real-time <br>6. System displays the detected emotion label and confidence score (e.g., "Happy — 87%") <br>7. Student clicks "Log This Mood" <br>8. System saves the mood record to MongoDB via `POST /api/mood/add` (label, value 0-6, capturedVia: 'ai') <br>9. System updates the mood history chart |
| **Alternate Flows** | AF1: Camera denied → System shows instructions to enable camera; manual mood entry offered <br>AF2: Model fails to load → System falls back to manual 7-emotion selection buttons <br>AF3: Student uses manual entry → Student selects emotion from provided options; system logs with `capturedVia: 'manual'` |

---

## 2.8 Sequence Diagrams

**Figure 2.4 — Sequence Diagram: User Registration**

```
Student        Frontend          Backend           MongoDB         Email Service
   │               │                │                 │                  │
   │──[Fill Form]──→│                │                 │                  │
   │               │──POST /register→│                 │                  │
   │               │                │──[Validate Data] │                  │
   │               │                │──[Hash Password] │                  │
   │               │                │──Create User──→  │                  │
   │               │                │←[User Saved]─────│                  │
   │               │                │──Generate OTP────│                  │
   │               │                │──[Hash OTP, Store Expiry]           │
   │               │                │──Send Email──────────────────────→  │
   │               │                │                 │                  │
   │               │←─[Show OTP Screen]               │                  │
   │──[Enter OTP]──→│                │                 │                  │
   │               │──POST /verify──→│                 │                  │
   │               │                │──[Verify Hash]   │                  │
   │               │                │──[Set isVerified: true]─────────→  │
   │               │                │──[Issue JWT]     │                  │
   │               │←──[JWT + User]──│                 │                  │
   │←─[Redirect to Dashboard]        │                 │                  │
```

**Figure 2.5 — Sequence Diagram: Mental Health Assessment & Report Generation**

```
Student       Frontend (JS)      Backend            MongoDB
   │               │                │                  │
   │──[Open Page]──→│                │                  │
   │               │──GET /progress──→                  │
   │               │←─[Saved Modules]│                  │
   │               │──[Prefill Form] │                  │
   │──[Complete M1]→│                │                  │
   │               │──POST /progress (M1)──────────────→│
   │──[Complete M2]→│                │                  │
   │               │──POST /progress (M2)──────────────→│
   │──[Complete M3]→│                │                  │
   │               │──POST /progress (M3)──────────────→│
   │──[Complete M4]→│                │                  │
   │──[Click Submit]→               │                  │
   │               │──[Set isSubmitting=true]           │
   │               │──[Set sessionStorage flag]         │
   │               │──POST /analyze──→                  │
   │               │                │──[Idempotency Check]──────────────→│
   │               │                │──[Calculate Scores]│               │
   │               │                │──[Generate Recommendations]        │
   │               │                │──[Determine Risk]  │               │
   │               │                │──[Save Report]────→│               │
   │               │                │←─[reportId]────────│               │
   │               │←─[Success + reportId]               │               │
   │               │──[location.replace → mental-report.html]            │
   │←─[Report Page Loads + sessionStorage cleared]       │               │
```

---

---

# CHAPTER 3
# SYSTEM DESIGN

---

This chapter presents the technical design artifacts of MindSpace. The design follows a classical three-tier web application architecture with clear separation of concerns between presentation, business logic, and data persistence. All diagrams in this chapter represent the implemented system.

---

## 3.1 Architecture Diagrams

### 3.1.1 Three-Tier Architecture

**Figure 3.1 — Three-Tier Architecture of MindSpace**

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION TIER (Client)                           │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│
│  │ index.html   │ │ dashboard.html│ │mental-home.html│ │ AI-support.html     ││
│  │ (Landing)    │ │ (Dashboard)  │ │(Assessment)   │ │ (AI Chat)           ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────────────┘│
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐│
│  │ mood.html    │ │resources.html│ │mental-report  │ │ appointment.html     ││
│  │(Mood Track)  │ │(Resources)   │ │ .html (Report)│ │ (Booking)           ││
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────────────┘│
│           ↑ CSS3/Vanilla JS ↑ TF.js (CDN) ↑ jsPDF (CDN) ↑ Chart.js (CDN)  │
│  Hosted on: Vercel (Global CDN)                                              │
└─────────────────────────────────────┬────────────────────────────────────────┘
                                      │ HTTPS / REST API (JSON)
┌─────────────────────────────────────▼────────────────────────────────────────┐
│                         BUSINESS LOGIC TIER (Server)                         │
│                          Node.js + Express.js                                │
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                 │
│  │  authRoutes    │  │ mentalHealth   │  │   moodRoutes   │                 │
│  │  authController│  │  Routes/       │  │  moodController│                 │
│  └────────────────┘  │  Controller    │  └────────────────┘                 │
│  ┌────────────────┐  └────────────────┘  ┌────────────────┐                 │
│  │  aiRoutes      │  ┌────────────────┐  │ profileRoutes  │                 │
│  │  aiController  │  │appointmentRoutes│  │ profileController│               │
│  └────────────────┘  │ appointmentCtrl│  └────────────────┘                 │
│                       └────────────────┘                                    │
│  Middleware: authMiddleware (JWT) · Helmet · CORS · express-rate-limit      │
│                                                                              │
│  External Services:                                                          │
│  ┌───────────────────┐  ┌───────────────────┐                               │
│  │  Google Gemini    │  │  Nodemailer/SMTP   │                               │
│  │  (@google/gen-ai) │  │  (Email Service)   │                               │
│  └───────────────────┘  └───────────────────┘                               │
│  Hosted on: Render                                                           │
└─────────────────────────────────────┬────────────────────────────────────────┘
                                      │ Mongoose Wire Protocol (TLS)
┌─────────────────────────────────────▼────────────────────────────────────────┐
│                         DATA TIER (Database)                                 │
│                         MongoDB Atlas (Cloud)                                │
│                                                                              │
│  Collections:                                                                │
│  ┌─────────┐ ┌──────────────────────┐ ┌───────┐ ┌──────────┐ ┌──────────┐ │
│  │  users  │ │  mentalHealthReports  │ │ moods │ │ profiles │ │appoint-  │ │
│  └─────────┘ └──────────────────────┘ └───────┘ └──────────┘ │ments     │ │
│                                                                └──────────┘ │
│  Hosted on: MongoDB Atlas (M0 Free / M2 Shared cluster)                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.1.2 Component Interaction Diagram

**Figure 3.2 — Component Interaction Diagram**

```
┌─────────────┐       JWT Bearer       ┌─────────────────────────────────┐
│  Browser    │──────────────────────→ │         Express.js Server        │
│  (Student)  │                        │  ┌─────────────────────────────┐ │
│             │ ←─ JSON Response ──────│  │  authMiddleware (protect)    │ │
└─────────────┘                        │  │  Decodes JWT → req.user     │ │
                                        │  └────────────┬────────────────┘ │
┌─────────────┐                        │               ↓                  │
│ TF.js Model │  (Runs in browser,     │  ┌────────────────────────────┐  │
│ (CDN)       │   no server call)      │  │  Route Handler              │  │
└─────────────┘                        │  │  (controller function)      │  │
                                        │  └────────────┬───────────────┘  │
                                        │               ↓                  │
                                        │  ┌────────────────────────────┐  │
                                        │  │  Mongoose Model            │  │────→ MongoDB Atlas
                                        │  │  (User/Report/Mood/etc.)   │  │
                                        │  └────────────────────────────┘  │
                                        │               ↓ (if AI chat)     │
                                        │  ┌────────────────────────────┐  │
                                        │  │  @google/generative-ai     │  │────→ Gemini API
                                        │  └────────────────────────────┘  │
                                        └─────────────────────────────────┘
```

---

## 3.2 Class Diagrams

**Figure 3.3 — Class Diagram: Core Domain Objects**

```
┌─────────────────────────────────────────┐
│                   User                   │
├─────────────────────────────────────────┤
│ - _id: ObjectId                         │
│ - firstName: String [required]          │
│ - lastName: String [required]           │
│ - email: String [required, unique]      │
│ - mobile: String [required, unique]     │
│ - dob: Date [required]                  │
│ - password: String [hashed, required]   │
│ - role: Enum ['user','counselor','admin']│
│ - isVerified: Boolean [default: false]  │
│ - verificationToken: String             │
│ - verificationExpire: Date              │
│ - resetPasswordToken: String            │
│ - resetPasswordExpire: Date             │
│ - lastPasswordChange: Date              │
│ - createdAt: Date                       │
├─────────────────────────────────────────┤
│ + matchPassword(pwd): Boolean           │
│ + getResetPasswordToken(): String       │
│ + generateOTP(): String                 │
└────────────────┬────────────────────────┘
                 │ 1:N (one user has many)
      ┌──────────┼──────────────────────┐
      ↓          ↓                     ↓
┌──────────┐ ┌──────────────────────┐ ┌─────────┐
│  Mood    │ │ MentalHealthReport   │ │Appoint- │
├──────────┤ ├──────────────────────┤ │ment     │
│ user:Ref │ │ user: ObjectId[ref]  │ ├─────────┤
│ value:0-6│ │ vitals: {            │ │user:Ref │
│ label:   │ │   sleepDuration,     │ │counsel- │
│ Enum[7]  │ │   temperature }      │ │ or:Ref  │
│ notes    │ │ lifestyle: {         │ │date     │
│ captured │ │   exerciseFrequency, │ │time     │
│ Via      │ │   smokingStatus,     │ │status   │
│ created  │ │   alcoholConsumption,│ │notes    │
│ At       │ │   screenTime,        │ └─────────┘
└──────────┘ │   chronicConditions, │
             │   medications }      │
             │ dass21: {            │
             │  depression:{score,  │
             │    severity},        │
             │  anxiety:{score,     │
             │    severity},        │
             │  stress:{score,      │
             │    severity} }       │
             │ gad7:{score,severity}│
             │ phq9:{score,severity}│
             │ overallRisk: Enum    │
             │ recommendations:[{   │
             │  category, title,    │
             │  description,        │
             │  priority }]         │
             │ createdAt: Date      │
             │ reportVersion:'1.0'  │
             └──────────────────────┘
```

---

## 3.3 Data Flow Diagram

**Figure 3.4 — Level-0 DFD (Context Diagram)**

```
                       ┌─────────────────┐
                       │                 │
    Student ──────────→│                 │←──────── Counselor
         ↑             │   MindSpace     │               ↓
         └─────────────│     System      │───────────────┘
                       │                 │
    Admin ────────────→│                 │
         ↑             │                 │
         └─────────────└────────┬────────┘
                                │
                    ┌───────────┼───────────┐
                    ↓           ↓           ↓
               MongoDB     Gemini API    SMTP
               Atlas       (AI Chat)    (Email)
```

**Figure 3.5 — Level-1 DFD: System Decomposition**

```
Student ──[Registration Data]──→ [P1: Auth Manager] ──[User Record]──→ MongoDB
                                         ↓
Student ←──[JWT Token]────────────────────┘

Student ──[Assessment Responses]──→ [P2: Assessment Processor]
                                            ↓
                                   [P2.1: Score Calculator]
                                            ↓
                                   [P2.2: Risk Analyzer]
                                            ↓
                                   [P2.3: Recommendation Engine]
                                            ↓
                                   ──[Report Document]──→ MongoDB
                                            ↓
Student ←──[Report + PDF]──────────────────┘

Student ──[Chat Message]──→ [P3: AI Chat Manager] ──[Prompt]──→ Gemini API
                                      ↑                                ↓
                                 [Conversation               [AI Response]
                                  History - MongoDB]                   ↓
Student ←──[Response]──────────────────────────────────────────────────┘

Student ──[Camera Frame]──→ [P4: Mood Detector (TF.js, Client-Side)]
                                      ↓
                              [P4.1: Emotion Classifier]
                                      ↓
Student ←──[Emotion + Score]──────────┘
                ↓
         [P4.2: Mood Logger] ──[Mood Record]──→ MongoDB
```

---

## 3.4 Activity Diagrams

### 3.4.1 User Registration & Login Activity

**Figure 3.6 — Activity Diagram: Registration & Login**

```
Start → [Fill Registration Form] → <Validation OK?> 
           No ↓                         Yes ↓
        [Show Errors]        [Hash Password] → [Save User (unverified)]
            ↑                    ↓
            └──────────[Generate & Email OTP]
                                 ↓
                        [User Enters OTP]
                                 ↓
                      <OTP Valid & Not Expired?>
                         No ↓         Yes ↓
                    <Resend Requested?>  [Set isVerified: true]
                      Yes ↓  No ↓            ↓
                  [Resend] [Show Error] [Issue JWT]
                      ↑                      ↓
                      └────────────── [Redirect to Dashboard] → End
```

### 3.4.2 Mental Health Assessment Activity

**Figure 3.7 — Activity Diagram: Mental Health Assessment Flow**

```
Start → [Load Progress from API] → [Prefill Completed Modules]
              ↓
    [Display Module 1: Vitals]
              ↓
    <Module 1 Complete & Valid?>
       No ↓          Yes ↓
   [Show Errors] [Save Progress M1 to API]
                          ↓
              [Display Module 2: DASS-21]
                          ↓
             <Module 2 Complete & Valid?>
                No ↓           Yes ↓
            [Show Errors] [Save Progress M2]
                                 ↓
                 [Display Module 3: GAD-7]
                                 ↓
                <Module 3 Complete & Valid?>
                   No ↓             Yes ↓
               [Show Errors]  [Save Progress M3]
                                        ↓
                      [Display Module 4: PHQ-9]
                                        ↓
                     <Module 4 Complete & Valid?>
                        No ↓                Yes ↓
                    [Show Errors]    [Disable Submit Button]
                                     [Set sessionStorage Flag]
                                     [POST /api/mental-health/analyze]
                                              ↓
                                   <API Response 200 OK?>
                                      No ↓        Yes ↓
                                  [Show Error]  [location.replace → Report Page]
                                  [Reset Button]
                                              ↓
                                           End
```

---

## 3.5 ER Diagrams

**Figure 3.8 — ER Diagram: MindSpace Database**

```
┌──────────────┐           ┌─────────────────────────┐
│    USERS     │           │   MENTAL_HEALTH_REPORTS  │
├──────────────┤           ├─────────────────────────┤
│ _id (PK)     │──────────→│ _id (PK)                │
│ firstName    │  1 : N    │ user (FK → USERS._id)   │
│ lastName     │           │ vitals.sleepDuration     │
│ email        │           │ vitals.temperature       │
│ mobile       │           │ lifestyle.exerciseFreq   │
│ dob          │           │ lifestyle.smokingStatus  │
│ password     │           │ lifestyle.alcoholConsum  │
│ role         │           │ lifestyle.screenTime     │
│ isVerified   │           │ lifestyle.chronicCond    │
│ createdAt    │           │ lifestyle.medications    │
└──────────────┘           │ dass21.depression.score  │
       │                   │ dass21.depression.sev    │
       │                   │ dass21.anxiety.score     │
       │                   │ dass21.anxiety.sev       │
       │                   │ dass21.stress.score      │
       │                   │ dass21.stress.sev        │
       │                   │ gad7.score               │
       │                   │ gad7.severity            │
       │                   │ phq9.score               │
       │                   │ phq9.severity            │
       │                   │ overallRisk              │
       │                   │ recommendations[]        │
       │                   │ createdAt                │
       │                   │ reportVersion            │
       │                   └─────────────────────────┘
       │
       │  1 : N            ┌──────────────────────────┐
       └──────────────────→│          MOODS            │
                           ├──────────────────────────┤
                           │ _id (PK)                 │
                           │ user (FK → USERS._id)    │
                           │ value [0-6]              │
                           │ label [Enum 7 emotions]  │
                           │ notes                    │
                           │ capturedVia [manual/ai]  │
                           │ createdAt                │
                           └──────────────────────────┘
       │
       │  1 : N            ┌──────────────────────────┐
       └──────────────────→│       APPOINTMENTS        │
                           ├──────────────────────────┤
                           │ _id (PK)                 │
                           │ student (FK → USERS._id) │
                           │ counselor (FK → USERS)   │
                           │ date                     │
                           │ time                     │
                           │ status [Enum]            │
                           │ notes                    │
                           └──────────────────────────┘
       │
       │  1 : 1            ┌──────────────────────────┐
       └──────────────────→│         PROFILES          │
                           ├──────────────────────────┤
                           │ _id (PK)                 │
                           │ user (FK → USERS._id)    │
                           │ institution              │
                           │ course                   │
                           │ year                     │
                           │ profilePhoto             │
                           └──────────────────────────┘
```

---

## 3.6 Database Schema Diagrams

**Table 3.1 — MongoDB Collection Schema: Users**

| Field | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | PK (auto) | MongoDB auto-generated primary key |
| `firstName` | String | Required | User's first name |
| `lastName` | String | Required | User's last name |
| `email` | String | Required, Unique, Regex validated | Email address used for login and communication |
| `mobile` | String | Required, Unique | Indian mobile number (10 digits) |
| `dob` | Date | Required | Date of birth for age verification |
| `password` | String | Required, select:false | bcrypt hashed password (salt factor 10) |
| `role` | String | Enum: user/counselor/admin | Access control role |
| `isVerified` | Boolean | Default: false | Email verification status |
| `verificationToken` | String | — | SHA-256 hash of OTP |
| `verificationExpire` | Date | — | OTP expiry (10 minutes from generation) |
| `resetPasswordToken` | String | — | SHA-256 hash of password reset token |
| `resetPasswordExpire` | Date | — | Reset token expiry (10 minutes) |
| `lastPasswordChange` | Date | — | Timestamp of last password change |
| `createdAt` | Date | Default: Date.now | Account creation timestamp |

**Table 3.2 — MongoDB Collection Schema: MentalHealthReports**

| Field | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | PK | Report identifier |
| `user` | ObjectId | Required, ref: User | Foreign key to User collection |
| `vitals.sleepDuration` | Number | Required, 0-24 | Average daily sleep in hours |
| `vitals.temperature` | Number | Optional, 35-110 | Body temperature in Fahrenheit |
| `lifestyle.exerciseFrequency` | String | Enum | never/rarely/sometimes/often/daily |
| `lifestyle.smokingStatus` | String | Enum | never/former/current/occasional |
| `lifestyle.alcoholConsumption` | String | Enum | never/rarely/occasionally/regularly/daily |
| `lifestyle.screenTime` | Number | Optional | Daily screen time in hours |
| `lifestyle.chronicConditions` | String | Optional | Text description |
| `lifestyle.medications` | String | Optional | Current medications list |
| `dass21.depression.score` | Number | Required, 0-42 | DASS-21 Depression subscale score |
| `dass21.depression.severity` | String | Enum | normal/mild/moderate/severe |
| `dass21.anxiety.score` | Number | Required, 0-42 | DASS-21 Anxiety subscale score |
| `dass21.anxiety.severity` | String | Enum | normal/mild/moderate/severe |
| `dass21.stress.score` | Number | Required, 0-42 | DASS-21 Stress subscale score |
| `dass21.stress.severity` | String | Enum | normal/mild/moderate/severe |
| `gad7.score` | Number | Required, 0-21 | GAD-7 total score |
| `gad7.severity` | String | Enum | normal/mild/moderate/severe |
| `phq9.score` | Number | Required, 0-27 | PHQ-9 total score |
| `phq9.severity` | String | Enum | normal/minimal/mild/moderate/severe |
| `overallRisk` | String | Enum | low/moderate/high/severe |
| `recommendations` | Array | — | Array of {category, title, description, priority} |
| `createdAt` | Date | Default: Date.now | Report generation timestamp |
| `reportVersion` | String | Default: '1.0' | Schema version for forward compatibility |

*Index: `{ user: 1, createdAt: -1 }` — enables efficient retrieval of a user's most recent reports*

**Table 3.3 — MongoDB Collection Schema: Moods**

| Field | Type | Constraints | Description |
|---|---|---|---|
| `_id` | ObjectId | PK | Mood entry identifier |
| `user` | ObjectId | Required, ref: User | Foreign key to User |
| `value` | Number | Required, 0-6 | Numeric emotion code |
| `label` | String | Enum[7] | Angry/Disgust/Fear/Happy/Neutral/Sad/Surprise |
| `notes` | String | Max: 500 chars | Optional user note |
| `capturedVia` | String | Enum: manual/ai | Entry method |
| `createdAt` | Date | Default: Date.now | Timestamp |

*Index: `{ user: 1, createdAt: -1 }`*

---

---

# CHAPTER 4
# IMPLEMENTATION AND RESULTS

---

This chapter describes the actual implementation of MindSpace, the development and testing environment, interface snapshots, test cases, and quantitative results. The system was built iteratively over a period of approximately four months by a team of six, following an agile sprint model with two-week iterations.

---

## 4.1 Software and Hardware Requirements

**Table 4.1 — Software Requirements**

| Component | Software | Version | Purpose |
|---|---|---|---|
| Development OS | Windows 11 | 22H2+ | Primary development environment |
| Code Editor | Visual Studio Code | 1.85+ | Editor with ESLint, Prettier, Live Server extensions |
| Version Control | Git | 2.43+ | Source code management |
| Repository | GitHub | — | Remote repository, issue tracking, PR management |
| Backend Runtime | Node.js | 18.x LTS | JavaScript server runtime |
| Package Manager | npm | 9.x | Dependency management |
| Database GUI | MongoDB Compass | 1.41+ | Local DB inspection and query testing |
| API Testing | Postman | 10.x | Manual REST API testing |
| Browser Testing | Chrome DevTools | 120+ | Frontend debugging, network inspection, TF.js profiling |
| CI/CD | GitHub Actions | — | Automated testing and linting on PR |

**Table 4.2 — Hardware Requirements**

| Component | Minimum | Recommended |
|---|---|---|
| Processor | Intel i3 / AMD Ryzen 3 | Intel i5+ / AMD Ryzen 5+ |
| RAM | 4 GB | 8 GB+ |
| Storage | 1 GB free | 5 GB+ free (including node_modules) |
| Internet | 5 Mbps | 20 Mbps+ (for TF.js model CDN load) |
| Camera | Optional | Required for mood detection feature |
| Display | 1024×768 | 1920×1080 |

---

## 4.2 Assumptions and Dependencies

Implementation proceeded with the following assumptions validated:

- The Google Gemini API's `gemini-pro` model returned safe, contextually appropriate responses to mental health queries throughout development; the system prompt proved sufficient for domain bounding
- bcrypt with salt factor 10 completes in approximately 100ms on the deployment server — acceptable for login latency
- MongoDB Atlas M0 (free cluster) provided sufficient throughput for development and early testing; a production deployment would require M2 or M10 cluster
- The TF.js emotion recognition model (FER+/FER-2013 trained) achieved satisfactory accuracy in controlled lighting conditions; performance degrades significantly in very low-light environments (documented in limitations)

---

## 4.3 Constraints

- **Cold Starts**: Render's free tier puts containers to sleep after 15 minutes of inactivity. The first API request after a cold start takes 25-35 seconds. A client-side loading indicator on the landing page mitigates user experience impact.
- **Free Tier Rate Limits**: Google Gemini API's free tier allows 60 requests per minute. Sustained heavy usage would require a paid API plan.
- **TF.js Model Accuracy**: The facial emotion recognition model is trained on Western-centric datasets (FER-2013). Accuracy for Indian students with diverse facial characteristics may vary.
- **Email Deliverability**: Using Gmail SMTP with a standard account is subject to sending limits (500 emails/day). A production deployment would use SendGrid or AWS SES.

---

## 4.4 Implementation Details

The implementation is organized into the following primary modules:

### 4.4.1 Snapshots of Interfaces

**Figure 4.1 — Landing Page (index.html)**

The landing page presents MindSpace's value proposition with a hero section, feature highlights, statistics (anonymous), a demo mood checker, and a call-to-action. The design uses a gradient background (indigo-purple to deep blue), Poppins font family from Google Fonts, and Font Awesome 6 icons. A sticky navigation header provides access to all major sections.

**Figure 4.2 — Registration Page**

The registration form is presented as a card-style overlay on the landing page. Fields include: First Name, Last Name, Email, Mobile Number, Date of Birth, Password, and Confirm Password. Real-time inline validation is applied on field blur. On successful submission, the OTP input screen slides in without page reload.

**Figure 4.3 — Dashboard (dashboard.html)**

The authenticated dashboard displays: a personalized greeting with the user's name and current time, a quick mood check-in widget, a summary of the most recent assessment results (overall risk badge and top 3 DASS-21/GAD-7/PHQ-9 scores), a resource recommendation strip (3 items matched to last mood), and quick action buttons for all major features. Mood trend data is visualized in a Chart.js line graph covering the last 7 days.

**Figure 4.4 — Mental Health Assessment Module 1 (mental-home.html)**

Module 1 collects health and lifestyle vitals. Fields:
- Sleep Duration: HTML range slider (0-12 hours) with live value display
- Body Temperature: Optional number input (°F), placeholder-guided
- Exercise Frequency: Custom radio button group (Never / Rarely / Sometimes / Often / Daily)
- Smoking Status: Radio group
- Alcohol Consumption: Radio group
- Daily Screen Time: Optional number input
- Chronic Conditions: Free-text textarea
- Current Medications: Free-text textarea

The form does not include Blood Pressure or Heart Rate — these were removed as they require clinical measurement equipment not available to typical students.

**Figure 4.5 — Mental Health Assessment Module 2 (DASS-21)**

Twenty-one questions displayed as card-style question containers with four radio button options (0: Did not apply / 1: Applied some of the time / 2: Applied a good part of the time / 3: Applied most of the time). A sticky progress indicator at the top shows completion percentage. The submit button is hidden until all 21 questions are answered.

**Figure 4.6 — Mental Health Report (mental-report.html)**

The redesigned report page features:
- A 4-column metadata header (Patient, Generated Date, Report ID, Overall Risk badge)
- An emergency alert panel (visible only for High/Severe risk — red gradient with crisis helpline links)
- Five animated gauge cards (DASS-21 Depression, DASS-21 Anxiety, DASS-21 Stress, GAD-7, PHQ-9) — each showing the tool name, scale name, raw score/max score, an animated progress bar that sweeps in (0.9s cubic-bezier transition), four band labels (Normal/Mild/Moderate/Severe), and a colour-coded severity chip
- Health & Lifestyle Snapshot (sleep duration, temperature if provided)
- Personalised Recommendations in priority-coloured cards
- Next Steps in an icon-led step list
- A clinical disclaimer

**Table 4.3 — DASS-21 Severity Band Thresholds**

| Scale | Normal | Mild | Moderate | Severe |
|---|---|---|---|---|
| Depression | 0-9 | 10-13 | 14-20 | 21-42 |
| Anxiety | 0-7 | 8-9 | 10-14 | 15-42 |
| Stress | 0-14 | 15-18 | 19-25 | 26-42 |

**Table 4.4 — GAD-7 Severity Band Thresholds**

| Score Range | Severity |
|---|---|
| 0-4 | None (Normal) |
| 5-9 | Mild |
| 10-14 | Moderate |
| 15-21 | Severe |

**Table 4.5 — PHQ-9 Severity Band Thresholds**

| Score Range | Severity |
|---|---|
| 0-4 | None (Normal) |
| 5-9 | Minimal |
| 10-14 | Mild |
| 15-19 | Moderate |
| 20-27 | Severe |

**Figure 4.7 — AI Chat Interface (AI-support.html)**

The AI chat page presents a full-screen chat interface with a conversation panel and an input row at the bottom. The AI persona is named "MindBot" and introduces itself as a compassionate mental health support assistant. Messages are styled with avatar icons — user messages right-aligned in indigo, AI responses left-aligned in white with a subtle shadow. A typing indicator (three animated dots) is displayed while the Gemini API processes the request.

**Figure 4.8 — Mood Detection (mood.html)**

The mood page shows a camera viewfinder (using HTML5 `<video>` element) with a live overlay displaying the detected emotion and confidence percentage. Below the camera view, a mood history graph (Chart.js) shows the last 14 mood entries. Users can also manually select from 7 emotion buttons if they prefer not to use the camera.

**Figure 4.9 — Resource Library (resources.html)**

The resource library page displays cards for each resource (video, audio guide, PDF, poster) fetched from a static `resources.json` manifest. Filters are provided: by mood (Happy, Sad, Anxious, etc.), by category (Meditation, Exercise, Academic Stress, Sleep, etc.), and by format (Video, Audio, Guide). Each card includes a thumbnail, title, duration, and a "Watch/Listen/Read" button that opens an in-app media player modal.

**Figure 4.10 — Appointment Booking (appointment.html)**

The appointment page presents a calendar-style date picker and available time slots for counselors. The user selects a counselor (from a list with name, specialization, and availability), chooses a date and time, adds an optional note, and confirms the booking. Confirmed bookings appear in the "My Appointments" tab with status (Pending/Confirmed/Completed/Cancelled).

**Figure 4.11 — GitHub Actions CI Pipeline**

The CI workflow (`.github/workflows/backend-ci.yml`) triggers on push to `main` and on pull requests. It runs on an `ubuntu-latest` GitHub-hosted runner with Node.js 18.x. Steps: (1) Checkout code, (2) Install dependencies (`npm ci`), (3) Run ESLint (`npm run lint`), (4) Run Jest tests (`npm test -- --passWithNoTests`). A passing status check is displayed on every PR.

---

### 4.4.2 Test Cases

**Table 4.6 — Test Cases: Authentication Module**

| TC# | Test Case | Input | Expected Output | Result |
|---|---|---|---|---|
| TC-A01 | Valid Registration | All valid fields | User created, OTP email sent, OTP screen shown | ✅ Pass |
| TC-A02 | Duplicate Email | Existing email address | 400 error: "Email already registered" | ✅ Pass |
| TC-A03 | Invalid Email Format | `user@` | Inline validation error shown | ✅ Pass |
| TC-A04 | Password < 6 chars | `pass` | Inline validation error shown | ✅ Pass |
| TC-A05 | Mismatched passwords | `pass123` / `pass456` | Inline validation error shown | ✅ Pass |
| TC-A06 | Valid OTP Entry | Correct 6-digit OTP | Account verified, JWT issued, redirect to dashboard | ✅ Pass |
| TC-A07 | Invalid OTP | Wrong 6 digits | Error: "Invalid or expired OTP" | ✅ Pass |
| TC-A08 | Expired OTP | OTP after >10 mins | Error: "OTP has expired" | ✅ Pass |
| TC-A09 | Valid Login | Correct email + password | JWT issued, redirect to dashboard | ✅ Pass |
| TC-A10 | Invalid Password | Correct email, wrong password | 401 error: "Invalid credentials" | ✅ Pass |
| TC-A11 | Unverified Account Login | Correct credentials, unverified | 401 error: "Please verify your email first" | ✅ Pass |
| TC-A12 | Password Reset Flow | Valid email → OTP → New password | Password updated, old JWT invalidated | ✅ Pass |

---

**Table 4.7 — Test Cases: Mental Health Assessment Module**

| TC# | Test Case | Input | Expected Output | Result |
|---|---|---|---|---|
| TC-M01 | Incomplete Module 1 | Missing sleep duration | Validation error shown, cannot advance | ✅ Pass |
| TC-M02 | Valid Module 1 | Sleep: 7hrs, exercise: often | Progress saved to MongoDB | ✅ Pass |
| TC-M03 | Progress Persistence | Close browser, reopen | Previous modules pre-filled | ✅ Pass |
| TC-M04 | Complete Assessment | All 4 modules filled | Report generated, redirected to report page | ✅ Pass |
| TC-M05 | Double-click Submit | Two rapid clicks | Only one API call made (isSubmitting guard) | ✅ Pass |
| TC-M06 | Back Button After Submit | Press Back after submission | Redirected to report page (sessionStorage guard) | ✅ Pass |
| TC-M07 | Refresh After Submit | Refresh assessment page | Redirected to report page (sessionStorage guard) | ✅ Pass |
| TC-M08 | Rate Limit (4th request) | 4 POSTs within 10 mins | 429 Too Many Requests | ✅ Pass |
| TC-M09 | Duplicate within 60s | 2 POSTs 30 seconds apart | 2nd request returns 409 with existing reportId | ✅ Pass |
| TC-M10 | Score Calculation | DASS-21 all 3s | Depression=42, Anxiety=42, Stress=42, all Severe | ✅ Pass |
| TC-M11 | Score Calculation | All 0s | All Normal | ✅ Pass |
| TC-M12 | Overall Risk | PHQ-9 Severe, rest Normal | Overall Risk = Severe | ✅ Pass |

---

**Table 4.8 — Test Cases: Mood Detection Module**

| TC# | Test Case | Input | Expected Output | Result |
|---|---|---|---|---|
| TC-D01 | Camera Permission Granted | Allow in browser | Live feed shown, emotion detection active | ✅ Pass |
| TC-D02 | Camera Permission Denied | Deny in browser | Fallback to manual emotion buttons | ✅ Pass |
| TC-D03 | Happy Face Detection | Happy facial expression | "Happy" label with >70% confidence | ✅ Pass |
| TC-D04 | Manual Mood Log | Click "Sad" button | Mood saved: label=Sad, capturedVia=manual | ✅ Pass |
| TC-D05 | AI Mood Log | Click "Log This Mood" on camera view | Mood saved: label=detected, capturedVia=ai | ✅ Pass |
| TC-D06 | Mood History | Log 5 entries | Chart.js graph updates with all 5 | ✅ Pass |

---

**Table 4.9 — Test Cases: Anti-Duplication Submission Guard**

| TC# | Scenario | Layer Tested | Expected Behaviour | Result |
|---|---|---|---|---|
| TC-G01 | Normal submission | All layers | One report created | ✅ Pass |
| TC-G02 | Double-click button | Layer 1 (isSubmitting flag) | Second click ignored | ✅ Pass |
| TC-G03 | Back button after submit | Layer 2 (sessionStorage) | Redirected to report page | ✅ Pass |
| TC-G04 | Refresh assessment page | Layer 2 (sessionStorage) | Redirected to report page | ✅ Pass |
| TC-G05 | Direct API POST (4th attempt) | Layer 3a (rate limiter) | 429 response | ✅ Pass |
| TC-G06 | Direct API POST (60s window) | Layer 3b (idempotency check) | 409 response with existing reportId | ✅ Pass |
| TC-G07 | New session after report view | sessionStorage clear | Can start new assessment | ✅ Pass |

---

### 4.4.3 Results

**Performance Metrics (Lighthouse — Deployed Production Build):**

| Metric | Score |
|---|---|
| Performance | 94 |
| Accessibility | 98 |
| Best Practices | 100 |
| SEO | 97 |

**API Response Times (Average over 100 test requests):**

| Endpoint | Average Latency |
|---|---|
| `POST /api/auth/register` | 280ms |
| `POST /api/auth/login` | 95ms |
| `POST /api/mental-health/analyze` | 220ms |
| `GET /api/mental-health/reports` | 80ms |
| `POST /api/ai/chat` (Gemini) | 1,200ms |
| `POST /api/mood/add` | 70ms |
| `GET /health` | 15ms |

**Assessment Accuracy Validation:**

Score calculation functions were validated against the official DASS-21, GAD-7, and PHQ-9 scoring manuals. Ten sample responses (5 normal, 5 clinical severity) were manually scored and cross-referenced with system output. All 10 produced identical results, confirming scoring implementation accuracy.

**CI Pipeline Results (GitHub Actions):**

The backend CI pipeline executes in approximately 45-60 seconds on a GitHub-hosted ubuntu-latest runner:
- `npm ci`: ~15 seconds
- `npm run lint` (ESLint): ~5 seconds  
- `npm test` (Jest): ~8 seconds
- Total: ~28-35 seconds (excl. runner spin-up)

As of the latest push to `main`, the CI pipeline shows a ✅ passing status on all three steps.

---

---

# CHAPTER 5
# CONCLUSIONS

---

## 5.1 Performance Evaluation

MindSpace successfully delivers on its primary objectives. The platform is live, accessible, and functionally complete across all Phase 1 deliverables. A quantitative summary of performance outcomes:

**Correctness**: All 12 authentication test cases, 12 assessment test cases, 6 mood detection test cases, and 7 anti-duplication guard test cases pass. Score calculation for DASS-21, GAD-7, and PHQ-9 is validated against official clinical scoring manuals with 100% accuracy.

**Performance**: Lighthouse performance score of 94/100. The frontend achieves First Contentful Paint (FCP) in under 1.5 seconds on a 4G connection, meeting Google's "Good" threshold. Backend API response times average under 300ms for all database operations, with the only exception being the Gemini AI API call (~1.2 seconds) — well within acceptable limits for a conversational interface where 1-2 seconds is standard.

**Security**: All endpoints requiring authentication are protected by the `authMiddleware` JWT validation. Passwords are hashed with bcrypt (salt factor 10). HTTP headers are hardened by Helmet.js. CORS restricts cross-origin requests to the production frontend origin. The API key for Google Gemini is never exposed to the client. The global rate limiter (1000 req/15min) and the assessment-specific rate limiter (3 req/10min per user) provide protection against automated abuse.

**Reliability**: The anti-duplication submission guard successfully prevents duplicate report generation across three attack surfaces: double-click, back-button/refresh, and direct API calls. Zero duplicate reports were created in any test scenario.

**Code Quality**: ESLint (flat config, v9) reports zero errors on the backend codebase. GitHub Actions CI enforces this on every PR, preventing regressions.

**Usability**: The four-module assessment form with progress persistence reduces abandonment — users who close the browser mid-assessment can resume exactly where they left off. The animated gauge visualizations on the report page reduce the cognitive effort required to interpret clinical scores.

---

## 5.2 Comparison with Existing State-of-the-Art Technologies

**Table 5.1 — Comparison with Existing Mental Health Platforms**

| Feature | MindSpace | BetterHelp | Wysa | iCall (TISS) | Headspace |
|---|---|---|---|---|---|
| Target Users | Students (India) | General Adults | General | Students/All | General |
| Cost | Free | ₹5,000-15,000/month | Freemium | Free (call) | ₹700/month |
| Clinical Screening (DASS-21/GAD-7/PHQ-9) | ✅ | ❌ | ❌ | ❌ | ❌ |
| AI Chatbot | ✅ (Gemini) | ❌ | ✅ (CBT) | ❌ | ❌ |
| Camera Mood Detection | ✅ | ❌ | ❌ | ❌ | ❌ |
| Personalised Report + PDF | ✅ | ❌ | ❌ | ❌ | ❌ |
| Resource Library | ✅ | ❌ | ✅ | ❌ | ✅ |
| Appointment Booking | ✅ | ✅ | ❌ | ✅ (Call) | ❌ |
| India-specific Helplines | ✅ | ❌ | ❌ | ✅ | ❌ |
| Anonymous Usage | ✅ | ❌ | ✅ | ✅ | ❌ |
| Open Source | ✅ | ❌ | ❌ | ❌ | ❌ |
| Progressive Web App | ✅ | ❌ | ✅ | ❌ | ✅ |
| Deployed Live | ✅ | ✅ | ✅ | ✅ | ✅ |

MindSpace is the only platform in this comparison that integrates clinically validated self-assessment tools (DASS-21, GAD-7, PHQ-9) with an AI chatbot, camera-based mood detection, and personalized reporting in a single, free, open-source application targeting the Indian student population.

**Limitations of MindSpace compared to Commercial Platforms:**

1. **No Licensed Therapist Access**: BetterHelp and iCall provide access to licensed human therapists. MindSpace provides AI-augmented support and appointment booking but not direct platform-mediated therapy sessions.
2. **AI Accuracy Boundaries**: Wysa's CBT-based chatbot has undergone clinical validation in peer-reviewed studies. MindSpace's Gemini-powered chatbot has not been clinically validated in randomised trials.
3. **Mood Detection Bias**: The TF.js emotion recognition model is trained on FER-2013, a dataset with known demographic biases. Clinical-grade emotion recognition systems (e.g., from Affectiva) use much larger, more diverse training datasets.
4. **Scalability**: At current hosting tier (Vercel/Render free), the platform is suitable for hundreds of concurrent users. A deployment targeting thousands of simultaneous users would require paid tiers and potentially a load-balanced backend.

---

## 5.3 Future Directions

The MindSpace project has been designed with extensibility as a core architectural principle. The following directions represent planned and potential future development:

**Phase 2 (Near-Term — 6-12 months):**

1. **Mobile Application (React Native)**: A cross-platform mobile app would improve accessibility and enable push notification delivery for daily mood check-ins, appointment reminders, and personalized wellness tips. The existing REST API backend requires no changes — the mobile app would be an additional frontend client.

2. **Peer Support Community**: A moderated, anonymous peer support forum or group chat would allow students to share experiences and support each other — a feature validated by research as highly effective for reducing stigma and improving help-seeking behavior. Socket.io is already listed in the planned dependencies.

3. **Wearable Device Integration**: Integration with consumer wearables (Fitbit, Apple Watch, Mi Band) would enable passive, continuous physiological data collection (heart rate variability, sleep quality, activity levels) to complement self-reported data and improve assessment accuracy.

4. **Group Therapy Booking**: Expanding the appointment system to support scheduled group therapy sessions with a single counselor and multiple students — reducing per-student cost and increasing throughput.

5. **Institution SSO Integration**: Enabling login via institutional email credentials (OAuth 2.0 / SAML) would remove the registration barrier for students and allow institutions to provision access at scale.

**Phase 3 (Medium-Term — 1-2 years):**

6. **Multi-Language Support**: Localizing the platform to Hindi, Bengali, Tamil, Telugu, and other major Indian languages would dramatically expand accessibility beyond English-comfortable students.

7. **Advanced Predictive Analytics**: Using historical mood and assessment data to build predictive models that flag students at elevated risk of acute mental health crises — enabling proactive counselor outreach before a student reaches a crisis point.

8. **Research Collaboration Tools**: De-identified, aggregated data from platform assessments could be made available (with explicit user consent) to academic researchers studying student mental health trends in India, contributing to a currently sparse evidence base.

9. **Gamification and Achievement System**: Evidence from behavioral health literature suggests that gamification (streaks, achievement badges, progress milestones) significantly improves engagement and long-term usage of wellness apps. A points system for consistent mood logging and resource consumption is planned.

**Phase 4 (Long-Term — 3+ years):**

10. **VR/AR Therapy Experiences**: Immersive virtual environments for guided meditation, exposure therapy for social anxiety, and relaxation training represent the frontier of digital mental health interventions. As consumer VR hardware becomes more accessible, the platform architecture could support VR session delivery.

11. **Insurance Integration**: In the long term, integration with health insurance providers (both public schemes like PMJAY and private insurers) could enable coverage reimbursement for counseling sessions booked through the platform.

12. **Improved Emotion Recognition**: Retraining the mood detection model on a demographically diverse Indian dataset would significantly improve accuracy. Collaboration with institutions for ethical, consented data collection is a prerequisite.

In conclusion, MindSpace represents a technically sound, clinically informed, and practically deployed foundation for a scalable student mental health platform. It fills a genuine and urgent gap in the Indian higher education ecosystem and is designed to grow — module by module, feature by feature — into a comprehensive institutional mental health infrastructure.

---

---

# APPENDIX A
# API ENDPOINT REFERENCE

All endpoints require an `Authorization: Bearer <jwt_token>` header unless marked as **Public**.

## Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user account |
| POST | `/api/auth/verify-otp` | Public | Verify email OTP |
| POST | `/api/auth/login` | Public | Login with email and password |
| POST | `/api/auth/logout` | Private | Invalidate session |
| POST | `/api/auth/forgot-password` | Public | Request password reset email |
| POST | `/api/auth/reset-password/:token` | Public | Reset password using token |
| GET | `/api/auth/me` | Private | Get current authenticated user |

## Mental Health Assessment (`/api/mental-health`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/mental-health/analyze` | Private | Submit full assessment and generate report |
| GET | `/api/mental-health/reports` | Private | List all reports for current user |
| GET | `/api/mental-health/reports/:id` | Private | Get a specific report by ID |
| POST | `/api/mental-health/email-report` | Private | Email a report to the user |
| GET | `/api/mental-health/reports/:id/pdf` | Private | Download report as PDF |
| GET | `/api/mental-health/progress` | Private | Get saved module progress |
| POST | `/api/mental-health/progress` | Private | Save module progress |
| DELETE | `/api/mental-health/progress/clear` | Private | Clear all saved progress |

## Mood Tracking (`/api/mood`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/mood/add` | Private | Log a new mood entry |
| GET | `/api/mood/history` | Private | Get mood history (last N entries) |
| GET | `/api/mood/summary` | Private | Get mood statistics summary |

## AI Chat (`/api/ai`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/chat` | Private | Send message and receive AI response |
| GET | `/api/ai/history` | Private | Get conversation history |
| DELETE | `/api/ai/clear` | Private | Clear conversation history |

## Appointments (`/api/appointments`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/appointments/counselors` | Private | List available counselors |
| POST | `/api/appointments/book` | Private | Book a new appointment |
| GET | `/api/appointments/my` | Private | Get user's appointments |
| PUT | `/api/appointments/:id/cancel` | Private | Cancel an appointment |

## Profile (`/api/user/profile`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/user/profile` | Private | Get user profile |
| PUT | `/api/user/profile` | Private | Update user profile |
| POST | `/api/user/profile/photo` | Private | Upload profile photo |

## Settings (`/api/settings`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| PUT | `/api/settings/password` | Private | Change account password |
| PUT | `/api/settings/notifications` | Private | Update notification preferences |
| DELETE | `/api/settings/account` | Private | Delete user account and all data |

## System

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | Public | System health check |
| GET | `/api/config` | Public | Get frontend configuration URLs |

---

---

# APPENDIX B
# ENVIRONMENT CONFIGURATION REFERENCE

## Backend Environment Variables (`.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `5001` | Port on which the backend server listens |
| `NODE_ENV` | No | `development` | Environment mode (development/production) |
| `MONGODB_URI` | **Yes** | — | MongoDB Atlas connection string |
| `JWT_SECRET` | **Yes** | — | Secret key for JWT signing (≥32 characters recommended) |
| `JWT_EXPIRE` | No | `7d` | JWT token expiry duration |
| `GOOGLE_AI_API_KEY` | Yes* | — | Google Gemini API key (*AI features disabled if absent) |
| `EMAIL_USER` | No | — | SMTP email address for outgoing mail |
| `EMAIL_PASS` | No | — | SMTP email app password |
| `EMAIL_SERVICE` | No | `gmail` | Email service provider |
| `ALLOWED_ORIGINS` | No | `http://localhost:3000` | Comma-separated list of allowed CORS origins |
| `FRONTEND_URL` | No | — | Primary frontend URL (fallback for CORS) |
| `BACKEND_API_URL` | No | `http://localhost:5001` | Backend URL served to frontend via /api/config |
| `ML_SERVICE_URL` | No | `http://localhost:5000/predict_emotion` | Python ML service URL (Phase 2) |

## Frontend Environment Variables (`.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_URL` | No | — | Backend API URL (overrides config endpoint) |

## GitHub Actions CI Variables (Repository Secrets — Optional)

| Variable | Purpose |
|---|---|
| `MONGODB_URI_TEST` | Test database URI for integration testing |
| `JWT_SECRET_TEST` | JWT secret for test environment |

> **Security Note**: Never commit `.env` files to version control. The `.gitignore` file in this repository explicitly excludes `*.env` and `.env*` patterns. All secrets are managed through environment variable configuration in the deployment platform dashboards (Render, Vercel).

---

---

# REFERENCES

[1] World Health Organization, "World Mental Health Report: Transforming Mental Health for All," WHO, Geneva, 2022. [Online]. Available: https://www.who.int/publications/i/item/9789240049338

[2] A. S. Reddy, "A Study on Depression, Anxiety and Stress among College Students," *Indian Journal of Psychiatry*, vol. 61, no. 3, pp. 294-298, 2019.

[3] T. Rajgopal, "Mental Well-being at the Workplace," *Indian Journal of Occupational and Environmental Medicine*, vol. 14, no. 3, pp. 63-65, 2010.

[4] K. Fitzpatrick, A. Darcy, and M. Vierhile, "Delivering Cognitive Behavior Therapy to Young Adults With Symptoms of Depression and Anxiety Using a Fully Automated Conversational Agent (Woebot): A Randomized Controlled Trial," *JMIR Mental Health*, vol. 4, no. 2, e19, 2017.

[5] J. Apolinario-Hagen, M. Mierau, and T. Hennemann, "Public Acceptance of Smartphone-Based Mental Health Interventions in Germany: A Cross-Sectional Online Survey," *JMIR mHealth and uHealth*, vol. 5, no. 8, e8, 2017.

[6] S. L. Happy and A. Routray, "Automatic Facial Expression Recognition Using Features of Salient Facial Patches," *IEEE Transactions on Affective Computing*, vol. 6, no. 1, pp. 1-12, 2015.

[7] S. Li and W. Deng, "Deep Facial Expression Recognition: A Survey," *IEEE Transactions on Affective Computing*, vol. 13, no. 3, pp. 1195-1215, 2020.

[8] P. Lovibond and S. Lovibond, "The Structure of Negative Emotional States: Comparison of the Depression Anxiety Stress Scales (DASS) with the Beck Depression and Anxiety Inventories," *Behaviour Research and Therapy*, vol. 33, no. 3, pp. 335-342, 1995.

[9] R. L. Spitzer, K. Kroenke, J. B. W. Williams, and B. Löwe, "A Brief Measure for Assessing Generalized Anxiety Disorder," *Archives of Internal Medicine*, vol. 166, no. 10, pp. 1092-1097, 2006.

[10] K. Kroenke, R. L. Spitzer, and J. B. W. Williams, "The PHQ-9: Validity of a Brief Depression Severity Measure," *Journal of General Internal Medicine*, vol. 16, no. 9, pp. 606-613, 2001.

[11] MongoDB Inc., "MongoDB Documentation," 2024. [Online]. Available: https://docs.mongodb.com/

[12] OpenJS Foundation, "Node.js Documentation," 2024. [Online]. Available: https://nodejs.org/en/docs/

[13] OpenJS Foundation, "Express.js Documentation," 2024. [Online]. Available: https://expressjs.com/en/guide/

[14] Google LLC, "Google Generative AI Documentation — Gemini API," 2024. [Online]. Available: https://ai.google.dev/docs

[15] TensorFlow Team, "TensorFlow.js Documentation," 2024. [Online]. Available: https://www.tensorflow.org/js/

[16] Vercel Inc., "Vercel Documentation," 2024. [Online]. Available: https://vercel.com/docs

[17] Auth0, "Introduction to JSON Web Tokens," 2024. [Online]. Available: https://jwt.io/introduction

[18] ESLint Team, "ESLint Documentation — Flat Config," 2024. [Online]. Available: https://eslint.org/docs/latest/

[19] GitHub Inc., "GitHub Actions Documentation," 2024. [Online]. Available: https://docs.github.com/en/actions

[20] Smart India Hackathon Organizing Committee, "SIH 2024 Problem Statements — Student Mental Health," Ministry of Education, Government of India, 2024. [Online]. Available: https://www.sih.gov.in/

---

*End of Report*

---

**MindSpace — Where Technology Meets Compassion**
*Version 1.0.0 | MindSpace Warriors | Smart India Hackathon 2024*
