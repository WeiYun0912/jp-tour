import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNotes, addNote, deleteNote } from "../api";

export function useNotes() {
  const queryClient = useQueryClient();

  // GET - 使用 useQuery
  const {
    data: notes = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["notes"],
    queryFn: fetchNotes,
    staleTime: 30000, // 30秒內不重新請求
  });

  // POST - 使用 useMutation
  const addNoteMutation = useMutation({
    mutationFn: addNote,
    onMutate: async (newNote) => {
      // 樂觀更新
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData(["notes"]);

      queryClient.setQueryData(["notes"], (old = []) => [
        {
          id: Date.now().toString(),
          name: newNote.name || "",
          content: newNote.content,
          dayId: newNote.dayId || null,
          timestamp: Date.now(),
        },
        ...old,
      ]);

      return { previousNotes };
    },
    onError: (err, newNote, context) => {
      queryClient.setQueryData(["notes"], context.previousNotes);
    },
    onSettled: () => {
      // 2秒後重新同步資料
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["notes"] });
      }, 2000);
    },
  });

  // DELETE - 使用 useMutation
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onMutate: async (noteId) => {
      await queryClient.cancelQueries({ queryKey: ["notes"] });
      const previousNotes = queryClient.getQueryData(["notes"]);

      queryClient.setQueryData(["notes"], (old = []) =>
        old.filter((note) => note.id !== noteId)
      );

      return { previousNotes };
    },
    onError: (err, noteId, context) => {
      queryClient.setQueryData(["notes"], context.previousNotes);
    },
    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["notes"] });
      }, 2000);
    },
  });

  return {
    notes,
    loading,
    error: error?.message || null,
    submitting: addNoteMutation.isPending || deleteNoteMutation.isPending,
    addNote: (noteData) => addNoteMutation.mutateAsync(noteData),
    deleteNote: (noteId) => deleteNoteMutation.mutateAsync(noteId),
  };
}
