# AI Intent Assistant - Testing Checklist

## Pre-Testing Setup

### Backend API Verification
- [ ] Confirm backend server is running
- [ ] Verify endpoint availability:
  - [ ] `POST /api/assistant/intent` returns 200
  - [ ] `POST /api/assistant/execute` returns 200
  - [ ] `GET /api/assistant/session/:sessionId` returns 200
  - [ ] `GET /api/assistant/job/:jobId` returns 200
- [ ] Test with sample payloads using Postman/curl
- [ ] Verify CORS is configured for frontend origin

---

## Phase 8: Testing & Verification

### 1. Complete User Journey Testing

#### Test Case 1: First-Time User Flow
**Steps:**
1. [ ] Open browser in incognito mode
2. [ ] Navigate to `/dashboard`
3. [ ] Verify assistant icon is visible (bottom-right, pulsing)
4. [ ] Upload an image file
5. [ ] **Expected:** Assistant auto-opens with welcome message
6. [ ] Type: "I want to check if this is recent"
7. [ ] **Expected:** Workflow card appears with recommended steps
8. [ ] Click "Run Workflow" button
9. [ ] **Expected:** Toast shows "Workflow started!" with estimated time
10. [ ] Verify results appear in main content area

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 2: Session Persistence
**Steps:**
1. [ ] Have a conversation with assistant (3-4 messages)
2. [ ] Note the workflow recommendation shown
3. [ ] Refresh the page (F5)
4. [ ] **Expected:** Conversation history is restored
5. [ ] **Expected:** Workflow card is still visible
6. [ ] Open browser DevTools → Application → Local Storage
7. [ ] Verify `assistant_session_*` and `assistant_last_session` keys exist

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 3: Clarifying Questions
**Steps:**
1. [ ] Upload media
2. [ ] Type an ambiguous message: "I need to verify this"
3. [ ] **Expected:** Assistant asks clarifying question with options
4. [ ] Click one of the option buttons
5. [ ] **Expected:** Selected option is sent as user message
6. [ ] **Expected:** Assistant responds with appropriate workflow

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 4: Error Handling
**Steps:**
1. [ ] Disconnect from internet / Stop backend server
2. [ ] Try to send a message
3. [ ] **Expected:** Toast error: "I'm having trouble connecting..."
4. [ ] **Expected:** Error message appears in conversation
5. [ ] Reconnect internet / Start backend
6. [ ] Send another message
7. [ ] **Expected:** Works normally

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 5: Error Boundary
**Steps:**
1. [ ] Open browser DevTools → Console
2. [ ] Trigger an error (modify component to throw error in dev mode)
3. [ ] **Expected:** Error boundary UI appears with "Assistant Error" message
4. [ ] **Expected:** "Reset Assistant" and "Dismiss" buttons visible
5. [ ] Click "Reset Assistant"
6. [ ] **Expected:** Page reloads, assistant session cleared
7. [ ] Verify localStorage is cleared

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

### 2. Mobile Responsive Behavior

#### Test Case 6: Mobile Layout (< 768px)
**Devices to test:** iPhone 12, Samsung Galaxy S21, iPad Mini

**Steps:**
1. [ ] Open `/dashboard` on mobile device or Chrome DevTools mobile emulator
2. [ ] **Expected:** Assistant icon visible in bottom-right
3. [ ] Tap assistant icon
4. [ ] **Expected:** Panel slides up from bottom, takes full width
5. [ ] **Expected:** Backdrop overlay appears (semi-transparent black)
6. [ ] Tap backdrop
7. [ ] **Expected:** Assistant closes
8. [ ] Re-open assistant
9. [ ] Swipe down on panel
10. [ ] **Expected:** Assistant closes

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 7: Tablet Layout (768px - 1024px)
**Devices to test:** iPad, iPad Pro

**Steps:**
1. [ ] Open `/dashboard` on tablet
2. [ ] **Expected:** Assistant icon visible
3. [ ] Tap icon
4. [ ] **Expected:** Panel slides from right, 400px width
5. [ ] **Expected:** Main content remains visible (no overlay)
6. [ ] Verify workflow cards display properly
7. [ ] Test scrolling in conversation view

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 8: Touch Interactions
**Steps:**
1. [ ] On mobile, tap assistant icon
2. [ ] Type a message using on-screen keyboard
3. [ ] **Expected:** Input box expands properly
4. [ ] **Expected:** Keyboard doesn't cover input
5. [ ] Tap send button
6. [ ] **Expected:** Message sends, keyboard stays open
7. [ ] Long-press on workflow card
8. [ ] **Expected:** No unexpected behavior

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

### 3. Accessibility Compliance

#### Test Case 9: Keyboard Navigation
**Steps:**
1. [ ] Open `/dashboard`
2. [ ] Press `Tab` repeatedly
3. [ ] **Expected:** Focus moves through page elements
4. [ ] **Expected:** Assistant icon receives focus with visible outline
5. [ ] Press `Enter` on focused assistant icon
6. [ ] **Expected:** Assistant opens
7. [ ] Press `Esc`
8. [ ] **Expected:** Assistant closes
9. [ ] Re-open assistant, type message
10. [ ] Press `Enter`
11. [ ] **Expected:** Message sends
12. [ ] Press `Shift + Enter`
13. [ ] **Expected:** New line in textarea

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 10: Screen Reader Support
**Tools:** NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)

**Steps:**
1. [ ] Enable screen reader
2. [ ] Navigate to `/dashboard`
3. [ ] **Expected:** Assistant icon announced as "Open verification assistant"
4. [ ] Activate assistant
5. [ ] **Expected:** Panel announced with role="complementary"
6. [ ] **Expected:** Header announced: "Verification Assistant"
7. [ ] Send a message
8. [ ] **Expected:** New messages announced via aria-live="polite"
9. [ ] Navigate to workflow card
10. [ ] **Expected:** All step details are readable
11. [ ] **Expected:** Buttons have descriptive labels

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 11: Color Contrast
**Tools:** Chrome DevTools Lighthouse, WAVE browser extension

**Steps:**
1. [ ] Run Lighthouse accessibility audit
2. [ ] **Expected:** No color contrast errors
3. [ ] Check user message bubble (indigo on white text)
4. [ ] **Expected:** Contrast ratio ≥ 4.5:1
5. [ ] Check assistant message bubble
6. [ ] **Expected:** Contrast ratio ≥ 4.5:1
7. [ ] Test in dark mode
8. [ ] **Expected:** All text remains readable

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 12: Focus Management
**Steps:**
1. [ ] Open assistant
2. [ ] Verify focus moves to input box
3. [ ] Press `Tab`
4. [ ] **Expected:** Focus moves to send button
5. [ ] Press `Tab` again
6. [ ] **Expected:** Focus moves to close button
7. [ ] **Expected:** Focus trapped within panel (doesn't escape to page)
8. [ ] Close assistant with Esc
9. [ ] **Expected:** Focus returns to assistant icon

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

### 4. Performance Optimization

#### Test Case 13: Load Time
**Tools:** Chrome DevTools Performance tab, Lighthouse

**Steps:**
1. [ ] Open DevTools → Performance
2. [ ] Reload `/dashboard`
3. [ ] Record performance
4. [ ] **Expected:** Assistant components load in < 500ms
5. [ ] Run Lighthouse performance audit
6. [ ] **Expected:** Performance score ≥ 90
7. [ ] Check bundle size
8. [ ] **Expected:** Assistant code < 50KB gzipped

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 14: Memory Leaks
**Tools:** Chrome DevTools Memory profiler

**Steps:**
1. [ ] Open DevTools → Memory
2. [ ] Take heap snapshot
3. [ ] Open/close assistant 10 times
4. [ ] Take another heap snapshot
5. [ ] **Expected:** Memory increase < 5MB
6. [ ] Check for detached DOM nodes
7. [ ] **Expected:** No significant detached nodes

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 15: Scroll Performance
**Steps:**
1. [ ] Have a long conversation (20+ messages)
2. [ ] Scroll up and down in conversation view
3. [ ] **Expected:** Smooth 60fps scrolling
4. [ ] Open DevTools → Rendering → FPS meter
5. [ ] **Expected:** No frame drops during scroll
6. [ ] Test auto-scroll when new message arrives
7. [ ] **Expected:** Smooth animation

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

### 5. Smart Nudges Testing

#### Test Case 16: Auto-Open on Upload
**Steps:**
1. [ ] Navigate to `/dashboard`
2. [ ] Verify assistant is closed
3. [ ] Upload an image file
4. [ ] **Expected:** Assistant auto-opens immediately
5. [ ] **Expected:** Welcome message appears
6. [ ] **Expected:** Media uploaded indicator shows in input box

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 17: Idle Timer
**Steps:**
1. [ ] Upload media
2. [ ] Close assistant
3. [ ] Wait 15 seconds without interaction
4. [ ] **Expected:** Toast notification: "Need help deciding the next step?"
5. [ ] **Expected:** Assistant icon pulses brighter
6. [ ] Move mouse or click anywhere
7. [ ] **Expected:** Timer resets
8. [ ] Wait another 15 seconds
9. [ ] **Expected:** Notification appears again

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

### 6. Cross-Browser Testing

#### Test Case 18: Browser Compatibility
**Browsers to test:** Chrome, Firefox, Safari, Edge

| Browser | Version | Pass/Fail | Notes |
|---------|---------|-----------|-------|
| Chrome  | Latest  | [ ]       |       |
| Firefox | Latest  | [ ]       |       |
| Safari  | Latest  | [ ]       |       |
| Edge    | Latest  | [ ]       |       |

**Steps for each browser:**
1. [ ] Open `/dashboard`
2. [ ] Upload media
3. [ ] Send messages
4. [ ] View workflow cards
5. [ ] Test animations
6. [ ] Test keyboard navigation
7. [ ] Check console for errors

---

### 7. Edge Cases

#### Test Case 19: Empty States
**Steps:**
1. [ ] Open assistant without uploading media
2. [ ] **Expected:** Welcome message with suggestions
3. [ ] Try to run workflow without media
4. [ ] **Expected:** Toast error: "Please upload media before running a workflow"

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 20: Long Messages
**Steps:**
1. [ ] Type a very long message (500+ characters)
2. [ ] **Expected:** Textarea expands properly
3. [ ] Send message
4. [ ] **Expected:** Message displays with proper wrapping
5. [ ] Verify scrolling works

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

#### Test Case 21: Rapid Interactions
**Steps:**
1. [ ] Open/close assistant rapidly (10 times)
2. [ ] **Expected:** No visual glitches
3. [ ] Send 5 messages in quick succession
4. [ ] **Expected:** All messages appear in order
5. [ ] **Expected:** No duplicate messages

**Pass/Fail:** ___________  
**Notes:** ___________________________________________

---

## Summary

### Overall Results
- **Total Test Cases:** 21
- **Passed:** _____
- **Failed:** _____
- **Blocked:** _____

### Critical Issues Found
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

### Minor Issues Found
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

### Recommendations
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

---

## Sign-Off

**Tested By:** ___________________________________________  
**Date:** ___________________________________________  
**Environment:** ___________________________________________  
**Backend Version:** ___________________________________________  

**Ready for Production:** [ ] Yes  [ ] No  [ ] With Conditions

**Conditions (if applicable):**
___________________________________________
___________________________________________
___________________________________________
