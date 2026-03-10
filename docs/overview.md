# ScoreMyClays — Overview

ScoreMyClays is a mobile app for recording clay pigeon shooting scores. It works fully offline and syncs data between devices when connectivity is available.

## The Problem

Clay shooting grounds often have poor or no mobile signal. Shooters currently track scores on paper cards that are easy to lose and hard to analyse. Existing scoring apps require internet connectivity, making them useless at the shooting ground.

## What the App Does

A shooter (or a designated scorer) uses the app to record the result of every target thrown during a round of sporting clays. The app stores all data locally on the device and syncs to the cloud when a connection becomes available.

## Key Concepts

| Term | Meaning |
|------|---------|
| **Round** | A complete shooting session (e.g., 100 targets) |
| **Stand** | A physical shooting position. A round has multiple stands. |
| **Target** | A single clay pigeon thrown from a trap |
| **Kill** | Target was hit/broken |
| **Loss** | Target was missed |
| **Presentation** | The type of target flight (Crosser, Driven, Teal, Rabbit, etc.) |
| **Squad** | A group of 1–6 shooters taking a round together |
| **Scorer** | The person recording results on their device |
| **Club** | A shooting ground with pre-configured positions and stands |
| **Position** | A group of stands within a club layout (e.g., "Position 1" with 3 stands) |
| **Invite** | An invitation from one user to another to join a round's squad |

### Target Configurations

Each stand throws targets in one of four configurations:

| Config | Description |
|--------|-------------|
| **Single** | One target per turn |
| **Report Pair** | Two targets — second launched on the sound of the first shot |
| **Simultaneous Pair** | Two targets launched at the same time |
| **Following Pair** | Two targets from the same trap in quick succession |

For pairs, each bird within the pair is tracked separately with its own Kill/Loss result.

### Presentation Types

Sporting clays use 13 standard presentation types: Crosser, Driven, Incoming, Going Away, Quartering Away, Quartering Towards, Teal, Dropping, Looper, Rabbit, Battue, Chandelle, and Springing. Each describes the trajectory and behaviour of the clay target.

### Round Types

The app supports two ways to create a round:

| Type | Description |
|------|-------------|
| **Custom** | User manually creates stands with presentation type, target config, and target count |
| **Club-based** | User selects a club; stands are pre-configured from the club's position and stand data |

Club-based rounds link to reference data (clubs, positions, stands) seeded in the database. Custom rounds are fully user-defined.

## MVP Scope

The MVP delivers:

- Create a round offline — set up stands, presentations, and target counts
- Create a round from a club's pre-configured layout
- Add shooters to a squad by name or by inviting registered users
- Record Kill/Loss/No Shot for each target with a single tap
- Running score totals visible during scoring
- View completed rounds and historical scores
- Browse clubs and start rounds from club layouts
- Send and receive round invites between users
- Detect and resolve scoring conflicts from multiple devices
- Account creation with Supabase Auth (enables cloud sync)
- Auth flow with login, signup, and profile setup
- Edit profile (display name, gear, favourite clubs)
- Deploys to iOS and Android via Expo EAS

### Not in MVP

Analytics, social features, leaderboards, weather tracking, subscriptions, web portal, push notifications, and guest-to-account data migration are all planned for future releases.

## Target Users

- **Recreational shooters** tracking personal scores
- **Club shooters** scoring for their squad at competitions
- **Coaches** reviewing shooter performance across sessions
