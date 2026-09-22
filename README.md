# FortiVexa: Cybercrime Cash-Out Prediction & Interception Portal

This is the duplicate copy 

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-orange.svg)](https://sih.gov.in)
[![Problem Statement ID](https://img.shields.io/badge/Problem%20Statement-SIH26184-blue.svg)](https://sih.gov.in)
[![Ministry](https://img.shields.io/badge/Sponsoring%20Ministry-Ministry%20of%20Home%20Affairs%20(MHA)-green.svg)](https://mha.gov.in)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20TailwindCSS%20%7C%20Express%20%7C%20Leaflet-teal.svg)](#technology-stack)

> **Problem Statement ID: SIH26184**  
> *"Predictive Analytics Framework for Cybercrime Complaints to Forecast Likely Cash Withdrawal Locations in Advance, Enabling Generation of Actionable Intelligence for Timely and Proactive Cybercrime Intervention."*  
> **Sponsoring Organization:** Ministry of Home Affairs (MHA)  
> **Theme:** Blockchain & Cybersecurity  

---

## 🛡️ Overview

**FortiVexa** is a specialized law-enforcement intelligence command console built for Cybercrime Cell officers and the Indian Cybercrime Coordination Centre (I4C).

When financial cyber fraud occurs, fraudsters rapidly disperse siphoned money across a multi-layered network of **mule bank accounts** before withdrawing physical cash at ATMs or bank branches. FortiVexa analyzes incoming cybercrime complaints, cleanses telemetry, reconstructs the multi-hop mule trail, and executes a geospatial-temporal ML prediction model to **forecast where and when the cash withdrawal is likely to happen**, enabling quick-response tactical teams to intercept withdrawals before the funds vanish into the cash economy.

---

## 🌟 Key Features

### 1. Restricted Cyber Command Access (Login)
- Dark Navy & cyber-circuit command aesthetic designed for government & law enforcement operations.
- Operational wing routing (*I4C*, *State Cyber Crime Police*, *Bank Fraud Liaison*).

### 2. Live Executive Dashboard
- **Real-Time KPIs**: Total Complaints Today, Active Mule Chains Tracked, High-Risk Predictions Pending, Cases Intercepted (with preserved fund analytics).
- **Interactive Visualizations (Recharts)**:
  - 24-Hour Siphoned Fund Velocity Wave.
  - Cybercrime Taxonomy Distribution (Digital Arrest, Crypto Ponzi, Job Scams, SIM Swap, Electricity Bill Phishing, etc.).
- **Live NCRP Complaint Ingestion Feed**: Searchable, filterable table with direct case launch into the analysis workflow.

### 3. Guided 6-Step Detection Workflow Wizard
- **Step 1 — Complaint Intake**: Complainant dossier, bank account details, IFSC code, and narrative modus operandi.
- **Step 2 — Automated Data Cleaning & Standardization**: Real-time validation checklist (IFSC route validation, NCRP deduplication, entity normalization, telecom tower triangulation) with a live terminal audit log.
- **Step 3 — Multi-Hop Mule Account Graph**: Interactive directed node-edge visualization tracking fund flow from Victim $\rightarrow$ Mule L1 $\rightarrow$ Mule L2 $\rightarrow$ Target ATM with transaction amounts, timestamps, and a Forensics Dossier panel.
- **Step 4 — Geospatial & Temporal ML Prediction Engine**: Ranked ATM withdrawal targets with confidence percentage bars, predicted withdrawal time windows, and nearest police QRT units.
- **Step 5 — Risk Map Visualization**: Leaflet map with OpenStreetMap tiles, color-coded risk markers (**Red** $\ge 80\%$, **Orange** $\ge 65\%$, **Yellow**), and interactive popups.
- **Step 6 — Actionable Intelligence & Alert Generation**: Formal tactical dispatch advisory memo with a prominent **"Mark as Intercepted"** action button that dynamically updates state across the entire platform.

### 4. Tactical Alerts Registry
- Filterable registry of active tactical broadcasts (*Pending*, *Under Watch*, *Intercepted*) with rapid status toggling.

### 5. Pan-India Hotspots View
- Macro map visualization consolidating high-risk withdrawal ATM clusters across major Indian metropolitan hubs (Delhi-NCR, Mumbai, Bengaluru, Hyderabad, Kolkata, Ahmedabad, Jaipur, Lucknow).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite 6, TailwindCSS 3
- **Icons & Graphics**: Lucide React
- **Charting**: Recharts
- **Geospatial Mapping**: Leaflet (with OpenStreetMap tiles — zero API keys required)
- **Backend**: Node.js, Express (REST API with mutable in-memory mock store)
- **Process Orchestration**: Concurrently (single command startup)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/gurutanishkj/fortivexa2.git
   cd fortivexa2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the application (single command)**:
   ```bash
   npm run dev
   ```


## 📊 Mock Data Schema

The prototype ships with 8 realistic, simulated cyber fraud cases covering major fraud vectors across India:
- `CMP-2026-8941`: Digital Arrest / Police Impersonation (Noida, UP)
- `CMP-2026-8942`: Cryptocurrency Investment Ponzi (Mumbai, MH)
- `CMP-2026-8943`: Part-time Job / YouTube Task Ponzi (Bengaluru, KA)
- `CMP-2026-8944`: Electricity Bill Phishing / Fake APK (Hyderabad, TS)
- `CMP-2026-8945`: Loan App Extortion & Defamation (Kolkata, WB)
- `CMP-2026-8946`: KYC Update Phishing Link (Jaipur, RJ)
- `CMP-2026-8947`: Customs Parcel Extortion Scam (Lucknow, UP)
- `CMP-2026-8948`: SIM Swap & Net Banking Takeover (Ahmedabad, GJ)

---

## ⚖️ License & Disclaimer

This project is developed as an academic and technological prototype for the **Smart India Hackathon 2026** under the problem statement issued by the Ministry of Home Affairs. All bank names, entity profiles, and account numbers are simulated and for demonstration purposes only.
