# Backend API Contract

Base URL: `VITE_API_BASE_URL` (defaults to `http://localhost:8080`)

## 1) Create Order
- Method: POST
- Endpoint: /api/orders

Request JSON body:
```json
{
  "drinkType": "Latte",
  "customerType": "NEW",
  "loyaltyStatus": "NONE"
}
```

Response JSON body (used fields):
```json
{
  "id": "order-123",
  "estimatedWaitTime": 7,
  "priorityReason": "GOLD_MEMBER"
}
```

Notes:
- `priorityReason` is optional; frontend checks for its presence.

## 2) Get Queue
- Method: GET
- Endpoint: /api/orders/queue

Response JSON body (array):
```json
[
  {
    "id": "order-123",
    "drinkType": "Latte",
    "customerType": "NEW",
    "loyaltyStatus": "NONE",
    "isEmergency": false,
    "createdAt": "2026-02-07T10:30:00Z",
    "estimatedWaitTime": 7
  }
]
```

Notes:
- Frontend requires at least `id` and `isEmergency` for rendering; other fields are typical but not strictly required by the current UI.

## 3) Get Barista Status
- Method: GET
- Endpoint: /api/barista/status

Response JSON body (used fields):
```json
{
  "status": "BUSY",
  "currentOrder": {
    "id": "order-123",
    "drinkType": "Latte",
    "startTime": "2026-02-07T10:30:00Z"
  }
}
```

Notes:
- `status` is compared to "BUSY".
- If no active order, `currentOrder` can be null or omitted and `status` should be "IDLE".

## 4) Complete Current Order
- Method: POST
- Endpoint: /api/barista/complete
- Request JSON body: none

Response JSON body (example):
```json
{
  "success": true
}
```

## 5) Get Manager Metrics
- Method: GET
- Endpoint: /api/manager/metrics

Response JSON body (used fields):
```json
{
  "averageWaitTime": 6,
  "maxWaitTime": 18,
  "timeoutRate": 2.5
}
```

Notes:
- `timeoutRate` is displayed as a percent.

## 6) Get Manager Alerts
- Method: GET
- Endpoint: /api/manager/alerts

Response JSON body (array):
```json
[
  {
    "orderId": "order-123",
    "message": "Order exceeds 10 min threshold",
    "waitTime": 12
  }
]
```

Notes:
- `orderId` is used as a key.
- `waitTime` is shown in minutes.
