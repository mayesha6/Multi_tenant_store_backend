export const excludeField = ["searchTerm", "sort", "fields", "page", "limit"]

export const SOCKET_EVENTS = {
  NEW_MESSAGE: "new_message",
  MESSAGE_SENT: "message_sent",
  CONVERSATION_UPDATED: "conversation_updated",
  CONVERSATION_ASSIGNED: "conversation_assigned",
  CONVERSATION_STATUS_CHANGED: "conversation_status_changed",
  UNREAD_UPDATED: "unread_updated",
  CONVERSATION_LIST_UPDATED: "conversation_list_updated",
} as const;