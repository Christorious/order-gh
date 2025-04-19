import time

def simulate_drone_delivery(request_id, pickup, dropoff):
    print(f"🚁 Drone assigned to Request ID: {request_id}")
    print(f"🔼 Taking off from: {pickup}")
    time.sleep(2)
    print("📍 En route...")
    time.sleep(3)
    print(f"✅ Delivered to: {dropoff}")
    print("📡 Sending delivery confirmation to backend...")
    print("🔒 Identity verified anonymously via blockchain")
    print("✅ Job complete.")

# Simulate a delivery run
simulate_drone_delivery("REQ123", "Accra Ridge Hospital", "Tema Community 1")
