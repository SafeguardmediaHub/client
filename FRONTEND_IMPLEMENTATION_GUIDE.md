# Frontend Implementation Guide - AI Intent Assistant

## Overview

This guide provides detailed instructions for implementing the **right-side AI Intent Assistant panel** that guides users through verification workflows. The backend API is ready - this document covers the frontend UI/UX implementation.

---

## Design Philosophy

### What This Is
A **ChatGPT-style assistant panel** that:
- Helps users understand which tools to use
- Recommends verification workflows
- Explains what each tool does and why it matters
- **Never blocks the main UI**

### What This Is NOT
- Not a modal or popup that interrupts workflow
- Not an AI that runs tools or interprets results
- Not a replacement for the existing feature menu

---

## UI Layout & Structure

### Dashboard Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header / Navigation                                          │
├──────────────┬──────────────────────────────┬───────────────┤
│              │                              │               │
│  Features    │   Main Content Area          │  Assistant    │
│  Menu        │   (Recent uploads,           │  Panel        │
│  (Left)      │    verification results,     │  (Right)      │
│              │    tool outputs)             │               │
│  - Metadata  │                              │  [Collapsed   │
│  - Tamper    │                              │   or Open]    │
│  - Reverse   │                              │               │
│  - Timeline  │                              │               │
│  - Geo       │                              │               │
│  - etc.      │                              │               │
│              │                              │               │
└──────────────┴──────────────────────────────┴───────────────┘
```

### Assistant Panel States

**1. Collapsed State**
- Floating icon on right edge
- Subtle pulse glow animation
- Width: 60px
- Shows notification badge if there's a pending recommendation

**2. Expanded State**
- Slides out from right
- Width: 400px (desktop), 100% (mobile)
- Does not push main content (overlay on mobile, sidebar on desktop)

---

## Component Structure

### 1. AssistantPanel (Container)

```tsx
<AssistantPanel>
  <AssistantHeader />
  <ConversationView>
    {messages.map(msg => (
      msg.role === 'user' 
        ? <UserMessage /> 
        : <AssistantMessage />
    ))}
  </ConversationView>
  <InputBox />
</AssistantPanel>
```

### 2. AssistantHeader

**Elements:**
- Assistant avatar/icon
- Title: "Verification Assistant"
- Minimize button
- Status indicator (thinking, ready, error)

**Design:**
- Background: Subtle gradient
- Border-bottom: 1px solid divider color
- Height: 64px

### 3. ConversationView

**Scrollable message list:**
- Auto-scroll to bottom on new messages
- Smooth scroll animation
- Loading indicator when AI is thinking

**Message Types:**
- User messages (right-aligned, user color)
- Assistant text messages (left-aligned, assistant color)
- Workflow cards (special component)
- Clarifying questions (with option buttons)

### 4. WorkflowCard Component

**Critical Component** - This displays recommended workflows.

**Structure:**
```tsx
<WorkflowCard>
  <WorkflowHeader>
    <WorkflowName />
    <TotalCost />
    <TotalTime />
  </WorkflowHeader>
  
  <WorkflowExplanation />
  
  <StepsList>
    {steps.map(step => (
      <StepCard>
        <StepIcon />
        <StepName />
        <StepWhy />
        <StepLimitation />
        <StepMetrics />
      </StepCard>
    ))}
  </StepsList>
  
  <WorkflowActions>
    <RunWorkflowButton />
    <CustomizeButton />
  </WorkflowActions>
</WorkflowCard>
```

**Design Specs:**
- Card background: Elevated surface
- Border-radius: 12px
- Padding: 16px
- Box-shadow: Subtle elevation
- Each step has an icon representing the tool
- Use arrow (→) between steps to show flow

**Step Card Design:**
```
┌────────────────────────────────────────┐
│ 🔍 Metadata Extraction                 │
│                                        │
│ Why: Extracts EXIF data, timestamps   │
│                                        │
│ ⚠️ Limitation: Metadata can be edited │
│                                        │
│ ⏱️ 5-10 seconds | 💰 Free             │
└────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────┐
│ 🌐 Reverse Image Lookup                │
│ ...                                    │
```

### 5. InputBox

**Elements:**
- Text input (multiline, auto-expand)
- Send button
- File attachment indicator (if media uploaded)
- Character count (optional)

**Behavior:**
- Disabled when AI is thinking
- Shows "Thinking..." placeholder during processing
- Enter to send, Shift+Enter for new line

---

## User Flows

### Flow 1: First-Time User

**Trigger:** User logs in for the first time

**Steps:**
1. Dashboard loads
2. Assistant icon visible but collapsed (with subtle pulse)
3. User uploads an image
4. Assistant auto-opens with message:
   > "Tell me what you're trying to verify and I'll pick the right tools."
5. User types: "I want to check if this is recent"
6. Assistant shows workflow card
7. User clicks "Run Workflow"
8. Existing tool pipeline executes
9. Results displayed in main content area

### Flow 2: Experienced User (Direct Tool Access)

**Trigger:** User clicks "Reverse Lookup" directly from features menu

**Steps:**
1. Tool opens in main area
2. Assistant whispers (non-intrusive notification):
   > "Are you trying to confirm originality, recency, or location? This helps me guide you."
3. User can ignore or respond
4. If user responds, assistant suggests complementary tools

### Flow 3: Idle User

**Trigger:** User sits idle for ~15 seconds after uploading media

**Steps:**
1. Assistant icon pulses slightly brighter
2. Small tooltip appears: "Need help deciding the next step?"
3. User can click to open assistant
4. Assistant asks: "What would you like to verify about this content?"

---

## Smart Nudge Moments (When to Auto-Open)

### A. On File Upload
```typescript
onFileUpload(file) {
  // Auto-open assistant
  openAssistant();
  
  // Send system message
  addMessage({
    role: 'assistant',
    content: 'Tell me what you\'re trying to verify and I\'ll pick the right tools.'
  });
}
```

### B. On Random Tool Click (Optional Nudge)
```typescript
onToolClick(toolName) {
  // Don't block - let tool open
  openTool(toolName);
  
  // Gentle assistant nudge (non-blocking)
  if (!assistantOpen) {
    showTooltip('The assistant can help you combine tools for better results');
  }
}
```

### C. On Idle (Gentle Reminder)
```typescript
let idleTimer;

onUserActivity() {
  clearTimeout(idleTimer);
  
  if (hasUploadedMedia && !hasStartedVerification) {
    idleTimer = setTimeout(() => {
      pulseAssistantIcon();
      showTooltip('Need help deciding the next step?');
    }, 15000); // 15 seconds
  }
}
```

---

## API Integration

### 1. Analyze Intent

```typescript
async function analyzeIntent(message: string, mediaId?: string) {
  const response = await fetch('/api/assistant/intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      message,
      media_id: mediaId,
      session_id: currentSessionId
    })
  });
  
  const data = await response.json();
  
  if (data.response.type === 'workflow') {
    displayWorkflowCard(data.response.content);
  } else if (data.response.type === 'question') {
    displayClarifyingQuestion(data.response.content);
  } else {
    displayMessage(data.response.content.message);
  }
  
  // Store session ID for continuity
  currentSessionId = data.session_id;
}
```

### 2. Execute Workflow

```typescript
async function executeWorkflow(workflowId: string, mediaId: string) {
  const response = await fetch('/api/assistant/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      session_id: currentSessionId,
      workflow_id: workflowId,
      media_id: mediaId
    })
  });
  
  const data = await response.json();
  
  // Show job status
  displayJobStatus(data.job_id, data.estimated_time);
  
  // Poll for results (or use WebSocket if available)
  pollJobStatus(data.job_id);
}
```

### 3. Session Management

```typescript
async function loadSession(sessionId: string) {
  const response = await fetch(`/api/assistant/session/${sessionId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const session = await response.json();
  
  // Restore conversation
  setMessages(session.messages);
  
  // Restore recommended workflow if exists
  if (session.recommended_workflow) {
    displayWorkflowCard(session.recommended_workflow);
  }
}
```

---

## State Management

### Session State

```typescript
interface AssistantState {
  isOpen: boolean;
  isThinking: boolean;
  sessionId: string | null;
  messages: Message[];
  currentWorkflow: WorkflowRecommendation | null;
  mediaContext: {
    mediaId?: string;
    mediaType?: 'image' | 'video';
  };
}
```

### Message Types

```typescript
type Message = 
  | { role: 'user'; content: string; timestamp: Date }
  | { role: 'assistant'; content: string; timestamp: Date }
  | { role: 'assistant'; type: 'workflow'; content: WorkflowRecommendation }
  | { role: 'assistant'; type: 'question'; content: ClarifyingQuestion };
```

---

## Design System

### Colors

**Assistant Theme:**
- Primary: `#6366F1` (Indigo)
- Surface: `#F8FAFC` (Light mode), `#1E293B` (Dark mode)
- Text: `#0F172A` (Light mode), `#F1F5F9` (Dark mode)
- Border: `#E2E8F0` (Light mode), `#334155` (Dark mode)

**Message Bubbles:**
- User: `#6366F1` background, white text
- Assistant: `#F1F5F9` background (light), `#334155` (dark), dark text

**Workflow Card:**
- Background: White (light), `#1E293B` (dark)
- Border: `#E2E8F0` (light), `#475569` (dark)
- Elevation: `0 4px 6px -1px rgba(0, 0, 0, 0.1)`

### Typography

**Assistant Messages:**
- Font: System font stack
- Size: 14px
- Line-height: 1.5
- Weight: 400 (regular)

**Workflow Card:**
- Title: 18px, weight 600
- Explanation: 14px, weight 400
- Step name: 16px, weight 500
- Step details: 13px, weight 400

### Spacing

- Panel padding: 16px
- Message spacing: 12px between messages
- Workflow card padding: 16px
- Step card padding: 12px
- Input box padding: 12px

### Animations

**Panel Slide:**
```css
.assistant-panel {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.assistant-panel.collapsed {
  transform: translateX(100%);
}

.assistant-panel.expanded {
  transform: translateX(0);
}
```

**Pulse Animation (Icon):**
```css
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.7);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 0 10px rgba(99, 102, 241, 0);
  }
}

.assistant-icon.has-suggestion {
  animation: pulse 2s infinite;
}
```

**Thinking Indicator:**
```css
@keyframes thinking {
  0%, 80%, 100% { opacity: 0; }
  40% { opacity: 1; }
}

.thinking-dot {
  animation: thinking 1.4s infinite;
}

.thinking-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.thinking-dot:nth-child(3) {
  animation-delay: 0.4s;
}
```

---

## Accessibility

### Keyboard Navigation
- `Esc` to close assistant panel
- `Tab` to navigate through workflow steps
- `Enter` on "Run Workflow" button to execute
- Focus trap when panel is open

### Screen Readers
- Announce when assistant opens
- Announce when new messages arrive
- Label all interactive elements
- Provide alt text for tool icons

### ARIA Attributes
```html
<div role="complementary" aria-label="Verification Assistant">
  <div role="log" aria-live="polite" aria-atomic="false">
    <!-- Messages appear here -->
  </div>
  <input aria-label="Ask the assistant" />
</div>
```

---

## Mobile Considerations

### Responsive Behavior

**Desktop (>768px):**
- Panel slides from right
- Width: 400px
- Does not overlay main content

**Mobile (<768px):**
- Panel takes full width
- Slides up from bottom
- Overlays main content with backdrop
- Swipe down to close

### Touch Interactions
- Swipe right to close (mobile)
- Tap outside to close (mobile)
- Long-press on workflow card to see full details

---

## Error Handling

### Network Errors
```typescript
try {
  const response = await analyzeIntent(message);
} catch (error) {
  displayErrorMessage(
    'I'm having trouble connecting. Please check your connection and try again.'
  );
}
```

### AI Errors
If the backend returns an error or invalid response:
```typescript
displayClarifyingQuestion({
  question: 'Could you tell me more about what you want to verify?',
  options: [
    'Check if it's recent',
    'Detect tampering',
    'Verify location',
    'Find original source'
  ],
  context: 'This helps me recommend the right tools.'
});
```

### Empty State
When no media is uploaded:
```
┌────────────────────────────────────┐
│  📁 No media uploaded yet          │
│                                    │
│  Upload an image or video to get   │
│  started with verification.        │
│                                    │
│  [Upload Media]                    │
└────────────────────────────────────┘
```

---

## Performance Optimization

### Lazy Loading
- Load assistant panel code only when first opened
- Lazy load workflow card components

### Debouncing
- Debounce typing indicator (500ms)
- Debounce auto-save of session state

### Caching
- Cache session data in localStorage
- Restore previous conversation on page reload

---

## Implementation Checklist

### Phase 1: Basic UI
- [ ] Create AssistantPanel container component
- [ ] Implement collapse/expand animation
- [ ] Build ConversationView with message list
- [ ] Create InputBox with send functionality
- [ ] Add basic styling and theme

### Phase 2: API Integration
- [ ] Integrate POST /api/assistant/intent
- [ ] Handle workflow recommendations
- [ ] Handle clarifying questions
- [ ] Implement session persistence

### Phase 3: Workflow Cards
- [ ] Build WorkflowCard component
- [ ] Create StepCard sub-component
- [ ] Add tool icons
- [ ] Implement "Run Workflow" action

### Phase 4: Smart Nudges
- [ ] Auto-open on file upload
- [ ] Idle timer with gentle reminder
- [ ] Optional nudge on tool click

### Phase 5: Polish
- [ ] Add animations and transitions
- [ ] Implement accessibility features
- [ ] Mobile responsive design
- [ ] Error handling and edge cases
- [ ] Loading states and skeleton screens

---

## Example Code Snippets

### React Component (Basic Structure)

```tsx
import React, { useState, useEffect } from 'react';

export function AssistantPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const sendMessage = async (text: string) => {
    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      content: text,
      timestamp: new Date()
    }]);

    setIsThinking(true);

    try {
      const response = await fetch('/api/assistant/intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          message: text,
          media_id: currentMediaId,
          session_id: sessionId
        })
      });

      const data = await response.json();
      setSessionId(data.session_id);

      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        type: data.response.type,
        content: data.response.content,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className={`assistant-panel ${isOpen ? 'expanded' : 'collapsed'}`}>
      <AssistantHeader onClose={() => setIsOpen(false)} />
      
      <ConversationView messages={messages} isThinking={isThinking} />
      
      <InputBox onSend={sendMessage} disabled={isThinking} />
    </div>
  );
}
```

---

## Testing Recommendations

### Unit Tests
- Message rendering
- Workflow card display
- Input validation
- State management

### Integration Tests
- API call handling
- Session persistence
- Error recovery
- Workflow execution flow

### E2E Tests
- Complete user journey: upload → ask → receive workflow → execute
- Mobile responsive behavior
- Accessibility compliance

---

## Next Steps After Implementation

1. **Gather User Feedback**
   - Track which workflows are most used
   - Monitor clarifying question frequency
   - Measure user satisfaction

2. **Iterate on UX**
   - Refine nudge timing
   - Improve workflow card design
   - Optimize response time

3. **Advanced Features**
   - Workflow customization
   - Save favorite workflows
   - Share workflows with team
   - Export workflow results

---

## Support & Resources

- **Backend API Docs:** See `walkthrough.md` for API details
- **Design System:** Follow your existing component library
- **Icons:** Use tool-specific icons from your design system
- **Questions:** Refer to `AI_INTENT_ASSISTANT.md` for product vision
