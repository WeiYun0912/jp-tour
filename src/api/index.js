import axios from "axios";

const API_URL =
  "https://script.google.com/macros/s/AKfycbyYp85E6OuxSRvFbkwVBySAtlY07ac7p59Sb7eml4b1WalzcAeHvhBfE7qrR8Jsz4SD/exec";

// 匯率 API (免費)
const EXCHANGE_API_URL = "https://api.exchangerate-api.com/v4/latest/JPY";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// ============ 備註 API ============
export async function fetchNotes() {
  const { data } = await axios.get(API_URL);
  return Array.isArray(data)
    ? data
        .filter((note) => note.note && note.note.trim())
        .map((note) => ({
          id: note.timestamp?.toString() || Date.now().toString(),
          name: note.name || "",
          content: note.note || "",
          dayId: note.tripId || null,
          timestamp: note.timestamp,
        }))
    : [];
}

export async function addNote({ name, content, dayId }) {
  // Google Apps Script 需要用 no-cors mode，所以用 fetch
  await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: name || "",
      note: content.trim(),
      tripId: dayId || "",
    }),
  });
  return true;
}

export async function deleteNote(noteId) {
  await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "delete",
      timestamp: noteId,
    }),
  });
  return true;
}

// ============ 購物清單 API ============
export async function fetchShoppingList() {
  const { data } = await axios.get(`${API_URL}?type=shopping`);
  return Array.isArray(data)
    ? data.map((item) => ({
        id: item.timestamp?.toString() || Date.now().toString(),
        item: item.item || "",
        quantity: item.quantity || "",
        checked: item.checked || false,
        tripId: item.tripId || null,
        timestamp: item.timestamp,
      }))
    : [];
}

export async function addShoppingItem({ item, quantity, tripId }) {
  await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "shopping",
      item: item.trim(),
      quantity: quantity || "",
      tripId: tripId || "",
    }),
  });
  return true;
}

export async function toggleShoppingItem(timestamp) {
  await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "shopping",
      action: "toggle",
      timestamp: timestamp,
    }),
  });
  return true;
}

export async function deleteShoppingItem(timestamp) {
  await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "shopping",
      action: "delete",
      timestamp: timestamp,
    }),
  });
  return true;
}

// ============ 匯率 API ============
export async function fetchExchangeRate() {
  const { data } = await axios.get(EXCHANGE_API_URL);
  // 回傳 JPY 對 TWD 的匯率
  return {
    jpyToTwd: data.rates.TWD, // 1 JPY = ? TWD
    twdToJpy: 1 / data.rates.TWD, // 1 TWD = ? JPY
    lastUpdate: data.date,
  };
}
