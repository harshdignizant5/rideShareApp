# Digni Ride Documentation

## 1. Problem Statement

In urban areas, a large number of motorcycles commute daily with **empty seats**, while many people travel alone on **similar routes at the same time**.

This results in:

- Inefficient use of existing vehicles
- Increased traffic congestion
- Higher fuel consumption
- Limited affordable and fast commute options for short distances

Despite the presence of ride-sharing platforms, there is **no simple solution focused on motorcycle-based ride sharing**, which is often the fastest mode of transport in dense cities.

---

## 2. Core Idea

Digni Ride is a motorcycle ride-sharing application that allows users to:

- **Create a ride** when they are already traveling on a bike
- **Join a nearby ride** as a passenger if their route matches

There are **no predefined user roles**.

A user automatically becomes a rider when creating a ride and a passenger when joining one.

The experience is designed to be **simple, fast, and flexible**.

---

## 3. Problem It Solves

- Underutilisation of motorcycle capacity
- Lack of short-distance, low-cost ride options
- Urban traffic and fuel inefficiency
- Time wasted in finding quick local transport
- Improves vehicle utilisation
- Reduces travel cost
- Helps lower traffic congestion
- Encourages eco-friendly commuting

---

## 4. How We Approached the Idea

Our approach was guided by **simplicity and feasibility within a hackathon timeframe**.

Key decisions:

- Focused on **motorcycles only** (one empty seat)
- Built around **location-based matching**
- Designed a **clear ride lifecycle**:
  - Open → Matched → Completed
- Prioritised essential flows over advanced features

We followed an **iterative MVP-first mindset**, ensuring the core experience worked end-to-end before adding enhancements.

---

## 5. User Flow

![User Flow Diagram](diagram-export-new.png)

> _Note: Diagram image reference updated to standard markdown. Please ensure `diagram-export-new.png` is in the repository._

---

## 6. AI Tools Used to Build the MVP

We leveraged AI tools to speed up development and improve quality:

- **Google AI Studio**
  - Project structure and features understanding
  - Application flow and requirements
- **Github Copilot Agents (Bmad method)**
  - Backend architecture planning
  - API design and validations
  - Prisma + PostgreSQL schema design
  - PostGIS-based geospatial query logic
- **AI Design Tools**
  - Figma AI for mobile application screens
  - Landing page structure and copywriting with ChatGPT and Antigravity
- **Eraser AI**
  - User flow diagram using single prompt
- **AI-Assisted Debugging**
  - Fixing authentication flows
  - Improving query performance
  - Refining user experience and edge cases

AI allowed us to **focus more on product thinking and system design** rather than boilerplate coding.

---

## 7. Challenges Faced During Implementation

- **Geospatial filtering**

  Implementing accurate distance-based ride matching required integrating PostGIS with Prisma and handling raw SQL queries.

- **JWT logout handling**

  Immediate token invalidation was challenging due to JWT’s stateless nature, requiring a blacklist-based approach.

- **State management complexity**

  Ensuring correct transitions between ride states (Open → Matched → Completed) without edge-case failures.

---

## 8. Future Scope

Digni Ride is designed to be **scalable beyond the MVP**. Future enhancements include:

### 🔐 User KYC

- Government ID verification
- License validation for riders
- Increased trust and safety

### 💰 Revenue Model

- Platform commission per ride
- Subscription plans for frequent riders
- Sponsored rides or ads

### ⭐ Reputation System

- Aggregated user ratings
- Trust score for riders and passengers
- Abuse reporting mechanism

### 💬 Communication

- In-app chat between rider and passenger
- Emergency contact and SOS features

---

## 9. 🛠️ Installation & Running

Follow these steps to set up and run the Digni Ride mobile application locally.

### Prerequisites

- **Node.js** (v18 or newer recommended)
- **Yarn** package manager
- **React Native CLI** development environment setup:
  - [Android Setup](https://reactnative.dev/docs/environment-setup?guide=native&platform=android) (Java SDK, Android Studio)
  - [iOS Setup](https://reactnative.dev/docs/environment-setup?guide=native&platform=ios) (Mac only: Xcode, CocoaPods)

### 1. Clone & Install Dependencies

Clone the repository and install the NPM packages:

```bash
# Clone the repo (if you haven't already)
git clone https://github.com/harshdignizant5/rideShareApp.git
cd rideShareApp

# Install dependencies
yarn install
```

### 2. iOS Specific Setup (Mac Only)

If you are developing for iOS, you need to install the native pods:

```bash
cd ios
pod install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory to configure the application. You can refer to the example below:

**`.env`**:

```env
API_URL=https://digni-ride-backend-production.up.railway.app/api/v1
```

### 4. Running the App

First, start the Metro bundler:

```bash
yarn start
```

Then, in a separate terminal, launch the app on your desired platform:

**For Android:**

```bash
yarn android
```

**For iOS:**

```bash
yarn ios
```

---

## 10. Team Members

- Keval kikani - Mobile Application Developer
- Harsh Chitaliya - Mobile Application Developer
- Raj Parmar - Backend Developer
- Harish Taskar - Backend Developer
- Parth Patel - QA

## 11. Source Code

- Mobile Application: [https://github.com/harshdignizant5/rideShareApp.git](https://github.com/harshdignizant5/rideShareApp.git)
- Application Backend: [https://github.com/harishtaskar/digni-ride-backend](https://github.com/harishtaskar/digni-ride-backend)
- Application Landing Page: [https://github.com/harishtaskar/digni-ride-landing](https://github.com/harishtaskar/digni-ride-landing)

## 12. Test Cases

- [Google Sheets Test Cases](https://docs.google.com/spreadsheets/d/1ZWynPJywTjvwZAnJeaujzEh7RSdE0d91g0OpNMyPJ0w/edit?gid=591602876#gid=591602876)
