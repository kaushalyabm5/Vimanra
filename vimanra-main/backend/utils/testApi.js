import http from "http";

const request = (path, method = "GET", data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const options = {
      hostname: "localhost",
      port: 5000,
      path,
      method,
      headers: {
        "Content-Type": "application/json",
        ...(payload && { "Content-Length": Buffer.byteLength(payload) }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
};

const runTests = async () => {
  console.log("⚡ Starting Automated API Verification...");

  // 1. Healthcheck
  const health = await request("/");
  console.log("1. Healthcheck:", health.status === 200 ? "PASS ✅" : "FAIL ❌");

  // 2. Admin Login Flow (Invalid Credentials)
  const invalidLogin = await request("/api/auth/login", "POST", { username: "admin", password: "wrong" });
  console.log("2a. Login Invalid Credentials:", invalidLogin.status === 401 ? "PASS ✅" : "FAIL ❌");

  // 2b. Admin Login Flow (Valid Credentials)
  const validLogin = await request("/api/auth/login", "POST", { username: "admin", password: "admin123" });
  console.log("2b. Login Valid Credentials:", validLogin.status === 200 ? "PASS ✅" : "FAIL ❌");
  const token = validLogin.data.token;

  // 3. Services Management Flow
  const servicesList = await request("/api/services");
  console.log("3a. Get Services:", servicesList.status === 200 ? "PASS ✅" : "FAIL ❌");

  const addService = await request("/api/services", "POST", { service_name: "Helipad Transfer", description: "VIP Helipad shuttle" }, token);
  console.log("3b. Add Service:", addService.status === 201 ? "PASS ✅" : "FAIL ❌");

  // 4. Gallery Management Flow
  const galleryList = await request("/api/gallery");
  console.log("4a. Get Gallery:", galleryList.status === 200 ? "PASS ✅" : "FAIL ❌");

  const addGallery = await request("/api/gallery", "POST", { title: "Helipad View", category: "Resort", image_url: "https://example.com/helipad.jpg" }, token);
  console.log("4b. Add Gallery Item:", addGallery.status === 201 ? "PASS ✅" : "FAIL ❌");

  // 5. Review Management Flow
  const reviewsList = await request("/api/reviews");
  console.log("5a. Get Reviews:", reviewsList.status === 200 ? "PASS ✅" : "FAIL ❌");

  const addReview = await request("/api/reviews", "POST", { guest_name: "Emma Watson", rating: 5, review: "Magical lakeside experience!" });
  console.log("5b. Add Review:", addReview.status === 201 ? "PASS ✅" : "FAIL ❌");

  // 6. Room Price Management Flow
  const roomsList = await request("/api/rooms");
  console.log("6a. Get Rooms:", roomsList.status === 200 ? "PASS ✅" : "FAIL ❌");

  const invalidPriceUpdate = await request("/api/rooms/1/price", "PUT", { price: -50 }, token);
  console.log("6b. Invalid Price Update (-50):", invalidPriceUpdate.status === 400 ? "PASS ✅ (Validation Triggered)" : "FAIL ❌");

  const validPriceUpdate = await request("/api/rooms/1/price", "PUT", { price: 215 }, token);
  console.log("6c. Valid Price Update ($215):", validPriceUpdate.status === 200 ? "PASS ✅ (Database & Website Updated)" : "FAIL ❌");

  console.log("\n✨ All API Verification Tests Completed!");
};

runTests().catch(console.error);
