# Development History

## Step 1: System Foundation & Design Tokens (Meta-Prompting)

### Goal
Establish a high-end UI/UX framework that makes the Search bar the "hero" of the app.

### Architectural Decisions

1.  **Tech Stack**:
    *   **Framework**: React + Vite (Fast development, optimized build).
    *   **Styling**: Tailwind CSS (Utility-first, rapid UI development).
    *   **Components**: Shadcn UI (Accessible, customizable components).
    *   **Icons**: Lucide React (Clean, consistent iconography).

2.  **Design System ("Deep Sea" Theme)**:
    *   **Primary Color**: Indigo-700 (`#4338ca`) - Used for branding and primary actions.
    *   **Background**: Slate-950 (`#020617`) - Deep, dark background for immersive experience.
    *   **Accent**: Cyan-400 (`#22d3ee`) - Used for AI-related elements and highlights.
    *   **Effects**:
        *   **Glow**: Custom box-shadows and drop-shadows using the accent color.
        *   **Glassmorphism**: `backdrop-blur` and semi-transparent backgrounds for depth.

3.  **Navigation (Header)**:
    *   **Hero Element**: The Search bar is the focal point, taking up ~60% of the width on desktop.
    *   **Visual Cues**:
        *   `animate-pulse` border/glow to draw attention to the search.
        *   Gradient background with blur behind the search input for a "magical" feel.
    *   **Layout**: Sticky header with glassmorphism to maintain context while scrolling.

### Component Structure

*   `src/components/Header.tsx`: The main navigation component. Contains the logo, search bar, and user actions.
*   `src/lib/utils.ts`: Utility functions, specifically `cn` for class name merging (Shadcn UI standard).
*   `src/App.tsx`: The main application layout. Wraps the content with the global theme and layout structure.
*   `tailwind.config.js`: Centralized design tokens and theme configuration.

### Progress
- [x] Initialized Tailwind CSS.
- [x] Configured "Deep Sea" theme in `tailwind.config.js`.
- [x] Created `Header` component with "Hero" search bar.
- [x] Updated `App.tsx` with the new layout and theme.
- [x] Documented decisions in `development_history.md`.
- [x] Fixed Tailwind CSS v4 configuration (Installed `@tailwindcss/postcss`, updated `postcss.config.js`, and `src/index.css`).

## Step 3: Context-Aware AI Learning Assistant (Few-Shot)

### Goal
Solve the "Context Switching" issue by building a LearningDashboard featuring a Video Player and a synchronized AI Sidebar.

## Step 5: The "Active Roadmap" Dashboard (Zero-Spam Strategy)

### Goal
Address "Spam" and "Abandonment" issues by replacing intrusive emails with an in-app "Action Center" and transparent user controls.

### Strategy & "Why"
*   **Zero-Spam**: Instead of bombarding users with emails to return, we use an "Action Center" on the dashboard. This respects the user's inbox and keeps the interaction within the learning context.
*   **Pulse Bar**: A high-visibility progress indicator leverages the "Zeigarnik Effect" (people remember uncompleted or interrupted tasks better than completed ones) to naturally encourage completion without nagging.
*   **Nudge Logic**: Context-aware AI messages ("Hey Nhat, you're 80% through...") provide personalized motivation based on actual progress, rather than generic "We miss you" spam.
*   **No-Dark-Patterns**: Making "Unsubscribe" or "Cancel Trial" easily accessible (1-click) builds trust. If a user wants to leave, letting them go easily is better for long-term brand reputation than trapping them. This aligns with UC07.

### Implementation Details
*   **Dashboard Update**: Added an "Active Roadmap" section to `LearningDashboard.tsx`.
*   **Pulse Bar**: Visual progress bar with animation.
*   **Action Center**: Container for the Nudge and Roadmap.
*   **User Controls**: Added a clear "Manage Subscription" section with an easy Cancel button.

### Functional Requirements
1.  **Video Player**:
    *   Standard playback controls.
    *   **Floating Mini-player (PIP)**: Automatically shrinks to the corner when the user scrolls down to read documentation/notes.
    *   Exposes current playback time to the parent component.

2.  **AI Sidebar**:
    *   **Interface**: Chat-like UI with "Neon" accents (Cyan/Indigo) to match the "Deep Sea" theme.
    *   **Context Awareness**:
        *   "Explain this concept" button.
        *   On click, captures video transcript context (current time +/- 20s).
        *   Simulates AI response based on the timestamp.
    *   **Note Taking**:
        *   "Save to My Notes" button for each AI response.
        *   Captures timestamp and the explanation text.

3.  **Data Flow**:
    *   `LearningDashboard` manages state (current time, notes, chat history).
    *   Passes `currentTime` from `VideoPlayer` to `AISidebar`.

### Component Structure
*   `src/components/LearningDashboard.tsx`: Main container.
*   `src/components/VideoPlayer.tsx`: Video component with PIP logic.
*   `src/components/AISidebar.tsx`: Chat interface and context logic.

### Implementation Details
*   **PIP**: Use `IntersectionObserver` or scroll event listener to detect when the video is out of view, then toggle a CSS class for fixed positioning.
*   **Mock Data**: Since we don't have a real backend/LLM, we will mock the transcript and AI responses based on timestamp ranges.

## Step 2: The "Spotlight" AI Search Interface (Chain-of-Thought)

### Goal
Satisfy Dr. Vu's requirement for prominent LLM application by developing a "Hero Search Section" that replaces traditional keyword search with Natural Language Intent.

### Role: AI Interaction Designer

### Chain of Thought & Implementation Details

1.  **Visual Cues**:
    *   **Trigger**: The search bar in `HeroSearch.tsx` acts as a trigger. It uses a glow effect and hover states to invite interaction.
    *   **Overlay**: `SearchOverlay.tsx` provides a full-screen, immersive experience with a blurred background (`backdrop-blur-md`) to focus the user's attention entirely on the query.

2.  **AI Suggestions ("Dynamic Prompt Chips")**:
    *   Implemented a list of `SUGGESTIONS` (e.g., "I have 2 hours/day, help me learn Python") that appear immediately when the overlay opens.
    *   These chips help guide the user on how to interact with the AI, reducing "blank page" syndrome.

3.  **Feedback Loop ("AI is thinking...")**:
    *   Added an `isThinking` state.
    *   When a search is submitted, the UI transitions to a loading state with a custom spinner and pulsing text ("AI is analyzing your request...") to manage user expectations and indicate processing.

4.  **Result Logic (RoadmapCard)**:
    *   Instead of a simple list of links, the result is a structured "RoadmapCard".
    *   This card displays a sequence of learning steps (e.g., "HTML & CSS Fundamentals", "JavaScript Deep Dive"), reinforcing the educational focus of the application.
    *   Used `framer-motion` for smooth layout transitions between the suggestions, loading state, and results.

### Technical Implementation

*   **Libraries**: Added `framer-motion` for complex animations (AnimatePresence, layout transitions).
*   **Components**:
    *   `HeroSearch.tsx`: The entry point. Manages the open state of the overlay.
    *   `SearchOverlay.tsx`: The modal component. Handles the search logic, states (input, thinking, results), and animations.
*   **State Management**: Local state (`useState`) within `SearchOverlay` handles the UI flow (Input -> Thinking -> Result).

### Progress
- [x] Installed `framer-motion`.
- [x] Created `src/components/HeroSearch.tsx`.
- [x] Created `src/components/SearchOverlay.tsx`.
- [x] Documented interaction logic and UI code in `development_history.md`.

## Step 3: Transparent Course Cards (Solving Decision Paralysis)

### Goal
Address Dr. Duy’s "Why" – Why this course over another? Eliminate user confusion when facing similar course options.

### Design Decisions

1.  **AI Match Score**:
    *   **Problem**: Users don't know which course fits their specific intent.
    *   **Solution**: A prominent percentage badge (e.g., "95% Match") calculated based on the user's natural language prompt.
    *   **Visuals**: Color-coded (Emerald for high match, Cyan for medium, Amber for low) with a sparkle icon to denote AI generation.

2.  **Metadata Transparency**:
    *   **Problem**: "Stale content" frustration (e.g., learning React Class Components in 2024).
    *   **Solution**: Explicitly display "Last Updated" and "Time Commitment".
    *   **Implementation**: Lucide icons (`Calendar`, `Clock`) with clear, concise text.

3.  **Outcome-Oriented Content**:
    *   **Problem**: Syllabus lists are often abstract and hard to compare.
    *   **Solution**: Replace/Augment syllabus with a "What you will build" section.
    *   **Visuals**: Checklist style with `CheckSquare` icons to emphasize tangible results.

4.  **Quick Comparison**:
    *   **Problem**: Users need to switch tabs to compare details.
    *   **Solution**: A "Compare" checkbox on the card itself.
    *   **Interaction**: Selecting multiple cards triggers a side-by-side comparison modal (future implementation).

### Component Structure

*   `src/components/CourseCard.tsx`:
    *   **Props**: `matchScore`, `lastUpdated`, `timeCommitment`, `whatYouWillBuild`, `onCompareToggle`.
    *   **Styling**:
        *   Glassmorphism background (`bg-slate-900/50`, `backdrop-blur-sm`).
        *   Hover effects: Border glow (`hover:border-indigo-500/50`) and slight scale up.
        *   Typography: Clear hierarchy with `slate-100` for titles and `slate-400` for metadata.

### Progress
- [x] Created `CourseCard.tsx` with all required transparency features.
- [x] Implemented AI Match Score logic (visual).
- [x] Added "What you will build" section.
- [x] Added "Compare" interaction toggle.
- [x] Documented design rationale in `development_history.md`.
