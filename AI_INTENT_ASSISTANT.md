# **Safeguard Media — Intent Assistant & Guided Workflow**

The platform already has powerful verification tools metadata extraction, tamper detection, reverse lookup, timeline analysis, geolocation matching, and more.

But power alone isn’t enough. Users often don’t know **which tool solves their real problem**, or how these tools should be combined to produce a trustworthy answer. The challenge is that most users don’t think in terms of “features.” They think in terms of **situations**.They arrive with a question or a suspicion, not a workflow

To build a platform that feels intelligent, supportive, and easy to navigate, we need a system that:

**✓ Captures the user’s intention**

**✓ Translates that intention into an optimal verification workflow**

**✓ Surfaces tools they didn’t know they needed**

**✓ Avoids overwhelming them or blocking exploration**

This is the core problem we’re solving with the **Intent Assistant & Guided Workflow**

Journalists, activists, investigators, auditors and more, comes to the platform with a story, not a technical plan. Their internal monologue sounds like: **“I need to verify if this photo is recent.”**

not **“I should combine metadata extraction + tamper detection + timeline inference + reverse lookup.”**

Right now, the user has to manually guess which tool is appropriate. We want the system to bridge that gap automatically.

---

Long onboarding forms or modal popups create frustration. We need a method that guides users **without interrupting** them or blocking the dashboard.

The solution:

A **right-side AI intent assistant** that feels natural, optional, and helpful.

---

## **The Solution Pattern: The Intent Assistant (Right-Side Panel)**

The best pattern for this problem is a **persistent assistant panel on the right side of the dashboard** — similar to ChatGPT’s interface, but focused on guiding verification workflows.

This pattern works because:

- **It never blocks the main UI.**

Users can still explore tools freely.

- **It provides real-time reasoning while users switch between tools.**

The assistant stays open, tracks context, and updates recommendations.

- **It feels familiar.**

Many users already understand the “right sidebar chat assistant” pattern from modern AI interfaces.

- **It’s low-friction.**

No forced modals and no onboarding blockers. Help is always there, but never in the way.

---

## **The End-to-End Flow (From Login to Final Result)**

### **Step 1: User Logs In**

Dashboard loads immediately.

### **Step 2: UI Overview**

**Left side:** Features menu (Metadata, Tamper Detection, Reverse Lookup, Geolocation, etc.)

**Center:** Recent uploads, previous verifications, quick actions

**Right side:** Collapsed assistant icon with a faint pulse glow

**The goal:** The assistant is visible, but not demanding attention.

---

### **Step 3: Assistant Interaction**

When the user clicks the glowing icon:

**Right sidebar slides out** (ChatGPT-style):

- Assistant header with avatar
- A single text input box
- Starter prompts like:
    - “Check if a photo is recent”
    - “Verify the location”
    - “See if the image was edited”

The user types their intention.

---

### **Step 4: Intent Interpretation**

The assistant analyzes the user’s request and returns:

1. The interpreted goal
2. 1–2 clarifying questions
3. The recommended workflow as cards

**Example:**

Goal: "Verify recency of this image."

Workflow:

- Metadata Extraction
- Reverse Lookup
- Timeline Verification
- Tamper Detection (if needed)

Each tool card includes:

- Simple explanation
- Why it matters
- “Run this tool” button

---

### **Step 5: Running the Workflow**

The user can:

- Run the entire sequence
- Or pick individual steps
- Or switch tools while the assistant stays open

As each step finishes, results appear inside the assistant timeline.

---

## **Smart Nudge Moments (Contextual, Not Annoying)**

We do **not** rely on users manually opening the assistant.

Instead, we trigger it only when helpful.

### **A. When the user uploads a file**

Assistant opens automatically:

> “Tell me what you’re trying to verify and I’ll pick the right tools.”
> 

This catches users at the moment they have a goal in mind.

---

### **B. When a user jumps into a random tool without context**

Example: They click *Reverse Lookup* directly.

Assistant whispers:

> “Are you trying to confirm originality, recency, or location?
> 
> 
> This helps me guide you.”
> 

This keeps users on track without blocking them.

---

### **C. When a user hesitates or sits idle**

After ~15 seconds:

> “Need help deciding the next step? You can describe the situation.”
> 

Non-intrusive.

Gentle.

Useful.

---

## **User Stories (Client-Friendly)**

### **User Story 1: Journalist Checking a War Image**

“I received a photo claiming to show a recent attack. I don’t know which tool checks recency, so I tell the assistant:

*‘I need to make sure this is recent.’*

Immediately it suggests metadata → timeline(includes reverse lookup result) → geolocation.

I run the workflow, and the final summary tells me the photo is from 2019.

This saves me from publishing misinformation.”

---

### **User Story 2: Investigator Reviewing Doctored Evidence**

“I upload an image from a suspect’s device. The assistant asks what I’m trying to prove.

I say: *‘I need to know if it was tampered with.’*

It builds a workflow: metadata → tamper detection  → Visual Forensics/Deepfake detection

The verdict shows clear signs of cloning.

I export the report and add it to the case file.”

---

### **User Story 3: NGO Analyst Verifying a Location Claim**

“I get photos claiming to show illegal mining in a remote region.

I type: *‘I need to confirm if this place is real.’*

The assistant suggests geolocation → reverse lookup.

The results show the photo is from a completely different continent.

This prevents false accusations.”

---

### **User Story 4: First-Time User With No Technical Knowledge**

“I log in and don’t know where to start.

The assistant pops up when I upload a file and says:

*‘Tell me what you’re trying to verify.’*

I write one sentence, and the system handles the complexity for me.”