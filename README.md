# PiePay Assignment — Flipkart Offer Extraction Service

This backend service extracts, stores, and evaluates **bank/payment offers** from Flipkart’s payment page API.

> **Note:**
> A sample Flipkart API JSON response was captured during browser inspection and stored in `flipkart.js`.
> That JSON was used as the payload during development (via Postman).
> Several helpful screenshots are also included.

---

## 🚀 Features

* Parse Flipkart’s offer API response
* Store offers in MongoDB
* Calculate the highest applicable discount for a given bank and amount
* Filter offers by payment instrument (e.g., `CREDIT`, `EMI_OPTIONS`)

---

## 🧰 Tech Stack

* **Node.js**, **Express.js**
* **MongoDB**, **Mongoose**

---

## 📂 Project Structure

```
src/
├── config/
│    └── db.js
├── controllers/
│    ├── offerController.js
│    └── discountController.js
├── models/
│    └── Offer.js
├── routes/
│    ├── offerRoutes.js
│    └── discountRoutes.js
├── utils/
│    ├── extractOffers.js
│    └── calculate.js
└── server.js
```

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <url>
cd piepay-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root:

```
MONGO_URI=mongodb://localhost:27017
```

(Replace with MongoDB Atlas URI if using Atlas.)

### 4. Start MongoDB

**Option A — Local MongoDB**

```bash
mongod --dbpath "C:\data\db"
```

**Option B — MongoDB Atlas**

Just ensure `.env` contains your correct Atlas URI.

### 5. Start the Backend Server

```bash
npm run dev
```

Server runs at:

```
PORT: 3000
http://localhost:3000/api
```

---

## 📡 API Endpoints

---

### 🔹 POST `/api/offer`

Extracts all offers from Flipkart API response and stores them in MongoDB.

#### Sample Payload

```json
{
  "flipkartOfferApiResponse": {
    "paymentOptions": {
      "offers": [
        {
          "offerHeader": {
            "title": "Additional ₹1000 Off On Selected Banks Credit Card EMI"
          },
          "offerDescription": [
            { "key": "Min. order value", "value": "₹3,000" },
            { "key": "Max Order Value", "value": "₹1,00,00,000" },
            { "key": "Max. discount", "value": "₹1,000" },
            { "key": "You get", "value": "₹1,000" }
          ],
          "bankCode": "AXIS",
          "paymentInstruments": ["CREDIT", "EMI_OPTIONS"]
        }
      ]
    }
  }
}
```

#### Sample Response

```json
{
  "noOfOffersIdentified": 1,
  "noOfNewOffersCreated": 1
}
```

---

### 🔹 GET `/api/highest-discount`

Finds the highest applicable discount based on amount & bank.

#### Query Parameters

| param             | required | description                  |
| ----------------- | -------- | ---------------------------- |
| amountToPay       | Yes      | Amount payable by user       |
| bankName          | Yes      | Bank code (e.g., AXIS, HDFC) |
| paymentInstrument | No       | CREDIT / EMI_OPTIONS         |

#### Example

```
GET /api/highest-discount?amountToPay=10000&bankName=AXIS
```

#### Response

```json
{
  "highestDiscountAmount": 1000
}
```

---

## 🧠 Assumptions

* Flipkart API response format varies → **recursive offer extractor** used
* Synthetic `offerId` created if missing
* `"You get"` considered the applied discount when present
* Missing numeric fields use safe defaults
* Bank/instrument metadata may appear in multiple formats

---

## 🧩 Design Choices

* **Node.js + Express** → Lightweight JSON API
* **MongoDB (Mongoose)** → Flexible schema for variable Flipkart payload
* **Recursive extraction** → Ensures zero missed offers
* **Modular structure** → Easier debugging & maintenance

---

## ⚡ Scaling Strategy (1,000 req/sec)

### ✔ 1. MongoDB Indexes

```
db.offers.createIndex({ bankName: 1 })
db.offers.createIndex({ paymentInstruments: 1 })
```

### ✔ 2. Redis Caching

Cache by: `bankName + amountToPay + paymentInstrument`

### ✔ 3. In-memory LRU Cache

Ultra-fast for repeated queries.

### ✔ 4. Horizontal Scaling

Multiple Node instances behind a load balancer.

### ✔ 5. Increase MongoDB Connection Pool

Better parallel query performance.

### ✔ 6. Microservices Split

* Offer ingestion
* Offer evaluation

---

## 🔧 Future Improvements

* Better offer de-duplication using hashing
* Docker support for Node + MongoDB
* NLP-based extraction when bank name missing

---

## ✔ Conclusion

This backend is robust, flexible, and scalable.
It fulfills all assignment requirements:

* ✔ Extract Flipkart offers
* ✔ Store them safely
* ✔ Compute highest discount
* ✔ Support payment instruments
* ✔ Production-ready architecture
