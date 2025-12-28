# On-Call Runbook: Real Estate Trust Platform

**Target Audience:** Verification Team & System Administrators
**System Status:** Beta (Local Development)

## 1. Role Definitions
The "On-Call User" generally refers to a member of the **Verification Team** or an **Admin** responsible for maintaining platform integrity and unblocking users.

| Role | Permissions | Key Responsibilities |
| :--- | :--- | :--- |
| **Admin** (`ADMIN`) | Full Access | User management, system config, escalation point. |
| **Verifier** (`VERIFICATION_TEAM`) | Verification Portal | Reviewing and approving/rejecting property listings. |

## 2. Core Workflows

### A. Property Verification (Daily Routine)
Properties are **hidden** from the public until approved.

1.  **Trigger**: New property submitted by Seller (Status: `PENDING`).
2.  **Action**:
    *   Navigate to **[Verification Portal](http://localhost:3000/admin/verification)**.
    *   Review the pending cards.
    *   **Checks**:
        *   Is the title/description professional?
        *   Are the images valid (no inappropriate content)?
        *   Does the price/area seem realistic?
    *   **Decision**:
        *   **Approve**: Click "Approve" -> Status becomes `APPROVED` -> Visible on Search.
        *   **Reject**: Enter reason -> Click "Reject" -> Status becomes `REJECTED` -> Seller notified (on dashboard).

### B. User Support (KYC Issues)
*Currently, KYC verification is manual via database or test endpoints.*

1.  **Issue**: User cannot list property because "KYC Login" required.
2.  **Diagnosis**: Check [User](file:///Users/vishnuvini/freelance/real-estate-platform/web/app/actions/register.ts#13-50) record in database. `kycStatus` must be `APPROVED`.
3.  **Resolution (Dev/Test)**:
    *   Use the database seed or manual SQL update to set `kycStatus = 'APPROVED'`.

## 3. Emergency & Testing Access (Seed Data)
Use these pre-configured accounts to verify system health or reproduce reported issues.

**Universal Password**: `AdminSecurePass2025!`

*   **Admin Access**: Login as `9000000001`
*   **Verifier Access**: Login as `9000000004`
*   **Seller Access**: Login as `9000000003` (Has pending/approved properties)

## 4. Troubleshooting Common Issues

### Issue: "Approve" button doesn't work
*   **Symptom**: Click button, spinner shows, but nothing happens.
*   **Cause**: Likely a network timeout or database lock.
*   **Fix**: Refresh page. Check server logs for `PrismaClientKnownRequestError`.

### Issue: Images not loading
*   **Cause**: `public/uploads` directory might be missing or permissions issue.
*   **Check**: Ensure `public/uploads/properties` exists and is writable.
