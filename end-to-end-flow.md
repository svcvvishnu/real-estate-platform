Understood 👍
Below is a **clear, end-to-end system view focused ONLY up to registration and verification**, exactly as you asked.
This can be treated as **Phase-1 scope** of your product.

---

# End-to-End Flow: Registration to Verification

## (Broker-less Property Platform – Phase 1)

---

## 1. Scope of This Phase

This document covers **everything from user onboarding until successful verification**, including:

* User registration
* Login
* KYC submission
* KYC verification
* Property submission
* Property verification

❌ **Excluded from this phase**:

* Buying / selling flow
* Payments / deposits
* Negotiation
* Transaction closure

---

## 2. Actors Involved

### External Users

* Buyer
* Seller / Lessor
  (Same account type, different actions)

### Internal Platform Teams

* KYC Verification Team
* Property Verification Team
* Admin

---

## 3. High-Level End-to-End Flow

```
User Registration
      ↓
User Login
      ↓
KYC Submission
      ↓
KYC Verification
      ↓
User Approved
      ↓
Property / Land Submission (Seller)
      ↓
Property Verification
      ↓
Verified Listing Ready
```

---

## 4. User Registration Flow

### 4.1 Registration Entry Points

* Mobile Application
* Web Application

### 4.2 Registration Details

User provides:

* Mobile number (OTP based)
* Email (optional but recommended)

### 4.3 Registration Rules

* One mobile number = one account
* Registration is **incomplete** until KYC is approved

---

## 5. Login Flow

* User logs in using:

  * Mobile number + OTP
* On first login:

  * User is redirected to **KYC submission**
* Without KYC approval:

  * User cannot list property
  * User cannot show interest

---

## 6. KYC Submission Flow (Mandatory)

### 6.1 KYC Details Collected

* Full Name
* Email ID
* Address (basic)
* One government ID (any one):

  * Aadhaar Card
  * PAN Card
  * Driving License
  * Passport

### 6.2 Uploads

* ID document image / PDF
* Self-declaration checkbox

### 6.3 KYC Status

* Submitted
* Approved
* Rejected (with reason)

---

## 7. KYC Verification Flow (Internal Team)

### 7.1 KYC Team Access

* Separate internal login
* Can view:

  * User details
  * Uploaded documents

### 7.2 Verification Actions

* Approve KYC
* Reject KYC with comments

### 7.3 Outcomes

* **Approved** → User becomes “Verified User”
* **Rejected** → User notified to re-submit

🔒 Buyer and seller identities are **never visible to other users**

---

## 8. Post-KYC User State

Once KYC is approved:

* User can:

  * Browse listings
  * Submit property / land (if seller)
* User is assigned:

  * Platform User ID (internal reference)

---

## 9. Property / Land Submission Flow (Seller Only)

### 9.1 Seller Eligibility

* Only KYC-approved users can submit property

### 9.2 Seller Selects

* Purpose:

  * Sell
  * Lease
* Type:

  * Property
  * Land

### 9.3 Property Details Collected

* Location (map pin)
* Area (sq ft / acres)
* Expected price
* Property / land category
* Images
* Ownership documents

### 9.4 Submission State

* Draft
* Submitted for verification
* Approved
* Rejected

---

## 10. Property Verification Flow (Internal Team)

### 10.1 Property Verification Team Access

* Separate login
* Access limited to:

  * Property details
  * Ownership documents
* No buyer visibility

### 10.2 Verification Checks

* Document completeness
* Duplicate listing check
* Basic ownership validation

### 10.3 Verification Outcomes

* **Approved**:

  * Listing marked as “Verified”
  * Ready to be shown to buyers (without seller identity)
* **Rejected**:

  * Seller notified with reason
  * Seller can resubmit

---

## 11. Data Visibility Rules (Critical)

| Data             | Buyer | Seller | Platform Team |
| ---------------- | ----- | ------ | ------------- |
| User identity    | ❌     | ❌      | ✅             |
| KYC documents    | ❌     | ❌      | ✅             |
| Property details | ✅     | ✅      | ✅             |
| Owner identity   | ❌     | ❌      | ✅             |

---

## 12. Security & Compliance (Phase-1)

* Encrypted storage for KYC documents
* Role-based access control
* Activity logs for:

  * KYC approvals
  * Property approvals
* No data sharing between users

---

## 13. Phase-1 Completion Criteria

Phase-1 is considered complete when:

* Users can register and log in
* KYC can be submitted and verified
* Properties can be submitted and verified
* Only verified users and listings exist in the system

---

## 14. Phase-1 Outcome

At the end of this phase, the platform has:

* A pool of **verified users**
* A catalog of **verified properties / land**
* Zero brokers
* Full privacy preserved

---

If you want, next I can:

* Convert this into a **PRD (Product Requirements Doc)**
* Create **API endpoints for registration & verification**
* Draw **sequence diagrams**
* Prepare **Phase-2 (buy/sell/lease + payments)**

Just tell me what you want next.
