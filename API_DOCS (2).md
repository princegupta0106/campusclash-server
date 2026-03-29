# Tournament App — Frontend API Documentation

**Base URL:** `http://localhost:3000`  
**All requests/responses use JSON.**  
**Required header on POST and PUT:** `Content-Type: application/json`

---

## Resources

| Resource | Base Path |
|---|---|
| Users | `/users` |
| Inter-Campus Tournaments | `/tournaments/inter` |
| Intra-Campus Tournaments | `/tournaments/intra` |

---

## KEY DIFFERENCE: Inter vs Intra

| | Inter-Campus | Intra-Campus |
|---|---|---|
| **Who participates** | Multiple colleges | One college only |
| **College field** | `colleges` → array of strings | `college` → single string |
| **Endpoint prefix** | `/tournaments/inter` | `/tournaments/intra` |

---

## DATA MODELS

### User Object
```json
{
  "id": 1,
  "college_name": "BITS Pilani",
  "full_name": "Aryan Shah",
  "mobile_number": "9876543210",
  "is_host": true,
  "created_at": "2026-03-29T10:00:00.000Z"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | number | auto | Do not send on create/update |
| `college_name` | string | yes | — |
| `full_name` | string | yes | — |
| `mobile_number` | string | yes | Must be unique across all users |
| `is_host` | boolean | no | Defaults to `false` |
| `created_at` | string | auto | Do not send on create/update |

---

### Inter-Campus Tournament Object
```json
{
  "id": 1,
  "tournament_name": "BITS Valorant Cup",
  "prize_pool": 5000.00,
  "date": "2026-04-15",
  "colleges": ["BITS Pilani", "BITS Goa", "BITS Hyderabad"],
  "g_form": "https://forms.gle/abc123",
  "game": "Valorant",
  "description": "Inter-campus 5v5 open to all BITS campuses.",
  "organizers": ["Aryan Shah", "Riya Mehta"]
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | number | auto | Do not send on create/update |
| `tournament_name` | string | yes | — |
| `prize_pool` | number | no | Decimals allowed, e.g. `1500.50` |
| `date` | string | no | Format: `YYYY-MM-DD` |
| `colleges` | array of strings | no | List of all participating colleges |
| `g_form` | string | no | Full URL to Google Form |
| `game` | string | no | e.g. `"Valorant"`, `"Chess"`, `"BGMI"` |
| `description` | string | no | Long text description |
| `organizers` | array of strings | no | Full names of organizers |

---

### Intra-Campus Tournament Object
```json
{
  "id": 1,
  "tournament_name": "Fresher's Chess Open",
  "prize_pool": 1000.00,
  "date": "2026-04-10",
  "college": "BITS Pilani",
  "g_form": "https://forms.gle/xyz456",
  "game": "Chess",
  "description": "Internal chess tournament for all BITS Pilani students.",
  "organizers": ["Kabir Malhotra"]
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | number | auto | Do not send on create/update |
| `tournament_name` | string | yes | — |
| `prize_pool` | number | no | Decimals allowed |
| `date` | string | no | Format: `YYYY-MM-DD` |
| `college` | string | no | Single college name (not an array) |
| `g_form` | string | no | Full URL to Google Form |
| `game` | string | no | e.g. `"Chess"`, `"Badminton"` |
| `description` | string | no | Long text description |
| `organizers` | array of strings | no | Full names of organizers |

---

## USERS API

### GET /users — Get All Users
```
GET /users
```
No body needed.

**Response 200**
```json
[
  {
    "id": 1,
    "college_name": "BITS Pilani",
    "full_name": "Aryan Shah",
    "mobile_number": "9876543210",
    "is_host": true,
    "created_at": "2026-03-29T10:00:00.000Z"
  }
]
```

---

### GET /users/:id — Get One User
```
GET /users/1
```
No body needed.

**Response 200**
```json
{
  "id": 1,
  "college_name": "BITS Pilani",
  "full_name": "Aryan Shah",
  "mobile_number": "9876543210",
  "is_host": true,
  "created_at": "2026-03-29T10:00:00.000Z"
}
```
**Response 404** `{ "error": "User not found" }`

---

### POST /users — Create User
```
POST /users
```
**Body**
```json
{
  "college_name": "BITS Pilani",
  "full_name": "Aryan Shah",
  "mobile_number": "9876543210",
  "is_host": true
}
```
**Response 201** `{ "id": 3, "message": "User created" }`  
**Response 400** `{ "error": "college_name, full_name, mobile_number are required" }`  
**Response 500** — if mobile number is a duplicate

---

### PUT /users/:id — Update User
```
PUT /users/1
```
**Body** — send all fields
```json
{
  "college_name": "BITS Goa",
  "full_name": "Aryan Shah",
  "mobile_number": "9876543210",
  "is_host": false
}
```
**Response 200** `{ "message": "User updated" }`  
**Response 404** `{ "error": "User not found" }`

---

### DELETE /users/:id — Delete User
```
DELETE /users/1
```
No body needed.  
**Response 200** `{ "message": "User deleted" }`  
**Response 404** `{ "error": "User not found" }`

---

## INTER-CAMPUS TOURNAMENTS API

### GET /tournaments/inter — Get All
```
GET /tournaments/inter
```
No body needed.

**Response 200**
```json
[
  {
    "id": 1,
    "tournament_name": "BITS Valorant Cup",
    "prize_pool": 5000,
    "date": "2026-04-15",
    "colleges": ["BITS Pilani", "BITS Goa", "BITS Hyderabad"],
    "g_form": "https://forms.gle/abc123",
    "game": "Valorant",
    "description": "Inter-campus 5v5 tournament.",
    "organizers": ["Aryan Shah", "Riya Mehta"]
  }
]
```

---

### GET /tournaments/inter/:id — Get One
```
GET /tournaments/inter/1
```
No body needed.

**Response 200** — same shape as above, single object  
**Response 404** `{ "error": "Tournament not found" }`

---

### POST /tournaments/inter — Create
```
POST /tournaments/inter
```
**Body**
```json
{
  "tournament_name": "BITS Valorant Cup",
  "prize_pool": 5000,
  "date": "2026-04-15",
  "colleges": ["BITS Pilani", "BITS Goa", "BITS Hyderabad"],
  "g_form": "https://forms.gle/abc123",
  "game": "Valorant",
  "description": "Inter-campus 5v5 tournament open to all BITS campuses.",
  "organizers": ["Aryan Shah", "Riya Mehta"]
}
```
> Only `tournament_name` is required. Omit or send `[]` for unused array fields.

**Minimal valid body**
```json
{ "tournament_name": "BITS Chess League" }
```

**Response 201** `{ "id": 2, "message": "Inter-campus tournament created" }`  
**Response 400** `{ "error": "tournament_name is required" }`

---

### PUT /tournaments/inter/:id — Update
```
PUT /tournaments/inter/1
```
**Body** — send all fields
```json
{
  "tournament_name": "BITS Valorant Cup Season 2",
  "prize_pool": 10000,
  "date": "2026-05-01",
  "colleges": ["BITS Pilani", "BITS Goa"],
  "g_form": "https://forms.gle/newlink",
  "game": "Valorant",
  "description": "Updated description.",
  "organizers": ["Aryan Shah"]
}
```
**Response 200** `{ "message": "Inter-campus tournament updated" }`  
**Response 404** `{ "error": "Tournament not found" }`

---

### DELETE /tournaments/inter/:id — Delete
```
DELETE /tournaments/inter/1
```
No body needed.  
**Response 200** `{ "message": "Inter-campus tournament deleted" }`  
**Response 404** `{ "error": "Tournament not found" }`

---

## INTRA-CAMPUS TOURNAMENTS API

### GET /tournaments/intra — Get All
```
GET /tournaments/intra
```
No body needed.

**Response 200**
```json
[
  {
    "id": 1,
    "tournament_name": "Fresher's Chess Open",
    "prize_pool": 1000,
    "date": "2026-04-10",
    "college": "BITS Pilani",
    "g_form": "https://forms.gle/xyz456",
    "game": "Chess",
    "description": "Internal chess tournament for BITS Pilani students.",
    "organizers": ["Kabir Malhotra"]
  }
]
```

---

### GET /tournaments/intra/:id — Get One
```
GET /tournaments/intra/1
```
No body needed.

**Response 200** — same shape as above, single object  
**Response 404** `{ "error": "Tournament not found" }`

---

### POST /tournaments/intra — Create
```
POST /tournaments/intra
```
**Body**
```json
{
  "tournament_name": "Fresher's Chess Open",
  "prize_pool": 1000,
  "date": "2026-04-10",
  "college": "BITS Pilani",
  "g_form": "https://forms.gle/xyz456",
  "game": "Chess",
  "description": "Internal chess tournament for BITS Pilani students.",
  "organizers": ["Kabir Malhotra"]
}
```
> Only `tournament_name` is required. `college` is a plain string, not an array.

**Minimal valid body**
```json
{ "tournament_name": "Badminton Open" }
```

**Response 201** `{ "id": 3, "message": "Intra-campus tournament created" }`  
**Response 400** `{ "error": "tournament_name is required" }`

---

### PUT /tournaments/intra/:id — Update
```
PUT /tournaments/intra/1
```
**Body** — send all fields
```json
{
  "tournament_name": "Fresher's Chess Open 2026",
  "prize_pool": 1500,
  "date": "2026-04-12",
  "college": "BITS Pilani",
  "g_form": "https://forms.gle/newlink2",
  "game": "Chess",
  "description": "Updated description.",
  "organizers": ["Kabir Malhotra", "Sneha Iyer"]
}
```
**Response 200** `{ "message": "Intra-campus tournament updated" }`  
**Response 404** `{ "error": "Tournament not found" }`

---

### DELETE /tournaments/intra/:id — Delete
```
DELETE /tournaments/intra/1
```
No body needed.  
**Response 200** `{ "message": "Intra-campus tournament deleted" }`  
**Response 404** `{ "error": "Tournament not found" }`

---

## FULL QUICK REFERENCE

| Action | Method | Endpoint | Body |
|---|---|---|---|
| Get all users | GET | `/users` | — |
| Get one user | GET | `/users/:id` | — |
| Create user | POST | `/users` | JSON |
| Update user | PUT | `/users/:id` | JSON (all fields) |
| Delete user | DELETE | `/users/:id` | — |
| Get all inter tournaments | GET | `/tournaments/inter` | — |
| Get one inter tournament | GET | `/tournaments/inter/:id` | — |
| Create inter tournament | POST | `/tournaments/inter` | JSON |
| Update inter tournament | PUT | `/tournaments/inter/:id` | JSON (all fields) |
| Delete inter tournament | DELETE | `/tournaments/inter/:id` | — |
| Get all intra tournaments | GET | `/tournaments/intra` | — |
| Get one intra tournament | GET | `/tournaments/intra/:id` | — |
| Create intra tournament | POST | `/tournaments/intra` | JSON |
| Update intra tournament | PUT | `/tournaments/intra/:id` | JSON (all fields) |
| Delete intra tournament | DELETE | `/tournaments/intra/:id` | — |

---

## JAVASCRIPT FETCH EXAMPLES

```js
const BASE = "http://localhost:3000";

// Create inter-campus tournament
await fetch(`${BASE}/tournaments/inter`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tournament_name: "BITS Valorant Cup",
    prize_pool: 5000,
    date: "2026-04-15",
    colleges: ["BITS Pilani", "BITS Goa"],
    game: "Valorant",
    organizers: ["Aryan Shah"],
  }),
});

// Create intra-campus tournament
await fetch(`${BASE}/tournaments/intra`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tournament_name: "Fresher's Chess Open",
    prize_pool: 1000,
    date: "2026-04-10",
    college: "BITS Pilani",       // single string, NOT an array
    game: "Chess",
    organizers: ["Kabir Malhotra"],
  }),
});

// Get all inter-campus tournaments
const res = await fetch(`${BASE}/tournaments/inter`);
const interTournaments = await res.json();

// Get all intra-campus tournaments
const res2 = await fetch(`${BASE}/tournaments/intra`);
const intraTournaments = await res2.json();
```

---

## IMPORTANT NOTES FOR THE FRONTEND

1. **Inter vs Intra college field** — inter uses `colleges` (array of strings), intra uses `college` (single string). Never mix these up.
2. **Arrays** — `colleges` and `organizers` must always be proper JSON arrays, not comma-separated strings.
3. **Dates** — always send in `YYYY-MM-DD` format (e.g. `"2026-04-15"`).
4. **PUT is a full replace** — always send all fields when updating, not just the changed ones.
5. **Booleans** — send `true`/`false`, not `"true"`/`"false"` strings.
6. **CORS** — enabled on the backend, frontend can make requests from any origin.
7. **IDs** — never send `id` or `created_at` in request bodies.
