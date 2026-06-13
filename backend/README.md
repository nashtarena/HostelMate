# HostelMate Backend

REST API for the HostelMate frontend — Node.js · Express · MongoDB.

## Quick start

```bash
cd backend
npm install

cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET

npm run seed    # populate sample data (optional)
npm run dev     # development with hot-reload
npm start       # production
```

## API base URL
`http://localhost:5000/api`

---

## Authentication
All protected routes require:
```
Authorization: Bearer <token>
```
Tokens are returned by `/api/auth/login` and `/api/auth/register`.

---

## Endpoints

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | ❌ | Register new user |
| POST | `/auth/login` | ❌ | Login, returns JWT |
| GET | `/auth/me` | ✅ | Get own profile |
| PATCH | `/auth/change-password` | ✅ | Change password |

### Rooms
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/rooms` | warden/admin | All rooms (filter: ?status= ?block=) |
| GET | `/rooms/my` | student | Own room + roommates |
| GET | `/rooms/:id` | any | Single room |
| POST | `/rooms` | warden/admin | Create room |
| PATCH | `/rooms/:id` | warden/admin | Update room |
| PATCH | `/rooms/:id/assign` | warden/admin | Assign student to room |

### Complaints
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/complaints` | any | Own (student) / all (warden/admin). Filter: ?status= ?category= |
| POST | `/complaints` | student | Raise complaint |
| PATCH | `/complaints/:id/status` | warden/admin | Update status |
| POST | `/complaints/:id/vote` | any | Toggle upvote |

### Leaves
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/leaves` | any | Own / all. Filter: ?status= |
| POST | `/leaves` | student | Apply for leave |
| PATCH | `/leaves/:id/approve` | warden/admin | Approve + generate QR |
| PATCH | `/leaves/:id/reject` | warden/admin | Reject |

### Fees
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/fees` | any | Own / all. Filter: ?status= |
| GET | `/fees/summary` | student | Outstanding + paid total |
| GET | `/fees/summary/admin` | warden/admin | Collection rate |
| POST | `/fees` | warden/admin | Create fee record |
| PATCH | `/fees/:id/pay` | any | Mark as paid |

### Mess
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/mess/menu` | any | Today's menu (?date=YYYY-MM-DD) |
| GET | `/mess/menu/week` | any | Next 7 days |
| POST | `/mess/menu` | warden/admin | Create menu |
| PATCH | `/mess/menu/:id` | warden/admin | Update menu |
| POST | `/mess/feedback` | student | Submit / update feedback |
| GET | `/mess/feedback/ratings` | any | Rating trends (last 10 days) |

### Visitors
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/visitors` | any | Own / all |
| POST | `/visitors` | student | Add visitor |
| PATCH | `/visitors/:id/checkin` | any | Check in |
| PATCH | `/visitors/:id/checkout` | any | Check out |

### Expenses
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/expenses` | student | Room's expenses |
| GET | `/expenses/balance` | student | Net balance |
| POST | `/expenses` | student | Add expense |
| PATCH | `/expenses/:id/settle` | student | Mark own share settled |

### Notices
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/notices` | any | All active notices |
| POST | `/notices` | warden/admin | Post notice |
| PATCH | `/notices/:id` | warden/admin | Update notice |
| DELETE | `/notices/:id` | warden/admin | Delete notice |

### Roommate Matching
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/roommate/preferences` | student | Get my prefs |
| PUT | `/roommate/preferences` | student | Save my prefs |
| GET | `/roommate/matches` | student | Top compatible students |

### Admin
| Method | Path | Role | Description |
|--------|------|------|-------------|
| GET | `/admin/stats` | warden/admin | Dashboard overview stats |

---

## Tech stack
- **Runtime**: Node.js 18+
- **Framework**: Express 4
- **Database**: MongoDB via Mongoose
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **QR codes**: qrcode (generated on leave approval)
- **Logging**: morgan
