import type { NextFunction, Request, Response } from "express";
export declare const ConversationControllers: {
    createConversation: (req: Request, res: Response, next: NextFunction) => void;
    getAllConversations: (req: Request, res: Response, next: NextFunction) => void;
    getSingleConversation: (req: Request, res: Response, next: NextFunction) => void;
    updateConversation: (req: Request, res: Response, next: NextFunction) => void;
    getMessagesByConversationId: (req: Request, res: Response, next: NextFunction) => void;
    sendAgentMessage: (req: Request, res: Response, next: NextFunction) => void;
    markConversationAsRead: (req: Request, res: Response, next: NextFunction) => void;
};
//# sourceMappingURL=conversation.controller.d.ts.map