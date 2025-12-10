import { useState, useEffect, useCallback } from "react";

const API_URL = "https://script.google.com/macros/s/AKfycbyYp85E6OuxSRvFbkwVBySAtlY07ac7p59Sb7eml4b1WalzcAeHvhBfE7qrR8Jsz4SD/exec";

// 轉換 API 資料格式到前端格式
// API 格式: { timestamp, name, note, tripId }
// 前端格式: { id, name, content, dayId, timestamp }
function transformNote(apiNote) {
  return {
    id: apiNote.timestamp?.toString() || Date.now().toString(),
    name: apiNote.name || "",
    content: apiNote.note || "",
    dayId: apiNote.tripId || null,
    timestamp: apiNote.timestamp,
  };
}

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch notes from Google Sheet
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch notes");
      const data = await response.json();
      const transformedNotes = Array.isArray(data)
        ? data.map(transformNote)
        : [];
      setNotes(transformedNotes);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(err.message);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new note
  const addNote = useCallback(async (noteData) => {
    try {
      setSubmitting(true);
      setError(null);

      // 轉換為 API 格式: { name, note, tripId }
      const apiData = {
        name: noteData.name || "",
        note: noteData.content,
        tripId: noteData.dayId || "",
      };

      const response = await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      // Since no-cors returns opaque response, we optimistically update
      const newNote = {
        id: Date.now().toString(),
        name: noteData.name || "",
        content: noteData.content,
        dayId: noteData.dayId || null,
        timestamp: Date.now(),
      };
      setNotes((prev) => [newNote, ...prev]);

      // Refresh after a short delay to sync with server
      setTimeout(fetchNotes, 1500);

      return true;
    } catch (err) {
      console.error("Error adding note:", err);
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [fetchNotes]);

  // Delete a note (根據 timestamp 刪除)
  const deleteNote = useCallback(async (noteId) => {
    try {
      setSubmitting(true);
      setError(null);

      await fetch(API_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete",
          timestamp: noteId,
        }),
      });

      // Optimistically update
      setNotes((prev) => prev.filter((note) => note.id !== noteId));

      // Refresh after a short delay
      setTimeout(fetchNotes, 1500);

      return true;
    } catch (err) {
      console.error("Error deleting note:", err);
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [fetchNotes]);

  // Initial fetch
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    submitting,
    addNote,
    deleteNote,
    refreshNotes: fetchNotes,
  };
}
