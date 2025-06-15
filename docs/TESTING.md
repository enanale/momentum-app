# Manual Testing Plan for Momentum App

## Overview
This document outlines step-by-step test cases for the Momentum app's functionality. Each test case includes prerequisites, steps to execute, and expected results.

## Test Environment Setup
- Modern web browser (Chrome/Firefox/Safari)
- Valid Google account for authentication
- Clean browser state (no cached data)
- Development server running (`npm run dev`)

## 1. Authentication Flow

### 1.1 Sign In
**Prerequisites:**
- User is not signed in
- App is loaded at homepage

**Steps:**
1. Observe the initial state
   - Should see "Welcome to Momentum - Your New Web App"
   - Should see "Sign in with Google" button
2. Click "Sign in with Google" button
3. Complete Google authentication flow

**Expected Results:**
- User is redirected back to app
- Navbar shows user's avatar
- "Sign in" button is replaced with "Sign out"
- Main content shows personalized greeting with user's first name
- Daily Operating Doc dashboard is displayed
- "I'm Stuck" button appears in bottom-right corner

### 1.2 Sign Out
**Prerequisites:**
- User is signed in

**Steps:**
1. Click the "Sign out" button in navbar

**Expected Results:**
- User is signed out
- Welcome screen is displayed
- "Sign in with Google" button appears
- "I'm Stuck" button disappears
- Daily Operating Doc is hidden

## 2. "I'm Stuck" Flow

### 2.1 Button Appearance
**Prerequisites:**
- User is signed in

**Steps:**
1. Observe the "I'm Stuck" button:
   - Position (fixed to bottom-right)
   - Gradient background
   - Icon and text
   - Shadow effect
2. Hover over the button
3. View on different screen sizes

**Expected Results:**
- Button is always visible in bottom-right corner
- Shows hand icon followed by "I'm Stuck" text
- Gradient animates on hover
- Button remains accessible on mobile
- Text and icon are properly aligned

### 2.2 Opening the Form
**Prerequisites:**
- User is signed in

**Steps:**
1. Click the "I'm Stuck" button in bottom-right corner

**Expected Results:**
- Modal dialog opens
- Dialog shows "Let's Get Unstuck" title
- Stepper shows 3 steps: Acknowledge, Define the Void, Next Action
- First step (Acknowledge) is active
- "Next" button is enabled

### 2.3 Completing the Form
**Prerequisites:**
- "I'm Stuck" dialog is open

**Steps:**
1. On Acknowledge step:
   - Read the acknowledgment text
   - Click "Next"
2. On Define the Void step:
   - Enter "Complete project documentation" in Void title
   - Enter "Need to document API endpoints" in description
   - Click "Next"
3. On Next Action step:
   - Enter "Create new docs/API.md file" as next action
   - Click "Start Action"

**Expected Results:**
- Form progresses through each step
- Each step shows appropriate content and fields
- Form submits successfully
- Dialog closes
- New action appears in Daily Operating Doc

### 2.4 Form Navigation
**Prerequisites:**
- "I'm Stuck" dialog is open

**Steps:**
1. On Acknowledge step:
   - Click "Back" button (should not be visible)
   - Click "Cancel" button
2. Reopen dialog and proceed to Define the Void step:
   - Click "Back" button
   - Click "Next" button again
3. On Next Action step:
   - Click "Back" button
   - Click "Next" button
   - Click "Cancel" button

**Expected Results:**
- Back button only appears after first step
- Back button returns to previous step
- Cancel button always closes dialog
- Dialog state resets when reopened

### 2.5 Form Validation
**Prerequisites:**
- "I'm Stuck" dialog is open

**Steps:**
1. On Define the Void step:
   - Leave title empty
   - Click "Next"
2. On Next Action step:
   - Leave action description empty
   - Click "Start Action"

**Expected Results:**
- Form should prevent progression without title
- Form should prevent submission without action description
- Appropriate error messages should be shown

### 2.6 Form State Reset
**Prerequisites:**
- "I'm Stuck" dialog is open
- Form partially filled out

**Steps:**
1. Fill out Void title and description
2. Click "Cancel"
3. Reopen dialog
4. Navigate through steps

**Expected Results:**
- All form fields should be empty
- No previous data should persist

## 3. Daily Operating Doc

### 3.1 Viewing Actions
**Prerequisites:**
- User is signed in
- At least one next action exists

**Steps:**
1. Observe the Daily Operating Doc section
2. Note the display of action items

**Expected Results:**
- Shows "Today's Next Actions" title
- Lists all uncompleted actions for today
- Each action shows:
  - Checkbox
  - Action description
  - Estimated time

### 3.2 Action Display
**Prerequisites:**
- User is signed in
- Multiple actions exist with different estimated times

**Steps:**
1. Observe action list items
2. Note the display of:
   - Action description
   - Checkbox state
   - Estimated time in minutes
3. Verify text styling:
   - Uncompleted actions in primary color
   - Completed actions struck through and grayed out

**Expected Results:**
- Each action shows complete information
- Estimated time appears on the right side
- Text styling reflects action state correctly
- List items are properly aligned and spaced

### 3.3 Action Sorting
**Prerequisites:**
- User is signed in
- Mix of completed and uncompleted actions

**Steps:**
1. Complete an action in the middle of the list
2. Observe list order
3. Refresh page
4. Add new action
5. Observe where it appears in the list

**Expected Results:**
- Completed actions move to bottom (if implemented)
- New actions appear at top of uncompleted section
- Order persists after refresh

### 3.4 Completing Actions
**Prerequisites:**
- User is signed in
- At least one uncompleted action exists

**Steps:**
1. Click the checkbox next to an action
2. Observe the action's appearance
3. Refresh the page

**Expected Results:**
- Checkbox becomes checked
- Action text is struck through
- Action persists as completed after refresh
- Completed action moves to bottom of list (if implemented)

### 3.5 Empty State
**Prerequisites:**
- User is signed in
- No actions exist for today

**Steps:**
1. Observe the Daily Operating Doc section

**Expected Results:**
- Shows "No actions planned for today" message
- Shows prompt to click "I'm Stuck" to get started

## 4. Edge Cases and Error Handling

### 4.1 Error Notifications
**Prerequisites:**
- User is signed in
- Actions exist in list

**Steps:**
1. Trigger errors by:
   - Completing action with invalid ID
   - Fetching actions with invalid user ID
   - Submitting malformed action data
2. Observe error handling:
   - Console messages
   - UI feedback
   - Data state consistency

**Expected Results:**
- Appropriate error messages shown to user
- Failed operations don't corrupt UI state
- Console logs contain error details
- Data remains consistent

### 4.2 Network Issues
**Prerequisites:**
- User is signed in
- Network connection can be disabled

**Steps:**
1. Disable network connection
2. Try to:
   - Submit new void entry
   - Complete an action
   - Sign out

**Expected Results:**
- Appropriate error messages shown
- UI remains responsive
- Data consistency maintained
- Operations retry or fail gracefully

### 4.2 Form Interactions
**Prerequisites:**
- "I'm Stuck" dialog is open

**Steps:**
1. Click outside dialog area
2. Press Escape key
3. Try tabbing through form fields
4. Press Enter in text fields

**Expected Results:**
- Clicking outside should not close dialog (intentional UX decision)
- Escape key should close dialog
- Tab navigation should work as expected
- Enter in text fields should not submit form

### 4.3 Data Loading
**Prerequisites:**
- User is signed in
- Multiple actions exist

**Steps:**
1. Refresh the page
2. Observe loading states

**Expected Results:**
- Loading indicators shown while data fetches
- Smooth transition to loaded content
- No UI jumps or flashes

## 5. Cross-browser Testing
Repeat core flows (authentication, void creation, action completion) in:
- Chrome
- Firefox
- Safari
- Mobile browsers

## 6. Responsive Design
Test layout and functionality at:
- Desktop (1920x1080)
- Laptop (1366x768)
- Tablet (768x1024)
- Mobile (375x667)

Verify:
- All content is readable
- Buttons are tappable
- Forms are usable
- No horizontal scrolling
- "I'm Stuck" button remains accessible

## Reporting Issues
When reporting bugs, include:
1. Test case number/name
2. Steps to reproduce
3. Expected vs actual result
4. Browser/device details
5. Screenshots if applicable

## Test Data Reset
To reset test data:
1. Sign out
2. Clear browser data
3. Delete test documents from Firestore (if needed)
