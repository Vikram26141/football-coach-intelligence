# Football Coach Intelligence — Project Context

## 1. Project Overview

**Name:** Football Coach Intelligence ("Football Coach")

**Purpose:**
A coach‑centric analytics platform that uses video analysis and machine learning to automatically detect, track, and report on key attacking events ("fast breaks"/counter‑attacks) during football matches.

**Key Objectives:**

* Provide coaches with visual heatmaps, timelines, and detailed reports of rapid forward‑passing sequences.
* Enable data‑driven tactical decisions by automating event extraction and summarization.

## 2. Core Features & Definitions

| Feature                     | Description                                                                                                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Authentication**          | Sign up / Sign in flow for secured access and personalized settings.                                              |
| **User Profile & Settings** | Manage password, display name, and analysis preferences.                                                          |
| **Static Pages**            | About, Contact, Help — informational pages.                                                                       |
| **Video Upload**            | Coaches upload match clips (.mp4) into the system.                                                                |
| **Live Detection Preview**  | Real‑time YOLOv8 bounding‑box overlay on video frames.                                                            |
| **Fast‑Break Extraction**   | Rule‑based heuristic: after 3 forward passes with zone‑sum > 9 (or 4–5 passes with zone‑sum > 12), flag an event. |
| **Heatmap Overlay**         | 18‑zone pitch grid showing aggregated ball movement density.                                                      |
| **Timeline Visualization**  | Interactive timeline marking detected events.                                                                     |
| **Export Reports**          | Downloadable summaries (CSV/JSON) with event timestamps, zones, metrics.                                          |
| **(Future) Soccernet API**  | Integration to pull match metadata (dates, teams, scores) for context.                                            |

## 3. ML & Computer Vision Components

* **YOLOv8 (PyTorch)**

  * Pretrained model (yolov8n.pt) for initial player & ball detection.
  * Custom fine‑tuning on labeled clips if needed to improve ball class accuracy.
* **Object Tracking (OpenCV)**

  * Simple tracker to maintain object identities and detect ball transfers between players.
* **Rule‑Based Event Extraction**

  * 18‑zone pitch mapping: divides the field into a 3×6 grid (zones 1–18).
  * Forward‑pass logic:

    1. Track sequence of passes between players.
    2. Compute zone index at each pass.
    3. If after ≥3 passes, sum(zones) > 9 → event.
    4. If after 4–5 passes, sum(zones) > 12 → event.
* **Optional RL Refinement (Stable‑Baselines3 DQN)**

  * State: recent pass history & zone pattern.
  * Action: classify sequence as fast‑break vs. normal.

## 4. Data & Storage

* **Raw Video Clips**: .mp4 files in `backend/data/raw/`.
* **Annotations**: YOLO txt format in `backend/data/labels/` (classes: player=0, ball=1).
* **Database (SQL)**:

  * PostgreSQL/MySQL (SQLAlchemy ORM).
  * Tables: Users, Profiles, Matches, Events, Zones.

## 5. Tech Stack Summary

* **Backend**: Python 3.x, Flask, SQLAlchemy, psycopg2
* **ML / CV**: PyTorch (YOLOv8), OpenCV, NumPy, scikit‑learn, stable‑baselines3
* **Frontend**: React, HTML5, CSS3, D3.js, react‑chartjs‑2
* **Dev Tools**: Git, virtualenv, labelImg

## 6. Folder Structure (Condensed, Meaning basic not detailed)

```
football-coach-intelligence/
├─ backend/
│  ├─ config/
│  ├─ data/raw/, data/labels/
│  ├─ models/yolov8/
│  ├─ scripts/
│  ├─ services/
│  ├─ utils/
│  ├─ api/
│  └─ requirements.txt
├─ frontend/
│  ├─ public/ index.html
│  ├─ src/components/, src/pages/, src/services/
│  ├─ App.js, index.js
│  └─ package.json
├─ docs/ (architecture.md, methodology.md)
├─ .env, README.md, .gitignore
```

---

*This context file centralizes all project details for quick reference and onboarding.*
