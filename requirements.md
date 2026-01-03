# PRD: LeetCode → Markdown → GitHub Gist → X Automation System

## 1. Product Overview

### Product Name (working)

**LeetFlow** (name optional)

### Purpose

A developer tool that converts daily LeetCode solutions into well-structured Markdown posts, publishes them as GitHub Gists, and automatically posts the links to X as a running thread.

The system prioritizes:

- consistency
- minimal manual steps
- explanations derived strictly from the author’s code
- fast daily execution

---

## 2. Goals & Success Criteria

### Primary Goals

- Reduce daily LeetCode posting friction to **under 2 minutes**
- Ensure explanations are **faithful to the user’s reasoning**
- Maintain a **single continuous X thread**
- Build a public, indexed archive of solutions via GitHub Gists

### Success Metrics

- Daily LeetCode posts published without failure
- Valid Markdown generated every time
- Gist creation success rate ≥ 99%
- X post success rate ≥ 99%
- Manual intervention optional, not required

---

## 3. Target User

- Solo developer
- Solves 1–2 LeetCode problems daily
- Comfortable with Python, TypeScript, Next.js
- Wants public proof of consistency and thinking
- Values automation over polish

---

## 4. Core User Flow

### Primary Flow: Generate → Review → Post

1. User solves a LeetCode problem locally
2. User opens the web app
3. User pastes:

   - solution code
   - problem title
   - LeetCode URL
   - optional image URL (Imgur)

4. User clicks **Generate**
5. AI generates Markdown explanation from the code
6. User reviews Markdown in preview
7. User clicks **Post**
8. System:

   - creates a GitHub Gist
   - posts link to X (threaded)
   - increments day counter

---

## 5. Functional Requirements

### 5.1 Frontend (Next.js App)

#### Tech

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Markdown preview library (e.g. react-markdown)

#### Pages

##### `/`

**Main Posting Interface**

Fields:

- Problem Title (text input)
- LeetCode URL (text input)
- Language (dropdown, default: Python)
- Solution Code (large textarea)
- Optional Image URL (text input)
- Generate Button

After generation:

- Editable Markdown textarea
- Live Markdown preview panel
- Post Button

States:

- Idle
- Generating
- Generated
- Posting
- Success
- Error

---

### 5.2 AI Generation Service

#### Input

- Problem title
- LeetCode URL
- Solution code (with comments)
- Optional image URL

#### Output

Markdown document with sections:

```md
# {Problem Title}

[Question]({LeetCode URL})

## Approach

(Explanation derived strictly from the code and comments)

## Implementation

(Code block, same as input)

## Complexity

(Time & space inferred from code)

## Results

(Optional image section if URL provided)
```

#### Constraints

- Must NOT solve or optimize the problem
- Must NOT invent techniques not present in code
- Must respect author comments as intent signals
- Tone: clear, technical, neutral

---

### 5.3 Backend API (Next.js API Routes)

#### `/api/generate`

- Method: POST
- Accepts: form data
- Calls LLM
- Returns: Markdown string

#### `/api/post`

- Method: POST
- Accepts: final Markdown
- Handles:

  - GitHub Gist creation
  - X posting
  - progress tracking

---

## 6. GitHub Gist Integration

### Requirements

- Create a **public Gist**
- Filename: `{problem-slug}.md`
- Content: generated Markdown

### Auth

- GitHub Personal Access Token
- Stored securely in env variables

### Output

- Gist URL returned to system
- Used in X post

---

## 7. X (Twitter) Integration

### Posting Rules

- First post creates thread
- Subsequent posts reply to original thread
- Format:

```
Day {N}

{Problem Title}

{Gist URL}
```

### State Management

- Store:

  - current day number
  - root thread tweet ID

### Storage

- Simple JSON file OR database (later)
- Example:

```json
{
  "day": 14,
  "thread_id": "17382929292"
}
```

---

## 8. Image Handling (Phase 1)

### Input

- User uploads image to Imgur manually
- Pastes image URL into form

### Behavior

- If image URL exists:

  - AI includes it under `## Results`

- If not:

  - Section omitted

No screenshot automation required in v1.

---

## 9. Python Scripts Integration

### Structure

```
/scripts
  ├── gist_publisher.py
  ├── twitter_poster.py
  ├── progress_tracker.py
```

### Responsibilities

- Python handles:

  - GitHub Gist API calls
  - X API posting

- Next.js backend invokes Python scripts via:

  - child processes OR
  - internal service abstraction

Python scripts must be:

- idempotent
- independently testable
- callable from CLI

---

## 10. Environment Variables

### Required

```
GITHUB_TOKEN=
TWITTER_API_KEY=
TWITTER_API_SECRET=
TWITTER_ACCESS_TOKEN=
TWITTER_ACCESS_TOKEN_SECRET=
TWITTER_BEARER_TOKEN=
OPENAI_API_KEY= (or other LLM)
```

---

## 11. Error Handling

- AI failure → retry + surface error
- Gist failure → abort X post
- X failure → do not increment day
- All failures logged clearly in UI

---

## 12. Non-Goals (Explicit)

- No auto-solving LeetCode
- No plagiarism detection
- No analytics dashboard
- No multi-user support
- No mobile app

---

## 13. Future Enhancements (Out of Scope)

- Auto screenshots via Playwright
- Repo mirroring
- Multi-language explanations
- Stats dashboard
- Public profile page

---

## 14. MVP Definition (What MUST exist tomorrow)

- Next.js UI
- AI Markdown generation
- Manual review
- GitHub Gist creation
- X thread posting
- Day counter persistence

Anything beyond this is optional.
