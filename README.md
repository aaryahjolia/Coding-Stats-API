# Coding Stats API

This project is a simple way to get all your coding stats from platforms like **LeetCode**, **CodeChef**, **GeeksForGeeks**, and **Codeforces** in one single request. 

## 🌟 The Big Picture

If you use multiple sites to practice coding, it is a hassle to keep checking each one to see your rank or how many problems you solved. This API does that for you. 

- **Everything in one place**: You get your ratings and solved counts from all four platforms at once.
- **Up to date**: It pulls live data from the websites whenever you call it.
- **Fast**: It uses caching, so if you ask for the same profile twice, the second time is almost instant.

---

## 🛠️ Performance & Technical Details

This is a Node.js project built using Express. I designed it to be modular and easy to extend if we want to add more platforms later.

### How it gets the data
Most of the platforms are scraped using `axios` and `JSDOM`. GeeksForGeeks is a bit different because it hides its data in script tags. I wrote a special logic that uses regex to find that data in the raw HTML and also hits a hidden internal API for the difficulty stats.

### Security
I added a few layers to make sure the API is safe to use:
1. **Helmet**: This sets secure headers to stop common web attacks.
2. **Rate Limiting**: Each IP is limited to 100 requests every 15 minutes so bots don't spam the server.
3. **Error Handling**: If a platform is down or a user isn't found, you get a clean error message instead of the app crashing.

### Caching
I used `node-cache` to store responses in memory for 1 hour. This saves time and prevents the coding sites from getting annoyed by too many requests. I also added a fix to make sure cached data is always returned as proper JSON.

---

## 📂 Project Structure

```text
├── index.js                # App entry point & middleware setup
├── package.json            # Project dependencies & scripts
├── src/
│   ├── config/             # Platform URLs and settings
│   ├── controllers/        # Request handling logic
│   ├── middleware/         # Security, Caching, and Error handlers
│   ├── routes/             # API endpoint definitions
│   └── services/           # The actual scraping and API logic
```

## 📖 API Documentation

### Base URL
`http://localhost:8800` (for local builds)

`https://coding-stats-api.vercel.app/` (production deployment)

### Endpoints

- **GeeksForGeeks**: `GET /geeksforgeeks/:handle`
- **LeetCode**: `GET /leetcode/:handle`
- **CodeChef**: `GET /codechef/:handle`
- **Codeforces**: `GET /codeforces/:handle`

---

## 🛠️ Installation & Setup

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the server**:
   ```bash
   node --watch index.js
   ```


