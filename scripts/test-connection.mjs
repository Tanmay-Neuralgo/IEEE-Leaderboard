import { google } from "googleapis";
import { JWT } from "google-auth-library";

const email =
  "leaderboard-sync@leaderboard-sheets-sync.iam.gserviceaccount.com";
const spreadsheetId = "1bTRn6rsw9txSfRvEvvnHe4cgfcoSUgfachAlDoKksls";
const key = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDLDImi9DMS+aqp
OZRb/vzNAyx4YDIKy05XS5rJcEZqZRtf8Ixj1WSYIeSt0VOd5X6/va6MstwVqrlX
LgWBHqY+z2+29cCe7B84Qb8kOac3eXcb6r3pBjYFFmkSUNfdewbw/96N8jgN5ieR
Hoj0e0B1gLzcZnnN0LnK2RxtUOwVPSWSzGYJCkJcKlL0iNSmo9ES2yqSMZud6vT8
xeDGg8XUUhynGNYx59zhdwt/ais/4nxAzNrmpX0JyV1gZ4m41BfZUCLpG6OUh3qk
iugyrHztqiGnzJcROY/1WZntpIxJxFx/PAj41TKsR1AaKPve7+FQDQMdOHkFI4R+
tJmAe95vAgMBAAECggEAHUPxgzT1jDrDlWrGToYkyKW4SfdPbyKDaENDjDIXAWxm
MtXts3vvvkTwUU8ri+/7wfC5u5oR7OYzmsmizcvtmShLyTqIKJUOy4x1BhMbM1HZ
+teYHKx3qmm4UNqpv53k+mUJSOXhnLs7S7LIzuKu1TYYwnQwrRtJlAo74H5P20ri
9qNvcf28jVgIefsGD3Pr947MdMVfILiurn5eSiBrmM8g5jle7ulgJEMS4voFpLRO
24eQUgyWeLTMhNGSkNtIwmkroSJ+PxsP0ICaeDF3lSXXv8PWpyWJvMlQ6sp5g+kc
qbKibOvnYT/OJYdjUIsF+sEdqbZsQS7xzklpUdQiZQKBgQDrpxPZaXXexzzShjEX
aebq2uRqJXxj6+UOBHxpFx2sWhcuPoMqOhorrn/BSUe7lD4IGYJgFSYLDgi8NnTv
PytWT6NrnKScV677lYJ4+P3Y4CPNMT0WjINZNsEY8i9JdTuaLBa56r4LWTWF03rT
HDh3rkhrLpqngz1t5elFn7YDQwKBgQDclMffh7GEkS0kTWHepBdpqvokvrRvMWuw
x4UxQtGEL1m/4OoNwxT5JqD3YK61NlsRs4JeMPCMyKKuLJHOv2fNnGUbcOL2/McJ
LDp6mHa43lVT9p1ZSxes543kd0V/zI3ENFmUnEx5Er4dqNn6axGclJktsVrWQaOp
bJSljVdHZQKBgQCwarFidyBF+rRfCxUfaSn1so+Do7Ke/4/IUbVt219ck0l9VlFN
wJetEgMUia7JEC7sU2SWV97WMdh6Ru592bWw9Qfr3SYi4UXflMtLk2Q/A3Xp/K21
/tWqaWJgMZcTEE/hmJYe80z5I/z8xhjSiPMBLhmLHCWtuIO5jYB4nhteDwKBgQDW
YaeMgaYvUKXOBYNcTqEOqwTo14woEaE3tAKoaOeWkCqrSV5RN8vXhwqkwwupxYVn
Q88t2mTAf3NU0q53gSHS/PBrZiDAqdaL/LdtVWb1r+jAbQxqr4f4HSiT5rPeTKFw
Eu0JeYr9lRC/ZM9OCeeZBfeGKDw/xpXY4VXrPN6Z3QKBgQCImW1iFeMU+OwS8XVn
UmTPu8N/+dAklqrPEyjgHtFxbGGrM0TQlEOQRTFlfFB4lec7xk0XquFiWPeWokAL
n/gCDCZujvx0e8fUg4OPRskEF7Iugk+bsvYsLaTTmPy0WewMK/IC3JdMjfUsiPA/
3pBcLmzUg4mSSkKfwAX5q1mKUA==
-----END PRIVATE KEY-----`;

async function testConnection() {
  try {
    console.log("Initializing client...");
    const client = new JWT({
      email,
      key,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    console.log("Creating sheets instance...");
    const sheets = google.sheets({ version: "v4", auth: client });

    console.log("Fetching spreadsheet data...");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A1:D",
    });

    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error:", error);
  }
}

testConnection();
