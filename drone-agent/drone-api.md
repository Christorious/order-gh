# Drone Agent API (Draft)

This API will let Order.GH communicate with a drone base station.

## Endpoints

### `POST /drone/assign-job`
Assign a job to an available drone.

Body:
```json
{
  "request_id": "REQ123",
  "pickup": "GPS_COORDS",
  "dropoff": "ENCRYPTED_COORDS",
  "secure_code": "HASHED_KEY"
}
